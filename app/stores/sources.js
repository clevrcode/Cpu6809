export const useSourceStore = defineStore('sources', () => {

    const content = ref([])

    // function processResponse(input) {
    //     try {
    //         const lines = input.split("\n")
    //         const regexp = /([0-9A-F]{4})? ([0-9A-F]+)? +(\([^)]+\))?:([0-9]{5})? (.*)?/g;
    //         const result = []
    //         for (let line of lines) {
    //             const res = [...line.matchAll(regexp)]
    //             result.push(res);
    //         }
    //         return result
    //     } catch (error) {
    //         console.log(error)
    //         return []
    //     }
    // }

    async function GetSource(cmd) {
        try {
            const filename = cmd + ".lst"
            // const url = useRuntimeConfig().public.api_url + "/" + filename
            const url = useRuntimeConfig().public.api_url + "/source"
            const headers = { 'X-Requested-With': 'XMLHttpRequest' }
            console.log(`get ${url}`)
            // const response = await $fetch(url, { parseResponse: (txt) => txt })
            const response = await $fetch(url, {
                headers,
                query: {
                    file: filename
                }
            })
            content.value = response;
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