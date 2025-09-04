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
        // CRITICAL FIX: Remove Content-Type header for FormData uploads
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            // Let the browser set the correct Content-Type with boundary
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        return processResponse(response);
    },
    function(error) {
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
        console.error("ERROR IN RESPONSE: ", error.response);
        return {
            isError: true,
            msg: error.response?.data?.msg || API_NOTIFICATION_MESSAGES.responseFailure.message,
            code: error.response?.status
        };
    } else if (error.request) {
        console.error("ERROR IN REQUEST: ", error.request);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure.message,
            code: ""
        };
    } else {
        console.error("ERROR IN CONFIG: ", error.message);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError.message,
            code: ""
        };
    }
};

const API = {};

// Dynamic API generation for regular requests
for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: body,
            responseType: value.responseType,
        });
}

// ADDED: Special file upload function
API.uploadFile = async (formData) => {
    try {
        console.log('=== API SERVICE DEBUG ===');
        console.log('Starting file upload...');
        
        // Debug FormData contents
        for (let [key, value] of formData.entries()) {
            console.log('API FormData entry:', key, value instanceof File ? `File: ${value.name}` : value);
        }
        
        const response = await axiosInstance({
            method: 'POST',
            url: '/file/upload',
            data: formData,
            timeout: 60000, // Increased timeout for file uploads
            // Don't set Content-Type - let axios handle it automatically for FormData
        });
        
        console.log('Upload successful:', response);
        return response;
        
    } catch (error) {
        console.error('=== API UPLOAD ERROR ===');
        console.error('Error:', error.message);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        throw error;
    }
};

export { API };
