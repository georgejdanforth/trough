import {
    CLEAR_FILTERS,
    SET_FEED_FILTER,
    SET_SAVED_FILTER,
    SET_TOPIC_FILTER,
} from '../actions/filters';


const filters = (state={ filters: null }, action) => {
    switch (action.type) {
        case CLEAR_FILTERS:
            return {};
        case SET_FEED_FILTER:
            return action.filters;
        case SET_SAVED_FILTER:
            return { saved: true };
        case SET_TOPIC_FILTER:
            return action.filters;
        default:
            return state;
    }
};

export default filters;