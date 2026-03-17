<template>
    <div class="reg-window" >
        <div class="reg-name">{{ name }}</div>
        <div class="reg-value" :class="{ modified }">{{ hex_value }}</div>
    </div>
</template>

<script setup>

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
const store = useCpuStore()
const clientMounted = ref(false)

const hex_value = computed(() => {
    if (clientMounted.value && store.cpu_state) {
        modified.value = store.cpu_state.registers[props.name] != prevValue
        prevValue = store.cpu_state.registers[props.name]
        return formatNumber(store.cpu_state.registers[props.name], store.radix, props.large ? 4 : 2)
    }
    modified.value = false
    return formatNumber(0, store.radix, props.large ? 4 : 2)
})

onMounted(() => clientMounted.value = true)

</script>

<style scoped>

.reg-window {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: center; */
}

.reg-name {
    border: solid 1px white;
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

.modified {
    color: yellow;
}

</style>