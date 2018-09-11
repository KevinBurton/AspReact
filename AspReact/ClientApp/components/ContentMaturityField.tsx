import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Label } from './Form';
import DropdownStrings from './DropdownStrings';


export interface ContentMaturityProps {

    getComponentData: (component: Object) => void;
    ContentMaturityField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const ContentMaturityComponent = React.createClass<ContentMaturityProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'ContentMaturityField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { ContentMaturityField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                ContentMaturity: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ContentMaturityField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidMount() {

    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['ContentMaturity'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ContentMaturityField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.ContentMaturityField.DataList;
        let selectedValue = this.props.ContentMaturityField.ContentMaturity.Value
            ? this.props.ContentMaturityField.ContentMaturity.Value
            : "0";

        return (
            <div id="ContentMaturity">
                <div>
                    <div className="form-group" >
                        <Label id="ContentMaturity_Label" text="CONTENT MATURITY   " required={this.props.ContentMaturityField.ContentMaturity.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <DropdownStrings id="ContentMaturityList" listOptions={listOptions} placeholder="Select Content Maturity" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.ContentMaturityField.ContentMaturity.IsEnabled} />
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
    if (!state.ContentMaturityField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            ContentMaturityField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                ContentMaturity: {
                    Value: ''
                },
                ContentMaturityName: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }
   
    return {
        itemId: state.itemId,
        ContentMaturityField: state.ContentMaturityField
    };
};

export const ContentMaturityContainer =
    connect(
        mapStateToProps,
        actions
    )(ContentMaturityComponent as React.ClassicComponentClass<any>);


export default ContentMaturityComponent;



