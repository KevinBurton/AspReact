﻿import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
﻿import { HlcItemHistoryContainer } from './components/HlcItemHistory';
import { configureGenericStore } from './store/configureGenericStore';


﻿const store = configureGenericStore();



render(

    <div>
        <Provider store={store}>
            <HlcItemHistoryContainer />
        </Provider>
    </div>,
    document.getElementById('HLC_History_Page')
);
