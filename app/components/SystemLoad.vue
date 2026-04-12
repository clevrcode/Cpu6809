<template>
    <div>
        <progress id="load" max="100" :value="system_load">{{ system_load}} %</progress>
        <div class="system-load">Load: {{ system_load }} %</div>
        <div class="system-overrun">Overrun: {{ system_overrun }}</div>
    </div>
</template>

<script setup>

const store = useCpuStore()

const system_load = computed(() => {
    if (store.cpu_state) 
        return store.cpu_state.load.toFixed(1)
    return 0.0
})

const system_overrun = computed(() => {
    if (store.cpu_state) {
        return store.cpu_state.overrun
    }
    return 0
})


</script>

<style scoped>

/* progress[value] {
  * Reset the default appearance *
  -webkit-appearance: none;
   appearance: none;

  width: 250px;
  height: 20px;
} */
progress[value]::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
}

.system-load {
    font-size: 1.5rem;
    color: black;
    background-color: yellow;
}

.system-overrun {
    font-size: 1.5rem;
    color: white;
    background-color: red;
}

</style>