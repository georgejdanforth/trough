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

const refresh = wrapped => async (...args) =>  {
    const { exp } = jwtDecode(localStorage.getItem('access_token'));
    const expirationDateTime = new Date(exp * 1000);
    const now = new Date();

    if (expirationDateTime < now) await refreshToken();

    return wrapped(...args);
};

const filtersToQueryParams = filters =>
    Object
        .entries(filters)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

export const login = creds =>
    axios.post(`${BASE_URL}/userdata/login`, creds, getAccessConfig());

export const getFeeds = refresh(forTopic =>
    axios.get(`${BASE_URL}/feeds/feeds?${forTopic ? `forTopic=${forTopic}` : ''}`, getAccessConfig()));

export const getFeedItems = refresh(filters =>
    axios.get(`${BASE_URL}/feeds/feeditems?${filtersToQueryParams(filters)}`, getAccessConfig()));

export const validateFeed = refresh(feedUrl =>
    axios.get(`${BASE_URL}/feeds/isvalid?url=${feedUrl}`, getAccessConfig()));

export const addFeed = refresh(feedUrl =>
    axios.post(`${BASE_URL}/feeds/add`, { feedUrl }, getAccessConfig()));

export const saveFeedItem = refresh(feedItemId =>
    axios.post(`${BASE_URL}/feeds/save/${feedItemId}`, null, getAccessConfig()));

export const unsaveFeedItem = refresh(feedItemId =>
    axios.delete(`${BASE_URL}/feeds/unsave/${feedItemId}`, getAccessConfig()));

export const getTopics = refresh(forFeed =>
    axios.get(`${BASE_URL}/feeds/topics?${forFeed ? `forFeed=${forFeed}`: ''}`, getAccessConfig()));

export const addTopic = refresh(name =>
    axios.post(`${BASE_URL}/feeds/topics/add`, { name }, getAccessConfig()));

export const manageTopicFeeds = refresh((topicId, feedIds) =>
    axios.post(`${BASE_URL}/feeds/topics/${topicId}/managefeeds`, { feedIds }, getAccessConfig()));

export const manageFeedTopics = refresh((feedId, topicIds) =>
    axios.post(`${BASE_URL}/feeds/${feedId}/managetopics`, { topicIds }, getAccessConfig()));

export const deleteTopic = refresh(topicId =>
    axios.delete(`${BASE_URL}/feeds/topics/delete/${topicId}`, getAccessConfig()));

export const unfollowFeed = refresh(feedId =>
    axios.delete(`${BASE_URL}/feeds/unfollow/${feedId}`, getAccessConfig()));
