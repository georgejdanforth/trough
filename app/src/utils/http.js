import axios from 'axios';
import jwtDecode from 'jwt-decode';

const BASE_URL = 'http://localhost:5000';

const getAccessConfig = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: token
            ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            : { 'Content-Type': 'application/json' }
    };
};

const getRefreshConfig = () => ({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
    }
});

const refreshToken = () =>
    axios.post(`${BASE_URL}/userdata/refresh_access_token`, null, getRefreshConfig())
        .then(({ data }) => localStorage.setItem('access_token', data.accessToken));

const refresh = wrapped => (...args) =>  {
    const { exp } = jwtDecode(localStorage.getItem('access_token'));
    const expirationDateTime = new Date(exp * 1000);
    const now = new Date();

    if (expirationDateTime < now) refreshToken();

    return wrapped(...args);
};

export const login = creds =>
    axios.post(`${BASE_URL}/userdata/login`, creds, getAccessConfig());

export const getFeeds = refresh(() =>
    axios.get(`${BASE_URL}/feeds/feeds`, getAccessConfig()));

export const getFeedItems = refresh(() =>
    axios.get(`${BASE_URL}/feeds/feeditems/1`, getAccessConfig()));
