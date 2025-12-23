<template>
    <!-- <div class="drive-plate" :style="{backgroundImage: 'url(' + image + ')'}"> -->
    <div class="drive-plate">
        <div class="top-plate">
            <div class="floppy-id">
                <span>{{ disk_id }}</span>
            </div>
            <div class="floppy-label">
                <span>{{ disk_label }}</span>
            </div>
            <div class="floppy-led" :style="{backgroundImage: 'url(' + led_img + ')'}">
            </div>
        </div>
        <div class="floppy-slot"></div>
        <div class="floppy-button">
            <button class="ctrl-button" @click="$emit('change_disk', disk_id)">change</button>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    disk_id: {
        type: Number,
        required: true
    },
    disk_file: {
        type: String,
        required: true,
    }
})

const image = useRuntimeConfig().public.img_url + "FloppyFacePlate.png"
const led_img = useRuntimeConfig().public.img_url + "red_led_off.png"

const disk_label = computed(() => {
    if (props.disk_file.length == 0) {
        return "EMPTY"
    }
    return props.disk_file
})

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

.floppy-id {
    color: white;
}

.floppy-label {
    color: black;
    border-radius: 5px;
    background-color: white;
    padding: 3px;
    padding: 0 20px;
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

.floppy-button {
    align-self: flex-end;
    padding-top: 10px;
    padding-right: 25px;
}

.ctrl-button {
    background-color: #AAA;   
    box-shadow:
        inset 2px 2px 3px rgb(255 255 255 / 0.6),
        inset -2px -2px 3px rgb(0 0 0 / 0.6);
}

.ctrl-button:hover {
    background-color: #CCC;   
}

.ctrl-button:active {
    background-color: #CCC;   
    box-shadow:
        inset -2px -2px 3px rgb(255 255 255 / 0.6),
        inset 2px 2px 3px rgb(0 0 0 / 0.6);
}



</style>