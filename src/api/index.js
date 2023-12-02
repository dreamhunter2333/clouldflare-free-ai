import { useGlobalState } from '../store'

const API_BASE = import.meta.env.VITE_API_BASE || "";
const { loading } = useGlobalState();
import { useMessage } from 'naive-ui'
const message = useMessage();

const apiFetch = async (path, options = {}) => {
    loading.value = true;
    try {
        const response = await fetch(`${API_BASE}${path}`, {
            method: options.method || 'GET',
            body: options.body ? JSON.stringify(options.body) : null,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const msg = `${response.status} ${await response.text()}` || "error"
            message.error(msg);
            throw new Error(msg);
        }
        const data = await response.json();
        return data;
    } finally {
        loading.value = false;
    }
}

const textGeneration = async (messages) => {
    let path = "/api/text-generation";
    return await apiFetch(path, {
        method: 'POST',
        body: messages
    });
}

const textToImage = async (inputs) => {
    loading.value = true;
    try {
        const response = await fetch(`${API_BASE}/api/text-to-image`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const msg = `${response.status} ${await response.text()}` || "error"
            message.error(msg);
            throw new Error(msg);
        }
        const blob = await response.blob();
        return blob;
    } finally {
        loading.value = false;
    }
}

const translation = async (inputs) => {
    let path = "/api/translation";
    return await apiFetch(path, {
        method: 'POST',
        body: inputs
    });
}

export const api = {
    fetch: apiFetch,
    textGeneration: textGeneration,
    textToImage: textToImage,
    translation: translation
}
