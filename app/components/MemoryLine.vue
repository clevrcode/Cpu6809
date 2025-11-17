<template>
    <div>{{ hexAddress }}</div>
    <div v-for="x of hexData">{{ x }}</div>
    <div>{{ asciiString }}</div>
</template>

<script setup>

const props = defineProps({
    address: { type: Number, required: true },
    data: { type: Array, required: true }
})

const asciiString = ref("")
const hexAddress = computed(() => props.address.toString(16).padStart(4, '0').toUpperCase())
const hexData = ref([])

function buildAscii() {
    asciiString.value = "";
    for (let i = 0; i < props.data.length; i++) {
        let c = props.data[i]
        hexData.value.push(c.toString(16).padStart(2, '0').toUpperCase())
        if ((c >= 0x20) && (c < 0x80)) {
            asciiString.value += String.fromCharCode(c);
        } else {
            asciiString.value += "."
        }
    }
}

onMounted(() => {
    buildAscii()
})

</script>

<style scoped>

</style>