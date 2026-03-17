<template>
    <div class="disasm-content">
        {{ disasm }}
    </div>
</template>

<script setup>

    const store = useCpuStore()
    const disasm = computed(() => {
        const addr = formatNumber(store.cpu_state.registers.PC, store.radix, 4)
        return addr + " " + store.cpu_state.disasm
    })

    const clientMounted = ref(false)

    onMounted(() => clientMounted.value = true)

</script>

<style scoped>

.disasm-content {
    background-color: white;
    color: black;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 2rem;
}

</style>