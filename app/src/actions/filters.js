export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const SET_FEED_FILTER = 'SET_FEED_FILTER';

export const clearFilters = () => ({
    type: CLEAR_FILTERS,
    filters: {}
});

export const setFeedFilter = feedId => ({
    type: SET_FEED_FILTER,
    filters: { feedId }
});