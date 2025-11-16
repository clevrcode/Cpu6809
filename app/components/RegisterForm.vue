<template>
    <GenericForm @submit="submitForm">
        <div class="form-register_name">Register: {{ name }}</div>
        <div class="form-values">
            <div class="form-register_value">{{ hex_value }}</div>
            <div class="form-register_value">{{ dec_value }}</div>
            <BitSelector :value :size @toggle="toggleBit"></BitSelector>
        </div>
        <div class="form-input">
            <input type="text" pattern="[a-fA-F0-9]{1,5}" v-model.trim="new_value">
            <span class="validity"></span>
        </div>
    </GenericForm>
</template>

<script setup>

const emit = defineEmits(['submit'])

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

const in_value = ref(props.value)
const new_value = computed(() => format_value(in_value.value, 16, 4))
const hex_value = computed(() => format_value(props.value, 16, 4))
const dec_value = computed(() => format_value(props.value, 10, 0))

function toggleBit(bit) {
    try {
        const mask = 1 << (props.size - bit - 1)
        in_value.value = in_value.value ^ mask
    } catch (err) {
        console.log(err)
    }
}

function submitForm() {
    console.log(`>>>submit: ${props.name} ${in_value.value} ${in_value.value.toString(16)}`)
    emit('submit', props.name, in_value.value)
}

// function cancel() {
//     console.log('cancel')
//     emit('cancel')
// }

</script>

<style scoped>


.form-register_name {
    font-size: 3rem;
    padding: 20px 0;
}

.form-values {
    display: flex;
    flex-direction: row;
}

.form-register_value {
    font-size: 2rem;
    padding: 0 40px 0 0;
}

.form-input {
    padding: 15px 0;
}

.form-input input {
    font-size: 2rem;
}


.form-input {
  margin-bottom: 10px;
  position: relative;
}

input + span {
  padding-right: 30px;
}
input:invalid + span::after {
  position: absolute;
  content: "✖";
  padding-left: 5px;
}

input:valid + span::after {
  position: absolute;
  content: "✓";
  padding-left: 5px;
}

</style>