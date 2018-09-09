﻿import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import { ApplicationState }  from '../store';
import * as ViewParentAssociationItemWorkFlowStageStore from '../store/ViewParentAssociationItemWorkFlowStage';

export interface ViewParentAssociationItemWorkFlowStageProps {
    SessionFileDetail?: Object;
    componentDescriptor?: ComponentDescriptor;
}


export const ViewParentAssociationItemWorkFlowStage = React.createClass<ViewParentAssociationItemWorkFlowStageProps, any>({
    componentWillMount() {

        this.componentDescriptor = {
            name: 'SessionFileDetail',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { SessionFileDetail: action.newObject});)',
            dataDictionary: {
                ItemId: ''
            }
        }

        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        // this.componentDescriptor.dataDictionary['EventTemplateDownload'] = this.props.SessionFileDetail.EventTemplateDownload;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },
    render() {
        var eventTemplateUrl = this.props.SessionFileDetail != null ? this.props.SessionFileDetail.EventTemplateDownload.DefaultValue : '';
        return (
            <a href={eventTemplateUrl}
                id="DownloadTemplate"
                className="btn btn-primary btn-sm btn-block">Download Template</a>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.SessionCategory) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            SessionFileDetail: {
                ItemId: {
                    Value: itemId,
                    IsEnabled: true
                },
                EventTemplateDownload: { Value: '', DefaultValue: '' }
            }
        };
    }

    return {
        itemId: state.itemId,
        SessionFileDetail: state.SessionFileDetail
    };
};

export default connect(
  (state: ApplicationState) => state.viewParentAssociationItemWorkFlowStage, // Selects which state properties are merged into the component's props
  ViewParentAssociationItemWorkFlowStageStore.actionCreators                 // Selects which action creators are merged into the component's props
)(ViewParentAssociationItemWorkFlowStage) as typeof ViewParentAssociationItemWorkFlowStage;
;
