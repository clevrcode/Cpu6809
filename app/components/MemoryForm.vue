<template>
    <GenericForm @submit="sendMemoryRequest" :with_buttons="false">
        <div class="main-window">
            <div class="header">
                <h1>MEMORY</h1>
                <div class="mem-address">
                    <label for="memvalue">{{ mem_origin }}</label>
                    <input type="text" id="memvalue" pattern="[a-fA-F0-9]{1,5}" v-model="start_value" @keydown="originInput">
                    <BaseButton @click="setStart">Apply</BaseButton>
                </div>
                <div class="mem-address">
                    <label for="memvalue">{{ mem_select }}</label>
                    <input type="text" id="memvalue" v-model="mem_change" @keydown="changeInput">
                    <BaseButton @click="setMemory">Apply</BaseButton>
                </div>
                <fieldset>
                    <legend>From Register {{ reg_selected }}</legend>
                    <div class="radio-buttons">
                        <div class="reg-radio"><input type="radio" id="reg_x" name="reg_" value="X" v-model="reg_selected"/>
                            <label for="reg_x">X</label>
                        </div>
                        <div class="reg-radio"><input type="radio" id="reg_y" name="reg_" value="Y" v-model="reg_selected"/>
                            <label for="reg_y">Y</label>
                        </div>
                        <div class="reg-radio"><input type="radio" id="reg_u" name="reg_" value="U" v-model="reg_selected"/>
                            <label for="reg_u">U</label>
                        </div>
                        <div class="reg-radio"><input type="radio" id="reg_s" name="reg_" value="S" v-model="reg_selected"/>
                            <label for="reg_s">S</label>
                        </div>
                        <div class="reg-radio"><input type="radio" id="reg_pc" name="reg_" value="PC" v-model="reg_selected"/>
                            <label for="reg_pc">PC</label>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="mapinfo" v-if="mmu_enabled">
                TR: {{ task_register }}
                MAP: {{ map }}
                Virtual Address: {{ virtual_address }}
            </div>
            <div class="mapinfo" v-else>
                Physical Address: {{ virtual_address }}
            </div>
            <div class="table-frame">
                <div class="main-table">
                    <div></div>
                    <div class="main-table-head" v-for="(_, idx) in address">{{ hexval(idx) }}</div>
                </div>
                <div class="main-table" v-for="(_, idx) in address">
                    <MemoryLine @select="selectMemory" :address="address[idx]" :data="memdata[idx]" ></MemoryLine>
                </div>
            </div>
            <div class="data-buttons">
                <button @click="backwardPage"><IconsFastBackward /></button>
                <button @click="backwardLine"><IconsBackward /></button>
                <button @click="forwardLine"><IconsForward /></button>
                <button @click="forwardPage"><IconsFastForward /></button>
            </div>
            <div class="mmu-registers">
                <MmuInfo tr="0" :data="mmu_registers0"></MmuInfo>
                <MmuInfo tr="1" :data="mmu_registers1"></MmuInfo>
            </div>
        </div>
    </GenericForm>
</template>

<script setup>

const store = useCpuStore()

const start_value = ref("")
const mem_change = ref("")

const memdata = ref([])
const address = ref([])
const radix = ref(16)

const mem_start       = computed(() => store.memory?.address)
const mem_select      = computed(() => store.selected_memory ? formatNumber(store.selected_memory, radix.value, 4) : "")
const mem_updated     = computed(() => store.memory.updated)
const mmu_enabled     = computed(() => store.memory.mmu)
const mmu_registers0  = computed(() => store.memory.mmureg.slice(0,8))
const mmu_registers1  = computed(() => store.memory.mmureg.slice(8))
const task_register   = computed(() => store.memory.tr)
const map             = computed(() => formatNumber(store.memory.map, radix.value, 2))
const virtual_address = computed(() => formatNumber(store.memory.virtual_address, radix.value, 5))

const mem_origin   = ref("")
const reg_selected = ref("")


function hexval(v) {
    return formatNumber(v, 16, 2)
}

function originInput(ev) {
    if (ev.key === "Enter") {
        setStart()
    }
}

function setStart() {
    console.log(`set start address: ${start_value.value}`)
    sendMemoryRequest(parseInt(start_value.value, radix.value), 256)
}

watch(mem_updated, (curr, _) => {
    address.value = []
    memdata.value = []
    for (let x=0; x < store.memory.data.length; x += 16) {
        address.value.push(store.memory.address + x)
        memdata.value.push(store.memory.data.slice(x, x+16))
    }
})

watch(reg_selected, (curr, _) => {
    // console.log(`selection changed from ${old} to ${curr}`)
    if (curr.length > 0) {
        sendMemoryRequest(store.cpu_state.registers[curr], 256)
    }
})

