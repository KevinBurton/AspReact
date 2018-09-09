import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import CheckBox from './Checkbox';
import CheckList from './CheckList';
import CheckListRow from './CheckListRow';

interface PQFModalState {
    reviewApproved: boolean;
};

export interface PQFModalProps {

    hlcItemStatusDate: Object;
    hlcItemStatusDateProps: Object;
    hlcItemStatusDateComponentDescriptor: ComponentDescriptor;
    reviewApproved: boolean;
}


export const PQFModalComponent = React.createClass<PQFModalProps, PQFModalState>({

    getInitialState() {
        return {
            reviewApproved: false
        };
    },

    componentWillMount() {
        
    },

    onReviewApproved() {
        this.setState({
            reviewApproved: !this.state.reviewApproved
        });
    },

    upsertChange: function (e) {

        if (this.state.reviewApproved) {
            let formattedDate = new Intl.DateTimeFormat('en-GB',
            {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }).format(new Date());

            var hlcItemStatusDate = this.props.hlcItemStatusDate;

            this.props.hlcItemStatusDateComponentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
            this.props.hlcItemStatusDateComponentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
            this.props.hlcItemStatusDateComponentDescriptor
                .dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
            this.props.hlcItemStatusDateComponentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
            this.props.hlcItemStatusDateComponentDescriptor
                .dataDictionary['ItemStatusDateTypeId'] = '3'; //Actual End Date 
            this.props.hlcItemStatusDateComponentDescriptor.dataDictionary['DateValue'] = formattedDate;
            this.props.hlcItemStatusDateComponentDescriptor.dataDictionary["ItemId"] = hlcItemStatusDate.ItemId.Value;
            this.props.hlcItemStatusDateProps.componentData(this.props.hlcItemStatusDateComponentDescriptor, 'Promote');

            this.props.hlcItemStatusDateProps.eventEmitter
                .emitEvent('ItemStatusDatesRefresh', [hlcItemStatusDate.ItemId.Value]);
        }
    },

    render() {

        return (
            <div>
                <a href="#" id="showPQFModal" data-toggle="modal" hidden={true} data-target="#PQFPopUp"></a>
                <div className="modal fade" id="PQFPopUp" tabIndex={-1} role="dialog" aria-hidden="false">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Presentation Quality Framework</h4>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Team Manager, please review the Presentation Quality Framework below and ensure that the associated presentation
                                    and/or other deliverables meets the quality standards that you and the authors are expected to maintain for all
                                    content.
                                </p>

                                <CheckList title={'Structure'}>
                                    <CheckListRow>Overall structure promotes the storyline and leads to relevant actions.</CheckListRow>
                                    <CheckListRow>Presentation has a good balance of content types including text, charts, and compelling visuals.</CheckListRow>
                                </CheckList>
                                <CheckList title={'Content'}>
                                    <CheckListRow>Content on slides is consistent with title and description for presentation (if not, please have the analyst update the title & description).</CheckListRow>
                                    <CheckListRow>
                                        Fact-based evidence (GEAR, Primary/Secondary research, vendor information) is used appropriately and
                                        adheres to <a href= "http://intranet.gartner.com/research/creatingresearch/fbr/index.html"
                                            target="_blank" style={{ color: "#067b9c", textDecoration: "none" }}>usage guidance</a>.
                                    </CheckListRow>
                                </CheckList>
                                <CheckList title={'Execution'}>
                                    <CheckListRow>Content can be delivered within the allocated time.</CheckListRow>
                                    <CheckListRow>Content layout is legible and uncluttered.</CheckListRow>
                                </CheckList>
                                <CheckList title={'Brand'}>
                                    <CheckListRow>Presentation follows Gartner Research presentation template and size.</CheckListRow>
                                    <CheckListRow>Visuals are aligned to the Gartner brand guidelines.</CheckListRow>
                                </CheckList>
                                <CheckList title={'Visuals'}>
                                    <CheckListRow>Visuals are relevant to, and enhance the content being presented.</CheckListRow>
                                    <CheckListRow>Visuals are consistent to each other and from slide to slide.</CheckListRow>
                                </CheckList>
                                <CheckList title={'Context'}>
                                    <CheckListRow>Third-party content including visuals are free from any copyright restrictions.</CheckListRow>
                                    <CheckListRow>Slide content is presented in a universally understood context.</CheckListRow>
                                </CheckList>

                                <div className="form-group" >
                                    <CheckBox
                                        noForm={true}
                                        isChecked={ this.state.reviewApproved }
                                        onChange= { this.onReviewApproved }>
                                        I have reviewed per the above and approve this content to move forward in the workflow.
                                    </CheckBox>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" id="btnFinalManagementReviewCancel" className="btn btn-default" data-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="button" id="btnFinalManagementReviewOk" className="btn btn-primary" data-dismiss="modal" onClick={this.upsertChange} >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state) {
        const { itemId } = state;

        return {
            itemId: state.itemId, 
            reviewApproved: state.reviewApproved
        };
    }

    return {
        itemId: state.itemId, 
        reviewApproved: state.reviewApproved
    };
};

export const PQFModalContainer =
    connect(
        mapStateToProps,
        actions
    )(PQFModalComponent as React.ClassicComponentClass<any>);


export default PQFModalComponent;



