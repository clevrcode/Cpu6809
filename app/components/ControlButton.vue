<template>
    <button class="ctrl-button">
        <slot></slot>
    </button>
</template>

<script setup>

</script>

<style scoped>

.ctrl-button {
    font: inherit;
    color: Black;
    background-color: #999;
    text-align: center;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border: solid 1px black;
    cursor: pointer;
    width: 100px;
    box-shadow:
        inset 2px 2px 3px rgb(255 255 255 / 0.6),
        inset -2px -2px 3px rgb(0 0 0 / 0.6);
}

.ctrl-button:hover {
    background-color: #CCC;   
}

.ctrl-button:active {
    box-shadow:
        inset -2px -2px 3px rgb(255 255 255 / 0.6),
        inset 2px 2px 3px rgb(0 0 0 / 0.6);
}

</style>