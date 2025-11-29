export const useMainStore = defineStore('main', () => {

    let timerId = 0

    const module_alias = {
        'shell': 'shell_21',
        'clock': 'clock_60hz',
        'clock2': 'clock2_soft'
    }

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
    
    const selected_memory = ref(null)
    const memory_start = ref(0)
    const memory_content = ref([])

    const moduleInfo = ref({
        "current_module": null,
        "base_address": 0
    })
    
    const sourceInfo = ref({
        "current_source": null,
        "base_address": 0,
        "base": 0,
        "content": []
    })

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

    function getModuleInfo() {
        return moduleInfo.value
    }

    function setCurrentModule() {
        const module = modules.value.find((mod) => registers.value.PC >= mod.start && registers.value.PC < mod.end)
        if (module) {
            moduleInfo.value.current_module = module.name
            moduleInfo.value.base_address   = module.start
            // console.log(`module: ${current_module.value} base address ${base_address.value}`)
        } else {
            moduleInfo.value.current_module = null
            moduleInfo.value.base_address   = 0
        }
    }

    function getSourceContent() {
        return sourceInfo.value.content
    }

    function setSourceBase(source) {
        console.log(`set source: ${source}`)
        const module = modules.value.find((mod) => mod.name === source)
        if (module) {
            sourceInfo.value.current_source = source
            sourceInfo.value.base = module.start
        } else {
            sourceInfo.value.current_source = ""
            sourceInfo.value.base = 0
        }
        console.log(`source: ${sourceInfo.value.current_source}, base: ${sourceInfo.value.base}`)
    }

    function getCurrentSource() {
        return sourceInfo.value.current_source
    }
    function getSourceBaseAddress() {
        return sourceInfo.value.base
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

    function getAlias(fname) {
        const name = fname.toLowerCase()
        if (name in module_alias) {
            return module_alias[name]
        }
        return name
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

    async function getSourceListing(source_name) {
        const filename = getAlias(source_name) + getModuleType(source_name) + ".lst"
        try {
            sourceInfo.value.content = []
            // const url = useRuntimeConfig().public.api_url + "/" + filename
            const url = useRuntimeConfig().public.api_url + "/source"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            console.log(`get ${filename}`)
            // const response = await $fetch(url, { parseResponse: (txt) => txt })
            const response = await $fetch(url, {
                headers,
                query: {
                    file: filename
                }
            })
            setSourceBase(source_name)
            sourceInfo.value.content = response;
        } catch (error) {
            console.log(error)
            throw `File not found: [${filename}]`
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

    async function createDisk(drive, name, dbl_side, nb_tracks) {
        try {
            const url = useRuntimeConfig().public.api_url + "/disk"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { 
                method: 'POST', 
                headers,
                query: {
                    drive,
                    name,
                    dbl_side,
                    nb_tracks
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

    async function getTracingInfo() {
        try {
            const url = useRuntimeConfig().public.api_url + "/tracing"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            const response = await $fetch(url, { headers })
            return response
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
        memory_start,
        memory_content,
        selected_memory,
        floppy_disks,
        available_disks,
        getSourceListing,
        isBreakpoint,
        isCurrentLine,
        getRegisters,
        setRegister,
        getModuleInfo,
        getCurrentSource,
        getSourceBaseAddress,
        getSourceContent,
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
        unmountDisk,
        createDisk,
        getTracingInfo
    }
})
