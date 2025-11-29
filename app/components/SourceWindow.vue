<template>
    <div>
        <div class="file-window">
            <div class="file-content" ref="source-window">
                <div v-for="(line, index) in source_content">
                    <debug-line :index :line :curline></debug-line>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const store = useMainStore()
const sourceWnd = useTemplateRef('source-window')
const { _, y } = useScroll(sourceWnd)

const source_content = computed(() => store.getSourceContent())
const current_module = computed(() => store.getModuleInfo().current_module)
const module_base    = computed(() => store.getSourceBaseAddress())
const pgm_counter    = computed(() => store.registers["PC"])
const curline        = ref(null)

watch(pgm_counter, (pc, oldpc) => {
    const src = store.getCurrentSource()
    console.log(`pc changed to ${pc} ${src} : ${current_module.value} ${module_base.value}`)
    if (src && (src == current_module.value)) {
        const rel_pc = pc - module_base.value
        const lineobj = source_content.value.find((el) => el.address == rel_pc)
        if (lineobj) {
            console.log(`current line: ${lineobj.line}, ${lineobj.address}, ${rel_pc}`)
            curline.value = lineobj.line
            scroll_to(lineobj.line)
        } else {
            console.log(`set current line null: ${rel_pc}`)
            curline.value = null
        }
    } else {
        curline.value = null
    }
})

watch(source_content, (newSrc, _) => {
    if (newSrc?.length > 0) {
        console.log(`scroll height: ${newSrc.length}`)
        console.log(`scroll pos: ${y.value}`)
    }
})

function scroll_to(val) {
    y.value += (val * 18)
    console.log(`scroll pos: ${y.value}`)
}

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