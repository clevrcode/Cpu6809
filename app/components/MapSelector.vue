<template>
    <div class="map-selector" v-if="mounted">
        <label for="mapList">Map: </label>
        <select id="mapList" v-model="mapSelected" @change="mapChanged" >
            <option disabled value="">Select a map</option>
            <option v-for="(val, idx) in map_list" :value="val" :key="val">
                {{ val }}
            </option>
        </select>
    </div>
</template>

<script setup>

const emit = defineEmits(['changed'])

const props = defineProps({
    map: {
        type: Number,
        required: true
    }
})

const mounted = ref(false)
const map_list = ref([])
const mapSelected = ref("")

function mapChanged() {
    emit('changed', map_list.value.indexOf(mapSelected.value))
}

onMounted(() => {   
    console.log(`on mounted: ${mapSelected.value}`)
    mapSelected.value = formatNumber(props.map, 16, 2)
    for (let i = 0; i < 64; i++) {
        map_list.value.push(formatNumber(i, 16, 2))
    }
    mounted.value = true
})

</script>

<style scoped>

.map-selector {
    padding: 0 20px;
}

</style>