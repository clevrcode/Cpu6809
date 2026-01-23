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
            <source-window @src_changed="loadSource"/>
        </div>
    </div>
</template>

<script setup>

const store = useCpuStore()
const selected_module = ref("")
const errorMsg = ref(null)

function handleError() {
    errorMsg.value = null
}

const module = computed(() => {
    if (store.current_module) {
        return store.current_module.name
    }
    return "----"
})

const button_enabled = computed(() => selected_module.value.length > 0)

function moduleChanged(event) {
    console.log(`module changed to: ${event.target.value}`)
    selected_module.value = event.target.value
}

function getFile() {
    try {
        if (selected_module.value) {
            console.log("get file button clicked")
            store.getSourceListing(selected_module.value)
        }
    } catch (error) {
        console.log(error)
        errorMsg.value = error
    }
}

function loadSource() {
    if (store.current_module && (store.current_module.name != "")) {
        console.log(`load source '${store.current_module.name}'`)
        store.getSourceListing(store.current_module.name)
        selected_module.value = store.current_module.name
    }
    else {
        selected_module.value = ""
    }
}

onMounted(async () => {
    console.log("debugger mounted")
    if (store.source_info.loaded) {
        console.log(`current source: ${store.source_info.module}`)
        selected_module.value = store.source_info.module
    } else {
        loadSource()
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