watch(mem_start, (curr, _) => {
    mem_origin.value = computed(() => formatNumber(curr, radix.value, 4))
    setOriginRegister()
})

function selectMemory(obj) {
    console.log(`select memory ${obj.addr.toString(radix.value)} ${obj.mem}`)
    store.setSelectedMemory(obj.addr)
}

function changeInput(ev) {
    if (ev.key === "Enter") {
        setMemory()
    }
}

function setMemory() {
    if (mem_change.value.length > 0) {
        const address = store.selected_memory
        const value = parseInt(mem_change.value, radix.value)
        console.log(`set memory: ${address} ${value}`)
        store.setMemory(address, value)
        sendMemoryRequest(store.memory.address, 256)
    }
}

function sendMemoryRequest(addr, length) {
    store.getMemory(addr, length)
}

function refresh() {
    sendMemoryRequest(store.memory.address, 256)
}

function backwardPage() {
    if (store.memory.address >= 0x100) {
        sendMemoryRequest(store.memory.address - 0x100, 256)
    } else {
        sendMemoryRequest(0, 256)
    }    
}
 
function backwardLine() {
    if (store.memory.address >= 0x10) {
        sendMemoryRequest(store.memory.address - 0x10, 256)
    } else {
        sendMemoryRequest(0, 256)
    }    
}
function forwardLine() {
    if (store.memory.address < 0xFF00) {
        sendMemoryRequest(store.memory.address + 0x10, 256)
    } else {
        sendMemoryRequest(0xFF00, 256)
    }    
}
function forwardPage() {
    if (store.memory.address <= 0xFE00) {
        sendMemoryRequest(store.memory.address + 0x100, 256)
    } else {
        sendMemoryRequest(0xFF00, 256)
    }    
}

function setOriginRegister() {
    if (store.memory.address == store.cpu_state.registers["X"]) {
        reg_selected.value = "X"
    } else if (store.memory.address == store.cpu_state.registers["Y"]) {
        reg_selected.value = "Y"
    } else if (store.memory.address == store.cpu_state.registers["U"]) {
        reg_selected.value = "U"
    } else if (store.memory.address == store.cpu_state.registers["S"]) {
        reg_selected.value = "S"
    } else if (store.memory.address == store.cpu_state.registers["PC"]) {
        reg_selected.value = "PC"
    } else {
        reg_selected.value = ""
    }
}

// const mmuData = computed(() => {
//     let tmpdata = []
//     for (let i = 0; i < store.memory.mmureg.length; i++) {
//         let c = props.data[i]
//         tmpdata.push({
//             tr: i / 8,
//             idx: i % 8,
//             val: formatNumber(c, 16, 2)
//         })
//     }
//     return tmpdata
// })

onMounted(() => {
    if (store.memory) {
        console.log(`on mounted ${store.memory.address} ${store.selected_memory}`)
        sendMemoryRequest(store.memory.address, 256)
        setOriginRegister()
    } else {
        sendMemoryRequest(0, 256)
    }
})

</script>

<style scoped>

.main-window {
    font-family: 'Open+Sans', sans-serif;
    margin: 20px;
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: 20px;
}

.radio-buttons {
    display: flex;
    align-items: flex-start;
    margin-bottom: 5px;
}

fieldset {
    border-radius: 8px;
}

legend {
    color: white;
    background-color: black;
    padding: 5px 10px;
    border-radius: 0;
    border: 0;
    font-size: 14px;
}

.radio-buttons label {
  margin-right: 10px;
  line-height: 15px;
}

.radio-buttons input {
  appearance: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;

  border: 2px solid #555;
  transition: 0.2s all linear;
  margin-right: 5px;

  position: relative;
  top: 4px;
}

.radio-buttons input:checked {
  border: 6px solid black;
}

.mem-address {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.mem-address input {
    height: 30px;
    font-size: 1.1rem;
    width: 100px;
}

.mem-address label {
    font-size: 1.2rem;
    padding: 0 15px;
}

.table-frame {
    padding: 5px;
    background-color: #fb660c;
    border: 2px solid black;
}

.main-table {
    display: grid;
    background-color: white;
    /* font-family: 'Courier New', Courier, monospace; */
    font-size: 1rem;
    font-weight: 400;
    grid-template-columns: 6rem repeat(16, 3.0rem) auto;
    align-items: center;
}

.main-table-head {
    background-color: yellow;
    padding: 0 10px;
}

.data-buttons {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

.data-buttons button {
    width: 80px;
    font-size: 1.5rem;
    box-shadow:
        inset 2px 2px 3px rgb(255 255 255 / 0.6),
        inset -2px -2px 3px rgb(0 0 0 / 0.6);
}

.data-buttons button:active {
    box-shadow:
        inset -2px -2px 3px rgb(255 255 255 / 0.6),
        inset 2px 2px 3px rgb(0 0 0 / 0.6);
}

</style>