import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/genericActions';
import { connect } from 'react-redux';
import { Input, FormGroup, TextArea, Label } from './Form';
import { ComponentDescriptor } from '../models/generic';

import { ViewParentAssociationOwnersContainer } from './ViewParentAssociationOwners';
import { ViewParentAssociationSpeakersContainer } from './ViewParentAssociationSpeakers';
import { ViewParentAssociationItemWorkFlowStageContainer } from './ViewParentAssociationItemWorkFlowStage';

export interface ViewParentAssociationProps {
    ViewParentAssociation: Object;
    componentDescriptor: ComponentDescriptor;
}

export const ViewParentAssociationComponent = React.createClass<ViewParentAssociationProps, any>({
    componentWillMount() {

        this.componentDescriptor = {
            name: "ViewParentAssociation",
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { ViewParentAssociation: action.newObject[0]});)',
            dataDictionary: {
                ItemId: '', 
                ID: ''
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');
       
    },

    render() {

        const urlItemDetails = window.location.origin + "/HighLeverageContent/Details/" + this.props.itemId;

        return (
            <div id="viewParentAssociation">
                <div className="portlet-body">
                    <div className="tree well">
                        <ul>
                            <li>
                                <span>
                                    <div className="portlet none">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <h3><a id="ViewParentAssociation_Label"  href = {urlItemDetails}>{this.props.ViewParentAssociation.Title.Value} ({this.props.ViewParentAssociation.ID.Value}) </a></h3>
                                                <span>  </span>
                                                <div><ViewParentAssociationOwnersContainer /></div>
                                                <div><ViewParentAssociationSpeakersContainer /></div>
                                                <div><ViewParentAssociationItemWorkFlowStageContainer /></div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ViewParentAssociation) {

        const { itemId } = state;
       
        return {
            itemId: state.itemId,
            ViewParentAssociation: {
                ID: {
                    Value: ''
                },
                ItemId: {
                    Value: itemId
                },
                Title: {
                    Value: ''
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        ViewParentAssociation: state.ViewParentAssociation
    };
};

export const ViewParentAssociationContainer =
    connect(
        mapStateToProps,
        actions
    )(ViewParentAssociationComponent as React.ClassicComponentClass<any>);


export default ViewParentAssociationComponent;


