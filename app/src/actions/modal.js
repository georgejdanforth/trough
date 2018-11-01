export const ADD_FEED = 'ADD_FEED';
export const ADD_TOPIC = 'ADD_TOPIC';
export const ADD_TO_TOPIC = 'ADD_TO_TOPIC';
export const CLOSE = 'CLOSE';

export const addFeed = () => ({
    type: ADD_FEED,
    formProps: {}
});

export const addTopic = topics => ({
    type: ADD_TOPIC,
    formProps: { topics }
});

export const addToTopic = (feed, topics) => ({
    type: ADD_TO_TOPIC,
    formProps: { feed, topics }
});

export const close = () => ({
    type: CLOSE,
    formProps: {}
});
