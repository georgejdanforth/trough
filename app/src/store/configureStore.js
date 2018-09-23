import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducers';

// const debugWare = [];
// if (process.env.NODE_ENV !== 'production') {
//     const createLogger = require('redux-logger');
//     debugWare.push(createLogger({ collapsed: true }));
// }

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        persistedReducer,
        initialState,
        composeEnhancers(applyMiddleware(thunkMiddleware))
    );

    // Enable webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    const persistor = persistStore(store);

    return { store, persistor };
}