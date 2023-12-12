import { axiosClient } from '@/lib/http'

const API_PREFIX_CONFIG = '/api/config'

const client = axiosClient()


export async function queryConfigCurrent() {
    return client.get(`${API_PREFIX_CONFIG}/current`).then(resp => resp.data)
}

