import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import HelpButton from './HelpButton';
const primaryOwnerHelpText = "A Primary Owner is required to create and idea or submit a session. Primary Owner defaults to the user that is entering the data. You can start typing in any Gartner employee name and the system will find them. The employee code is shown in case there are close names and the associate directory needs to be referenced.";
import { Label }  from './Form';
import ComboBox from './kendo/ComboBox';

export interface PrimaryOwnerProps {

    getComponentData: (component: Object) => void;
    PrimaryOwner: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    itemId: string;
}

export const PrimaryOwnerComponent = React.createClass<PrimaryOwnerProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'PrimaryOwner',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { PrimaryOwner: action.newObject[0]});)',
            dataDictionary: {
                ID: '0', ItemId: '', EmployeeId: '0', ItemAuthorTypeId: '1'
            }
        }
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');
        

	},

    componentDidUpdate(){
        if (this.props.PrimaryOwner.EmployeeId.DefaultValue) {
            if (this.props.PrimaryOwner.EmployeeId.DefaultValue != '0') {
                if (this.props.PrimaryOwner.EmployeeId.Value == '0') {
                    const n = this.props.PrimaryOwner.EmployeeId.DefaultValue.indexOf('(');
                    const empId = this.props.PrimaryOwner.EmployeeId.DefaultValue.substr(n + 1, 5);
                    if (this.props.PrimaryOwner.EmployeeId.Value != empId) {
                        if (n != 0) {
                            this.savePrimaryOwner(empId);
                        }
                    }
                }
            }
        }
    },

	savePrimaryOwner(e) {
		if (e != '') {
            this.componentDescriptor.dataDictionary["EmployeeId"] = e;
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["ID"] = this.props.PrimaryOwner.ID.Value;
            this.componentDescriptor.dataDictionary["ItemAuthorTypeId"] = '1';
            this.props.componentData(this.componentDescriptor, 'Upsert');
        }
    },
    render() {
       

        return (
            <div id="primaryOwner">
                <div>
                    <div className="form-group" >
                        <Label id="PrimaryOwner_Label" text="PRIMARY OWNER  " required={this.props.PrimaryOwner.EmployeeId.IsRequired} />
                        <span  className="pull-right" >
                            <HelpButton  title="Primary Owner"  text={primaryOwnerHelpText}  />
                        </span>

                        <div>
                           { (this.props.PrimaryOwner.EmployeeId.DefaultValue)?
                            
                                <ComboBox
                                    id="primaryOwnerList"
                                    name="primaryOwnerList"
                                    onSelect={(selectedItem) => this.savePrimaryOwner(selectedItem) }
                                    url="/GenericApiHelper/GetEmployees"
                                    dataTextField="DisplayText"
                                    dataValueField="EmployeeId"
                                    placeholder="Search Employee By Name"
                                    isEnabled= {true}
                                    selectedValue={this.props.PrimaryOwner.EmployeeId.DefaultValue}
                                    ></ComboBox>
                            : <div></div> }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.PrimaryOwner) {
        const { itemId } = state;

        return {
            itemId: itemId,
            PrimaryOwner: {

                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                EmployeeId: {
                    Value: '0'
                },
                ItemAuthorTypeId:
                {
                    Value: '1'
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        PrimaryOwner: state.PrimaryOwner
    };
};

export const PrimaryOwnerContainer =
    connect(
        mapStateToProps,
        actions
    )(PrimaryOwnerComponent) as React.ClassicComponentClass<any>;


export default PrimaryOwnerComponent;


