<template>
    <div v-if="line_comment">
        <div class="debug-line-comment" :class="{selected}" @click="toggle">
            <div class="brkpt" v-if="brkptline" >
                <IconsBreakpoint />
            </div>
            <div class="brkpt" v-else>
                <div>=</div>
            </div>
            <div class="addr">{{ addr }}</div>
            <div class="code">{{ code }}</div>
            <div class="filename">{{ filename }}</div>
            <div class="comments"><pre>{{ comments }}</pre></div>
        </div>        
    </div>
    <div v-else>
        <div class="debug-line-code" :class="{selected}" @click="toggle">
            <div class="brkpt" v-if="brkptline" >
                <IconsBreakpoint />
            </div>
            <div class="brkpt" v-else>
                <div>#</div>
            </div>
            <div class="addr">{{ addr }}</div>
            <div class="code">{{ code }}</div>
            <div class="filename">{{ filename }}</div>
            <div class="label">{{ label }}</div>
            <div class="opcode">{{ opcode }}</div>
            <div class="operand">{{ operand }}</div>
            <div class="comments">{{ comments }}</div>
        </div>        
    </div>
     
</template>

<script setup>

const store = useMainStore()

const props = defineProps({
    line: {
        type: Object,
        required: true
    }
})

const addr = computed(() => props.line.address)
const code = computed(() => props.line.code)
// const filename = computed(() => `${props.line[3]}:${props.line[4]}`)
const filename = computed(() => props.line.file + ":" + props.line.line)
const label = computed(() => props.line.opcode.label)
const opcode = computed(() => props.line.opcode.opcode)
const operand = computed(() => props.line.opcode.operand)
const comments = computed(() => props.line.opcode.comment)

const brkptline = computed(() => {
    if (props.line.address.length == 4) {
        return store.isBreakpoint(parseInt(props.line.address, 16))
    }
    return false
})

const selected = ref(false)

const line_comment = computed(() => {
    return (props.line.opcode.label === "") && (props.line.opcode.opcode === "") && (props.line.opcode.operand === "")
})

function toggle() {
    selected.value = !selected.value
}

</script>

<style scoped>

.debug-line-comment {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 1rem 3rem 10rem 20rem auto;
    grid-template-areas: 'brkpt addr code filename comments';
}

.debug-line-code {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 1rem 3rem 10rem 20rem 6rem 6rem 20rem auto;
    grid-template-areas: 'brkpt addr code filename label opcode operand comments';
}


.selected {
    background-color: aqua;
}

.brkpt {
    background-color: white;
}

.opcode {
    color: purple;
}

.operand {
    color: blue;
}
.comments pre {
    display: inline;
    color: green;
}


</style>