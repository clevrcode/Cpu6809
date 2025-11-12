export const useMainStore = defineStore('main', () => {

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


    function setRegisters(reg) {
        registers.value = reg.registers
        load.value = reg.load
        map_type.value = reg.map_type
        break_active.value = reg.break
        wait.value = reg.wait
        halted.value = reg.halted
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
  
    async function step() {
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

    async function stepover() {
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

    async function reset() {
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
        getRegisters,
        getModuleList,
        updateDisplay,
        getBreakpoints,
        addBreakpoint,
        deleteBreakpoint,
        sendCommand,
        run,
        cpubreak,
        step,
        stepover,
        reset
    }
})
