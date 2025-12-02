import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const fetchPayments = async (skip = 0, limit = 10, status?: string) => {
    const params = { skip, limit, status };
    const response = await api.get('/payments', { params });
    return response.data;
};

export const fetchInvoices = async (skip = 0, limit = 10, status?: string) => {
    const params = { skip, limit, status };
    const response = await api.get('/invoices', { params });
    return response.data;
};

export const fetchSummary = async () => {
    const response = await api.get('/summary');
    return response.data;
};

export const fetchLogs = async (limit = 50) => {
    const response = await api.get('/agent-logs', { params: { limit } });
    return response.data;
};

export const chatWithAssistant = async (query: string) => {
    const response = await api.post('/ai-assistant', { query });
    return response.data;
};
