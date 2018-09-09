import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import * as ajax from '../utils/ajax';

let fileSrc;
const urlStr = window.location.href;
const itemId = urlStr.substring(urlStr.lastIndexOf('/') + 1);

ajax.get<any>('/api/GenericDataHandler/GetSessionFileSrc/?id=' + itemId)
    .then((fileSrcUrl) => {
        console.log('fileSrcUrl: ', fileSrcUrl);
        fileSrc = fileSrcUrl;
        setFileSrc(fileSrc);
    })
    .fail(() => {
        console.log('Failed to retrieve file source URL');
    });

function setFileSrc(url) {
    var ele = document.getElementById("fileDetails");
    if(ele) ele.setAttribute("src", url);
}

enum SfdType {
    List,
    Content
}

export interface SessionFileDetailsProps {
    SessionFileDetail: any;
    sfdType: string;
}

export const HlcSessionFileDetailsComponent = React.createClass<SessionFileDetailsProps, any>({
    componentWillMount() {
        if (this.props.sfdType === 'List') {

            this.componentDescriptor = {
                name: 'SessionFileDetail',
                returnObjectIndexed: true,
                stateFunction:
                    '(objectAssign.default({}, state, { SessionFileDetail: action.newObject});)',
                dataDictionary: {
                    ItemId: itemId
                }
            }
            this.props.componentData(this.componentDescriptor, 'GetData');
        }
    },

    render() {
        var isEnabled = this.props.SessionFileDetail ? this.props.SessionFileDetail.ItemId.IsEnabled : false;
        return (
            this.props.sfdType === 'List' && isEnabled ?
                <li role="presentation" >
                    <a id="allFilesTab" href="#files2" data-toggle="tab">
                        All Session Files
                    </a>
                </li>
                : this.props.sfdType === 'List' ? <li display='none'></li>
                    : this.props.sfdType === 'Content' && isEnabled ?
                        <div role="tabpanel" className="tab-pane fade" id="files2">
                            <div className="intrinsic-container intrinsic-container-16x9">
                                <iframe className="embed-responsive-item" id="fileDetails" name="iframe1" height="900" width="1100" scrolling="auto" src=""></iframe>
                            </div>
                            </div> : <div id="files2" display='none'></div>
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

                }
            }
        };
    }

    return {
        itemId: state.itemId,
        SessionFileDetail: state.SessionFileDetail
    };
};

export const HlcSessionFileDetailsContainer =
    connect(
        mapStateToProps,
        actions
    )(HlcSessionFileDetailsComponent as React.ClassicComponentClass<any>);

export default HlcSessionFileDetailsComponent;



