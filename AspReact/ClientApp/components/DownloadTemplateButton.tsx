﻿import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor, IOption } from '../models/generic';
import { ApplicationState }  from '../store';
import { DownloadTemplateButtonState, actionCreators } from '../store/DownloadTemplateButton';

type DownloadTemplateButtonProps = DownloadTemplateButtonState;

class DownloadTemplateButton extends React.Component<DownloadTemplateButtonProps, any> {
  componentDescriptor: ComponentDescriptor;
  constructor(props: any) {
      super(props);
      this.componentDescriptor = {
          name: 'DownloadTemplateButton',
          returnObjectType: '',
          returnObjectIndexed: false,
          stateFunction:
          '(objectAssign.default({}, state, { DownloadTemplateButton: action.newObject});)',
          onComponentOperationComplete: () => {},
          dataDictionary: {
              ID: 0,
              ItemId: 0,
              VendorId: 0
          }
      };
      // Bindings
  }
  componentWillMount() {
        this.componentDescriptor = {
            name: 'DownloadTemplateButton',
            returnObjectType: '',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { SessionFileDetail: action.newObject});)',
            onComponentOperationComplete: () => {},
            dataDictionary: {
                ItemId: ''
            }
        }

        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['EventTemplateDownload'] = this.props.SessionFileDetail ? this.props.SessionFileDetail.EventTemplateDownload : '';
        //this.props.componentData(this.componentDescriptor, 'GetData');

    }
    render() {
        var eventTemplateUrl = this.props.SessionFileDetail ? this.props.SessionFileDetail.EventTemplateDownload.DefaultValue : '';
        return (
            <a href={eventTemplateUrl}
                id="DownloadTemplate"
                className="btn btn-primary btn-sm btn-block">Download Template</a>
        );
    }
}

export default connect(
  (state: ApplicationState) => state.downloadTemplateButton, // Selects which state properties are merged into the component's props
  actionCreators                                             // Selects which action creators are merged into the component's props
)(DownloadTemplateButton) as typeof DownloadTemplateButton;
