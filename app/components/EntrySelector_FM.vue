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
    { id: 'create_' , value: 0, label: 'Create'  },
    { id: 'open_'   , value: 3, label: 'Open'    },
    { id: 'makdir_' , value: 6, label: 'MakDir'  },
    { id: 'chgdir_' , value: 9, label: 'ChgDir'  },
    { id: 'delete_' , value: 12, label: 'Delete'  },
    { id: 'seek_'   , value: 15, label: 'Seek'    },
    { id: 'read_'   , value: 18, label: 'Read'    },
    { id: 'write_'  , value: 21, label: 'Write'   },
    { id: 'readln_' , value: 24, label: 'ReadLn'  },
    { id: 'writeln_', value: 27, label: 'WriteLn' },
    { id: 'getstat_', value: 30, label: 'GetStat' },
    { id: 'setstat_', value: 33, label: 'SetStat' },
    { id: 'close_'  , value: 36, label: 'Close'   }
 ]

const entry_selected = ref("")

watch(entry_selected, (curr, _) => {
    if (curr.length > 0) {
        console.log(`selection changed to ${curr}`)
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