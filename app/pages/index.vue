<template>
    <div class="main-page">
        <!-- <CrtDisplay @command="sendCommand"></CrtDisplay>   -->
        <CrtCanvas @command="sendCommand"></CrtCanvas>
    </div>
</template>

<script setup>

    const store = useMainStore()
    
    async function sendCommand(cmd) {
        try {
            await store.sendCommand(cmd)
            await store.run("200")
            await store.updateDisplay()
        } catch (err) {
            console.log(err)
        }
    }
   
</script>

<style scoped>
</style>