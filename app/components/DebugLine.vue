<template>
    <div class="debug-line" :class="{selected}" @click="toggle">
        <div class="brkpt">X</div>
        <div class="addr">{{ addr }}</div>
        <div class="code">{{ code }}</div>
        <div class="filename">{{ filename }}</div>
        <div class="opcode">{{ opcode }}</div>
        <div class="comments">{{ comments }}</div>
    </div>
</template>

<script setup>

const props = defineProps({
    line: {
        type: Array,
        required: true
    }
})

const addr = computed(() => props.line[1])
const code = computed(() => props.line[2])
// const filename = computed(() => `${props.line[3]}:${props.line[4]}`)
const filename = computed(() => props.line[4])
const opcode = computed(() => props.line[5])
const comments = computed(() => props.line[6])
const selected = ref(false)

function toggle() {
    selected.value = !selected.value
}

</script>

<style scoped>

.debug-line {
    display: grid;
    grid-template-columns: 2rem 3rem 10rem 4rem auto auto ;
    grid-template-areas: 'brkpt addr code filename opcode comments';
}

.selected {
    background-color: aqua;
}

</style>