<template>
    <div class="registers" >
        <h1>REGISTERS</h1>
        <Register class="register" name="A" @click="$emit('update', 'A')" />
        <Register class="register" name="B" @click="$emit('update', 'B')" />
        <Register class="register" name="D" @click="$emit('update', 'D')" :large="true" />
        <Register class="register" name="X" @click="$emit('update', 'X')" :large="true" />
        <Register class="register" name="Y" @click="$emit('update', 'Y')" :large="true" />
        <Register class="register" name="U" @click="$emit('update', 'U')" :large="true" />
        <Register class="register" name="S" @click="$emit('update', 'S')" :large="true" />
        <Register class="register" name="PC" @click="$emit('update', 'PC')" :large="true" />
        <Register class="register" name="CC" @click="$emit('update', 'CC')" :large="false" />
        <Register class="register" name="DP" @click="$emit('update', 'DP')" :large="false" />
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
    margin: 0 2.0rem;
}

.register {
    cursor: pointer;
}

</style>