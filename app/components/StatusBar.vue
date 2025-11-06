<template>
    <div>
        <div class="sts-window sts-alarm-off" :class="{ 'sts-alarm-on': haltOn }">HALTED</div>
        <div class="sts-window sts-info-off" :class="{ 'sts-info-on': breakOn }">BREAK</div>
        <div class="sts-window sts-info-off" :class="{ 'sts-info-on': waitOn }">WAIT</div>
        <div class="sts-window sts-info-on">{{ mapType }}</div>
    </div>
</template>

<script setup>

const store = useMainStore()

const haltOn = computed(() => store.halted)
const waitOn = computed(() => store.wait)
const breakOn = computed(() => store.break_active)
const mapType = computed(() => store.map_type)

</script>

<style scoped>

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
    background-color: #292;
    color: white;
}

.sts-alarm-off {
    background-color: #422;
    color: white;
}

.cc-alarm-on {
    background-color: #922;
    color: white;
}


</style>