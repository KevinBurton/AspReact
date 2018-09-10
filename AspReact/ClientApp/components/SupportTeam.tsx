import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';

import { GraphicDesignerBenchContainer } from './GraphicDesignerBench';
import { EditorBenchContainer } from './EditorBench';

import { ApplicationState }  from '../store';
import * as SupportTeamStore from '../store/SupportTeam';

export interface SupportTeamProps {
    SupportTeam?: Object;
}

export const SupportTeam = React.createClass<SupportTeamProps, any>({

    render() {

        return (
            <div >
                <div>

                    <GraphicDesignerBenchContainer />
                    <EditorBenchContainer />

                </div>
            </div>
        );
    }
});

const mapStateToProps = (state: any) => {
    if (!state.SupportTeam) {
        const { itemId } = state;
        return {
            itemId: state.itemId

        };
    }

    return {
        itemId: state.itemId
    };
};

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.supportTeam, // Selects which state properties are merged into the component's props
  SupportTeamStore.actionCreators                 // Selects which action creators are merged into the component's props
)(SupportTeam) as typeof SupportTeam;


