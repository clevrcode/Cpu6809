export const useSourceStore = defineStore('sources', () => {

    const content = ref([])

    function processResponse(input) {
        try {
            const lines = input.split("\n")
            const regexp = /([0-9A-F]{4})? ([0-9A-F]+)? +(\([^)]+\))?:([0-9]{5})? (.*)?/g;
            const result = []
            for (let line of lines) {
                const res = [...line.matchAll(regexp)]
                
                result.push(res);
            }
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async function GetSource(cmd) {
        try {
            const filename = cmd + ".lst"
            const url = useRuntimeConfig().public.src_url + "/" + filename
            console.log(`get ${url}`)
            const response = await $fetch(url, { parseResponse: (txt) => txt })
            content.value = processResponse(response)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return {
        content,
        GetSource
    }
})