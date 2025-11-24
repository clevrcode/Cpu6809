<template>
    <div class="main-page">
        <!-- <CrtDisplay @command="sendCommand"></CrtDisplay>   -->
        <CrtCanvas @command="sendCommand"></CrtCanvas>
        <div class="floppy-drives">
            <FloppyDrive disk_file="disk1"></FloppyDrive>
            <FloppyDrive disk_file="disk2"></FloppyDrive>
            <FloppyDrive disk_file="disk3"></FloppyDrive>
        </div>
    </div>
</template>

<script setup>

    const store = useMainStore()
    
    const emit = defineEmits(['command'])

    async function sendCommand(cmd) {
        console.log('send command...')
        emit('command', cmd)
        // try {
        //     await store.sendCommand(cmd)
        //     await store.run("200")
        //     await store.updateDisplay()
        // } catch (err) {
        //     console.log(err)
        // }
    }
   
</script>

<style scoped>

.main-page {
    display: flex;
    flex-direction: row;
}

.floppy-drives {
    display: flex;
    flex-direction: column;
}

</style>