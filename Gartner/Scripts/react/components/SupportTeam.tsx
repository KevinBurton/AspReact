import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';

import { GraphicDesignerBenchContainer } from './GraphicDesignerBench';
import { EditorBenchContainer } from './EditorBench';

export interface SupportTeamProps {
    SupportTeam: Object;
}

export const SupportTeamComponent = React.createClass<SupportTeamProps, any>({

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

const mapStateToProps = (state) => {
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

export const SupportTeamContainer =
    connect(
        mapStateToProps,
        actions
    )(SupportTeamComponent as React.ClassicComponentClass<any>);

export default SupportTeamComponent;


