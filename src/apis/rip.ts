import { axiosClient } from '@/lib/http'

const API_PREFIX_RIP = '/api/rip'

const client = axiosClient()

export async function preview(name: string, queue: string) {
    return client.get(`${API_PREFIX_RIP}/preview`, {
        name,
        queue
    }).then(resp => resp.data)
}
