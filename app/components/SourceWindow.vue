<template>
    <div class="file-window">
        <div class="file-content" ref="source-window">
            <div v-for="(line, index) in source_content">
                <debug-line :index :line :curline></debug-line>
            </div>
        </div>
    </div>
</template>

<script setup>

const emit = defineEmits(['src_changed'])

const store = useMainStore()
const sourceWnd = useTemplateRef('source-window')
const { _, y } = useScroll(sourceWnd)

const source_content = computed(() => store.getSourceContent())
const current_module = computed(() => store.module_info.current_module)
const module_base    = computed(() => store.getSourceBaseAddress())
const pgm_counter    = computed(() => store.registers["PC"])
const source_loaded  = computed(() => store.source_loaded)
const curline        = ref(null)
let windowHeight = 0

watch(pgm_counter, (pc, oldpc) => {
    const src = store.getCurrentSource()
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
        console.log(`set scroll pos to pc: ${store.currPC}`)
        scrollToLine(store.currPC)
    }
})

function scrollToLine(pc) {
    const relpc = pc - module_base.value
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
    console.log(`mounted: y = ${y.value}`)
    const rect = sourceWnd.value.getBoundingClientRect()
    windowHeight = Math.floor(rect.height)
    console.log(`source window height: ${windowHeight}`)
    if (store.getCurrentSource()) {
        const src = store.getCurrentSource()
        if (src && (src == current_module.value)) {
            scrollToLine(store.currPC)
        } else {
            // Load file of new module
            curline.value = null
        }
    } 
})

</script>

<style scoped>

.file-window {
    /* padding: 0 2%; */
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