import * as React from 'react';
import { connect } from 'react-redux';
import EmployeePicker from './EmployeePicker';
import { Label } from './Form';
import { ApplicationState }  from '../store';
import * as GraphicDesignerBenchStore from '../store/GraphicDesignerBench';
import componentData from '../utils/componentData';

interface GraphicDesignerBenchProps {
    GraphicDesignerBench?: Object;
}

const GraphicDesignerBench = React.createClass<GraphicDesignerBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'GraphicDesignerBench',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { GraphicDesignerBench: action.newObject});)',
            dataDictionary: {
                ID: 0,
                ItemId: 0,
                EmployeeId: 0
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        componentData(this.componentDescriptor, 'GetData');
    },


    componentDidMount() {

    },

    upsertChange: function (employee: any) {

        this.componentDescriptor.dataDictionary['EmployeeId'] = employee.id;
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        componentData(this.componentDescriptor, 'Upsert');

    },

    removeSelectedGraphicDesigner(GraphicDesigner: any) {

        this.componentDescriptor.dataDictionary['ID'] = GraphicDesigner.ID.Value;
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['EmployeeId'] = GraphicDesigner.EmployeeId.Value;
        componentData(this.componentDescriptor, 'Delete');
    },


    render() {

        const GraphicDesignerList = this.props.GraphicDesignerBench;


        return (
            <div id="GraphicDesignerBench">
                <div className="form-group">
                    <Label id="GraphicDesignerBench_Label" text="GRAPHIC DESIGNER(S)  " required={this.props.GraphicDesignerBench[0].EmployeeId.IsRequired} />
                    <div>
                        <EmployeePicker id={"addGraphicDesignersEmployeePicker" + this.props.EventId}
				                        buttonText="Add"
				                        onSelect={(employee) => this.upsertChange(employee) }
                            isEnabled={this.props.GraphicDesignerBench[0].EmployeeId.IsEnabled}/>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-condensed">
                            <tbody>
                                {GraphicDesignerList[0].ID.Value != '0' ?
                                    GraphicDesignerList.sort((a, b) => {
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
                                    .map((GraphicDesigner: any) => (
                                        <tr  key={GraphicDesigner.ID.Value}>
                                            <td  className="text-middle" width="50%" >
                                                {GraphicDesigner.FullName.Value} ({GraphicDesigner.EmployeeId.Value})
                                            </td>
                                            <td>
                                                <button type="button" width="50%"
                                                    className="btn btn-xs btn-custom delete-button"
                                                    onClick={() => this.removeSelectedGraphicDesigner(GraphicDesigner) }
                                                    disabled={!this.props.GraphicDesignerBench[0].EmployeeId.IsEnabled}>
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
    if (!state.GraphicDesignerBench) {
        const { itemId } = state;
        return {
            itemId: state.itemId,
            GraphicDesignerBench: [
                {
                    ID: { Value: '0' },
                    EmployeeId: { Value: '0' },
                    FullName: { Value: '' }
                }]
        };
    }

    return {
        itemId: state.itemId,
        GraphicDesignerBench: state.GraphicDesignerBench
    };
};

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.graphicDesignerBench, // Selects which state properties are merged into the component's props
  GraphicDesignerBenchStore.actionCreators                 // Selects which action creators are merged into the component's props
)(GraphicDesignerBench) as typeof GraphicDesignerBench;
