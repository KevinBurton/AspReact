import * as React from 'react';
import { connect } from 'react-redux';
import EmployeePicker from './EmployeePicker';
import { Label } from './Form';
import { ApplicationState }  from '../store';
import * as EditorBenchStore from '../store/EditorBench';

export interface EditorBenchProps {
    EditorBench?: Object;
}

const EditorBench = React.createClass<EditorBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'EditorBench',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { EditorBench: action.newObject});)',
            dataDictionary: {
                ID: 0,
                ItemId: 0,
                EmployeeId: 0
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');
    },


    componentDidMount() {

    },

    upsertChange: function (employee: any) {

        this.componentDescriptor.dataDictionary['EmployeeId'] = employee.id;
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['ID'] = this.props.EditorBench.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');

    },

    render() {

        return (
            <div id="EditorBench">
                <div className="form-group">
                    <Label id="EditorBench_Label" text="EDITOR  " required={this.props.EditorBench.EmployeeId.IsRequired} />
                    <div>
                        <EmployeePicker id={"addEditorsEmployeePicker"}
				                        buttonText="Update"
				                        onSelect={(employee) => this.upsertChange(employee) }
                            isEnabled={this.props.EditorBench.EmployeeId.IsEnabled}/>
                    </div>
                    {this.props.EditorBench.ID.Value != '0' ?
                    <div className="table-responsive">
                        <table className="table table-condensed">
                            <tbody>
                                <tr >
                                    <td  className="text-middle" >
                                        {this.props.EditorBench.FullName.Value} ({this.props.EditorBench.EmployeeId.Value})
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        : <div></div>}
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state: any) => {
    if (!state.EditorBench) {
        const { itemId } = state;
        return {
            itemId: state.itemId,
            EditorBench:
                {
                    ID: { Value: '0' },
                    EmployeeId: { Value: '0', IsRequired: false },
                    FullName: { Value: '' }
                }
        };
    }

    return {
        itemId: state.itemId,
        EditorBench: state.EditorBench
    };
};

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.editorBench, // Selects which state properties are merged into the component's props
  EditorBenchStore.actionCreators                 // Selects which action creators are merged into the component's props
)(EditorBench) as typeof EditorBench;

