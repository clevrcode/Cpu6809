<template>
    <div>
        <fieldset>
            <legend>Radix {{ radix_selected }}</legend>
            <div class="radio-buttons">
                <div class="radix-radio">
                    <input type="radio" id="radix_8" name="rdx_" value="8" v-model="radix_selected"/>
                    <label for="radix_8">OCT</label>
                </div>
                <div class="radix-radio">
                    <input type="radio" id="radix_10" name="rdx_" value="10" v-model="radix_selected"/>
                    <label for="radix_10">DEC</label>
                </div>
                <div class="radix-radio">
                    <input type="radio" id="radix_16" name="rdx_" value="16" v-model="radix_selected"/>
                    <label for="radix_16">HEX</label>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script setup>

const store = useCpuStore()

const radix_selected = ref("16")

watch(radix_selected, (curr, _) => {
    // console.log(`selection changed from ${old} to ${curr}`)
    store.radix = parseInt(curr, 10)
})

onMounted(() => {
        radix_selected.value = store.radix.toString(10)
})

</script>

<style scoped>

fieldset {
    border-radius: 8px;
}

legend {
    color: black;
    /* background-color: #f99a08; */
    background-color: white;
    border-radius: 8px;
    border: 0;
    font-size: 14px;
}

.radio-buttons {
    display: flex;
    flex-direction: row;
}

.radix-radio {
    width: 80px;
}
</style>