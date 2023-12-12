import { axiosClient } from '@/lib/http'

const API_PREFIX_PCC = '/api/pcc'

const client = axiosClient()

export async function powerOnPCC(state: 'on' | 'off') {
    return client.post(`${API_PREFIX_PCC}/headPower/${state}`).then(resp => resp.data)
}

export async function queryPccHeadTemperature(pcc: number, hNums: number[]) {
    const params = new URLSearchParams()
    hNums.forEach(n => params.append('hNums', n.toString()))
    return client.get(`${API_PREFIX_PCC}/${pcc}/temperature`, params).then(resp => resp.data)
}

export async function queryPccState(pcc: number) {
    return client.get(`${API_PREFIX_PCC}/${pcc}/state`).then(resp => resp.data)
}