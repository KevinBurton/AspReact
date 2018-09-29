
import * as React from 'react';
import { connect } from 'react-redux';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';
import { ApplicationState }  from '../store';
import * as SpeakerBenchStore from '../store/SpeakerBench';
import componentData from '../utils/componentData';

export interface SpeakerBenchProps {
    SpeakerBench?: Object;
}

export const SpeakerBench = React.createClass<SpeakerBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'SpeakerBench',
            returnObjectIndexed: false,
            dataDictionary: {
                ID: '0', ItemId: '', EmployeeId: ''
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        componentData(this.componentDescriptor, 'GetData');

    },

    upsertChange: function (employee: any) {
        if (employee != '') {
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["EmployeeId"] = employee.id;

            componentData(this.componentDescriptor, 'Upsert');
        }
    },

    deleteSelected: function (employee: any) {
        if (employee != '') {
            this.componentDescriptor.dataDictionary["ID"] = employee.ID.Value;
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["EmployeeId"] = employee.EmployeeId.Value;

            componentData(this.componentDescriptor, 'Delete');
        }
    },

    render() {
        const SpeakerBench = this.props.SpeakerBench;
        return (
            <div id="SpeakerBench">
                <div className="form-group">
                    <Label id="SpeakerBench_Label" text="SPEAKER BENCH  " required={this.props.SpeakerBench[0].EmployeeId.IsRequired} />
                    <div>
                        <EmployeePicker id={"addSpeakersEmployeePicker" + this.props.EventId}
				                        buttonText="Add"
                            onSelect={(employee) => this.upsertChange(employee) }
                            isEnabled={this.props.SpeakerBench[0].EmployeeId.IsEnabled}/>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-condensed">
                            <tbody>
                                {SpeakerBench[0].ID.Value != '0' ?
                                    SpeakerBench.sort((a: any, b: any) => {
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
                                    .map((Speaker: any) => (
                                        <tr  key={Speaker.ID.Value}>
                                            <td  className="text-middle" width="50%">
                                                {Speaker.FullName.Value} ({Speaker.EmployeeId.Value})
                                            </td>
                                            <td>
                                                <button type="button" width="50%"
                                                    className="btn btn-xs btn-custom delete-button"
                                                    onClick={() => this.deleteSelected(Speaker) }
                                                    disabled={!this.props.SpeakerBench[0].EmployeeId.IsEnabled}>
                                                    <span className="icon-trash">
                                                    </span></button>
                                            </td>
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

const mapStateToProps = (state: any) => {
    if (!state.SpeakerBench) {
        return {
            itemId: state.itemId,
            SpeakerBench: [{

                ID: { Value: '' }
                , EmployeeId: { Value: '' }
                , FullName: { Value: '' }

            }]
        };
    }

    return {
        itemId: state.itemId,
        SpeakerBench: state.SpeakerBench
    };
};

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.speakerBench, // Selects which state properties are merged into the component's props
  SpeakerBenchStore.actionCreators                 // Selects which action creators are merged into the component's props
)(SpeakerBench) as typeof SpeakerBench;
