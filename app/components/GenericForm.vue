<template>
    <div class="form-box">
        <div class="form-content">
            <slot></slot>
        </div>
        <div class="button-bar">
            <BaseButton @click="$emit('submit')">APPLY</BaseButton>
            <BaseButton @click="$emit('cancel')">CANCEL</BaseButton>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.form-box {
    /* background-color: lightgray; */
    background-color: #f99a08;
    padding: 20px;
    border: solid 3px black;
    border-radius: 20px;;
}

.button-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

</style>