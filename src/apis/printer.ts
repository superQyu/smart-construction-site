import { axiosClient } from '@/lib/http'

const API_PREFIX_PRINT = '/api/printer'

const client = axiosClient()

export async function triggerLog() {
    return client.post(`${API_PREFIX_PRINT}/log/start`).then(resp => resp.data)
}

export async function queryAllLog() {
    return client.get(`${API_PREFIX_PRINT}/log/all`).then(resp => resp.data)
}

export async function clearLog() {
    return client.deleteM(`${API_PREFIX_PRINT}/log/clear`).then(resp => resp.data)
}

export async function queryLog() {
    return client.get(`${API_PREFIX_PRINT}/log`).then(resp => resp.data)
}

export async function open() {
    return client.post(`${API_PREFIX_PRINT}/open`).then(resp => resp.data)
}

export async function close() {
    return client.post(`${API_PREFIX_PRINT}/close`).then(resp => resp.data)
}

export async function abort() {
    return client.post(`${API_PREFIX_PRINT}/abort`).then(resp => resp.data)
}

export async function queryPrintStatus() {
    return client.get(`${API_PREFIX_PRINT}/tapp-status`).then(resp => resp.data)
}