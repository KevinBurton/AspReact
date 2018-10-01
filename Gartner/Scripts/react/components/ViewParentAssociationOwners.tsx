import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/genericActions';
import { connect } from 'react-redux';
import { Input, FormGroup, TextArea, Label } from './Form';
import { ComponentDescriptor } from '../models/generic';


export interface ViewParentAssociationOwnersProps {
    ViewParentAssociation: Object;
    componentDescriptor: ComponentDescriptor;
}

export const ViewParentAssociationOwnersComponent = React.createClass<ViewParentAssociationOwnersProps, any>({
    componentWillMount() {

        this.componentDescriptor = {
            name: "ViewParentAssociationOwners",
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { ViewParentAssociationOwners: action.newObject[0][0]});)',
            dataDictionary: {
                ID: '0',
                ItemId: '', 
                EmployeeId: ''
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ID;
        this.props.componentData(this.componentDescriptor, 'GetData');
       
    },

    getNamesList() {

        let namesList = '';
        this.props.ViewParentAssociationOwners.map((Owner: any) => (
            (Owner.ItemAuthorTypeId.DefaultValue != null
                ? namesList = namesList + Owner.FullName.Value + Owner.ItemAuthorTypeId.DefaultValue + ', '
                : namesList = namesList + Owner.FullName.Value + ', '
        )
        ));
        namesList = namesList.substr(0, namesList.length - 2);
        return namesList;
    },


    render() {



        return (
            <div id="ViewParentAssociationOwners" >
                <div className="portlet-body">
                    <div className="show-details">
                        <div className="list-unstyled list-inline">
                            <strong>Owner(s)      </strong>{this.getNamesList() }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ViewParentAssociationOwners) {

        const { itemId } = state;
        
        return {
            itemId: state.itemId,
            ViewParentAssociationOwners: [
                {
                    ID: { Value: '0' },
                    EmployeeId: { Value: '0' },
                    FullName: { Value: '' }, 
                    ItemAuthorTypeId: { Value: ''}
                }]
        };
    }

    return {
        itemId: state.itemId,
        ViewParentAssociationOwners: state.ViewParentAssociationOwners
    };
};

export const ViewParentAssociationOwnersContainer =
    connect(
        mapStateToProps,
        actions
    )(ViewParentAssociationOwnersComponent as React.ClassicComponentClass<any>);


export default ViewParentAssociationOwnersComponent;


