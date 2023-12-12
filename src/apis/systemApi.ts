import { axiosClient } from '@/lib/http'

const API_PREFIX_SYSTEM = '/api/system'

const client = axiosClient()

export interface NetworkAdapterInfo {
    "name": string;
    "description": string;
    "type": string;
    "status": string;
    "iPv4": string;
    "iPv6"?: string;
    "dns"?: string;
    "mask": string;
    "gateway"?: string;
}

export async function listNetworkAdapter(): Promise<NetworkAdapterInfo[]> {
    return client.get(`${API_PREFIX_SYSTEM}/networkAdapter`).then(resp => resp.data)
}
