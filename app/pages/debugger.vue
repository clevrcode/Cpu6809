<template>
    <div>
        <base-dialog
            :show="!!errorMsg"
            :title=errorMsg
            @close="handleError">
        </base-dialog>
        <div class="debug-header">
            <BaseButton @click="getFile" :enabled="button_enabled">Get File</BaseButton>
            <module-selector :module="selected_module" @change="moduleChanged"></module-selector>
            <h1>MODULE : {{ module }}</h1>
        </div>
        <div>
            <source-window />
        </div>
    </div>
</template>

<script setup>

const store = useMainStore()
const selected_module = ref("")
const errorMsg = ref(null)

function handleError() {
    errorMsg.value = null
}

const module = computed(() => store.getModuleInfo().current_module ? store.getModuleInfo().current_module : "")

const button_enabled = computed(() => selected_module.value.length > 0)

function moduleChanged(event) {
    console.log(`module changed to: ${event.target.value}`)
    selected_module.value = event.target.value
}

async function getFile() {
    try {
        console.log("...")
        if (selected_module.value) {
            console.log("get file button clicked")
            await store.getSourceListing(selected_module.value)
        }
    } catch (error) {
        console.log(error)
        errorMsg.value = error
    }
}

onMounted(() => {
    console.log("debugger mounted")
    if (store.getCurrentSource()) {
        console.log(`current source: ${store.getCurrentSource()}`)
        selected_module.value = store.getCurrentSource()
    } else {
        console.log("No source loaded")
    }
})

</script>

<style scoped>

.debug-header {
    display: flex;
    flex-direction: row;
    justify-content:space-around;
    align-items: center;
    border: solid 2px black;
}

.debug-header button {
    padding: 0 20px;
    margin: 0 50px;
}

.debug-header h1 {
    color: white;
    font-family: "Orbitron", sans-serif;
    margin: 0;
}


</style>