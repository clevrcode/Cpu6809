<template>
    <div>
        <div class="debug-header">
            <BaseButton @click="getFile">Get File</BaseButton>
            <h1>
                MODULE: {{ module }}
            </h1>            
        </div>
        <div class="file-window">
            <div class="file-content">
                <div v-for="line of store.content">
                    <debug-line :line="line"></debug-line>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const store = useSourceStore()
const main_store = useMainStore()

const module = computed(() => main_store.current_source)

async function getFile() {
    try {
        console.log("get file button clicked")
        main_store.setSourceBase("WordPakII")
        await store.GetSource("wordpakii.dr")
        console.log(`current source: [${store.current_source}]`)
    } catch (error) {
        console.log(error)
    }
}

</script>

<style scoped>

.debug-header {
    display: flex;
    flex-direction: row;
}

.debug-header button {
    padding: 0 20px;
    margin: 0 50px;
}

.debug-header h1 {
    font-family: "Orbitron", sans-serif;
}

.file-window {
    padding: 0 2%;
}

.file-content {
    background-color: white;
    height: 80vh; /* Set a fixed height for the div */
    width: 100%; /* Optional: Set a fixed width */
    border: 1px solid #ccc; /* Optional: Add a border for visibility */
    overflow: auto; /* Add scrollbars only when content overflows */
}

</style>