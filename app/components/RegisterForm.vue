<template>
    <div class="form-box">
        <div class="form-register_name">Register: {{ name }}</div>
        <div class="form-register_value">{{ hex_value }}</div>
        <input type="text">
        <ControlButton @click="submit">APPLY</ControlButton>
        <ControlButton @click="cancel">CANCEL</ControlButton>
    </div>
</template>

<script setup>

const emit = defineEmits(['submit', 'cancel'])

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
})

function format_value(val, radix, width) {
    return val.toString(radix).padStart(width, '0').toUpperCase()
}

const hex_value = computed(() => format_value(props.value, 16, 4))

function submit() {
    console.log('submit')
    emit('submit', props.name, props.value)
}

function cancel() {
    console.log('cancel')
    emit('cancel')
}


</script>

<style scoped>

.form-box {
    background-color: lightgray;
    padding: 20px;
    border: solid 3px black;
    border-radius: 20px;;
}

.form-register_name {
    font-size: 3rem;
    padding: 20px 0;
}
.form-register_value {
    font-size: 2rem;;
}

</style>