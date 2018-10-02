import { SET_FEED_FILTER } from '../actions/filters';


const filters = (state={ filters: null }, action) => {
    switch (action.type) {
        case SET_FEED_FILTER:
            return { feedId: action.filters.feedId };
        default:
            return state;
    }
};

export default filters;