import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const getConfig = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: token
            ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            : { 'Content-Type': 'application/json' }
    };
};

export function login(creds) {
    return axios.post(`${BASE_URL}/userdata/login`, creds, getConfig());
}