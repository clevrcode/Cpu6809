<template>
    <div >
        <div class="display">
            <canvas ref="crt" id="crtscreen" width="800" height="500">
                Unsupported browser
            </canvas>
        </div>
        <!-- <div class="crt-input">
            <input type="text" placeholder="command" spellcheck="false" @keydown="dataInput" v-model="command">
        </div>         -->
    </div>
</template>

<script setup>

import {Buffer} from 'buffer'
const store = useCpuStore()

const command = ref("")
const displayContent = ref([])

const isCoco  = computed(() => store.display.type === "COCO")
const updated = computed(() => store.display.updated)

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
    if (crt.value) {
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
}

let blinkOn = false
let timerId = 0

function drawCursor() {
    if (crt.value && store.display.cursor.on) {
        const context = crt.value.getContext("2d")
        const params = getDisplayParams()
        if (blinkOn) {
            context.fillStyle = params.fg
        } else {
            context.fillStyle = params.bg
        }
        const charWidth = 10
        let px = (store.display.cursor.pos.x * charWidth) + 15
        let py = (store.display.cursor.pos.y * params.line_spacing) + 5
        context.fillRect(px, py, charWidth, params.line_spacing-2);
        blinkOn = !blinkOn
    }
    timerId = setTimeout(drawCursor, 500)
}

onMounted(() => {
    try {
        window.addEventListener('keydown', dataInput);
        crt.value.focus()
        if (store.display) {
            renderContent(store.display.content)
            draw()
        }
        timerId = setTimeout(drawCursor, 1000)
    } catch (error) {
        console.log(error)
    }
})

onBeforeUnmount(() => {
    clearTimeout(timerId)
    window.removeEventListener('keydown', dataInput);
})

function dataInput(ev) {
    // if (crt.value !== document.activeElement)
    //     return
    if ((ev.key === "Shift") || 
        (ev.key === "CapsLock") || 
        (ev.key === "Control") ||
        (ev.key === "Dead") ||
        (ev.key === "NumLock") ||
        (ev.key === "PageUp") ||
        (ev.key === "PageDown") ||
        (ev.key === "End") ||
        (ev.key === "Delete") ||
        (ev.key === "Insert") ||
        (ev.key === "Alt")) {
            return
    }

    console.log(`key: [${ev.key}]`)        
    let keyval = 255;
    if (ev.key === "Enter") {
        keyval = 0x0d
        command.value = ""
    } else if (ev.key === "Tab") {
        keyval = 0x09
    } else if (ev.key == "Backspace") {
        keyval = 0x08
        if (command.value.length > 0) {
            command.value = command.value.substring(0, command.value.length-1)
        }
    } else if (((ev.key == "C")||(ev.key == "c")) && ev.ctrlKey) {
        keyval = 0x03
    } else if (ev.key === "Home") {
        keyval = 0x01
    } else if (ev.key == "Escape") {
        keyval = 0x1b
    } else if (ev.key == "ArrowUp") {
        keyval = 0x0c
    } else if (ev.key == "ArrowDown") {
        keyval = 0x0a
    } else if (ev.key == "ArrowLeft") {
        keyval = 0x08
    } else if (ev.key == "ArrowRight") {
        keyval = 0x09
    } else if (!ev.ctrlKey && !ev.altKey) {
        keyval = ev.key.charCodeAt(0)
    }
    if (keyval != 255) {
        store.sendCommand('keypress', { key: keyval })
    }
}

function renderContent(disp_mem) {
    let disp = []
    try {
        const data = Buffer.from(disp_mem, 'base64')
        if (store.display.type === "COCO") {
            for (let i=0; i < store.display.size.y; i++) {
                let line = ""
                for (let j=0; j < store.display.size.x; j++) {
                    let x = data[(store.display.size.x * i) + j]
                    line += cocoCharMap[x]
                }
                disp.push(line)
            }
        }
        else if (store.display.type === "CRTC") {
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

watch(updated, (newDisplay, _) => {
    renderContent(store.display.content)
    draw()
})

</script>

<style scoped>

canvas {
    border: 5px solid #777;
}
canvas:focus {
    border: 5px solid white;
}

.crt-input input {
    width: 810px;
    background-color: #0b0;
    font-size: 24px;
}

</style>