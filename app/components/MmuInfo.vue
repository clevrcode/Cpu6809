<template>
    <div class="mmu-row">
        <div class="mmu-content">
            <div>TR</div>
            <div v-for="val in 8">
                {{ val-1 }}
            </div>
        </div>
        <div class="mmu-content">
            0:
            <div v-for="val in registers0">
                {{ hexval(val) }}
            </div>
        </div>
        <div class="mmu-content">
            1:
            <div v-for="val in registers1">
                {{ hexval(val) }}
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    data: { type: Array, required: true }
})

const registers0  = computed(() => props.data.slice(0, 8))
const registers1  = computed(() => props.data.slice(8))

const data0 = computed(() => props.data)
// const data1 = computed(() => props.data.slice(8))
function hexval(v) {
    return formatNumber(v, 16, 2) + " [" + formatNumber(v << 13, 16, 5) + "]"
}

</script>

<style scoped>
.mmu-row {
    border: solid 1px black;
}

.mmu-content {
    display: grid;
    background-color: yellow;
    /* font-family: 'Courier New', Courier, monospace; */
    font-size: 1rem;
    font-weight: 400;
    padding: 5px;
    grid-template-columns: 6rem repeat(8, 6.0rem) auto;
    align-items: center;
}
</style>