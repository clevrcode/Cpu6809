<template>
    <div class="table-address">{{ hexAddress }}</div>
    <div class="table-data" v-for="x of hexData">
        <div class="mem-content" @click="selectMemory(x)" :class="{active: isActive[x.idx]}">{{ x.mem }}</div>
    </div>
    <div class="table-ascii">{{ asciiString }}</div>
</template>

<script setup>

const store = useMainStore()

const emit = defineEmits(['select'])

const props = defineProps({
    address: { type: Number, required: true },
    data: { type: Array, required: true }
})

const isActive = ref([])

//computed((addr) => store.getSelectedMemory() == addr)

const asciiString = computed(() => {
    let str = "";
    for (let i = 0; i < props.data.length; i++) {
        let c = props.data[i]
        if ((c >= 0x20) && (c < 0x80)) {
            str += String.fromCharCode(c);
        } else {
            str += "."
        }
    }
    return str
})
const hexAddress = computed(() => formatNumber(props.address, 16, 4))
const hexData = computed(() => {
    let tmpdata = []
    for (let i = 0; i < props.data.length; i++) {
        let c = props.data[i]
        tmpdata.push({
            addr: props.address + i,
            idx: i,
            mem: formatNumber(c, 16, 2)
        })
        isActive.value[i] = (props.address + i) == store.selected_memory
    }
    return tmpdata
})

function setActive(addr) {
    isActive.value.fill(false)
    // console.log(`start address: ${addr.toString(16)} ${addr % props.data.length}`)
    if ((addr >= props.address) && (addr < (props.address + props.data.length))) {
        isActive.value[addr % props.data.length] = true
    }
}

const selected = computed(() => store.selected_memory)

watch(selected, (addr, _) => {
    setActive(addr)
})

function selectMemory(obj) {
    emit('select', obj)
}

onMounted(() => {
    // console.log("memory line mounted")
    isActive.value = new Array(props.data.length).fill(false);
})

</script>

<style scoped>

.table-address {
    background-color: rgb(87, 180, 211);
    padding: 0 20px;
}

.table-data {
    background-color: lightblue;
    padding: 0 10px;
}

.table-ascii {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    font-weight: 400;
    background-color: rgb(87, 180, 211);
    padding: 0 40px;
}

.mem-content {
    cursor: pointer;
    padding: 3px;
}

.active {
    /* background-color: lightblue; */
    /* border: 1px solid black; */
    /* padding: 3px; */
    background-color: blue;
    color: white;
    box-shadow:
        inset -2px -2px 3px rgb(255 255 255 / 0.6),
        inset 2px 2px 3px rgb(0 0 0 / 0.6);

}

</style>