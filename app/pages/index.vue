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
                <StatusBar></StatusBar>
                <BreakpointList></BreakpointList>
            </div>
            <ControlButton @click="update">Get Registers</ControlButton>
            <div class="button-bar">
                <ControlButtonBar @reset="reset" @run="run" @stop="stop" @step="step" @stepover="stepover"/>
            </div>
        </div>
        <div class="control-panel">
            <Registers @update="openForm"></Registers>
            <CrtDisplay></CrtDisplay>  
        </div>
    </div>
</template>

<script setup>

    const cpuRunning = ref(false)
    const store = useMainStore()

    const showRegForm = ref(false)
    const regFormName = ref("")
    const regFormValue = ref(0)
    const regValSize = ref(16)

    function openForm(name) {
        showRegForm.value = true
        regFormName.value = name
        regFormValue.value = store.registers[name]
    }

    function canClose() {
        showRegForm.value = false
    }
    function submitRequest(name, value) {
        console.log(`submit request ${name}: ${value}`)
        canClose()
    }

    function update() {
        store.getRegisters()
        store.updateDisplay()
    }

    function run() {
        if (!cpuRunning.value) {
            cpuRunning.value = true
            runOnce()
        }
    }

    async function runOnce()
    {
        try {
            // Your existing code that might throw an error
            // For example:
            // const result = someUndefinedFunction();
            // Or a network request that fails
            await store.run("200")
            await store.updateDisplay()
            if (!store.break_active && cpuRunning.value) {
                console.log("reschedule cpu run")
                setTimeout(runOnce, 100)
            } else {
                console.log("stop cpu run")
                cpuRunning.value = false
            }
        } catch (error) {
            console.error("An error occurred during 'run':", error);
            cpuRunning.value = false
            // Optionally, display a user-friendly message or perform other error handling
        }
    }        
    
    function stop() {
        cpuRunning.value = false
    }
    
    function step() {
        store.step()
        updateDisplay()
    }
    
    function stepover() {
        store.stepover()
        updateDisplay()
    }

    function reset() {
        console.log("reset")
        store.reset()
        store.updateDisplay()
    }

    onMounted(() => {
        console.log("Main Page Mounted")
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
    justify-content: space-between;
}

.button-bar {
    display: flex;
    flex-direction: row;
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