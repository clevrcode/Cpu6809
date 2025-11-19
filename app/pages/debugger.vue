<template>
    <div>
        <div class="debug-header">
            <BaseButton @click="getFile" :enabled="button_enabled">Get File</BaseButton>
            <module-selector :module="selected_module" @change="moduleChanged"></module-selector>
            <h1>MODULE: {{ module }}</h1>
        </div>
        <div class="file-window">
            <div class="file-content">
                <div v-for="(line, index) in store.source_content">
                    <debug-line :index :line></debug-line>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const store = useMainStore()
const selected_module = ref(store.getCurrentSource())

const module = computed(() => store.current_module)
const button_enabled = computed(() => selected_module.value != null)

function moduleChanged(event) {
    console.log(`module changed to: ${event.target.value}`)
    selected_module.value = event.target.value
}

async function getFile() {
    try {
        console.log("...")
        if (selected_module.value) {
            console.log("get file button clicked")
            await store.GetSource(selected_module.value)
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    console.log(`current source: ${selected_module.value}`)
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