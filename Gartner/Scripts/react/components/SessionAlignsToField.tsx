import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import HelpButton from './HelpButton';
import Dropdown from './Dropdown';


export interface SessionAlignsToProps {

    getComponentData: (component: Object) => void;
    SessionAlignsToField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const SessionAlignsToComponent = React.createClass<SessionAlignsToProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'SessionAlignsToField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { SessionAlignsToField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                NewnessCategoryId: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.SessionAlignsToField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidMount() {

    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['NewnessCategoryId'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.SessionAlignsToField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.SessionAlignsToField.DataList;
        let selectedValue = this.props.SessionAlignsToField.NewnessCategoryId.Value
            ? this.props.SessionAlignsToField.NewnessCategoryId.Value
            : "0";

        return (
            <div id="SessionAlignsTo">
                <div>
                    <div className="form-group" >
                        <Label id="SessionAlignsTo_Label" text="THIS SESSION ALIGNS TO   " required={this.props.SessionAlignsToField.NewnessCategoryId.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <Dropdown id="SessionAlignsToList" listOptions={listOptions} placeholder="Select Session Alignment" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.SessionAlignsToField.NewnessCategoryId.IsEnabled} />
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
    if (!state.SessionAlignsToField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            SessionAlignsToField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                NewnessCategoryId: {
                    Value: ''
                },
                SessionAlignsToName: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        SessionAlignsToField: state.SessionAlignsToField
    };
};

export const SessionAlignsToContainer =
    connect(
        mapStateToProps,
        actions
    )(SessionAlignsToComponent as React.ClassicComponentClass<any>);


export default SessionAlignsToComponent;



