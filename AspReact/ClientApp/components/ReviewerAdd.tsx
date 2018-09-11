import * as React from 'react';
import { connect } from 'react-redux';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';

export interface ReviewerAddProps {
    ReviewerAdd?: Object;
}

export const ReviewerAddComponent = React.createClass<ReviewerAddProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'ReviewerAdd',
            returnObjectIndexed: false,
            dataDictionary: {
                ID: '0', ItemId: '', Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: ''
            }
        }


        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentWillUnmount() {


    },

    upsertChange(employee: any) {
        if (employee != '') {

            this.componentDescriptor.dataDictionary["ID"] = 0;
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["Reason"] = 'AddedByUser';
            this.componentDescriptor.dataDictionary["ReviewedByEmployeeId"] = '';
            this.componentDescriptor.dataDictionary["ReviewStatus"] = 'N';
            this.componentDescriptor.dataDictionary["EmployeeId"] = employee.id;
            this.componentDescriptor.dataDictionary["ItemReviewerTypeId"] = '1';

            this.props.componentData(this.componentDescriptor, 'Upsert');

            this.props.eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);

        }
    },


    render() {
        const ReviewerAdd = this.props.ReviewerAdd;

        return (
            <div id="ReviewerAdd">
                <div className="form-group">
                    <Label id="Reviewer_Label" text="ADD PEER REVIEWER(S)  " required={this.props.ReviewerAdd[0].ID.IsRequired} />
                    <div>
                        <EmployeePicker id={"addReviewerEmployeePicker"}
                            buttonText="Add"
                            onSelect={(employee) => this.upsertChange(employee) }
                            isEnabled={this.props.ReviewerAdd[0].EmployeeId.IsEnabled}/>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ReviewerAdd) {
        const { itemId } = state;
        return {
            eventEmitter: state.eventEmitter,
            itemId: state.itemId,
            ReviewerAdd: [{

                ID: { Value: '' }
                , ReviewedByEmployeeId: { Value: '' }
                , ReviewStatus: { Value: '' }
                , EmployeeId: { Value: '' }
                , FullName: { Value: '' }
                , VendorName: { Value: '' }
                , DelegateNames: { Value: '' }
                , DelegateEmails: { Value: '' }
                , Description: { Value: '' }
                , ItemReviewerTypeId: { Value: '' }
                , ActionButton: { Value: '' }
            }]
        };
    }

    return {
        eventEmitter: state.eventEmitter,
        itemId: state.itemId,
        ReviewerAdd: state.ReviewerAdd
    };
};

export const ReviewerAddContainer =
    connect(
        mapStateToProps,
        actions
    )(ReviewerAddComponent) as React.ClassicComponentClass<any>;


export default ReviewerAddComponent;

