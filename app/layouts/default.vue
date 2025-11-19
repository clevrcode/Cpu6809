<template>
    <transition name="slideform">
        <RegisterForm v-if="showRegForm" class="register-form"
            @cancel="canCloseRegister"
            @submit="submitRegisterRequest"
            :name="regFormName"
            :value="regFormValue"
            :size="regValSize"
        />
    </transition>
    <transition name="slideform">
        <MemoryForm v-if="showMemoryForm" class="memory-form"
            @cancel="canCloseMemory"
            @submit="submitMemoryRequest"
        />
    </transition>
    <transition name="slideform">
        <BreakpointList v-if="showBreakpoints" class="breakpoint-form"
            @cancel="canCloseBreakpoints"
            @submit="submitBreakpointRequest"
        />
    </transition>

    <div class="main-page">
        <TheHeader></TheHeader>
        <div class="control-panel">
            <ConditionCode />
            <ControlButtonBar @memory="openMemory" @breakpoint="openBreakpoints" @cpurun="run"/>
        </div>
        <div class="page_separator">
        </div>
        <div class="console-panel">
            <div class="console-panel_sidebar">
                <StatusBar></StatusBar>
                <Registers @update="openForm"></Registers>
            </div>
            <div class="console-panel_main">
                <NuxtPage @command="submitCommand"></NuxtPage>
            </div>
        </div>
    </div>
</template>

<script setup>

    const store = useMainStore()

    const showRegForm = ref(false)
    const showBreakpoints = ref(false)
    const showMemoryForm = ref(false)
    const regFormName = ref("")
    const regFormValue = ref(0)
    const regValSize = ref(16)

    function openMemory() {
        showMemoryForm.value = !showMemoryForm.value
    }

    function openBreakpoints() {
        showBreakpoints.value = !showBreakpoints.value
    }

    function openForm(name, size) {
        showRegForm.value = !showRegForm.value
        regFormName.value = name
        regFormValue.value = store.registers[name]
        regValSize.value = size
    }

    function canCloseRegister() {
        showRegForm.value = false
    }
    function canCloseMemory() {
        showMemoryForm.value = false
    }
    function canCloseBreakpoints() {
        showBreakpoints.value = false
    }

    async function submitRegisterRequest(name, value) {
        console.log(`submit request ${name}: ${value} ${value.toString(16)}`)
        await store.setRegister({ name, value })
        canCloseRegister()
    }

    function submitMemoryRequest() {
        console.log("submit memory request")
        canCloseMemory()
    }

    function submitBreakpointRequest() {
        console.log("submit breakpoints")
    }

    async function submitCommand(cmd) {
        try {
            await store.sendCommand(cmd)
            runOnce()
        } catch (err) {
            console.log(err)
        }
    }


    let timerId = 0

    function run() {
        console.log("run cpu...")
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
                timerId = 0
           }
        } catch (error) {
            console.error("An error occurred during 'run':", error);
            timerId = 0
        }
    }    
    
    function update() {
        console.log("update")
        store.getRegisters()
        store.updateDisplay()
        store.getBreakpoints()
    }

    onMounted(() => {
        update()
    })

</script>

<style scoped>

.main-page {
    background-color: #222;
    height: 100vh;
}

.control-panel {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #555;
    justify-content: space-between;
}

.console-panel {
    display: flex;
    flex-direction: row;
    background-color: #222;
    justify-content: space-between;
}

.console-panel_main {
    width: 100%;
}

.page_separator {
    height:10px;
    background-color: black;;
    border: solid 1px black;
}

.register-form {
    position: fixed;
    top: 50%;
    right: 0%;
    /* width: 50%; */
    z-index: 1;
}

.memory-form {
    position: fixed;
    top: 25%;
    right: 0%;
    /* width: 80%; */
    z-index: 1;
}

.breakpoint-form {
    position: fixed;
    top: 40%;
    right: 0%;
    /* width: 50%; */
    z-index: 1;
}

.slideform-enter-from,
.slideform-leave-to {
    transform: translateX(100%);
}

.slideform-enter-active,
.slideform-leave-active {
    transition: transform 0.5s;
}

.slideform-enter-to {
    transform: translateX(0%);
}

</style>