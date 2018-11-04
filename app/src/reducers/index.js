import { combineReducers } from 'redux';
import auth from './auth';
import filters from './filters';
import modal from './modal';
import updates from './updates';

const rootReducer = combineReducers({
    auth,
    filters,
    modal,
    updates,
});

export default rootReducer;