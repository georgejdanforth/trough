export const ADD_FEED = 'ADD_FEED';
export const ADD_TOPIC = 'ADD_TOPIC';
export const ADD_TO_TOPICS = 'ADD_TO_TOPICS';
export const MANAGE_TOPIC_FEEDS = 'MANAGE_TOPIC_FEEDS';
export const CLOSE = 'CLOSE';

export const addFeed = () => ({
    type: ADD_FEED,
    formProps: {}
});

export const addTopic = topics => ({
    type: ADD_TOPIC,
    formProps: { topics }
});

export const addToTopics = feed => ({
    type: ADD_TO_TOPICS,
    formProps: { feed }
});

export const manageTopicFeeds = topic => ({
    type: MANAGE_TOPIC_FEEDS,
    formProps: { topic }
});

export const close = () => ({
    type: CLOSE,
    formProps: {}
});
