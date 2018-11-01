import {
    ADD_FEED,
    ADD_TOPIC,
    ADD_TO_TOPIC,
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
        case ADD_TO_TOPIC:
            return {
                isActive: true,
                formProps: action.formProps,
                type: ADD_TO_TOPIC
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