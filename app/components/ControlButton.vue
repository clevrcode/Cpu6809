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
    background-color: #888;
    text-align: center;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border: solid 1px black;
    cursor: pointer;
    width: 100px;
    height: 50px;
}

.ctrl-button:hover {
    color: Black;
    background-color: darkgray;
}

</style>