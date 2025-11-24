<template>
    <div v-if="line_comment">
        <div class="debug-line-comment" :class="{fanfold}">
            <div class="brkpt">
                <div> </div>
            </div>
            <div class="addr">{{ addr }}</div>
            <div class="code">{{ code }}</div>
            <div class="filename">{{ filename }}</div>
            <div class="comments"><pre>{{ comments }}</pre></div>
        </div>        
    </div>
    <div v-else>
        <div class="debug-line-code" :class="{fanfold, brkpt_active: brkptline, current_line: currline}">
            <div class="brkpt" :class="{canset}" v-if="brkptline" @click="toggleBreakpoint">
                <IconsBreakpoint />
            </div>
            <div class="brkpt" :class="{canset}" v-else @click="toggleBreakpoint">
                <div> </div>
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

let address = ref(null)
const addr = computed(() => props.line.address)
const code = computed(() => props.line.code)
// const filename = computed(() => props.line.file + ":" + props.line.line)
const filename = computed(() => {
    if (address.value && (props.line.code.length > 0)) {
        return `(${address.value.toString(16).padStart(4, '0').toUpperCase()}):${props.line.line}`
    }
    return `(----):${props.line.line}`
})
const label = computed(() => props.line.opcode.label)
const opcode = computed(() => props.line.opcode.opcode)
const operand = computed(() => props.line.opcode.operand)
const comments = computed(() => props.line.opcode.comment)
const brkptline = ref(false)
const currline = ref(false)
const fanfold = computed(() => (props.index % 6) < 3)
const canset = computed(() => props.line.address != "" && props.line.code != "")

function testBreakpoint() {
    if (address.value) {
        // console.log(`test breakpoint ${address}`)
        brkptline.value = store.isBreakpoint(address.value)
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
    if (props.line.address.length > 0) {
        address.value = parseInt(props.line.address, 16) + store.source_base
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
    if (brkptline.value) {
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
    grid-template-columns: 2rem 3rem 10rem 8rem auto;
    grid-template-areas: 'brkpt addr code filename comments';
}

.debug-line-code {
    display: grid;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    grid-template-columns: 2rem 3rem 10rem 8rem 6rem 6rem 20rem auto;
    grid-template-areas: 'brkpt addr code filename label opcode operand comments';
}


.current_line {
    /* background-color: rgb(168, 216, 255); */
    background-color: blue;
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