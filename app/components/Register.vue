<template>
    <div class="reg-window" >
        <div class="reg-name" @click="update">{{ name }}</div>
        <div class="reg-value" :class="{ 'wide-box': large, modified }">{{ hex_value }}</div>
    </div>
</template>

<script setup>

// const emit = defineEmits(['update'])

const emit = defineEmits(['update'])

function update() {
    console.log("click update")
    emit('update', props.name)
}

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    large: {
        type: Boolean,
        required: false,
        default: false
    }
})

let prevValue = 0
const modified = ref(false)
const store = useMainStore()

function format_value(val, radix, width) {
    return val.toString(radix).padStart(width, '0').toUpperCase()
}

// watch(store.registers[props.name], (newValue, oldValue) => {
//     modified.value = newValue !== oldValue
// })

const hex_value = computed(() => {
    try {
        modified.value = store.registers[props.name] != prevValue
        prevValue = store.registers[props.name]
        return format_value(store.registers[props.name], 16, props.large ? 4 : 2)
    } catch (err) {
        console.log(err)
    }
})

</script>

<style scoped>

.reg-window {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: center; */
}

.reg-name {
    border: solid 1px;
    background-color: #f99a08;
    width: 50px;
    padding: 10px;
    text-align: center;
}

.reg-value {
    border: solid 1px white;
    background-color: #fb660c;
    color: white;
    width: 100px;
    padding: 10px;
    text-align: center;
}

/* .wide-box {
} */

.modified {
    color: yellow;
}

</style>