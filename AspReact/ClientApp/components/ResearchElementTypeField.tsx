import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import { Label } from './Form';
import Dropdown from './Dropdown';

export interface ResearchElementTypeFieldProps {

    getComponentData: (component: Object) => void;
    ResearchElementTypeField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const ResearchElementTypeFieldComponent = React.createClass<ResearchElementTypeFieldProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'ResearchElementTypeField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { ResearchElementTypeField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                ResearchElementTypeId: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ResearchElementTypeField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidUpdate() {
        if (this.props.ResearchElementTypeField.ResearchElementTypeId.DefaultValue) {
            if (this.props.ResearchElementTypeField.ResearchElementTypeId.DefaultValue != '0') {
                if (this.props.ResearchElementTypeField.ResearchElementTypeId.Value == '') {
                    this.upsertChange(this.props.ResearchElementTypeField.ResearchElementTypeId.DefaultValue);
                }
            }
        }
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['ResearchElementTypeId'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ResearchElementTypeField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.ResearchElementTypeField.DataList;
        let selectedValue = this.props.ResearchElementTypeField.ResearchElementTypeId.Value
            ? this.props.ResearchElementTypeField.ResearchElementTypeId.Value
            : "0";

        return (
            <div id="ResearchElementTypeField">
                <div>
                    <div className="form-group" >
                        <Label id="ResearchElementTypeField_Label" text="RESEARCH ELEMENT TYPE    " required={this.props.ResearchElementTypeField.ResearchElementTypeId.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <Dropdown id="ResearchElementTypeFieldList" listOptions={listOptions} placeholder="Select Research Element Type" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.ResearchElementTypeField.ResearchElementTypeId.IsEnabled} />
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
    if (!state.ResearchElementTypeField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            ResearchElementTypeField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                ResearchElementTypeId: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        ResearchElementTypeField: state.ResearchElementTypeField
    };
};

export const ResearchElementTypeFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(ResearchElementTypeFieldComponent as React.ClassicComponentClass<any>);


export default ResearchElementTypeFieldComponent;



