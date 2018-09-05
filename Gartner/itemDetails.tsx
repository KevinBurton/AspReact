import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { configureItemDetailsStore } from './store/configureStore';
import { requestItemShared } from './actions/itemSharedActions';
import AddAssociationModalContainer from './containers/AddAssociationModalContainer';
import ChangeAssociationModalContainer from './containers/ChangeAssociationModalContainer';
import CreateSessionFromThisContainer from './containers/CreateSessionFromThisContainer';
import FinalManagementReviewModal from './components/FinalManagementReviewModal';
import KeywordsContainer from './containers/KeywordsContainer';
import PeerReviewFilesContainer from './containers/PeerReviewFilesContainer';
import RelationshipDetailContainer from './containers/RelationshipDetailContainer';
import RemoveAssociationModalContainer from './containers/RemoveAssociationModalContainer';
import ViewBackupsContainer from './containers/ViewBackupsContainer';
import QvrReviewerListContainer from './containers/QvrReviewerListContainer';
import EditSpeakerListContainer from './containers/EditSpeakerListContainer';
import EditExternalSpeakerListContainer from './containers/EditExternalSpeakerListContainer';
import SpeakerManagerContainer from './containers/SpeakerManagerContainer';

const store = configureItemDetailsStore();
requestItemShared()(store.dispatch, store.getState);

render(
	<FinalManagementReviewModal />,
	document.getElementById('finalManagementReviewModalContent')
);

render(
	<Provider store={store}>
		<KeywordsContainer />
	</Provider>,
	document.getElementById('keywords')
);

render(
	<Provider store={store}>
		<CreateSessionFromThisContainer />
	</Provider>,
	document.getElementById('createSessionFromThisModalBody')
);

render(
	<Provider store={store}>
		<AddAssociationModalContainer />
	</Provider>,
	document.getElementById('addAssociationModalBody')
);

render(
	<Provider store={store}>
		<ChangeAssociationModalContainer />
	</Provider>,
	document.getElementById('changeAssociationModalBody')
);

render(
	<Provider store={store}>
		<RemoveAssociationModalContainer />
	</Provider>,
	document.getElementById('removeAssociationModalBody')
);

render(
	<Provider store={store}>
		<RelationshipDetailContainer />
	</Provider>,
	document.getElementById('relationshipDetail')
);

render(
	<div>
		<Provider store={store}>
			<PeerReviewFilesContainer />
		</Provider>
		<Provider store={store}>
			<QvrReviewerListContainer />
		</Provider>
	</div>,
	document.getElementById('peerReviewRightContent')
);

render(
	<Provider store={store}>
		<ViewBackupsContainer />
	</Provider>,
	document.getElementById('viewBackups')
);

render(
    <div>
        <Provider store={store}>
            <SpeakerManagerContainer />
        </Provider>
    </div>,
    document.getElementById('SpeakerManagement')
);
