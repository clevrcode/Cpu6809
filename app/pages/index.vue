<template>
    <transition name="regform">
        <RegisterForm v-if="showRegForm" class="register-form"
            @cancel="canClose"
            @submit="submitRequest"
            :name="regFormName"
            :value="regFormValue"
            :size="regValSize"
        />
    </transition>

    <div class="main-page">
        <div class="control-panel">
            <div class="status-panel">
                <ConditionCode :value="store.registers?.CC"></ConditionCode>
                <!-- <BreakpointList></BreakpointList> -->
            </div>
            <!-- <ControlButton @click="update">Get Registers</ControlButton> -->
            <div class="button-bar">
                <StatusBar></StatusBar>
                <ControlButtonBar @reset="reset" @run="run" @stop="stop" @step="step" @stepover="stepover"/>
            </div>
        </div>
        <div class="control-panel">
            <Registers @update="openForm"></Registers>
            <CrtDisplay @command="sendCommand"></CrtDisplay>  
            <BreakpointList></BreakpointList>
        </div>
    </div>
</template>

<script setup>

    const store = useMainStore()

    const showRegForm = ref(false)
    const regFormName = ref("")
    const regFormValue = ref(0)
    const regValSize = ref(16)

    let timerId = 0

    async function sendCommand(cmd) {
        try {
            await store.sendCommand(cmd)
            runOnce()
        } catch (err) {
            console.log(err)
        }
    }

    function openForm(name, size) {
        showRegForm.value = !showRegForm.value
        regFormName.value = name
        regFormValue.value = store.registers[name]
        regValSize.value = size
    }

    function canClose() {
        showRegForm.value = false
    }
    function submitRequest(name, value) {
        console.log(`submit request ${name}: ${value} ${value.toString(16)}`)
        canClose()
    }

    function update() {
        store.getRegisters()
        store.updateDisplay()
    }

    function run() {
        runOnce()
    }

    async function runOnce()
    {
        try {
            await store.run("200")
            await store.updateDisplay()
            if (!store.break_active && !store.wait) {
                timerId = setTimeout(runOnce, 50)
            } else {
                await store.getModuleList()
           }
        } catch (error) {
            console.error("An error occurred during 'run':", error);
            timerId = 0
        }
    }        
    
    function stop() {
        if (timerId != 0) {
            clearTimeout(timerId)
            timerId = 0
        }
        store.cpubreak()
    }
    
    function step() {
        store.step()
        store.updateDisplay()
    }
    
    function stepover() {
        store.stepover()
        store.updateDisplay()
    }

    function reset() {
        store.reset()
        store.updateDisplay()
    }

    onMounted(() => {
        update()
        store.getBreakpoints()
    })

</script>

<style scoped>

h1 {
    padding: 20px;
    margin: 0;
}
.main-page {
    color: white;
    background-color: #555;
    height: 1000px;
}

.control-panel {
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
}

.button-bar {
    display: flex;
    flex-direction: column;
}

.register-form {
    position: fixed;
    top: 50%;
    right: 0%;
    width: 50%;
    z-index: 1;
}

.regform-enter-from,
.regform-leave-to {
    transform: translateX(100%);
}

.regform-enter-active,
.regform-leave-active {
    transition: transform 0.5s;
}

.regform-enter-to {
    transform: translateX(0%);
}


</style>