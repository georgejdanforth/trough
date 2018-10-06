import {
    CLEAR_FILTERS,
    SET_FEED_FILTER, SET_SAVED_FILTER
} from '../actions/filters';


const filters = (state={ filters: null }, action) => {
    switch (action.type) {
        case CLEAR_FILTERS:
            return {};
        case SET_FEED_FILTER:
            return { feedId: action.filters.feedId };
        case SET_SAVED_FILTER:
            return { saved: true };
        default:
            return state;
    }
};

export default filters;