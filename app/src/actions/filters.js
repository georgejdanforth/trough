export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const SET_FEED_FILTER = 'SET_FEED_FILTER';
export const SET_SAVED_FILTER = 'SET_SAVED_FILTER';
export const SET_TOPIC_FILTER = 'SET_TOPIC_FILTER';

export const clearFilters = () => ({
    type: CLEAR_FILTERS,
    filters: {}
});

export const setFeedFilter = feedId => ({
    type: SET_FEED_FILTER,
    filters: { feedId }
});

export const setSavedFilter = () => ({
    type: SET_SAVED_FILTER,
    filters: {}
});

export const setTopicFilter = topicId => ({
    type: SET_TOPIC_FILTER,
    filters: { topicId }
});