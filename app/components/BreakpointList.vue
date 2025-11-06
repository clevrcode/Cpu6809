<template>
<div class="list-box">
    <div v-for="brkpt in breakpoints">
        <BreakpointItem :address="brkpt.address" :enabled="brkpt.enable" @toggle-enable="toggleEnabled"></BreakpointItem>
    </div>
</div>
</template>

<script setup>

const store = useMainStore()
const breakpoints = computed(() => store.breakpoints)

function toggleEnabled(address, enable) {
    store.addBreakpoint({ address, enable })
}

</script>

<style scoped>

.list-box {
    border: solid 2px white;
    background-color: black;
    color: white;
    width: 100px;
    height: 100px;
}

</style>