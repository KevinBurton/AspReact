import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import { Input, Label } from './Form';
import componentData from '../utils/componentData';


export interface TotalPagesProps {

    getComponentData: (component: Object) => void;
    TotalPagesField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const TotalPagesComponent = React.createClass<TotalPagesProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'TotalPagesField',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { TotalPagesField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                TotalPages: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.TotalPagesField.ID.Value;
        componentData(this.componentDescriptor, 'GetData');

    },

    componentDidUpdate() {
        if (this.props.TotalPagesField.TotalPages.DefaultValue) {
            if (this.props.TotalPagesField.TotalPages.DefaultValue != '0') {
                if (this.props.TotalPagesField.TotalPages.Value == '') {
                    this.upsertChange(this.props.TotalPagesField.TotalPages.DefaultValue);
                }
            }
        }
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['TotalPages'] = e.target.value;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.TotalPagesField.ID.Value;
        componentData(this.componentDescriptor, 'Upsert');
    },

    handleChange(e) {
        this.props.updateState(this.componentDescriptor, e.target.id, e.target.value);
    },

    render() {

        const listOptions: Array<IOption> = this.props.TotalPagesField.DataList;
        let selectedValue = this.props.TotalPagesField.TotalPages.Value
            ? this.props.TotalPagesField.TotalPages.Value
            : "0";

        return (
            <div id="TotalPages">
                <div>
                    <div className="form-group" >
                        <Label id="TotalPages_Label" text="TOTAL NUMBER OF PAGES IN PRESENTATION  " required={this.props.TotalPagesField.TotalPages.IsRequired} />
                        <div  >
                            <Input className="form-control"
                                id='TotalPages'
                                value={this.props.TotalPagesField.TotalPages.Value}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.TotalPagesField.TotalPages.MaxLength} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.TotalPagesField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            TotalPagesField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                TotalPages: {
                    Value: ''
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        TotalPagesField: state.TotalPagesField
    };
};

export const TotalPagesFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(TotalPagesComponent as React.ClassicComponentClass<any>);


export default TotalPagesComponent;



