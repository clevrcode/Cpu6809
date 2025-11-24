<template>
    <transition name="slideform">
        <DiskSelector class="file-form" v-if="showFileSelector" @selected="diskSelected" @cancel="cancelChange" @remove="removeDisk"/>
    </transition>
    <div class="main-page">
        <!-- <CrtDisplay @command="sendCommand"></CrtDisplay>   -->
         <div class="crt-display">
             <CrtCanvas @command="sendCommand"></CrtCanvas>
         </div>
        <div class="floppy-drives">
            <div v-for="disk of store.floppy_disks">
                <FloppyDrive :disk_id="disk.id" :disk_file="disk.name" @change_disk="changeDisk"></FloppyDrive>
            </div>
        </div>
    </div>
</template>

<script setup>

    const store = useMainStore()
    
    const emit = defineEmits(['command'])

    const showFileSelector = ref(false)

    async function sendCommand(cmd) {
        console.log('send command...')
        emit('command', cmd)
    }

    const current_drive = ref(null)

    async function changeDisk(id) {
        console.log(`change disk: ${id}`)
        await store.getAvailableDisks()
        current_drive.value = id
        showFileSelector.value = !showFileSelector.value
    }

    function diskSelected(disk) {
        console.log(`new disk selected: ${disk}`)
        store.mountDisk(current_drive.value, disk)
        current_drive.value = null
        showFileSelector.value = false;
    }

    function cancelChange() {
        console.log("cancel disk change")
        showFileSelector.value = false
    }
    
    function removeDisk() {
        console.log(`remove disk ${current_drive.value}`)
        store.unmountDisk(current_drive.value)
        current_drive.value = null
        showFileSelector.value = false
    }

    onMounted(() => {
        store.getDisksInfo()
        console.log(store.floppy_disks)
    })

</script>

<style scoped>

.main-page {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.file-form {
    position: fixed;
    top: 25%;
    left: 0%;
    z-index: 1;
}

.floppy-drives {
    display: flex;
    flex-direction: column;
}

.slideform-enter-from,
.slideform-leave-to {
    transform: translateX(-100%);
}

.slideform-enter-active,
.slideform-leave-active {
    transition: transform 0.5s;
}

.slideform-enter-to {
    transform: translateX(0%);
}


</style>