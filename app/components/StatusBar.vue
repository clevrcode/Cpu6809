<template>
    <div class="sts-box">
        <div class="sts-window sts-alarm-off" :class="{ 'sts-alarm-on': haltOn }">HALTED</div>
        <div class="sts-window sts-alarm-off" :class="{ 'sts-alarm-on': breakOn }">BREAK</div>
        <div class="sts-window sts-info-off" :class="{ 'sts-info-on': waitOn }">WAIT</div>
        <div class="sts-window sts-info-on">{{ mapType }}</div>
    </div>
</template>

<script setup>

const store = useCpuStore()

const haltOn = computed(() => store.cpu_state?.halted)
const waitOn = computed(() => store.cpu_state?.wait)
const breakOn = computed(() => store.cpu_state?.break)
const mapType = computed(() => store.cpu_state?.map_type)

</script>

<style scoped>

.sts-box {
    display: flex;
    flex-direction: column;
}

.sts-window {
    border: solid 1px white;
    width: 150px;
    padding: 10px;
    justify-content: center;
    text-align: center;
}

.sts-info-off {
    background-color: #242;
    color: white;
}

.sts-info-on {
    background-color: #2C2;
    color: white;
}

.sts-alarm-off {
    background-color: #422;
    color: white;
}

.sts-alarm-on {
    background-color: #C22;
    color: white;
}

</style>