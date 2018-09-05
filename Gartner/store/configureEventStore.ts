/// <reference path="../../../typings/index.d.ts" />
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import eventOverviewReducer from '../reducers/eventOverviewReducer';
import { checkForErrorsHandler } from '../utils/errorHandler';
import { handleLoad } from '../utils/loadHandler';

export const configureEventStore = (preloadedState?: any) => {
	const store = createStore(
		eventOverviewReducer,
		preloadedState,
		applyMiddleware(thunkMiddleware)
	);

	// TODO: Short-term solution for calling Redux actions outside of React.
	(window as any).store = store;

	store.subscribe(() => checkForErrorsHandler(store.getState, store.dispatch));
	store.subscribe(() => handleLoad(store.getState, store.dispatch));

	return store;
};