export const useMainStore = defineStore('main', () => {

    let timerId = 0

    const registers = ref({
        "A": 0, "B": 0, "D": 0, "X": 0, "Y": 0, "U": 0, "S": 0, "PC": 0, "CC": 0, "DP": 0
    })
    const map_type = ref("")
    const wait = ref(false)
    const halted = ref(false)
    const break_active = ref(false)
    const load = ref(0.0)
    const display = ref("")
    const display_type = ref("")
    const display_size = ref({ x: 0, y: 0 })
    const breakpoints = ref([])
    const modules = ref([])
    const current_module = ref("")

    const selected_memory = ref(null)
    const memory_start = ref(null)
    const memory_content = ref([])

    const current_source = ref(null)
    const base_address = ref(0)
    const source_base = ref(0)
    const source_content = ref([])

    const floppy_disks = ref([])
    const available_disks = ref([])

    function isBreakpoint(address) {
        let breakpoint = breakpoints.value.find((b) => b.address == address)
        if (breakpoint)
            return breakpoint.enable
        return false
    }

    function isCurrentLine(address) {
        return address == registers["PC"]
    }

    function setCurrentModule() {
        const module = modules.value.find((mod) => registers.value.PC >= mod.start && registers.value.PC < mod.end)
        if (module) {
            current_module.value = module.name
            base_address.value = module.start
            // console.log(`module: ${current_module.value} base address ${base_address.value}`)
        } else {
            current_module.value = ""
            base_address.value = 0
        }
    }

    function setSourceBase(source) {
        console.log(`set source: ${source}`)
        const module = modules.value.find((mod) => mod.name === source)
        if (module) {
            current_source.value = source
            source_base.value = module.start
        } else {
            current_source.value = ""
            source_base.value = 0
        }
        console.log(`source: ${current_source.value}, base: ${source_base.value}`)
    }

    function getCurrentSource() {
        return current_source.value
    }

    function setRegisters(reg) {
        registers.value = reg.registers
        load.value = reg.load
        map_type.value = reg.map_type
        break_active.value = reg.break
        wait.value = reg.wait
        halted.value = reg.halted
        if (map_type.value === "RAM") {
            setCurrentModule()
        }
    }

    function getModuleType(module) {
        const mod = modules.value.find((mod) => mod.name === module)
        if (mod) {
            if (mod.type == 13) 
                return ".mn"
            if (mod.type == 14)
                return ".dr"
            if (mod.type == 15)
                return ".dd"
            return ""
        }
    }

    function getModuleStart(module) {
        const mod = modules.value.find((mod) => mod.name === module)
        if (mod) {
            return mod.start
        }
        return 0
    }

    async function GetSource(source_name) {
        try {
            const filename = source_name + getModuleType(source_name) + ".lst"
            source_content.value = []
            // const url = useRuntimeConfig().public.api_url + "/" + filename
            const url = useRuntimeConfig().public.api_url + "/source"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            console.log(`get ${url}`)
            // const response = await $fetch(url, { parseResponse: (txt) => txt })
            const response = await $fetch(url, {
                headers,
                query: {
                    file: filename
                }
            })
            setSourceBase(source_name)
            source_content.value = response;

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function getRegisters() {
        try {
            const url = useRuntimeConfig().public.api_url + "/registers" 
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function setRegister(payload) {
        try {
            const url = useRuntimeConfig().public.api_url + "/register" 
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, 
                { 
                    method: 'PUT',
                    headers,
                    query: payload                        
                 })
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function updateDisplay() {
        try {
            const url = useRuntimeConfig().public.api_url + "/display" 
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            display.value = response.display
            display_type.value = response.type
            display_size.value.x = response.width
            display_size.value.y = response.height
        } catch (error) {
            console.log(error)
            throw error
        }
    } 

    async function getBreakpoints() {
        try {
            const url = useRuntimeConfig().public.api_url + "/breakpoints" 
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            breakpoints.value = response.breakpoints
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function getModuleList() {
        try {
            const url = useRuntimeConfig().public.api_url + "/modules"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            modules.value = response.modules
            setCurrentModule()
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function addBreakpoint(payload) {
        try {
            const url = useRuntimeConfig().public.api_url + "/breakpoint"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { 
                method: 'PUT',
                headers,
                query: {
                    address: payload.address,
                    enable: payload.enable
                }
             })
             console.log("update breakpoint list")
            breakpoints.value = response.breakpoints
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function deleteBreakpoint(address) {
        try {
            const url = useRuntimeConfig().public.api_url + "/breakpoint"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { 
                method: 'DELETE',
                headers,
                query: {
                    address: address,
                }
             })
            breakpoints.value = response.breakpoints
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function run(duration) {
        try {
            const url = useRuntimeConfig().public.api_url + "/run"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { method: 'PUT', headers })
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    function stop() {
        if (timerId != 0) {
            clearTimeout(timerId)
            timerId = 0
        }
        cpubreak()
    }

    async function cpubreak() {
        try {
            const url = useRuntimeConfig().public.api_url + "/break"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { method: 'PUT', headers })
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }
  
    function step() {
        sendStep()
        updateDisplay()
        getModuleList()
    }

    async function sendStep() {
        try {
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const url = useRuntimeConfig().public.api_url + "/step"
            const response = await $fetch(url, { method: 'PUT', headers})
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    function stepover() {
        sendStepover()
        updateDisplay()
        getModuleList()
    }

    async function sendStepover() {
        try {
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const url = useRuntimeConfig().public.api_url + "/stepover"
            const response = await $fetch(url, { method: 'PUT', headers})
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    function reset() {
        sendReset()
        updateDisplay()
        getModuleList()
    }

    async function sendReset() {
        try {
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const url = useRuntimeConfig().public.api_url + "/reset"
            const response = await $fetch(url, { method: 'PUT', headers})
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function getMemory(address, length) {
        try {
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const url = useRuntimeConfig().public.api_url + "/memory"
            const response = await $fetch(url, 
                { 
                    method: 'GET', 
                    headers,
                    query: {
                        start: address,
                        length: length
                    }
                }
            )
            memory_start.value = response.address
            memory_content.value = response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function setMemory(address, value) {
        try {
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const url = useRuntimeConfig().public.api_url + "/memory"
            await $fetch(url, 
                { 
                    method: 'PUT', 
                    headers,
                    query: { address, value }
                }
            )
            // Ignore response, send a request to update the whole memory block
            //memory_content.value[address - memory_start.value] = response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }


    async function sendCommand(command) {
        try {
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const url = useRuntimeConfig().public.api_url + "/input"
            const response = await $fetch(url, 
                { 
                    method: 'POST', 
                    headers,
                    query: {
                        command
                    }
                }
            )
            setRegisters(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
    function setSelectedMemory(addr) {
        selected_memory.value = addr
    }

    function getSelectedMemory() {
        return selected_memory.value
    }

    async function getDisksInfo() {
        try {
            const url = useRuntimeConfig().public.api_url + "/disks"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            floppy_disks.value = response.disks
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function getAvailableDisks() {
        try {
            const url = useRuntimeConfig().public.api_url + "/alldisks"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            available_disks.value = response.available_disks
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function mountDisk(drive, name) {
        try {
            const url = useRuntimeConfig().public.api_url + "/disk"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { 
                method: 'PUT', 
                headers,                     
                query: {
                    drive, 
                    name
                }
            })
            floppy_disks.value = response.disks
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function unmountDisk(drive) {
        try {
            const url = useRuntimeConfig().public.api_url + "/disk"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { 
                method: 'DELETE', 
                headers,                     
                query: {
                    drive
                }
            })
            floppy_disks.value = response.disks
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return {
        registers,
        display,
        display_type,
        display_size,
        load,
        wait,
        break_active,
        halted,
        map_type,
        breakpoints,
        modules,
        current_module,
        base_address,
        source_content,
        source_base,
        memory_start,
        memory_content,
        selected_memory,
        floppy_disks,
        available_disks,
        GetSource,
        isBreakpoint,
        isCurrentLine,
        getRegisters,
        setRegister,
        getCurrentSource,
        getModuleList,
        updateDisplay,
        getBreakpoints,
        addBreakpoint,
        deleteBreakpoint,
        getMemory,
        setMemory,
        setSelectedMemory,
        getSelectedMemory,
        sendCommand,
        run,
        stop,
        step,
        stepover,
        reset,
        getDisksInfo,
        getAvailableDisks,
        mountDisk,
        unmountDisk
    }
})
