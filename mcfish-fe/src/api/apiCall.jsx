import { apiRoutes } from "./apiRoutes";

export const apiCall = async (endpoint, method = 'GET', data = null) => {
    const url = `${apiRoutes.BASE_URL}/${endpoint}`;

    const options = {
        method,
        headers: {}
    };

    // Only send body for POST/PUT/PATCH
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        return res.json();
    } catch (err) {
        console.error('API call error:', err);
        throw err;
    }
};