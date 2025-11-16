<template>
    <div class="module-selector">
        <label for="moduleList">OS9 Modules:</label>
        <select id="moduleList" v-model="moduleSelected" @change="moduleChanged">
            <option disabled value="">Select a module</option>
            <div v-for="module in modules" >
                <option :value="module.name">{{ module.name }}</option>
            </div>
        </select>
    </div>
</template>

<script setup>

const emit = defineEmits(['changed'])
const store = useMainStore()

const moduleSelected = ref("")
const modules = computed(() => store.modules)

function moduleChanged() {
    console.log(`module changed to : ${moduleSelected.value}`)
    emit('changed', moduleSelected.value)
}

</script>

<style scoped>

.module-selector {
    width: 200px;
}

#moduleList {
    width: 100%;
    font-size: 1.5rem;
}
</style>