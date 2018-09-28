import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { HlcSessionFileDetailsState, actionCreators } from '../store/HlcSessionFileDetails';

type HlcSessionFileDetailsProps = HlcSessionFileDetailsState;

class HlcSessionFileDetails extends React.Component<HlcSessionFileDetailsProps, any> {
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
        if (this.props.sfdType === 'List') {
            this.componentDescriptor = {
                name: 'SessionFileDetail',
                returnObjectType: '',
                returnObjectIndexed: true,
                stateFunction:
                    '(objectAssign.default({}, state, { SessionFileDetail: action.newObject});)',
                onComponentOperationComplete: () => {},
                    dataDictionary: {
                    ItemId: this.props.itemId
                }
            }
            // this.props.componentData(this.componentDescriptor, 'GetData');
        }
    }
    render() {
        var isEnabled = this.props.SessionFileDetail.ItemId ? this.props.SessionFileDetail.ItemId.IsEnabled : false;
        return (
            this.props.sfdType === 'List' && isEnabled ?
                <li role="presentation" >
                    <a id="allFilesTab" href="#files2" data-toggle="tab">
                        All Session Files
                    </a>
                </li>
                // https://stackoverflow.com/questions/37728951/how-to-css-displaynone-within-conditional-with-react-jsx
                : this.props.sfdType === 'List' ? <li style={{display: 'none'}}></li>
                    : this.props.sfdType === 'Content' && isEnabled ?
                        <div role="tabpanel" className="tab-pane fade" id="files2">
                            <div className="intrinsic-container intrinsic-container-16x9">
                                <iframe className="embed-responsive-item" id="fileDetails" name="iframe1" height="900" width="1100" scrolling="auto" src=""></iframe>
                            </div>
                            </div> : <div id="files2" style={{display: 'none'}}></div>
        );
    }
}

export default connect(
  (state: ApplicationState) => state.hlcSessionFileDetails, // Selects which state properties are merged into the component's props
  actionCreators                                             // Selects which action creators are merged into the component's props
)(HlcSessionFileDetails) as typeof HlcSessionFileDetails;

