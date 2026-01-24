<template>
    <div class="disk-selector-form">
        <div class="disk-form">
            <fieldset>
                <legend>Select disk</legend>
                <div class="radio-buttons">
                    <div class="dsk-selection-radio">
                        <div class="disk-radio"><input type="radio" id="select" name="dsk_" value="SELECT" v-model="disk_select"/>
                            <label for="select">Select a disk</label>
                            <select id="fileList" v-model="diskSelected" @change="diskChanged" :disabled="!selectEnabled">
                                <option disabled value="">Select a disk</option>
                                <option v-for="{ name } in store.available_disks" :value="name" :key="name">
                                    {{ name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Create new disk</legend>
                <div class="dsk-creation-radio">
                    <div class="disk-radio"><input type="radio" id="create" name="dsk_" value="CREATE" v-model="disk_select"/>
                        <label for="create">Create a disk</label>
                        <input type="text" v-model="diskToCreate" :disabled="selectEnabled">
                        <input type="checkbox" id="double_side" name="double_side" :checked="doubleSide" @change="checkDoubleSide" />
                        <label for="double-side">Double Side</label>
                        <fieldset>
                            <legend>Number of tracks</legend>
                            <input type="radio" id="size1" name="dsk_size" value="35" v-model="disk_size" :disabled="selectEnabled"/>
                            <label for="size1">35</label>
                            <input type="radio" id="size2" name="dsk_size" value="40" v-model="disk_size" :disabled="selectEnabled"/>
                            <label for="size2">40</label>
                            <input type="radio" id="size3" name="dsk_size" value="80" v-model="disk_size" :disabled="selectEnabled"/>
                            <label for="size3">80</label>
                        </fieldset>
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="disk-buttons">
            <BaseButton @click="applyChange">Apply</BaseButton>
            <BaseButton @click="removeDisk">REMOVE</BaseButton>
            <BaseButton @click="cancel">Cancel</BaseButton>
        </div>
    </div>
</template>

<script setup>

const store = useCpuStore()
const diskSelected = ref("")
const diskToCreate = ref("")

const disk_select = ref("SELECT")
const disk_size = ref("40")

const selectEnabled = computed(() => disk_select.value == "SELECT")
const doubleSide = ref(true)

function checkDoubleSide() {
    doubleSide.value = !doubleSide.value
}

const emit = defineEmits(['selected', 'create', 'remove', 'cancel'])

function applyChange() {
    if (selectEnabled.value) {
        console.log(`change disk to: ${diskSelected.value}`)
        emit('selected', diskSelected.value)
    } 
    else 
    {
        console.log(`create new disk: ${diskToCreate.value}`)
        if (diskToCreate.value.length > 0) {
            emit('create', diskToCreate.value, doubleSide.value, parseInt(disk_size.value))
        }
    }
}

function removeDisk() {
    console.log("remove disk")
    emit('remove')
}

function cancel() {
    console.log("cancel")
    emit('cancel')
}



</script>

<style scoped>

.disk-selector-form {
    /* background-color: #f99a08; */
    background-color: white;
    border: solid 2px black;
    /* border-radius: 8px; */
}

.disk-form {
    margin: 1px;
    /* background-color: #f99a08; */
    background-color: white;
    /* border-radius: 8px; */
}

fieldset {
    margin: 20px 5px;
}

.dsk-selection-radio {
    padding: 20px 5px;
}

.dsk-creation-radio {
    padding: 20px 5px;
}


.disk-form label {
    padding: 10px;
}

.disk-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px;
    padding: 10px;
}

</style>