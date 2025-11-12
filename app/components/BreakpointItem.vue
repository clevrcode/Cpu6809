<template>
    <div class="brkpt-item">
        <div class="brkpt-checkbox"><input type="checkbox" id="enabled" name="enabled" :checked="checked" @change="check"/></div>
        <label for="enabled">{{ breakpoint.strAddress }}</label>
        <button @click="deleteBreakpoint">
            <IconsDelete></IconsDelete>
        </button>
    </div>
</template>

<script setup>

const emit = defineEmits(['toggle-enable', 'delete'])

const props = defineProps({
    breakpoint: {
        type: Object,
        required: true
    }
})

const checked = ref(props.breakpoint.enable)

function check() {
    checked.value = !checked.value
    emit('toggle-enable', props.breakpoint.address, checked.value)
}

function deleteBreakpoint() {
    console.log('delete breakpoint...')
    emit('delete', props.breakpoint.address)
}

</script>

<style scoped>

.brkpt-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #f99a08;
    color: black;
    padding: 5px;
}

</style>
