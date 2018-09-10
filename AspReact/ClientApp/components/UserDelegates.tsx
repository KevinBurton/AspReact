import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { Input, FormGroup, TextArea, Label } from './Form';
import { ComponentDescriptor } from '../models/generic';


export interface UserDelegatesProps {
    UserDelegates?: Object;
    reviewerId: number;
    namesList: string[];
}

export const UserDelegatesComponent = React.createClass<UserDelegatesProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: "UserDelegates",
            returnObjectIndexed: false,
            stateFunction:
                '(objectAssign.default({}, state, { UserDelegates: action.newObject[0][0]});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                EmployeeId: this.props.reviewerId,
                DelegateId: '0',
                DelegateTypeId: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    getNamesList() {

        let namesList = '';
        this.props.UserDelegates.map((UserDelegate: any) => (
            (UserDelegate.DelegateTypeId.Value == 4
                ? namesList = namesList + UserDelegate.FullName.Value + ', '
                : namesList = namesList + '' + ', '
            )
        ));
        namesList = namesList.substr(0, namesList.length - 2);
        return namesList;
    },


    render() {
        return (
            <div id={"UserDelegates" +  this.props.reviewerId} >
                <div className="portlet-body">
                    <div className="show-details">
                        <div className="list-unstyled list-inline">
                            <strong>Backup(s) </strong>{this.getNamesList()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state: any) => {
    if (!state.UserDelegates) {

        const { itemId } = state;

        return {
            itemId: state.itemId,
            UserDelegates: [
                {
                    ID: { Value: '0' },
                    EmployeeId: { Value: '0' },
                    FullName: { Value: '' },
                    DelegateTypeId: { Value: '0' },
                    DelegateId: { Value: '0' }
                }]
        };
    }

    return {
        itemId: state.itemId,
        UserDelegates: state.UserDelegates
    };
};

export const UserDelegatesContainer =
    connect(
        mapStateToProps,
        actions
    )(UserDelegatesComponent as React.ClassicComponentClass<any>);


export default UserDelegatesComponent;


