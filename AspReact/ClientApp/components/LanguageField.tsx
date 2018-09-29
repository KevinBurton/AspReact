import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import { Label } from './Form';
import DropdownStrings from './DropdownStrings';
import componentData from '../utils/componentData';


export interface LanguageProps {

    getComponentData: (component: Object) => void;
    LanguageField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const LanguageComponent = React.createClass<LanguageProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'LanguageField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { LanguageField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                Language: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.LanguageField.ID.Value;
        componentData(this.componentDescriptor, 'GetData');

    },

    componentDidUpdate() {
        if (this.props.LanguageField.Language.DefaultValue) {
            if (this.props.LanguageField.Language.DefaultValue != '0') {
                if (this.props.LanguageField.Language.Value == '') {
                    this.upsertChange(this.props.LanguageField.Language.DefaultValue);
                }
            }
        }
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['Language'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.LanguageField.ID.Value;
        componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.LanguageField.DataList;
        let selectedValue = this.props.LanguageField.Language.Value
            ? this.props.LanguageField.Language.Value
            : "0";

        return (
            <div id="Language">
                <div>
                    <div className="form-group" >
                        <Label id="Language_Label" text="AUTHORING LANGUAGE   " required={this.props.LanguageField.Language.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <DropdownStrings id="LanguageList" listOptions={listOptions} placeholder="Select Language" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.LanguageField.Language.IsEnabled} />
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
    if (!state.LanguageField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            LanguageField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                Language: {
                    Value: ''
                },
                LanguageName: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        LanguageField: state.LanguageField
    };
};

export const LanguageContainer =
    connect(
        mapStateToProps,
        actions
    )(LanguageComponent as React.ClassicComponentClass<any>);


export default LanguageComponent;



