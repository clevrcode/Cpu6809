<template>
    <div>
        <div class="debug-header">
            <BaseButton @click="getFile">Get File</BaseButton>
            <h1>MODULE: {{ module }}</h1>
        </div>
        <div class="file-window">
            <div class="file-content">
                <div v-for="(line, index) in store.content">
                    <debug-line :index :line></debug-line>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const store = useSourceStore()
const main_store = useMainStore()

const module = computed(() => main_store.getCurrentSource())

async function getFile() {
    try {
        console.log("get file button clicked")
        main_store.setSourceBase("verify")
        await store.GetSource("verify")
    } catch (error) {
        console.log(error)
    }
}

</script>

<style scoped>

.debug-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    width: 100%;
}

.file-content {
    background-color: white;
    height: 75vh; /* Set a fixed height for the div */
    width: 100%; /* Optional: Set a fixed width */
    border: 1px solid #ccc; /* Optional: Add a border for visibility */
    overflow: auto; /* Add scrollbars only when content overflows */
}

</style>