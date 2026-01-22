<template>
    <div class="button-bar">
        <ControlButton @click="store.reset(true)"><IconsReset /></ControlButton>
        <ControlButton @click="store.run()"><IconsRun /></ControlButton>
        <ControlButton @click="store.cpubreak()"><IconsStop /></ControlButton>
        <ControlButton @click="store.step()"><IconsStep /></ControlButton>
        <ControlButton @click="store.stepover()"><IconsStepOver /></ControlButton>
        <ControlButton @click="$emit('breakpoint')"><IconsBreakBtn /></ControlButton>
        <ControlButton @click="$emit('memory')"><IconsMemory /></ControlButton>
        <ControlButton @click="$emit('watch')"><IconsWatchpoint /></ControlButton>
    </div>
</template>

<script setup>
    const store = useCpuStore()
</script>

<style scoped>

.button-bar {
    color: white;
}

</style>