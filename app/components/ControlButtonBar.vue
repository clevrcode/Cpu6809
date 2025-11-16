<template>
    <div class="button-bar">
        <ControlButton @click="reset"><IconsReset /></ControlButton>
        <ControlButton @click="run"><IconsRun /></ControlButton>
        <ControlButton @click="stop"><IconsStop /></ControlButton>
        <ControlButton @click="step"><IconsStep /></ControlButton>
        <ControlButton @click="stepover"><IconsStepOver /></ControlButton>
        <ControlButton @click="$emit('memory')">MEMORY</ControlButton>
    </div>
</template>

<script setup>

    const store = useMainStore()

    let timerId = 0
    
    function run() {
        runOnce()
    }

    async function runOnce()
    {
        try {
            await store.run("200")
            await store.updateDisplay()
            if (!store.break_active && !store.wait) {
                timerId = setTimeout(runOnce, 50)
            } else {
                await store.getModuleList()
                timerId = 0
           }
        } catch (error) {
            console.error("An error occurred during 'run':", error);
            timerId = 0
        }
    }        
    
    function stop() {
        if (timerId != 0) {
            clearTimeout(timerId)
            timerId = 0
        }
        store.cpubreak()
    }
    
    function step() {
        store.step()
        store.updateDisplay()
        store.getModuleList()
    }
    
    function stepover() {
        store.stepover()
        store.updateDisplay()
        store.getModuleList()
    }

    function reset() {
        store.reset()
        store.updateDisplay()
        store.getModuleList()
    }

    function update() {
        store.getRegisters()
        store.updateDisplay()
    }

    onMounted(() => {
        update()
        store.getBreakpoints()
    })

</script>

<style scoped>

.button-bar {
    color: white;
}

</style>