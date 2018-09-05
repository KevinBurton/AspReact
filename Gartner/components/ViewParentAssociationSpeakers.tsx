import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/genericActions';
import { connect } from 'react-redux';
import { Input, FormGroup, TextArea, Label } from './Form';
import { ComponentDescriptor } from '../models/generic';


export interface ViewParentAssociationSpeakersProps {
    ViewParentAssociationSpeakers: Object;
    componentDescriptor: ComponentDescriptor;
    getNamesList: () => String;
}

export const ViewParentAssociationSpeakersComponent = React.createClass<ViewParentAssociationSpeakersProps, any>({
        componentWillMount() {

            this.componentDescriptor = {
                name: "ViewParentAssociationSpeakers",
                returnObjectIndexed: false,
                stateFunction:
                    '(objectAssign.default({}, state, { ViewParentAssociationSpeakers: action.newObject[0]});)',
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
            this.props.ViewParentAssociationSpeakers.map((Speaker: any) => (
                    namesList = namesList + Speaker.FullName.Value + ', '
            ));
            namesList = namesList.substr(0, namesList.length - 2);
            return namesList;
        },


    render() {

        return (
            <div id="ViewParentAssociationSpeakers">
                <div className="portlet-body">
                    <div className="show-details">
                        <div className="list-unstyled list-inline">
                            <strong>Speaker(s)      </strong>{this.getNamesList()}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ViewParentAssociationSpeakers) {

        const { itemId } = state;

        return {
            itemId: state.itemId,

            ViewParentAssociationSpeakers: [
                {
                    ID: { Value: '0' },
                    EmployeeId: { Value: '0' },
                    FullName: { Value: '' }
                }]
        };
    }
   

    return {
        itemId: state.itemId,
        ViewParentAssociationSpeakers: state.ViewParentAssociationSpeakers
    };
};

export const ViewParentAssociationSpeakersContainer =
    connect(
        mapStateToProps,
        actions
    )(ViewParentAssociationSpeakersComponent as React.ClassicComponentClass<any>);


export default ViewParentAssociationSpeakersComponent;


