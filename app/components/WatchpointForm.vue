<template>
    <GenericForm @submit="sendTracingRequest" :with_buttons="true">
        <fieldset>
            <legend>Execution Tracing</legend>
            <div class="tracing-form">
                <div class="form-checkbox">
                    <input type="checkbox" id="enable" name="enable" v-model="tEnabled" @change="checkTracing" />
                    <label for="enable">Tracing Enabled</label>
                </div>
                <div class="form-grid">
                        <label for="trace_start">Starting Address</label>
                        <input type="text" id="trace_start" style="text-transform: uppercase" pattern="[a-fA-F0-9]{1,5}" v-model="tStart">
                        <label for="trace_end">End Address</label>
                        <input type="text" id="trace_end" style="text-transform: uppercase" pattern="[a-fA-F0-9]{1,5}" v-model="tEnd">
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>Watch Memory</legend>
            <div class="tracing-form">
                <div class="form-checkbox">
                    <input type="checkbox" id="enable" name="enable" :checked="watchEnabled" @change="checkWatch" />
                    <label for="enable">Watch Memory Enabled</label>
                </div>
                <div class="form-grid">
                        <label for="trace_start">Starting Address</label>
                        <input type="text" id="trace_start" style="text-transform: uppercase" pattern="[a-fA-F0-9]{1,5}" v-model="watchStart">
                        <label for="trace_end">End Address</label>
                        <input type="text" id="trace_end" style="text-transform: uppercase" pattern="[a-fA-F0-9]{1,5}" v-model="watchEnd">
                 </div>
            </div>

        </fieldset>


</GenericForm>
</template>

<script setup>

const store = useCpuStore()

const radix = ref(16)

const tEnabled = ref(false)
const tStart = ref(0)
const tEnd = ref(0)

const tracingEnabled = computed(() => store.tracing_info.enable)
const tracingStart = computed(() => store.tracing_info.start)
const tracingEnd = computed(() => store.tracing_info.end)

watch(tracingEnabled, (enbl, _) => {
    console.log(`watch: tracing enabled ${enbl}`)
    tEnabled.value = enbl
})
watch(tracingStart, (start, _) => tStart.value = formatNumber(start, radix.value, 4) )
watch(tracingEnd, (end, _) => tEnd.value = formatNumber(end, radix.value, 4))

const watchStart = ref(0)
const watchEnd = ref(0)
const watchEnabled = ref(false)

function checkTracing() {
}

function checkWatch() {
}


function sendTracingRequest() {
    if (tStart.value < tEnd.value) {
        console.log("send tracing request")
        const start = Number.parseInt(tStart.value, radix.value);
        const end   = Number.parseInt(tEnd.value, radix.value);
        store.setTracing(tEnabled.value, start, end)
    }
}

onMounted(() => {
    console.log(store.tracing_info)
    tEnabled.value = store.tracing_info.enable
    tStart.value = formatNumber(store.tracing_info.start, radix.value, 4)
    tEnd.value = formatNumber(store.tracing_info.end, radix.value, 4)
    store.getTracing()
})

</script>

<style scoped>

fieldset {
    margin: 20px;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 400;
}

.tracing-form {
    display: flex;
    flex-direction: column;
}

.form-checkbox {
    margin: 10px;
}

.form-grid {
    display: grid;
    font-size: 1.2rem;
    font-weight: 400;
    grid-template-columns: 10rem auto;
}

</style>