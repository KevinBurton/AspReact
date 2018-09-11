import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Label } from './Form';
import DropdownStrings from './DropdownStrings';

export interface ContentAspectProps {

    getComponentData: (component: Object) => void;
    ContentAspectField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const ContentAspectComponent = React.createClass<ContentAspectProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'ContentAspectField',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { ContentAspectField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                ContentAspect: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ContentAspectField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidMount() {

    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['ContentAspect'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.ContentAspectField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.ContentAspectField.DataList;
        let selectedValue = this.props.ContentAspectField.ContentAspect.Value
            ? this.props.ContentAspectField.ContentAspect.Value
            : "0";

        return (
            <div id="ContentAspect">
                <div>
                    <div className="form-group" >
                        <Label id="ContentAspect_Label" text="CONTENT ASPECT   " required={this.props.ContentAspectField.ContentAspect.IsRequired} />

                        {(listOptions[0].text != 'default') ?
                            <DropdownStrings id="ContentAspectList" listOptions={listOptions} placeholder="Select Content Aspect" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.ContentAspectField.ContentAspect.IsEnabled} />
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
    if (!state.ContentAspectField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            ContentAspectField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                ContentAspect: {
                    Value: ''
                },
                ContentAspectName: {
                    Value: ''
                },
                DataList: [{ stringValue: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        ContentAspectField: state.ContentAspectField
    };
};

export const ContentAspectContainer =
    connect(
        mapStateToProps,
        actions
    )(ContentAspectComponent as React.ClassicComponentClass<any>);


export default ContentAspectComponent;



