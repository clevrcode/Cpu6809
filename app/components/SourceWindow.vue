<template>
    <div class="file-window">
        <div class="file-content" ref="source-window" >
            <div v-for="(line, index) in source_content" v-if="source_loaded">
                <source-line :index :line :curline></source-line>
            </div>
        </div>
    </div>
</template>

<script setup>

const emit = defineEmits(['src_changed'])

const store = useCpuStore()
const sourceWnd = useTemplateRef('source-window') 
const { _, y } = useScroll(sourceWnd)

const source_content = computed(() => store.source_info.content)
const source_module  = computed(() => store.source_info.module)
const source_loaded  = computed(() => store.source_info.loaded)
const current_module = computed(() => store.current_module ? store.current_module.name : "")
const pgm_counter    = computed(() => store.cpu_state.registers["PC"])
const curline        = ref(null)
let windowHeight = 0

watch(pgm_counter, (pc, oldpc) => {
    const src = store.source_info.module
    // console.log(`pc changed to ${pc} ${src} : ${current_module.value} ${module_base.value}`)
    if (src && (src == current_module.value)) {
        scrollToLine(pc)
    } else {
        // Load file of new module
        emit('src_changed')
        curline.value = null
    }
})

watch(source_loaded, (loaded, _) => {
    if (loaded) {
        console.log("new source loaded")
        console.log(`set scroll pos to pc: ${pgm_counter.value}`)
        setTimeout(() => scrollToLine(pgm_counter.value), 1000)
    }
})

function scrollToLine(pc) {
    const relpc = pc - store.source_info.base
    console.log(`relpc: ${relpc} base: ${store.source_info.base}`)
    const idx = source_content.value.findIndex((el) => (el.address == relpc) && (el.code.length > 0))
    if (idx >= 0) {
        const lineobj = source_content.value[idx]
        console.log(`current line: ${lineobj.line}, ${lineobj.address}`)
        curline.value = lineobj.line
        scroll_to(idx)
    } else {
        console.log(`set current line null: ${relpc}`)
        curline.value = null
    }
}

function scroll_to(val) {
    const scroll = Math.max(Math.floor(val * 18) - Math.floor(windowHeight / 3), 0)
    y.value = scroll
    // y.value = Math.floor(val * 18)
    console.log(`scroll pos: ${scroll} ${y.value} (index: ${val})`)
}

onMounted(() => {
    const rect = sourceWnd.value.getBoundingClientRect()
    windowHeight = Math.floor(rect.height)
    console.log(`source window height: ${windowHeight}`)
    if (source_loaded) {
        if (source_module == current_module.value) {
            scrollToLine(pgm_counter.value)
        } else {
            // Load file of new module
            curline.value = null
        }
    } 
})

</script>

<style scoped>

.file-window {
    width: 95%;
}

.file-content {
    background-color: white;
    height: 75vh; /* Set a fixed height for the div */
    width: 100%; /* Optional: Set a fixed width */
    border: 1px solid #ccc; /* Optional: Add a border for visibility */
    overflow: auto; /* Add scrollbars only when content overflows */
}

</style>