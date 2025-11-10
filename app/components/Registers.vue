<template>
    <div class="registers" >
        <!-- <h1>REGISTERS</h1> -->
        <Register class="register" name="A" @click="$emit('update', 'A', 8)" />
        <Register class="register" name="B" @click="$emit('update', 'B', 8)" />
        <Register class="register" name="D" @click="$emit('update', 'D', 16)" :large="true" />
        <Register class="register" name="X" @click="$emit('update', 'X', 16)" :large="true" />
        <Register class="register" name="Y" @click="$emit('update', 'Y', 16)" :large="true" />
        <Register class="register" name="U" @click="$emit('update', 'U', 16)" :large="true" />
        <Register class="register" name="S" @click="$emit('update', 'S', 16)" :large="true" />
        <Register class="register" name="PC" @click="$emit('update', 'PC', 16)" :large="true" />
        <Register class="register" name="CC" @click="$emit('update', 'CC', 8)" :large="false" />
        <Register class="register" name="DP" @click="$emit('update', 'DP', 8)" :large="false" />
    </div>
</template>

<script setup>

const emit = defineEmits(['update'])

function update(name) {
    console.log(`registers update: ${name}`)
    emit('update', name)
}

</script>

<style scoped>

h1 {
    margin: 0;
}
.registers {
    justify-content: center;
}

.register {
    cursor: pointer;
}

</style>