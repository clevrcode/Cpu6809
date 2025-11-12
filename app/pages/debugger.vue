<template>
    <div>
        <h1>
            <button @click="getFile">Get file</button>
        </h1>
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

async function getFile() {
    try {
        console.log("get file button clicked")
        await store.GetSource("attr")
    } catch (error) {
        console.log(error)
    }
}

</script>

<style scoped>

.file-window {
    padding: 0 2%;
}

.file-content {
    background-color: #eee;
    height: 80vh; /* Set a fixed height for the div */
    width: 100%; /* Optional: Set a fixed width */
    border: 1px solid #ccc; /* Optional: Add a border for visibility */
    overflow: auto; /* Add scrollbars only when content overflows */
}

</style>