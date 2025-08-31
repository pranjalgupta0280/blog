import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        // This function will only be triggered for successful responses (status code 2xx)
        return processResponse(response);
    },
    function(error) {
        // This function will be triggered for any error responses
        return Promise.reject(ProcessError(error));
    }
);

/**
 * If success -> returns { isSuccess: true, data: object }
 */
const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    }
};

/**
 * If fail -> returns { isError: true, msg: string, code: int }
 */
const ProcessError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("ERROR IN RESPONSE: ", error.response);
        return {
            isError: true,
            // Prioritize the actual error message from the backend server.
            // If it doesn't exist, fall back to a generic message from config.js.
            msg: error.response?.data?.msg || API_NOTIFICATION_MESSAGES.responseFailure.message,
            code: error.response?.status
        };
    } else if (error.request) {
        // The request was made but no response was received
        console.error("ERROR IN REQUEST: ", error.request);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure.message,
            code: ""
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error("ERROR IN CONFIG: ", error.message);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError.message,
            code: ""
        };
    }
};

const API = {};

// This loop dynamically creates API functions based on your SERVICE_URLS config
for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: body,
            responseType: value.responseType,
            // You can add headers for authentication here in the future
            // headers: { authorization: getAccessToken() }
        });
}

export { API };
