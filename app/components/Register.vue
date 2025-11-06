<template>
    <div class="reg-window">
        <div class="reg-name">{{ name }}</div><div class="reg-value" :class="{ 'wide-box': large, modified }">{{ hex_value }}</div>
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

const modified = ref(false)
const store = useMainStore()

const hex_value = computed(() => {
    // console.log(`convert value ${props.name} : ${store.registers[props.name]}`)
    const w = props.large ? 4 : 2
    const reg_value = store.registers[props.name]
    return reg_value.toString(16).padStart(w, '0').toUpperCase()
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
    background-color: blueviolet;
    width: 80px;
    padding: 10px;
    text-align: center;
}

.reg-value {
    border: solid 1px white;
    background-color:darkblue;
    color: white;
    width: 50px;
    padding: 10px;
    text-align: center;
}

.wide-box {
    width: 100px
}

.modified {
    color: red;
}

</style>