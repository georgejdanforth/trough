export const UPDATE_FEED = 'UPDATE_FEED';
export const FINISH_UPDATE_FEED = 'FINISH_UPDATE_FEED';
export const UPDATE_SIDEBAR = 'UPDATE_SIDEBAR';
export const FINISH_UPDATE_SIDEBAR = 'FINISH_UPDATE_SIDEBAR';


export const updateFeed = () =>  ({ type: UPDATE_FEED });

export const finishUpdateFeed = () => ({ type: FINISH_UPDATE_FEED });

export const updateSidebar = () => ({ type: UPDATE_SIDEBAR });

export const finishUpdateSidebar = () => ({ type: FINISH_UPDATE_SIDEBAR });
