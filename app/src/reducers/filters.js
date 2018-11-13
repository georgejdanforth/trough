import _ from 'lodash';

import {
    CLEAR_FILTERS,
    DECREMENT_PAGE,
    INCREMENT_PAGE,
    SET_FEED_FILTER,
    SET_SAVED_FILTER,
    SET_TOPIC_FILTER,
} from '../actions/filters';


const filters = (state={ page: 1 }, action) => {
    switch (action.type) {
        case CLEAR_FILTERS:
            return { page: 1 };
        case DECREMENT_PAGE:
            return {
                page: Math.max(action.filters.page - 1, 1),
                ..._.omit(action.filters, 'page')
            };
        case INCREMENT_PAGE:
            return {
                page: action.filters.page + 1,
                ..._.omit(action.filters, 'page')
            };
        case SET_FEED_FILTER:
            return { page: 1, ...action.filters };
        case SET_SAVED_FILTER:
            return { page: 1, saved: true };
        case SET_TOPIC_FILTER:
            return { page: 1, ...action.filters };
        default:
            return state;
    }
};

export default filters;