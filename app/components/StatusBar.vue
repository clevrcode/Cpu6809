<template>
    <div class="sts-box">
        <div class="sts-window sts-alarm-off" :class="{ 'sts-alarm-on': haltOn }">HALTED</div>
        <div class="sts-window sts-alarm-off" :class="{ 'sts-alarm-on': breakOn }">BREAK</div>
        <div class="sts-window sts-info-off"  :class="{ 'sts-info-on':  waitOn }">WAIT</div>
        <div class="sts-window sts-info-on">{{ mapType }}</div>
        <div class="sts-window sts-mmu-off" :class="{ 'sts-mmu-on': mmuOn }">MMU</div>
    </div>
</template>

<script setup>

const store = useCpuStore()
const clientMounted = ref(false)

// const cpu_state = computed(() => {
//     if (clientMounted.value && store.cpu_state) {
//         return store.cpu_state
//     }
//     return { halted: false, wait: false, break: false, map_type: "ROM" }
// })

const haltOn  = computed(() => clientMounted.value && store.cpu_state ? store.cpu_state.halted : false)
const waitOn  = computed(() => clientMounted.value && store.cpu_state ? store.cpu_state.wait   : false)
const breakOn = computed(() => clientMounted.value && store.cpu_state ? store.cpu_state.break  : false)
const mapType = computed(() => clientMounted.value && store.cpu_state ? store.cpu_state.map_type : "ROM")
const mmuOn   = computed(() => clientMounted.value && store.cpu_state ? store.cpu_state.mmu : false)
onMounted(() => clientMounted.value = true)

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

.sts-mmu-off {
    background-color: rgb(246, 246, 124);
    color: black;
}
.sts-mmu-on {
    background-color: yellow;
    color: black;
}

</style>