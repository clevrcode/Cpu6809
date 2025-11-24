<template>
    <div class="disk-selector-form">
        <div class="disk-form">
            <label for="fileList">Disks:</label>
            <select id="fileList" v-model="diskSelected" @change="diskChanged">
                <option disabled value="">Select a disk</option>
                <div v-for="disk in store.available_disks" >
                    <option :value="disk.name">{{ disk.name }}</option>
                </div>
            </select>
        </div>
        <div class="disk-buttons">
            <BaseButton @click="applyChange">Apply</BaseButton>
            <BaseButton @click="removeDisk">REMOVE</BaseButton>
            <BaseButton @click="cancel">Cancel</BaseButton>
        </div>
    </div>
</template>

<script setup>

const store = useMainStore()
const diskSelected = ref("")

function applyChange() {
    console.log(`change disk to: ${diskSelected.value}`)
}

function removeDisk() {
    console.log("remove disk")
}

function cancel() {
    console.log("cancel")
}

</script>

<style scoped>

.disk-selector-form {
    background-color: #f99a08;
    border-radius: 8px;;
    /* height: 500px; */
}

.disk-form {
    height: 300px;
    margin: 20px;
    /* width: 400px; */
}

.disk-form label {
    padding: 10px;
}

.disk-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px;
}

</style>