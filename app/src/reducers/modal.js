import {
    ADD_FEED,
    ADD_TOPIC,
    DELETE_ITEM,
    MANAGE_FEED_TOPICS,
    MANAGE_TOPIC_FEEDS,
    CLOSE,
} from '../actions/modal';


const modal = (state={isActive: false, formProps: {}, type: null}, action) => {
    switch (action.type) {
        case ADD_FEED:
            return {
                isActive: true,
                formProps: action.formProps,
                type: ADD_FEED
            };
        case ADD_TOPIC:
            return {
                isActive: true,
                formProps: action.formProps,
                type: ADD_TOPIC
            };
        case MANAGE_FEED_TOPICS:
            return {
                isActive: true,
                formProps: action.formProps,
                type: MANAGE_FEED_TOPICS
            };
        case MANAGE_TOPIC_FEEDS:
            return {
                isActive: true,
                formProps: action.formProps,
                type: MANAGE_TOPIC_FEEDS
            };
        case DELETE_ITEM:
            return {
                isActive: true,
                formProps: action.formProps,
                type: DELETE_ITEM
            };
        case CLOSE:
            return {
                isActive: false,
                formProps: {},
                type: null
            };
        default:
            return state;
    }
};

export default modal;