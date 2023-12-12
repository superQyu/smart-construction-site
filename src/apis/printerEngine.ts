import { axiosClient } from '@/lib/http'

const API_PREFIX_PRINT_ENGINE = '/api/printerEngine'

const client = axiosClient()

export async function queryConfigPath() {
    return client.get(`${API_PREFIX_PRINT_ENGINE}/config-path`).then(resp => resp.data)
}
