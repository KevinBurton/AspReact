import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { configureGenericStore } from './store/configureGenericStore';

import GenericContainer from './containers/GenericContainer';

import { TitleDescriptionContainer } from './components/TitleDescription';
import { DescriptionFieldContainer } from './components/DescriptionField';
import { SessionCategoryContainer } from './components/SessionCategory';
import { PrimaryAgendaContainer } from './components/PrimaryAgenda';
import { PrimaryOwnerContainer } from './components/PrimaryOwner';
import { ReadyForUseDateContainer } from './components/ReadyForUseDate';
import { CreateNewNextButtonContainer } from './components/CreateNewNextButton';
import { SpeakerBenchContainer } from './components/SpeakerBench';
import { CreateNewCancelContainer } from './components/CreateNewCancelButton';

const store = configureGenericStore();



render(

    <div>
        <Provider store={store}>
            <TitleDescriptionContainer />
        </Provider>
        <Provider store={store}>
            <DescriptionFieldContainer />
        </Provider>
        <Provider store={store}>
            <SessionCategoryContainer />
        </Provider>
        <Provider store={store}>
            <PrimaryAgendaContainer />
        </Provider>
        <Provider store={store}>
            <PrimaryOwnerContainer />
        </Provider>
        <Provider store={store}>
            <ReadyForUseDateContainer />
        </Provider>
        <Provider store={store}>
            <SpeakerBenchContainer />
        </Provider>
        <Provider store={store}>
            <CreateNewCancelContainer />
        </Provider>
        <Provider store={store}>
            <CreateNewNextButtonContainer />
        </Provider>
    </div>,
    document.getElementById('HLC_Page')
   

);
