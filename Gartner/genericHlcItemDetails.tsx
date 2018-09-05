﻿import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { configureGenericStore } from './store/configureGenericStore';

import GenericContainer from './containers/GenericContainer';
import { HlcHeaderComponent } from './components/HlcHeader';
import { HlcBodyComponent } from './components/HlcBody';
import { HlcItemDetailsComponent } from './components/HlcItemDetails';
import { HLCBasicInfoContainer } from './components/HLCBasicInfo';
import { TitleDescriptionContainer } from './components/TitleDescription';
import { HlcItemStatusDatesContainer } from './components/HlcItemStatusDates';

const store = configureGenericStore();




render(

    <div>
        <Provider store={store}>
            <HlcItemDetailsComponent />
        </Provider>
        
    </div>,
    document.getElementById('HLC_Detail_Page')
);
