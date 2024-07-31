import axios from "axios";
import { toast } from "react-toastify";


const post = async (url: string, data: any, success: (data: any) => void, headers?: any) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}${url}`, data, {
        headers: headers
        });
        if (!response.data.success) {
            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                toast.error('Internal Server Error');
            }
        } else {
            success(response.data);
        }
    } catch (err) {
        toast.error('Internal Server Error');
        console.log(err);
    }
}

const get = async (url: string, success: (data: any) => void, headers?: any) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: headers
        });
        if (!response.data.success) {
            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                toast.error('Internal Server Error');
            }
        } else {
            success(response.data);
        }
    } catch (err) {
        toast.error('Internal Server Error');
        console.log(err);
    }
}

const put = async (url: string, data: any, success: (data: any) => void, headers?: any) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}${url}`, data, {
        headers: headers
        });
        if (!response.data.success) {
            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                toast.error('Internal Server Error');
            }
        } else {
            success(response.data);
        }
    } catch (err) {
        toast.error('Internal Server Error');
        console.log(err);
    }
}

const del = async (url: string, success: (data: any) => void, headers?: any) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: headers
        });
        if (!response.data.success) {
            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                toast.error('Internal Server Error');
            }
        } else {
            success(response.data);
        }
    } catch (err) {
        toast.error('Internal Server Error');
        console.log(err);
    }
}


export { post, get, put, del };