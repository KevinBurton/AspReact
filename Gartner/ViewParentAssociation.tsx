﻿import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { configureGenericStore } from './store/configureGenericStore';

import { ViewParentAssociationContainer } from './components/ViewParentAssociation';


const store = configureGenericStore();




render(

    <div>
        <Provider store={store}>
            <ViewParentAssociationContainer />
        </Provider>
        
    </div>,
    document.getElementById('ViewParentAssociation')
);
