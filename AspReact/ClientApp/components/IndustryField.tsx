import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Label } from './Form';
import Dropdown from './Dropdown';


export interface IndustryFieldProps {

    getComponentData: (component: Object) => void;
    IndustryField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const IndustryFieldComponent = React.createClass<IndustryFieldProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'IndustryField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { IndustryField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                IndustryId: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.IndustryField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidUpdate() {
        if (this.props.IndustryField.IndustryId.DefaultValue) {
            if (this.props.IndustryField.IndustryId.DefaultValue != '0') {
                if (this.props.IndustryField.IndustryId.Value == '') {
                    this.upsertChange(this.props.IndustryField.IndustryId.DefaultValue);
                }
            }
        }
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['IndustryId'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.IndustryField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.IndustryField.DataList;
        let selectedValue = this.props.IndustryField.IndustryId.Value
            ? this.props.IndustryField.IndustryId.Value
            : "0";

        return (
            <div id="IndustryField">
                <div>
                    <div className="form-group" >
                        <Label id="IndustryField_Label" text="INDUSTRY    " required={this.props.IndustryField.IndustryId.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <Dropdown id="IndustryFieldList" listOptions={listOptions} placeholder="Select Industry Type" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.IndustryField.IndustryId.IsEnabled} />
                            :
                            <div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.IndustryField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            IndustryField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                IndustryId: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        IndustryField: state.IndustryField
    };
};

export const IndustryFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(IndustryFieldComponent as React.ClassicComponentClass<any>);


export default IndustryFieldComponent;



