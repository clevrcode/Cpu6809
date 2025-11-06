<template>
    <div class="registers">
        <h1>REGISTERS</h1>
        <Register name="A" />
        <Register name="B" />
        <Register name="D" :large="true" />
        <Register name="X" :large="true" />
        <Register name="Y" :large="true" />
        <Register name="U" :large="true" />
        <Register name="S" :large="true" />
        <Register name="PC" :large="true" />
    </div>
</template>

<script setup>

const store = useMainStore()
const registers = computed(() => {
    console.log("registers updated")
    // console.log(`vertical display size: ${store.display_size.y}`)
    return store.registers
})

</script>

<style scoped>

h1 {
    margin: 0;
}
.registers {
    justify-content: center;
    margin: 0 2.0rem;
}

</style>