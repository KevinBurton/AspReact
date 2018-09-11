import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Label } from './Form';
import DropdownStrings from './DropdownStrings';

export interface ContentFocusProps {

    getComponentData: (component: Object) => void;
    ContentFocusField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const ContentFocusComponent = React.createClass<ContentFocusProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'ContentFocusField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { ContentFocusField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                ContentFocus: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ContentFocusField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidMount() {

    },
    
    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['ContentFocus'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ContentFocusField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.ContentFocusField.DataList;
        let selectedValue = this.props.ContentFocusField.ContentFocus.Value
            ? this.props.ContentFocusField.ContentFocus.Value
            : "0";

        return (
            <div id="ContentFocus">
                <div>
                    <div className="form-group" >
                        <Label id="ContentFocus_Label" text="CONTENT FOCUS   " required={this.props.ContentFocusField.ContentFocus.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <DropdownStrings id="ContentFocusList" listOptions={listOptions} placeholder="Select Content Focus" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.ContentFocusField.ContentFocus.IsEnabled} />
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
    if (!state.ContentFocusField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            ContentFocusField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                ContentFocus: {
                    Value: ''
                },
                ContentFocusName: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        ContentFocusField: state.ContentFocusField
    };
};

export const ContentFocusContainer =
    connect(
        mapStateToProps,
        actions
    )(ContentFocusComponent as React.ClassicComponentClass<any>);


export default ContentFocusComponent;



