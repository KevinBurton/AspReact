/// <reference path="../../../typings/index.d.ts" />
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import genericReducer from '../reducers/genericReducer';
import { checkForErrorsHandler } from '../utils/errorHandler';
import { eventEmit } from '../utils/eventEmitter';
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

export const configureGenericStore = (preloadedState?: any) => {
	const store = createStore(
		genericReducer,
		preloadedState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
	);

	// TODO: Short-term solution for calling Redux actions outside of React.
	(window as any).store = store;

	store.subscribe(() => checkForErrorsHandler(store.getState, store.dispatch));
    store.subscribe(() => eventEmit(store.getState, store.dispatch));
  

	return store;
};