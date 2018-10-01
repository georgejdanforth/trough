import { combineReducers } from 'redux';
import auth from './auth';
import filters from './filters';

const rootReducer = combineReducers({ auth, filters });

export default rootReducer;