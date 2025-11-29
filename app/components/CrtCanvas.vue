<template>
    <div>
        <div class="display" @keydown="keyPressed">
            <canvas ref="crt" id="crtscreen" width="800" height="500">
                Unsupported browser
            </canvas>
        </div>
        <div class="crt-input">
            <input type="text" placeholder="command" spellcheck="false" @keydown="dataInput" v-model="command">
        </div>        
    </div>
</template>

<script setup>

import {Buffer} from 'buffer'
const store = useMainStore()
const emit = defineEmits(['command'])

const command = ref("")
const displayContent = ref([])

const isCoco = computed(() => store.display_type === "COCO")
const memory = computed(() => store.display)
const crt = useTemplateRef("crt")

const cocoCharMap = [
	'@', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',  // 0x00-0x0f
	'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '[', '\\', ']', '^', '_', // 0x10-0x1f
	' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', // 0x20-0x2f
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',  // 0x30-0x3f
	'@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',  // 0x40-0x4f
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', // 0x50-0x5f
	' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', // 0x60-0x6f
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?'   // 0x70-0x7f
];

function keyPressed(ev) {
    console.log(`key pressed [${ev.key}]`)
}

function fillBackgroundColor(canvas, context, bgcolor) {
    context.fillStyle = bgcolor;
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function getDisplayParams() {
    if (isCoco.value) {
        return { width: 32, height: 16, bg: "green", fg: "black", font: "2.5em Courier", line_spacing: 31 }
    }
    return { width: 80, height: 24, bg: "black", fg: "#0f0", font: "1.0em Courier", line_spacing: 20 }
}

function draw() {
    const context = crt.value.getContext("2d")
    const params = getDisplayParams()
    fillBackgroundColor(crt.value, context, params.bg)
    context.font = params.font
    context.textAlign = "left"
    context.fillStyle = params.fg
    const nb_lines = params.height
    let pos_y = params.line_spacing
    for (let i=0; i < nb_lines; i++) {
        if (i < displayContent.value.length) {
            context.fillText(displayContent.value[i], 15, pos_y)
            pos_y += params.line_spacing
        }
    }
}

onMounted(() => {
    try {
        renderContent(store.display)
        draw()
    } catch (error) {
        console.log(error)
    }
})

function dataInput(ev) {
    let b64cmd = null
    if (ev.key === "Enter") {
        b64cmd = Buffer.from(command.value + "\r").toString('base64')
    } else if (((ev.key == "C")||(ev.key == "c")) && ev.ctrlKey) {
        b64cmd = Buffer.from([0x03]).toString('base64')
    } else if (ev.key == "Escape") {
        b64cmd = Buffer.from([0x1b]).toString('base64')
    } else if (ev.key == "ArrowUp") {
        b64cmd = Buffer.from([0x0C]).toString('base64')
    } else if (ev.key == "ArrowDown") {
        b64cmd = Buffer.from([0x0A]).toString('base64')
    } else if (ev.key == "ArrowLeft") {
        b64cmd = Buffer.from([0x08]).toString('base64')
    } else if (ev.key == "ArrowRight") {
        b64cmd = Buffer.from([0x09]).toString('base64')
    }
    if (b64cmd) {
        console.log(`send command: ${b64cmd}`)
        emit('command', b64cmd)
        command.value = ""
    }
}

function renderContent(content) {
    let disp = []
    try {
        const data = Buffer.from(content, 'base64')
        if (store.display_type === "COCO") {
            for (let i=0; i < store.display_size.y; i++) {
                let line = ""
                for (let j=0; j < store.display_size.x; j++) {
                    let x = data[(store.display_size.x * i) + j]
                    line += cocoCharMap[x]
                }
                disp.push(line)
            }
        }
        else if (store.display_type === "CRTC") {
            const content = data.toString('utf8')
            disp.push(content.substring(0, 80))
            for (let x=80; x < content.length; x += 80) {
                disp.push(content.substring(x, x+80))
            }
        }
    } catch (error) {
        console.log("Error decoding base64 buffer")
        console.log(error)
    }
    displayContent.value = disp
}

watch(memory, (newDisplay, _) => {
    renderContent(newDisplay)
    draw()
})

</script>

<style scoped>

canvas {
    border: 5px solid #777;
}

.crt-input input {
    width: 810px;
    background-color: #0b0;
    font-size: 24px;
}

</style>