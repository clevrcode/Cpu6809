<template>
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

const code = computed(() => props.line.code)
const linenb = computed(() => formatNumber(props.line.line, 10, 5))
// const filename = computed(() => props.line.file + ":" + props.line.line)

const filename = computed(() => {
    if (address.value && (props.line.code.length > 0)) {
        return `${linenb.value}:(${formatNumber(address.value, 16, 4)})`
    }
    return `${linenb.value}:(----)`
})
const label = computed(() => props.line.opcode.label)
const opcode = computed(() => props.line.opcode.opcode)
const operand = computed(() => props.line.opcode.operand)
const comments = computed(() => props.line.opcode.comment)
const brkpt_active = ref(false)
const currline = ref(false)
const fanfold = computed(() => (props.index % 6) < 3)
const canset = computed(() => (props.line.address != null) && (props.line.code != ""))

const current_line = computed(() => {
    if ((props.curline != null) && (props.curline == props.line.line)) {
        console.log(`calc current_line ${props.curline}`)
        return true
    }
    return false
})

function testBreakpoint() {
    if (address.value) {
        // console.log(`test breakpoint ${address}`)
        brkpt_active.value = store.isBreakpoint(address.value)
    }
}

function testCurrentLine() {
    if (address.value) {
        currline.value = store.isCurrentLine(address.value)
        if (currline.value) {
            console.log(`pc: ${pgm_counter.value}, addr: ${address.value}`)
        }
    }
}

onMounted(() => {
    const base_address = store.getSourceBaseAddress()
    if (props.line.address != null) {
        address.value = props.line.address + base_address
        testBreakpoint()
        testCurrentLine()
    }
})

const pgm_counter = computed(() => store.registers["PC"])
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
        const payload = {
            address: address.value,
            enable: true
        }
        console.log(`toggle breakpoint ${payload.address} ${payload.enable}`)
        store.addBreakpoint(payload)
    }
}

</script>

<style scoped>

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