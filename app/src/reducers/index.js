import { combineReducers } from 'redux';
import auth from './auth';
import filters from './filters';
import modal from './modal';

const rootReducer = combineReducers({
    auth,
    filters,
    modal,
});

export default rootReducer;