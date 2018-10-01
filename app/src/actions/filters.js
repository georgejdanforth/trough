export const SET_FEED_FILTER = 'SET_FEED_FILTER';

export const setFeedFilter = feedId => ({
    type: SET_FEED_FILTER,
    filters: { feedId }
});