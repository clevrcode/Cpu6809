<template>
<div class="list-box">
    <div v-for="brkpt in breakpoints">
        <BreakpointItem :address="brkpt.address" :enabled="brkpt.enable" @toggle-enable="toggleEnabled"></BreakpointItem>
    </div>
    <div class="break-input">
        <input type="text" placeholder="breakpoint" spellcheck="false" @keydown="dataInput" v-model="breakpoint">
    </div>
    <div class="break-modules">
        <label for="moduleList">OS9 Modules:</label>
        <select id="myDropdown" name="selectedOption">
            <div v-for="mod in modules" >
                <option value="mod.name">{{ mod.name }}</option>
            </div>
            <!-- <option value="option2">Option 2 Text</option>
            <option value="option3">Option 3 Text</option> -->
        </select>
    </div>
</div>
</template>

<script setup>

const store = useMainStore()
const breakpoints = computed(() => store.breakpoints)
const modules = computed(() => store.modules)
const breakpoint = ref("")

function toggleEnabled(address, enable) {
    store.addBreakpoint({ address, enable })
}

onMounted(async () => {
    try {
        await store.getModuleList()
        modules.value = store.modules
    } catch (error) {
        console.log(error)
    }
})

</script>

<style scoped>

.list-box {
    border: solid 5px #777;
    background-color: black;
    width: 300px;
    height: 200px;
}

.break-input {
    width: 100%;
}

.break-input input {
    width: 100%;
    font-size: 24px;
}

.break-modules select {
    width: 100%;
}

</style>