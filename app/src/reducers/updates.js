import {
    UPDATE_FEED,
    FINISH_UPDATE_FEED,
    UPDATE_SIDEBAR,
    FINISH_UPDATE_SIDEBAR
} from '../actions/updates';


const updates = (state={updateFeed: false, updateSidebar: false}, action) => {
    switch (action.type) {
        case UPDATE_FEED:
            return { updateFeed: true, updateSidebar: false};
        case FINISH_UPDATE_FEED:
            return { updateFeed: false, updateSidebar: false};
        case UPDATE_SIDEBAR:
            return { updateFeed: false, updateSidebar: true};
        case FINISH_UPDATE_SIDEBAR:
            return { updateFeed: false, updateSidebar: false};
        default:
            return state;
    }
};

export default updates;
