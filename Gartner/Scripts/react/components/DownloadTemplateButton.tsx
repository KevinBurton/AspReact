﻿import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';

export interface DownloadTemplateButtonProps {
    SessionFileDetail?: Object;
    componentDescriptor?: ComponentDescriptor;
}


export const DownloadTemplateButton = React.createClass<DownloadTemplateButtonProps, any>({
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

export const DownloadTemplateButtonContainer =
    connect(
        mapStateToProps,
        actions
    )(DownloadTemplateButton as React.ClassicComponentClass<any>);

export default DownloadTemplateButton;