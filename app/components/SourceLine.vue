<template>
    <div class="debug-line">
        <div v-if="line_comment">
            <div class="debug-line-comment" :class="{fanfold}">
                <div class="brkpt">
                    <div> </div>
                </div>
                <div class="filename">{{ filename }}</div>
                <div class="addr">{{ addr }}</div>
                <div class="code">{{ code }}</div>
                <div class="comments"><pre>{{ comments }}</pre></div>
            </div>        
        </div>
        <div v-else>
            <div class="debug-line-code" :class="{fanfold, brkpt_active, current_line}">
                <div class="brkpt" :class="{canset}" v-if="brkpt_active" @click="toggleBreakpoint">
                    <IconsBreakpoint />
                </div>
                <div class="brkpt" :class="{canset}" v-else @click="toggleBreakpoint">
                    <div v-if="current_line">
                        <IconsPointer />
                    </div>
                </div>
                <div class="filename">{{ filename }}</div>
                <div class="addr">{{ addr }}</div>
                <div class="code">{{ code }}</div>
                <div class="label">{{ label }}</div>
                <div class="opcode">{{ opcode }}</div>
                <div class="operand">{{ operand }}</div>
                <div class="comments">{{ comments }}</div>
            </div>        
        </div>
    </div>
</template>

<script setup>

const store = useCpuStore()

const props = defineProps({
    index: {
        type: Number,
        required: true
    },
    line: {
        type: Object,
        required: true
    },
    curline: {
        type: Number,
        required: false,
        default: null
    }
})

let address = ref(null)

const addr = computed(() => {
    if (props.line.address != null) {
        return formatNumber(props.line.address, 16, 4)
    }
    return ""
})


const filename = computed(() => {
    if (address.value && (props.line.code.length > 0)) {
        return `${linenb.value}:(${formatNumber(address.value, 16, 4)})`
    }
    return `${linenb.value}:(----)`
})
const code     = computed(() => props.line.code)
const linenb   = computed(() => formatNumber(props.line.line, 10, 5))
const label    = computed(() => props.line.opcode.label)
const opcode   = computed(() => props.line.opcode.opcode)
const operand  = computed(() => props.line.opcode.operand)
const comments = computed(() => props.line.opcode.comment)
// const currline = ref(false)
const fanfold  = computed(() => (props.index % 6) < 3)
const canset   = computed(() => (props.line.address != null) && (props.line.code != ""))
const brkpt_active = ref(false)

const current_line = computed(() => {
    return ((props.curline != null) && (props.curline == props.line.line))
})

function testBreakpoint() {
    if (address.value) {
        // console.log(`test breakpoint ${address}`)
        brkpt_active.value = store.isBreakpoint(address.value)
    }
}

function testCurrentLine() {
    if (address.value) {
        // currline.value = address.value == store.cpu_state.registers["PC"]
        if (address.value == store.cpu_state.registers["PC"]) {
            console.log(`pc: ${pgm_counter.value}, addr: ${address.value}`)
        }
    }
}

onMounted(() => {
    if (props.line.address != null) {
        address.value = props.line.address + store.source_info.base_address
        testBreakpoint()
        testCurrentLine()
    }
})

const pgm_counter = computed(() => {
    return store.cpu_state ? store.cpu_state.registers["PC"] : 0
})
watch(pgm_counter, () => {
    testCurrentLine()
})


const breakpointList = computed(() => store.breakpoints)
watch(breakpointList, () => {
    testBreakpoint()
})

const line_comment = computed(() => {
    return (props.line.opcode.label === "") && (props.line.opcode.opcode === "") && (props.line.opcode.operand === "")
})

function toggleBreakpoint() {
    if (brkpt_active.value) {
        store.deleteBreakpoint(address.value)
    } else {
        store.addBreakpoint(address.value, true)
    }
}

</script>

<style scoped>

.debug-line {
    height: 18px;
}

.debug-line-comment {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 2rem  10rem     3rem 10rem auto;
    grid-template-areas:  'brkpt filename addr code  comments';
}

.debug-line-code {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 2rem 10rem     3rem 10rem 6rem  6rem   20rem   auto;
    grid-template-areas: 'brkpt filename addr code  label opcode operand comments';
}

.fanfold {
    background: rgb(228, 253, 228);
}

.brkpt_active {
    background-color: rgb(255, 209, 216);
}

.current_line {
    /* background-color: rgb(168, 216, 255); */
    background-color: lightblue;
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