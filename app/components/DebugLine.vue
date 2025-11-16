<template>
    <div v-if="line_comment">
        <div class="debug-line-comment" :class="{fanfold}">
            <div class="brkpt">
                <div>=</div>
            </div>
            <div class="addr">{{ addr }}</div>
            <div class="code">{{ code }}</div>
            <div class="filename">{{ filename }}</div>
            <div class="comments"><pre>{{ comments }}</pre></div>
        </div>        
    </div>
    <div v-else>
        <div class="debug-line-code" :class="{fanfold, brkpt_active: brkptline, current_line: currline}">
            <div class="brkpt" :class="{canset}" v-if="brkptline" @click="toggle">
                <IconsBreakpoint />
            </div>
            <div class="brkpt" :class="{canset}" v-else @click="toggle">
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
    index: {
        type: Number,
        required: true
    },
    line: {
        type: Object,
        required: true
    }
})

let address = null
const addr = computed(() => props.line.address)
const code = computed(() => props.line.code)
// const filename = computed(() => `${props.line[3]}:${props.line[4]}`)
const filename = computed(() => props.line.file + ":" + props.line.line)
const label = computed(() => props.line.opcode.label)
const opcode = computed(() => props.line.opcode.opcode)
const operand = computed(() => props.line.opcode.operand)
const comments = computed(() => props.line.opcode.comment)
const brkptline = ref(false)
const currline = ref(false)
const fanfold = computed(() => (props.index % 6) < 3)
const canset = computed(() => props.line.address != "" && props.line.code != "")

function testBreakpoint() {
    if (address) {
        brkptline.value = store.isBreakpoint(address)
    }
}

function testCurrentLine() {
    if (address) {
        currline.value = store.isCurrentLine(address)
    }
}

onMounted(() => {
    if (props.line.address.length > 0) {
        // console.log(`onMounted: ${props.line.address}`)
        address = parseInt(props.line.address, 16)
        testBreakpoint()
        testCurrentLine()
    }
})

watch(store.breakpoints, () => testBreakpoint())

const line_comment = computed(() => {
    return (props.line.opcode.label === "") && (props.line.opcode.opcode === "") && (props.line.opcode.operand === "")
})

function toggle() {
    console.log("toggle breakpoint TODO")
}

</script>

<style scoped>

.debug-line-comment {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 1.5rem 3rem 10rem 15rem auto;
    grid-template-areas: 'brkpt addr code filename comments';
}

.debug-line-code {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 1.5rem 3rem 10rem 15rem 6rem 6rem 20rem auto;
    grid-template-areas: 'brkpt addr code filename label opcode operand comments';
}


.current_line {
    background-color: rgb(168, 216, 255);
}
.fanfold {
    background: rgb(228, 253, 228);
}
.brkpt_active {
    background-color: rgb(255, 209, 216);
}


.brkpt {
    background-color: white;
}

.canset {
    cursor: pointer;
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