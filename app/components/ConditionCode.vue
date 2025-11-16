<template>
    <div>
        <div class="cc-row">
            <div class="cc-window cc-info-off" :class="{ 'cc-info-on': entireOn }">ENTIRE</div>
            <div class="cc-window cc-irq-off" :class="{ 'cc-irq-on': firqOn }">FIRQ</div>
            <div class="cc-window cc-irq-off" :class="{ 'cc-irq-on': irqOn }">IRQ</div>
            <div class="cc-window cc-info-off" :class="{ 'cc-info-on': halfOn }">HALF-CARRY</div>
        </div>
        <div class="cc-row">
            <div class="cc-window cc-info-off" :class="{ 'cc-info-on': negativeOn }">NEGATIVE</div>
            <div class="cc-window cc-info-off" :class="{ 'cc-info-on': zeroOn }">ZERO</div>
            <div class="cc-window cc-info-off" :class="{ 'cc-info-on': overflowOn }">OVERFLOW</div>
            <div class="cc-window cc-info-off" :class="{ 'cc-info-on': carryOn }">CARRY</div>
        </div>
    </div>
</template>

<script setup>

const store = useMainStore()
const cc = computed(() => store.registers["CC"])

const entireOn   = computed(() => ((cc.value & 0x80) != 0))
const halfOn     = computed(() => ((cc.value & 0x20) != 0))
const negativeOn = computed(() => ((cc.value & 0x08) != 0))
const zeroOn     = computed(() => ((cc.value & 0x04) != 0))
const overflowOn = computed(() => ((cc.value & 0x02) != 0))
const carryOn    = computed(() => ((cc.value & 0x01) != 0))
const firqOn     = computed(() => ((cc.value & 0x40) != 0))

const irqOn      = computed(() => ((cc.value & 0x10) != 0))

</script>

<style scoped>

.cc-row {
    display: flex;
    flex-direction: row;
}

.cc-window {
    border: solid 1px white;
    width: 150px;
    padding: 10px;
    justify-content: center;
    text-align: center;
}

.cc-info-off {
    background-color: #242;
    color: white;
}

.cc-info-on {
    background-color: #2A2;
    color: white;
}

.cc-irq-off {
    background-color: #422;
    color: white;
}

.cc-irq-on {
    background-color: #A22;
    color: white;
}

</style>