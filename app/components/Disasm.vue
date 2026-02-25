<template>
    <div class="disasm-content">
        {{ disasm }}
    </div>
</template>

<script setup>

    const store = useCpuStore()
    const disasm = computed(() => store.cpu_state.disasm)

</script>

<style scoped>

.disasm-content {
    background-color: white;
    color: black;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 2rem;
}

</style>