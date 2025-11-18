<template>
    <GenericForm @submit="submitForm" :with_buttons="false">
        <div class="main-window">
            <div class="header">
                <h1>MEMORY</h1>
                <div class="mem-address">
                    <label for="memvalue">{{ start_address }}</label>
                    <input type="text" id="memvalue" v-model="start_value">
                    <BaseButton @click="setStart">Apply</BaseButton>

                </div>
                <div class="mem-input">
                    <label for="memvalue">{{ mem_address }}</label>
                    <input type="text" id="memvalue" v-model="mem_value">
                    <BaseButton @click="setMemory">Apply</BaseButton>
                </div>
            </div>
            <div class="table-frame">
                <div class="main-table" v-for="(_, idx) in address">
                    <MemoryLine @changemem="changeMemory" :address="address[idx]" :data="memdata[idx]" ></MemoryLine>
                </div>
            </div>
            <div class="data-buttons">
                <button @click="backwardPage"><IconsFastBackward /></button>
                <button @click="backwardLine"><IconsBackward /></button>
                <button @click="forwardLine"><IconsForward /></button>
                <button @click="forwardPage"><IconsFastForward /></button>
            </div>
        </div>
    </GenericForm>
</template>

<script setup>

const store = useMainStore()

const start_value = ref("")
const mem_value = ref("")
const start_address = computed(() => store.memory_start?.toString(radix.value).padStart(4, '0').toUpperCase())
const mem_address = computed(() => store.selected_memory?.toString(radix.value).padStart(4, '0').toUpperCase())

const memdata = ref([])
const address = ref([])
const radix = ref(16)

function changeMemory(obj) {
    console.log(`change memory ${obj.addr.toString(radix.value)} ${obj.mem}`)
    // mem_address.value = obj.addr.toString(radix.value).padStart(4, '0').toUpperCase()
    mem_value.value = obj.mem
}

function setStart() {
    console.log(`set start address: ${start_value.value}`)
    submitForm(parseInt(start_value.value, radix.value), 256)
}

function setMemory() {
    console.log(`${mem_value.value}`)
    const address = store.selected_memory
    const value = parseInt(mem_value.value, radix.value)
    console.log(`set memory: ${address} ${value}`)
    store.setMemory(address, value)
    submitForm(store.memory_start, 256)
}

async function submitForm(addr, length) {
    try {
        await store.getMemory(addr, length)
        address.value = []
        memdata.value = []
        for (let x=0; x < store.memory_content.length; x += 16) {
            address.value.push(store.memory_start + x)
            memdata.value.push(store.memory_content.slice(x, x+16))
        }
    } catch (error) {
        console.log(error)
    }
}

function backwardPage() {
    if (store.memory_start >= 0x100) {
        submitForm(store.memory_start - 0x100, 256)
    } else {
        submitForm(0, 256)
    }    
}

function backwardLine() {
    if (store.memory_start >= 0x10) {
        submitForm(store.memory_start - 0x10, 256)
    } else {
        submitForm(0, 256)
    }    
}
function forwardLine() {
    if (store.memory_start < 0xFF00) {
        submitForm(store.memory_start + 0x10, 256)
    } else {
        submitForm(0xFF00, 256)
    }    
}
function forwardPage() {
    if (store.memory_start <= 0xFE00) {
        submitForm(store.memory_start + 0x100, 256)
    } else {
        submitForm(0xFF00, 256)
    }    
}

onMounted(() => {
    console.log(`on mounted ${store.memory_start} ${store.getSelectedMemory()}`)
    if (store.memory_start) {
        submitForm(store.memory_start, 256)
        if (store.getSelectedMemory()) {
            const sel = store.getSelectedMemory()
            console.log(`update selected memory to: ${sel}`)
            mem_value.value = store.memory_content[sel - store.memory_start].toString(radix.value).padStart(2, '0').toUpperCase()
        }
    } else {
        submitForm(0, 256)
    }
})

</script>

<style scoped>

.main-window {
    margin: 20px;
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}

.mem-address {
    display: flex;
    flex-direction: row;
    align-items: center;
}

input {
    height: 35px;
    font-size: 1.3rem;
    width: 100px;
}

label {
    font-size: 1.2rem;
    padding: 0 15px;
}

.mem-input {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.table-frame {
    padding: 5px;
    background-color: #fb660c;
    border: 2px solid black;
}

.main-table {
    display: grid;
    background-color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    font-weight: 400;
    grid-template-columns: 6rem repeat(16, 3.0rem) auto;
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