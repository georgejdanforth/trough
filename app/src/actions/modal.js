export const ADD_FEED = 'ADD_FEED';
export const ADD_TOPIC = 'ADD_TOPIC';
export const CLOSE = 'CLOSE';

export const addFeed = () => ({
    type: ADD_FEED,
    formProps: {}
});

export const addTopic = topics => ({
    type: ADD_TOPIC,
    formProps: { topics }
});

export const close = () => ({
    type: CLOSE,
    formProps: {}
});
