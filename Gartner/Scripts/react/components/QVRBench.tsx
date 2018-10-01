import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import ComboBox from './kendo/ComboBox';
import HelpButton from './HelpButton';
import { Input, FormGroup, TextArea, Label } from './Form';
import { UserDelegatesContainer }  from './UserDelegates';
import EmployeePicker from './EmployeePicker';
import { SetComponentDescriptorRefresh } from '../utils/eventEmitter';
import CheckBox from './CheckBox';
import { ReviewerAddContainer } from './ReviewerAdd';
import Rating from './QVR/Rating';

export interface QVRBenchProps {
    getComponentData: (component: Object) => void;
    QVRBench: Object;
    componentDescriptor: ComponentDescriptor;
    updateState: Function;
    QVRBenchRefresh: () => void;
}




export const QVRBenchComponent = React.createClass<QVRBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'QVRBench',
            returnObjectIndexed: false,
            dataDictionary: {
                ID: '0', ItemId: '', Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: '', 
                Rating: '', QvrReasonId: '', Name: '', QvrComment: '', QvrId: ''
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
            this.props.eventEmitter.emitEvent("ReviewerRefresh", [this.props.itemId]);

        }
    },

    upsertRatingChange(Reviewer: any, rating: any) {
        if (Reviewer != '' && rating > 2) {

            this.componentDescriptor.dataDictionary["ID"] = Reviewer.ID.Value;
            this.componentDescriptor.dataDictionary["QvrId"] = Reviewer.ID.Value;
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["Rating"] = rating.toString();
            this.componentDescriptor.dataDictionary["EmployeeId"] = Reviewer.EmployeeId.Value;

            this.props.componentData(this.componentDescriptor, 'Upsert');

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
        const QVRBench = this.props.QVRBench;

        return (
            <div id="QVRBench">
                <div className="form-group">
                    <div>
                        <ReviewerAddContainer/>
                    </div>
                  
                    <div>
                        <p>Rate your reviewers by selecting 1-5 stars.</p>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-condensed ">
                            <tbody>

                                {QVRBench[0].ID.Value != '' ?

                                    QVRBench.sort((a, b) => {
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
                                        .map((Reviewer: any) => (
                                            <tr  key={Reviewer.ID.Value}>
                                                <td  className="text-middle" >
                                                    {Reviewer.FullName.Value} ({Reviewer.Description.Value})
                                                </td>
                                                <div className="rating">
                                                    <Rating
                                                        rating={Reviewer.Rating.Value != "" ? Reviewer.Rating.Value : undefined}
                                                        isDisabled={!Reviewer.Rating.IsEnabled}
                                                        onSelected={(rating: number) => this.upsertRatingChange(Reviewer, rating) }
                                                        />
                                                </div>
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
        );
    }
});



const mapStateToProps = (state) => {
    if (!state.QVRBench) {
        const { itemId } = state;
        return {
            eventEmitter: state.eventEmitter,
            itemId: state.itemId,
            QVRBench: [{

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
                , Name: { Value: '' }
                , Rating: { Value: '' }
                , QvrReason: { Value: '' }
                , QvrComment: { Value: '' }
                , QvrId: { Value: '' }
            }]
        };
    }

    return {
        eventEmitter: state.eventEmitter,
        itemId: state.itemId,
        QVRBench: state.QVRBench
    };
};

export const QVRBenchContainer =
    connect(
        mapStateToProps,
        actions
    )(QVRBenchComponent) as React.ClassicComponentClass<any>;


export default QVRBenchComponent;

