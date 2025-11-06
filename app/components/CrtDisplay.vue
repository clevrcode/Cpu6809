<template>
    <div class="crt-screen" :class="{ coco: isCoco }">
        <div v-for="line of displayContent">
            {{ line }}
        </div>        
    </div>
</template>

<script setup>
import {Buffer} from 'buffer'
const store = useMainStore()

const data_coco = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ012345")
const data_crtc = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+@#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+@#")

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

const display_data = computed(() => {
    console.log(`display length: ${store.display.length}`)
    let dsp = ""
    let line = data_crtc.value
    if (store.display_type === "COCO") {
        line = data_coco.value
    }
    dsp = line
    for (let i=1; i < store.display_size.y; i++) {
        dsp += "\n"
        dsp += line
    }
    return dsp
})

const displayContent = ref([])
const memory = computed(() => store.display)

watch(memory, (newDisplay, _) => {
    let disp = []
    try {
        console.log("update display...")
        const data = Buffer.from(newDisplay, 'base64')
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
})

const isCoco = computed(() => store.display_type === "COCO")


</script>

<style scoped>

.crt-screen {
    border: solid 15px #777;
    width: 800px;
    height: 730px;
    background-color: black;
    color: green;
    font-family:'Courier New', Courier, monospace;
    font-size: 1.0rem;
    overflow: hidden;
    /* margin: 20px */
}

.coco {
    font-size: 2.5rem;
    background-color: green;
    color: black;
}

</style>