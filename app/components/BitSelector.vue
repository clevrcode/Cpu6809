<template>
    <div class="bits-box">
        <div class="bit-item" v-for="(bit, index) in bit_values">
            <div class="bit-column">
                <label :for="index">{{ size - index - 1 }}</label>
                <input type="checkbox" :id="index" :name="index" :checked="bit != 0" @click="$emit('toggle', index)"/>
            </div>
        </div>
    </div>
</template>

<script setup>

// const emit = defineEmits(['toggle-bit'])

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
})

// const bit_values = ([ 1, 0, 1, 0, 1, 0, 1, 1])
// const bit_values = ref(null)

const bit_values = computed(() => {
    console.log("compute bits")
    let bits = []
    let mask = 1 << (props.size - 1)
    for (let i=0; i < props.size; i++) {
        let bit = (props.value & mask) != 0 ? 1 : 0;
        bits.push(bit)
        mask = mask >> 1
    }
    return bits
})

</script>

<style scoped>

.bits-box {
    display: inline-block;
    padding: 5px;
    border: solid 1px black;
    border-radius: 5px;
}

.bit-item {
    display: inline-block;
    padding: 2px;
}
.bit-column {
    display: flex;
    flex-direction: column;
}

</style>