<template>
    <GenericForm @submit="submitForm">
        <div class="main-table" v-for="(_, idx) in address">
            <MemoryLine :address="address[idx]" :data="data[idx]"></MemoryLine>
        </div>
    </GenericForm>
</template>

<script setup>

const store = useMainStore()

const data = ref([])
const address = ref([])

async function submitForm(addr, length) {
    try {
        await store.getMemory(addr, length)
        for (let x=0; x < store.memory_content.length; x += 16) {
            data.value.push(store.memory_content.slice(x, x+16))
            address.value.push(store.memory_start + x)
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => submitForm(256, 256))

</script>

<style scoped>

.main-table {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 4rem repeat(16, 3rem) auto;
}

</style>