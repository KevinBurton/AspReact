import * as React from 'react';
import { connect } from 'react-redux';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';
import objectAssign from '../utils/objectAssign';
import { ApplicationState }  from '../store';
import * as ReviewerBenchStore from '../store/ReviewerBench';

export interface ReviewerBenchProps {
    ReviewerBench?: Object;
}

export const ReviewerBench = React.createClass<ReviewerBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'ReviewerBench',
            returnObjectIndexed: false,
            dataDictionary: {
                ID: '0', ItemId: '', Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: ''
            }
        }


        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');

        const self = this;
        this.props.eventEmitter.addListener('ReviewerRefresh', (itemId: number) => {
            var componentDescriptor = objectAssign({}, self.componentDescriptor, {
                dataDictionary: { ItemId: itemId }
            });
           self.props.componentData(componentDescriptor, 'GetData');
        });

    },
    componentWillUnmount() {
        this.props.eventEmitter.removeListener('ReviewerRefresh');
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

            var self = this;
            this.componentDescriptor.onComponentOperationComplete = () => {
                self.props.eventEmitter.emitEvent('QVRRefresh', [self.props.itemId]);
            };

            this.props.componentData(this.componentDescriptor, 'Upsert');
        }
    },

    toggleReviewComplete(Reviewer: any) {
        if (Reviewer != '') {

            this.componentDescriptor.dataDictionary["ID"] = Reviewer.ID.Value;
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["Reason"] = 'AddedByUser';
            this.componentDescriptor.dataDictionary["ReviewedByEmployeeId"] = 'UseModifiedByUserId';
            this.componentDescriptor.dataDictionary["ReviewStatus"] = Reviewer.ReviewStatus.Value == 'Y' ? 'N' : 'Y';
            this.componentDescriptor.dataDictionary["ReviewTimeUTC"] = Date.now();
            this.componentDescriptor.dataDictionary["EmployeeId"] = Reviewer.EmployeeId.Value;
            this.componentDescriptor.dataDictionary["ItemReviewerTypeId"] = Reviewer.ItemReviewerTypeId.Value;

            var self = this;
            this.componentDescriptor.onComponentOperationComplete = () => {
                self.props.eventEmitter.emitEvent('QVRRefresh', [self.props.itemId]);
            };
            this.props.componentData(this.componentDescriptor, 'Upsert');

        }
    },

    deleteSelected(employee: any) {
        if (employee != '') {

            this.componentDescriptor.dataDictionary["ID"] = employee.ID.Value;
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["EmployeeId"] = employee.EmployeeId.Value;

            var self = this;
            this.componentDescriptor.onComponentOperationComplete = () => {
                self.props.eventEmitter.emitEvent('QVRRefresh', [self.props.itemId]);
            };
            this.props.componentData(this.componentDescriptor, 'Delete');
        }
    },
    getNames: function (DelegateNames: string) {
        return DelegateNames.split(';');

    },

    getEmails: function (DelegateEmails: string) {
        return DelegateEmails.split(';');

    },

    getDelegates: function (Reviewer: any) {
        let names = this.getNames(Reviewer.DelegateNames.Value);
        let emails = this.getEmails(Reviewer.DelegateEmails.Value);
        let delString = [{
            Email: '',
            Name: ''
        }]

        for (var i = 0; i < names.length; i++) {
            delString.push({ Email: emails[i], Name: names[i] });
        }

        return delString;

    },

    render() {
        const ReviewerBench = this.props.ReviewerBench;
        const getLink = (email: string, itemId: number) => { return `mailto:${email}?subject=Backup Request for CPP ${itemId}&body= ${encodeURIComponent(window.location.href)}`; };



        return (
            <div id="ReviewerBench">
                <div className="form-group">
                    <Label id="Reviewer_Label" text="REVIEWER(S)  " required={this.props.ReviewerBench[0].ID.IsRequired} />
                    <div>
                        <EmployeePicker id={"addReviewerEmployeePicker"}
                                        buttonText="Add"
                                        onSelect={(employee) => this.upsertChange(employee) }
                                        isEnabled={this.props.ReviewerBench[0].EmployeeId.IsEnabled}/>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-condensed ">
                            <tbody>

                                {ReviewerBench[0].ID.Value != '0' ?

                                    ReviewerBench.sort((a, b) => {
                                        var nameA = a.FullName.Value.toUpperCase();
                                        var nameB = b.FullName.Value.toUpperCase();
                                        if (nameA < nameB) {
                                            return -1;
                                        } else if (nameA > nameB) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    })
                                        .filter((Reviewer: any) => { return Reviewer.ItemReviewerTypeId.Value == '2' && Reviewer.ReviewStatus.Value == 'N'; })
                                        .map((Reviewer: any) => (
                                            <tr  key={Reviewer.ID.Value}>
                                                <td  className="text-middle" width="50%" >
                                                    {Reviewer.FullName.Value} ({Reviewer.Description.Value})
                                                </td>
                                                {Reviewer.ActionButton.DefaultValue == 'Mandatory Review' ?
                                                    <td className="text-middle" width="50%">

                                                        <button type="button"
                                                            className="btn btn-xs btn-custom btn-secondary btn-hlc"
                                                            onClick={() => this.toggleReviewComplete(Reviewer) }
                                                            disabled={!Reviewer.ActionButton.IsEnabled}> Click to Complete
                                                        </button>

                                                    </td>
                                                    :
                                                    <td></td>}
                                            </tr>
                                        )
                                        )
                                    : <tr></tr>
                                }
                            </tbody>
                        </table>
                        <div className="table-responsive">
                            <table className="table table-condensed">
                                <tbody>

                                    {ReviewerBench[0].ID.Value != '' ?

                                        ReviewerBench.sort((a, b) => {
                                            var nameA = a.FullName.Value.toUpperCase();
                                            var nameB = b.FullName.Value.toUpperCase();
                                            if (nameA < nameB) {
                                                return -1;
                                            } else if (nameA > nameB) {
                                                return 1;
                                            } else {
                                                return 0;
                                            }
                                        })
                                            .filter((Reviewer:any) => { return Reviewer.ItemReviewerTypeId.Value == '2' && Reviewer.ReviewStatus.Value == 'Y'; })
                                            .map((Reviewer: any) => (
                                                <tr  key={Reviewer.ID.Value}>
                                                    <td className="text-middle" width="50%">
                                                        {Reviewer.FullName.Value} ({Reviewer.Description.Value})
                                                    </td>
                                                    {Reviewer.ActionButton.DefaultValue == 'Mandatory Review' ?
                                                        <td className="text-middle" width="50%">
                                                            <button type="button"
                                                                className="btn btn-xs btn-custom btn-secondary btn-hlc"
                                                                onClick={() => this.toggleReviewComplete(Reviewer) }
                                                                disabled={!Reviewer.ActionButton.IsEnabled}> Completed
                                                            </button>

                                                        </td>
                                                        :
                                                        <td></td>}
                                                </tr>
                                            )
                                            )
                                        : <tr></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="table-responsive">
                        <table className="table table-condensed">
                            <tbody>

                            {ReviewerBench[0].ID.Value != '0' ?

                                    ReviewerBench.sort((a, b) => {
                                        var nameA = a.FullName.Value.toUpperCase();
                                        var nameB = b.FullName.Value.toUpperCase();
                                        if (nameA < nameB) {
                                            return -1;
                                        } else if (nameA > nameB) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    })
                                        .filter((Reviewer:any) => { return Reviewer.ItemReviewerTypeId.Value == '1' && Reviewer.ReviewStatus.Value == 'N'; })
                                        .map((Reviewer: any) => (
                                            <tr  key={Reviewer.ID.Value}>
                                                <td  className="text-middle" width="50%" >
                                                    {Reviewer.FullName.Value} ({Reviewer.Description.Value})
                                                </td>
                                                {Reviewer.ActionButton.DefaultValue == 'Peer Review' ?
                                                    <td className="text-middle" width="50%">

                                                        <button type="button"
                                                            className="btn btn-xs btn-custom btn-secondary btn-hlc"
                                                            onClick={() => this.toggleReviewComplete(Reviewer) }
                                                            disabled={!Reviewer.ActionButton.IsEnabled}> Click to Complete
                                                        </button>

                                                        <button type="button"
                                                            className="btn btn-xs btn-custom delete-button"
                                                            onClick={() => this.deleteSelected(Reviewer) }
                                                            disabled={false}>
                                                            <span className="icon-trash">
                                                            </span>
                                                        </button>
                                                    </td>
                                                    :
                                                    <td></td>}
                                            </tr>
                                        )
                                        )
                                    : <tr></tr>
                                }
                            </tbody>
                        </table>
                        <div className="table-responsive">
                            <table className="table table-condensed">
                                <tbody>

                                {ReviewerBench[0].ID.Value != '' ?

                                        ReviewerBench.sort((a, b) => {
                                            var nameA = a.FullName.Value.toUpperCase();
                                            var nameB = b.FullName.Value.toUpperCase();
                                            if (nameA < nameB) {
                                                return -1;
                                            } else if (nameA > nameB) {
                                                return 1;
                                            } else {
                                                return 0;
                                            }
                                        })
                                            .filter((Reviewer:any) => { return Reviewer.ItemReviewerTypeId.Value == '1' && Reviewer.ReviewStatus.Value == 'Y'; })
                                            .map((Reviewer: any) => (
                                                <tr  key={Reviewer.ID.Value}>
                                                    <td className="text-middle">
                                                        {Reviewer.FullName.Value} ({Reviewer.Description.Value})
                                                    </td>
                                                    {Reviewer.ActionButton.DefaultValue == 'Peer Review' ?
                                                        <td className="text-middle" width="50%">
                                                            <button type="button"
                                                                className="btn btn-xs btn-custom btn-secondary btn-hlc"
                                                                onClick={() => this.toggleReviewComplete(Reviewer) }
                                                                disabled={!Reviewer.ActionButton.IsEnabled}> Completed
                                                            </button>

                                                            <button type="button"
                                                                className="btn btn-xs btn-custom delete-button"
                                                                onClick={() => this.deleteSelected(Reviewer) }
                                                                disabled={false}>
                                                                <span className="icon-trash">
                                                                </span>
                                                            </button>
                                                        </td>
                                                        :
                                                        <td></td>}
                                                </tr>
                                            )
                                            )
                                        : <tr></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state:any) => {
    if (!state.ReviewerBench) {
        const { itemId } = state;
        return {
            eventEmitter: state.eventEmitter,
            itemId: state.itemId,
            ReviewerBench: [{
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
        ReviewerBench: state.ReviewerBench
    };
};

export default connect(
  (state: ApplicationState) => state.reviewerBench, // Selects which state properties are merged into the component's props
  ReviewerBenchStore.actionCreators                 // Selects which action creators are merged into the component's props
)(ReviewerBench) as typeof ReviewerBench;


