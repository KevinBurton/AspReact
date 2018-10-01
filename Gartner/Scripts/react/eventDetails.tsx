import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { configureEventStore } from './store/configureEventStore';
import { getEventOverview } from './actions/eventOverviewActions';
import EventOverviewContainer from './containers/EventOverviewContainer';

const store = configureEventStore();

getEventOverview()(store.dispatch, store.getState);

render(
	<Provider store={store}>
		<EventOverviewContainer />
	</Provider>,
	document.getElementById('eventOverview')
);