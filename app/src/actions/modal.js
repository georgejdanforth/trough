export const ADD_FEED = 'ADD_FEED';
export const ADD_TOPIC = 'ADD_TOPIC';
export const DELETE_ITEM = 'DELETE_ITEM';
export const MANAGE_FEED_TOPICS = 'MANAGE_FEED_TOPICS';
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

export const manageFeedTopics = feed => ({
    type: MANAGE_FEED_TOPICS,
    formProps: { feed }
});

export const manageTopicFeeds = topic => ({
    type: MANAGE_TOPIC_FEEDS,
    formProps: { topic }
});

export const deleteItem = (itemType, item) => ({
    type: DELETE_ITEM,
    formProps: { itemType, item  }
});

export const close = () => ({
    type: CLOSE,
    formProps: {}
});
