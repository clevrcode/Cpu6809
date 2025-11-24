<template>
    <!-- <div class="drive-plate" :style="{backgroundImage: 'url(' + image + ')'}"> -->
    <div class="drive-plate">
        <div class="top-plate">
            <div class="floppy-label">
                <span>{{ disk_file }}</span>
            </div>
            <div class="floppy-led" :style="{backgroundImage: 'url(' + led_img + ')'}">
            </div>
        </div>
        <div class="floppy-slot"></div>
    </div>
</template>

<script setup>

const props = defineProps({
    disk_file: {
        type: String,
        required: false,
        default: ""
    }
})

const image = useRuntimeConfig().public.img_url + "FloppyFacePlate.png"
const led_img = useRuntimeConfig().public.img_url + "red_led.png"
</script>

<style scoped>

.drive-plate {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color:white;
    background-color: black;
    align-items: center;
    width: 500px;
    height: 100px;
    border: 2px solid grey;
}

.top-plate {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content:space-between;
    align-items: center;
    padding-bottom: 10px;
}

.floppy-label {
    color: black;
    border-radius: 5px;
    background-color: white;
    width: 100px;
    padding: 3px;
}

.floppy-led {
    width: 20px;
    height: 20px;
    background-size: cover;
}

.floppy-slot {
    background-color: #444;
    width: 90%;
    height: 10px;
}

</style>