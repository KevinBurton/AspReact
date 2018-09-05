import * as React from 'react';
import { connect } from 'react-redux';
import { Employee, EmployeeBench } from '../models/employee';
import EmployeePicker from './EmployeePicker';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Label } from './Form';

export interface EditorBenchProps {
    getComponentData: (component: Object) => void;
    componentDescriptor: ComponentDescriptor;
    EditorBench: Object;
}

const EditorBenchComponent = React.createClass<EditorBenchProps, any>({

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

const mapStateToProps = (state) => {
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

export const EditorBenchContainer =
    connect(
        mapStateToProps,
        actions
    )(EditorBenchComponent as React.ClassicComponentClass<any>);

export default EditorBenchComponent;