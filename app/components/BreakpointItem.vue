<template>
    <div class="brkpt-item">
        <div class="brkpt-checkbox"><input type="checkbox" id="enabled" name="enabled" :checked="checked" @change="check"/></div>
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

const checked = ref(props.enabled)
const hex_address = computed(() => props.address.toString(16).padStart(4, '0').toUpperCase())

function check(ev) {
    checked.value = !checked.value
    // console.log(`checkbox changed [${checked.value}]`)
    emit('toggle-enable', props.address, checked.value)
}

</script>

<style scoped>

.brkpt-item {
    display: flex;
    flex-direction: row;
    background-color: #f99a08;
    color: black;
    padding: 5px;
}

</style>