export const useSourceStore = defineStore('sources', () => {

    const content = ref([])

    async function GetSource(cmd) {
        try {
            content.value = []
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