<template>
    <div class="module-selector">
        <label for="moduleList">OS9 Modules:</label>
        <select id="moduleList" v-model="moduleSelected" @change="moduleChanged">
            <option disabled value="">Select a module</option>
            <option v-for="{ name } in executableModules" :value="name" :key="name">
                {{ name }}
            </option>
        </select>
    </div>
</template>

<script setup>

const emit = defineEmits(['module_changed'])
const store = useCpuStore()

const props = defineProps({
    module: {
        type: String,
        required: true
    }
})

const executableModules = computed(() => {
    // console.log(store.modules)
    return store.modules.filter((m) => m.type != 15)
})

const moduleSelected = ref(props.module)
// const modules = computed(() => store.modules)

function moduleChanged() {
    console.log(`module changed to : ${moduleSelected.value}`)
    emit('module_changed', moduleSelected.value)
}

</script>

<style scoped>

.module-selector {
    width: 200px;
}
.module-selector label {
    color: white;
}

#moduleList {
    width: 100%;
    font-size: 1.5rem;
}
</style>