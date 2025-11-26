<template>
    <GenericForm @submit="sendTracingRequest" :with_buttons="true">
        <fieldset>
            <legend>Execution Tracing</legend>
            <div class="tracing-form">
                <div class="form-checkbox">
                    <input type="checkbox" id="enable" name="enable" :checked="tracingEnabled" @change="checkTracing" />
                    <label for="enable">Tracing Enabled</label>
                </div>
                <div class="form-grid">
                        <label for="trace_start">Starting Address</label>
                        <input type="text" id="trace_start" style="text-transform: uppercase" pattern="[a-fA-F0-9]{1,5}" v-model="tracingStart">
                        <label for="trace_end">End Address</label>
                        <input type="text" id="trace_end" style="text-transform: uppercase" pattern="[a-fA-F0-9]{1,5}" v-model="tracingEnd">
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

const store = useMainStore()

const tracingInfo = ref(null)
const tracingEnabled = ref(false)
const tracingStart = ref(0)
const tracingEnd = ref(0)

const watchEnabled = ref(false)
const watchStart = ref(0)
const watchEnd = ref(0)

// const tracing_enabled = computed(() => tracingInfo.value?.enabled)
// const tracing_start = computed(() => tracingInfo.value?.start)
// const tracing_end = computed(() => tracingInfo.value?.end)

function checkTracing() {
}

function checkWatch() {
}


function sendTracingRequest() {
    console.log("send tracing request")
}

onMounted(async () => {
    tracingInfo.value = await store.getTracingInfo()
    console.log(tracingInfo.value)
    tracingEnabled.value = tracingInfo.value.enabled
    tracingStart.value = formatNumber(tracingInfo.value.start, 16, 4)
    tracingEnd.value = formatNumber(tracingInfo.value.end, 16, 4)
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