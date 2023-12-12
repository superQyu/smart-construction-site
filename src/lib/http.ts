import axios from "axios";
import { fetch } from '@tauri-apps/api/http';


const baseURL = import.meta.env.VITE_BASE_URL
export function axiosClient() {

    const req = axios.create({
        timeout: 30000,
        withCredentials: true, // with cookie
        baseURL: baseURL,
    })


    req.defaults.headers.common['Content-Type'] = 'application/json'
    req.defaults.headers.common['accept'] = 'application/json'


    const get = async (url: string, params?: any) => {
        return req.get(url, {
            params: params
        })
    }


    const post = async (url: string, params?: any, data?: any) => {
        return req.post(url, {
            data
        }, {
            params
        })
    }

    const deleteM = async (url: string, params?: any, data?: any) => {
        return req.delete(url, {
            params,
            data
        })
    }

    const postForm = async (url: string, data: any) => {
        return req.postForm(url, data)
    }



    return {
        get,
        post,
        deleteM,
        postForm
    }
};


export function tauriClient() {
    const config = {}

    const get = async (url: string, params?: any) => {
        return fetch(`${baseURL}${url}`, {
            ...config,
            method: 'GET',
            query: params
        })
    }


    return {
        get
    }

}