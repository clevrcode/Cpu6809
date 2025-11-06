<template>
    <div class="brkpt-item">
        <div class="brkpt-checkbox"><input type="checkbox" id="enabled" name="enabled" :checked="enabled" @click="check"/></div>
        <div class="brkpt-address">{{ address }}</div>
    </div>
</template>

<script setup>

const emit = defineEmits(['toggle-enable'])

const props = defineProps({
    address: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    }
})

function check() {
    console.log('toggle enable')
    emit('toggle-enable', props.address, !props.enabled)
}

</script>

<style scoped>

.brkpt-item {
    display: flex;
    flex-direction: row;
    background-color: aquamarine;
    color: black;
}

.brkpt-checkbox {

}

</style>