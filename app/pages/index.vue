<template>
    <!-- === Popover ================== -->
    <div ref="disk-popup" popover class="disk-popup">
        <DiskSelector class="disk-form" 
            @selected="selectDisk" 
            @create="createDisk"
            @cancel="cancelChange" 
            @remove="removeDisk"/>
    </div>
    <!-- ============================== -->
    <div class="main-page">
         <div class="crt-display">
             <CrtCanvas></CrtCanvas>
         </div>
        <div class="floppy-drives" v-if="clientMounted">
            <div v-for="disk of store.floppy_disks">
                <FloppyDrive :disk_id="disk.id" :disk_file="disk.name" :motor_on="disk.motor_on" @change_disk="changeDisk"></FloppyDrive>
            </div>
        </div>
    </div>
</template>

<script setup>

    const store = useCpuStore()
    const diskPopup = useTemplateRef('disk-popup')

    const clientMounted = ref(false)
    const current_drive = ref(null)

    onMounted(() => clientMounted.value = true)

    function changeDisk(id) {
        console.log(`change disk: ${id}`)
        store.getAvailableDisks()
        current_drive.value = id
        diskPopup.value.togglePopover()
    }

    function selectDisk(disk) {
        console.log(`new disk selected: ${disk}`)
        store.mountDisk(current_drive.value, disk)
        current_drive.value = null
        diskPopup.value.togglePopover()
    }

    function createDisk(disk, dbl_side, nb_tracks) {
        console.log(`create disk: ${disk}, double side: ${dbl_side}, tracks: ${nb_tracks}`)
        store.createDisk(current_drive.value, disk, dbl_side, nb_tracks)
        current_drive.value = null
        diskPopup.value.hidePopover()
    }

    function cancelChange() {
        console.log("cancel disk change")
        diskPopup.value.hidePopover()
    }
    
    function removeDisk() {
        console.log(`remove disk ${current_drive.value}`)
        store.unmountDisk(current_drive.value)
        current_drive.value = null
        diskPopup.value.hidePopover()
    }

</script>

<style scoped>

.main-page {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.floppy-drives {
    display: flex;
    flex-direction: column;
}

/* 1. Default (hidden) state styles and transitions */
.disk-popup {
    opacity: 0;
    padding: 0;
    margin: auto;
    transform: scale(0.5) translateY(-50px);
    transition: 
        opacity 0.5s, 
        transform 0.5s, 
        overlay 0.5s allow-discrete, 
        display 0.5s allow-discrete;
}

/* 2. Open state styles (what it transitions TO) */
.disk-popup:popover-open {
    opacity: 1;
    transform: scale(1) translateY(0);
    /* No need to list transitions again if using shorthand on the base selector */
}

/* 3. Define the STARTING styles for the entry transition */
@starting-style {
    /* Styles inside this block are applied right before the element is shown */
    .disk-popup:popover-open {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
    }
}

/* Optional: Add a backdrop transition */
.disk-popup::backdrop {
    background-color: rgb(0 0 0 / 0%); /* Start fully transparent */
    backdrop-filter: unset;
    transition: 
        background-color 0.5s,
        background-filter 0.5s,
        display 0.5s allow-discrete, 
        overlay 0.5s allow-discrete;
}

.disk-popup:popover-open::backdrop {
    background-color: rgb(0 0 0 / 25%); /* End with a dimmed background */
    backdrop-filter: blur(5px);
}

@starting-style {
    .disk-popup:popover-open::backdrop {
        background-color: rgb(0 0 0 / 0%);
    }
}

</style>