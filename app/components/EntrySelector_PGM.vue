<template>
    <div>
        <fieldset>
            <legend>Entry Point:</legend>
            <input type="checkbox" id="start_" name="start_" :checked="selected" @change="valueChanged" />
            <label for="start_">Start</label>
        </fieldset>
    </div>
</template>

<script setup>

const emit = defineEmits(['entry_changed'])

const selected = ref(false)

const props = defineProps({
    exec_offset: { 
        type: Number, 
        required: true 
    }
})

function valueChanged() {
    selected.value = !selected.value
    if (selected.value) {
        emit('entry_changed', props.exec_offset)
    } else {
        emit('entry_changed', 0)
    }
}

</script>

<style scoped>

</style>