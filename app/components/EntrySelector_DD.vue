<template>
    <div>
        <fieldset>
            <legend>Entry Point: {{ entry_selected }}</legend>
            <div class="radio-buttons" v-for="entry in entryPoints">
                <input type="radio" :id="entry.id" name="" :value="entry.label" v-model="entry_selected"/>
                <label :for="entry.id">{{ entry.label }}</label>
            </div>
        </fieldset>
    </div>
</template>

<script setup>

const emit = defineEmits(['entry_changed'])

const entryPoints = [ 
    { id: 'init_'   , value: 0, label: 'Init'    },
    { id: 'read_'   , value: 3, label: 'Read'    },
    { id: 'write_'  , value: 6, label: 'Write'   },
    { id: 'getstat_', value: 9, label: 'GetStat' },
    { id: 'setstat_', value: 12, label: 'SetStat' },
    { id: 'term_'   , value: 15, label: 'Term'    }
 ]

const entry_selected = ref("")

watch(entry_selected, (curr, _) => {
    if (curr.length > 0) {
        const entry = entryPoints.find((x) => x.label === curr)
        if (entry) {
            console.log(`entry selected: ${entry.value}`)
            emit('entry_changed', entry.value)
        }
    }
})


</script>

<style scoped>

</style>