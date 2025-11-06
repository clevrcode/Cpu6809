<template>
    <div>
        <ControlButton @click="reset"><IconsReset /></ControlButton>
        <ControlButton @click="run"><IconsRun /></ControlButton>
        <ControlButton @click="stop"><IconsStop /></ControlButton>
        <ControlButton @click="step"><IconsStep /></ControlButton>
        <ControlButton @click="stepover"><IconsStepOver /></ControlButton>
    </div>
</template>

<script setup>

const emit = defineEmits(['reset', 'run', 'stop', 'step', 'stepover'])

function reset() {
    emit('reset')
}

function run() {
    emit('run')
}

function stop() {
    emit('stop')
}

function step() {
    emit('step')
}

function stepover() {
    emit('stepover')
}

</script>

<style lang="scss" scoped>

</style>