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
            <module-selector :module="moduleSelected" @module_changed="moduleChanged"></module-selector>
        </div>
        <div class="module-entries" v-if="(moduleType == 14) || (moduleType == 13)">
            <div class="module-entries_fileManager" v-if="moduleType == 13">
                <EntrySelector_FM @entry_changed="entryChanged"></EntrySelector_FM>
            </div>
            <div class="module-entries_deviceDriver" v-else>
                <EntrySelector_DD @entry_changed="entryChanged"></EntrySelector_DD>
            </div>

        </div>
        <div class="break-input">
            <input type="text" :placeholder="breakpoint_hint" spellcheck="false" @keydown="dataInput" v-model="breakpoint">
        </div>
        <div class="button-bar">
            <BaseButton @click="submitBreakpoint" :enabled="applyEnabled">APPLY</BaseButton>
            <BaseButton @click="$emit('cancel')">CANCEL</BaseButton>
        </div>
    </div>
</template>

<script setup>

const emit = defineEmits(['submit', 'cancel'])

const props = defineProps({
    radix: { type: Number, required: false, default: 16 }
})
const store = useCpuStore()

const breakpoint = ref("")
const useModule = ref(false)
const moduleSelected = ref("")
const moduleType = ref(0)
const applyEnabled = computed(() => breakpoint.value.length > 0)

const breakpoint_hint = computed(() => {
    if (useModule.value && moduleSelected.value.length > 0)
        return "offset"
    return "absolute address"
})
function moduleChanged(event) {
    console.log(`module changed to: ${event}`)
    setSelectedModule(event)
}

function entryChanged(offset) {
   console.log(`entry changed to: ${offset}`)
//    let addr = getBreakpointAddress(offset)
   breakpoint.value = formatNumber(offset, props.radix, 0)
}

function setSelectedModule(name) {
    const module = store.modules.find((m) => m.name === name)
    if (module) {
        moduleSelected.value = module.name
        moduleType.value = module.type
    }
    else
    {
        moduleSelected.value = ""
        moduleType.value = 0
    }
}

const breakpoints = computed(() => {
    let brkpts = []
    for (let brk of store.breakpoints) {
        if (!brk.temporary) {
            let obj = { 
                address: brk.address,
                strAddress: hexAddress(brk.address),
                enable: brk.enabled
            }
            if (useModule.value) {
                let mod = findModule(brk.address)
                if (mod) {
                    let addr = brk.address - mod.start
                    obj.strAddress =  mod.name + ":" + hexAddress(addr)
                    if (mod.type == 14) 
                    {
                        if (addr == 0)
                            obj.strAddress =  mod.name + ":Init"
                        else if (addr == 3)
                            obj.strAddress =  mod.name + ":Read"
                        else if (addr == 6)
                            obj.strAddress =  mod.name + ":Write"
                        else if (addr == 9)
                            obj.strAddress =  mod.name + ":GetStat"
                        else if (addr == 12)
                            obj.strAddress =  mod.name + ":SetStat"
                        else if (addr == 15)
                            obj.strAddress =  mod.name + ":Term"
                    }
                    else if (mod.type == 13)
                    {
                        if (addr == 0)
                            obj.strAddress =  mod.name + ":Create"
                        else if (addr == 3)
                            obj.strAddress =  mod.name + ":Open"
                        else if (addr == 6)
                            obj.strAddress =  mod.name + ":MakDir"
                        else if (addr == 9)
                            obj.strAddress =  mod.name + ":ChgDir"
                        else if (addr == 12)
                            obj.strAddress =  mod.name + ":Delete"
                        else if (addr == 15)
                            obj.strAddress =  mod.name + ":Seek"
                        else if (addr == 18)
                            obj.strAddress =  mod.name + ":Read"
                        else if (addr == 21)
                            obj.strAddress =  mod.name + ":Write"
                        else if (addr == 24)
                            obj.strAddress =  mod.name + ":ReadLn"
                        else if (addr == 27)
                            obj.strAddress =  mod.name + ":WriteLn"
                        else if (addr == 30)
                            obj.strAddress =  mod.name + ":GetStat"
                        else if (addr == 33)
                            obj.strAddress =  mod.name + ":SetStat"
                        else if (addr == 36)
                            obj.strAddress =  mod.name + ":Close"
                    }
                }
            }
            brkpts.push(obj)
        }
    }
    return brkpts
})

function hexAddress(addr) {
    return formatNumber(addr, props.radix, 4)
}

function findModule(addr) {
    for (let module of store.modules) {
        if ((addr >= module.start) && (addr < module.end)) {
            return module
        }
    }
    return null
}

function submitBreakpoint()
{
    let address = Number.parseInt(breakpoint.value, props.radix);
    if (useModule.value) {
        address += getBreakpointAddress()
    }
    breakpoint.value = ""
    emit('submit', address)
}

function getBreakpointAddress(offset=0)
{
    const module = store.modules.find((elem) => elem.name === moduleSelected.value)
    if (module) {
        return module.start + offset
    }
    return 0
}

function dataInput(ev) {
    try {
        if (ev.key === "Enter") {
            const enable = true
            console.log(moduleSelected.value)
            console.log(breakpoint.value)
            submitBreakpoint()
        } 
    } catch (error) {
        console.log(error)
    }
}

function toggleEnabled(address, enable) {
    store.addBreakpoint(address, enable)
}

function deleteBreakpoint(address) {
    store.deleteBreakpoint(address)
}

function UseModuleChanged() {
    useModule.value = !useModule.value
    if (!useModule.value) {
        moduleSelected.value = ""
        moduleType.value = 0
    }
}

onMounted(() => {
    if (store.current_module) {
        console.log(`module: ${store.current_module.name}`)
        setSelectedModule(store.current_module.name)
        useModule.value = true
    }
    else if (store.modules.length == 0)
    {
        store.getModules()
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

.module-entries {
    color: white;
}

.button-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

</style>