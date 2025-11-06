<template>
    <div class="brkpt-item">
        <div class="brkpt-checkbox"><input type="checkbox" id="enabled" name="enabled" :checked="enabled" @click="check"/></div>
        <div class="brkpt-address">0x{{ hex_address }}</div>
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

const hex_address = computed(() => props.address.toString(16).padStart(4, '0').toUpperCase())

function check() {
    emit('toggle-enable', props.address, !props.enabled)
}

</script>

<style scoped>

.brkpt-item {
    display: flex;
    flex-direction: row;
    background-color: aquamarine;
    color: black;
    padding: 5px;
}

</style>