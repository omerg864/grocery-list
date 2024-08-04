import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const errorHandler = (
	err: AxiosError | any,
	fail?: (message: string) => void
) => {
	if (err.response) {
		if (err.response.data.message) {
			if (fail) {
				fail(err.response.data.message);
			} else {
				toast.error(err.response.data.message);
			}
		}
	} else {
		if (fail) {
			fail('Internal Server Error');
		} else {
			toast.error('Internal Server Error');
		}
	}
	console.log(err);
};

const successHandler = (
	response: any,
	success: (data: any) => void,
	fail?: (message: string) => void
) => {
	if (!response.data.success) {
		if (fail) {
			fail(response.data.message);
		} else {
			if (response.data.message) {
				toast.error(response.data.message);
			} else {
				toast.error('Internal Server Error');
			}
		}
	} else {
		success(response.data);
	}
};

const post = async (
	url: string,
	data: any,
	success: (data: any) => void,
	headers?: any,
	fail?: (message: string) => void
) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}${url}`,
			data,
			{
				headers: headers,
			}
		);
		successHandler(response, success, fail);
	} catch (err: AxiosError | any) {
		errorHandler(err, fail);
	}
};

const get = async (
	url: string,
	success: (data: any) => void,
	headers?: any,
	fail?: (message: string) => void
) => {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_URL}${url}`,
			{
				headers: headers,
			}
		);
		successHandler(response, success, fail);
	} catch (err: AxiosError | any) {
		errorHandler(err, fail);
	}
};

const put = async (
	url: string,
	data: any,
	success: (data: any) => void,
	headers?: any,
	fail?: (message: string) => void
) => {
	try {
		const response = await axios.put(
			`${import.meta.env.VITE_API_URL}${url}`,
			data,
			{
				headers: headers,
			}
		);
		successHandler(response, success, fail);
	} catch (err: AxiosError | any) {
		errorHandler(err, fail);
	}
};

const del = async (
	url: string,
	success: (data: any) => void,
	headers?: any,
	fail?: (message: string) => void
) => {
	try {
		const response = await axios.delete(
			`${import.meta.env.VITE_API_URL}${url}`,
			{
				headers: headers,
			}
		);
		successHandler(response, success, fail);
	} catch (err: AxiosError | any) {
		errorHandler(err, fail);
	}
};

export { post, get, put, del };
