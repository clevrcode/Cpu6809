<template>
    <GenericForm @submit="sendMemoryRequest" :with_buttons="false">
        <div class="module-list">
            <div class="module-entry-header">
                <div>NAME</div>
                <div>START</div>
                <div>END</div>
                <div>EXEC</div>
                <div>OFFSET</div>
                <div>TYPE</div>
                <div>LANGUAGE</div>
                <div>DATA SIZE</div>
                <div>ATTR</div>
                <div>REV</div>
            </div>
            <div class="module-entry" v-for="module of store.modules">
                <div id="name">{{ module.name }}</div>
                <div id="start">{{ hex_value(module.start) }}</div>
                <div id="end">{{ hex_value(module.end) }}</div>
                <div id="exec">{{ hex_value(module.exec_offset + module.start) }}</div>
                <div id="offset">{{ hex_value(module.exec_offset) }}</div>
                <div id="type">{{ module_type(module.type) }}</div>
                <div id="language">{{ module_language(module.language) }}</div>
                <div id="data">{{ hex_value(module.data_size) }}</div>
                <div id="attr">{{ get_attr(module.attr_rev) }}</div>
                <div id="rev">{{ get_rev(module.attr_rev) }}</div>
            </div>
        </div>
    </GenericForm>
</template>

<script setup>

const store = useCpuStore()

const hex_value = (val) => formatNumber(val, 16, 4)

const module_type = (type) => {
    if (type == 1)
        return "Program"
    if (type == 2)
        return "Subroutine"
    if (type == 3)
        return "multi-module"
    if (type == 4)
        return "data"
    if (type == 0x0c)
        return "OS9 system"
    if (type == 0x0d)
        return "File Manager"
    if (type == 0x0e)
        return "Device Driver"
    if (type == 0x0f)
        return "Device Descr"
    return "User"
}

const module_language = (lang) => {
    if (lang == 0)
        return "data"
    if (lang == 1)
        return "6809-obj"
    if (lang == 2)
        return "Basic09"
    if (lang == 3)
        return "Pascal"
    if (lang == 4)
        return "Cobol"
    return "Reserved"
}
const get_attr = (attr) => {
    if (attr & 0x80) {
        return "Reentrant"
    }
    return "---------"
}
const get_rev = (rev) => rev & 0x0f

</script>

<style scoped>

.module-list {
    background-color: white;
    /* font-family: 'Courier New', Courier, monospace; */
    /* font-size: 1.2rem;
    font-weight: 400;
    grid-template-columns: 8rem repeat(2, 4.0rem) auto; */
    overflow-y: scroll;
}
.module-entry-header {
    display: grid;
    background-color: black;
    color: white;
    font-size: 1.2rem;
    font-weight: 400;
    grid-template-columns: 8rem repeat(3, 4.0rem) 6rem 10rem 8rem 4rem 8rem 4rem;
}
.module-entry {
    display: grid;
    font-size: 1.2rem;
    font-weight: 400;
    grid-template-columns: 8rem repeat(3, 4.0rem) 6rem 10rem 8rem 4rem 8rem 4rem;
}

#name {
    padding: 2px 10px;
}

</style>