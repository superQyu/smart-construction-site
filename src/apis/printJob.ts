import { axiosClient } from '@/lib/http'

const API_PREFIX_PRINT_JOB = '/api/printJob'

const client = axiosClient()


export async function queryPrintJob() {
    return client.get(`${API_PREFIX_PRINT_JOB}/queue`).then(resp => resp.data)
}

export async function uploadPrintJob(fileName: string, file: Blob) {
    const form = new FormData();
    form.append('files', file, fileName);

    return client.postForm(`${API_PREFIX_PRINT_JOB}/queue`, form).then(resp => resp.data)
}

export async function moveQueue(data: { srcQueue: string, dstQueue: string, file: string }) {
    return client.post(`${API_PREFIX_PRINT_JOB}/queue/move`, data).then(resp => resp.data)
}

export async function prePrintJob(jobName: string) {
    return client.post(`${API_PREFIX_PRINT_JOB}/${jobName}`).then(resp => resp.data)
}


export async function startPrintJob(jobName: string) {
    return client.post(`${API_PREFIX_PRINT_JOB}/${jobName}/start`).then(resp => resp.data)
}

export async function stopPrintJob(jobName: string) {
    return client.post(`${API_PREFIX_PRINT_JOB}/${jobName}/stop`).then(resp => resp.data)
}

export async function deletePrintJob(jobName: string) {
    return client.deleteM(`${API_PREFIX_PRINT_JOB}/${jobName}`).then(resp => resp.data)
} 