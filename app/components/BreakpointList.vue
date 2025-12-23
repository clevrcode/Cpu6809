<template>
    <div class="list-box">
        <div class="follow-checkbox">
            <input type="checkbox" id="use_module" name="use_module" :checked="useModule" @change="UseModuleChanged" />
            <label for="use_module">Follow OS9 module</label>
        </div>
        <div v-for="breakpoint of breakpoints">
            <BreakpointItem :breakpoint @toggle-enable="toggleEnabled" @delete="deleteBreakpoint"></BreakpointItem>
        </div>
        <div class="break-modules" v-if="useModule">
            <module-selector :module="moduleSelected" @change="moduleChanged"></module-selector>
        </div>
        <div class="break-input">
            <input type="text" placeholder="breakpoint" spellcheck="false" @keydown="dataInput" v-model="breakpoint">
        </div>
    </div>
</template>

<script setup>

const store = useMainStore()

const moduleSelected = ref("")
const breakpoint = ref("")

let useModule = ref(true)

function moduleChanged(event) {
    console.log(`module changed to: ${event.target.value}`)
    moduleSelected.value = event.target.value
}

const breakpoints = computed(() => {
    let brkpts = []
    for (let brk of store.breakpoints) {
        let obj = { 
            address: brk.address,
            strAddress: hexAddress(brk.address),
            enable: brk.enable
        }
        if (useModule.value) {
            // console.log(findModule(brk.address))
            let mod = findModule(brk.address)
            if (mod) {
                let addr = brk.address - mod.start
                obj.strAddress =  mod.name + ":" + hexAddress(addr)
            }
        }
        brkpts.push(obj)
    }
    return brkpts
})

function hexAddress(addr) {
    return formatNumber(addr, 16, 4)
}

function findModule(addr) {
    for (let module of store.modules) {
        if ((addr >= module.start) && (addr < module.end)) {
            return module
        }
    }
    return null
}

function dataInput(ev) {
    try {
        if (ev.key === "Enter") {
            const enable = true
            console.log(moduleSelected.value)
            console.log(breakpoint.value)
            let address = Number.parseInt(breakpoint.value, 16);
            if (useModule.value) {
                let module = store.modules.find((elem) => elem.name === moduleSelected.value)
                if (module) {
                    address += module.start
                    console.log(`absolute address is: ${address}`)
                }
            }
            store.addBreakpoint({ address, enable })
            breakpoint.value = ""
        } 
    } catch (error) {
        console.log(error)
    }
}

function toggleEnabled(address, enable) {
    store.addBreakpoint({ address, enable })
}

function deleteBreakpoint(address) {
    store.deleteBreakpoint(address)
}

function UseModuleChanged() {
    useModule.value = !useModule.value
}

onMounted(async () => {
    try {
        await store.getBreakpoints()
        await store.getModuleList()
        const info = store.getModuleInfo()
        console.log(`module: ${info.current_module}`)
        moduleSelected.value = info.current_module
    } catch (error) {
        console.log(error)
    }
})

</script>

<style scoped>

.list-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: solid 5px #777;
    background-color: black;
    width: 300px;
}

.follow-checkbox {
    padding: 5px 5px;
}

.follow-checkbox label {
    color: white;
}

.break-input {
    width: 100%;
    padding: 5px 0;
}

.break-input input {
    width: 100%;
    font-size: 24px;
}

.break-modules {
    margin: 10px 0;
    padding: 15px 0;
}
.break-modules label {
    padding: 15px 0;
}
.break-modules select {
    width: 100%;
}

</style>