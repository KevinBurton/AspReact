import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { Input, FormGroup, TextArea, Label } from './Form';
import HelpButton from './HelpButton';

export interface ItemStatusDisplayProps {

    getComponentData: (component: Object) => void;
    ItemStatusDisplay: Object;
    componentDescriptor: ComponentDescriptor;
}

export const ItemStatusDisplayComponent = React.createClass<ItemStatusDisplayProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'ItemStatusDisplay',
            returnObjectIndexed: true,
            dataDictionary: {
                ID: '0', ItemId: '', Description: ''
            }
        }

        this.componentDescriptor.dataDictionary = {
            ID: this.props.ItemStatusDisplay.ID.Value,
            ItemId: this.props.itemId,
            Description: this.props.ItemStatusDisplay.Description.Value
        }

        this.props.componentData(this.componentDescriptor, 'GetData');


    },

    render() {

        return (
            <div id="ItemStatusDisplay">
                <div >
                    <div className="form-group" >
                        {(this.props.ItemStatusDisplay.Description !== 'undefined')?
                            <Label id="ItemStatusDescription_Label" text={this.props.ItemStatusDisplay.Description.Value} required={this.props.ItemStatusDisplay.Description.IsRequired} />
                            : <div></div>}
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ItemStatusDisplay) {

        const { itemId } = state;

        return {
            itemId: state.itemId,
            eventEmitter: state.eventEmitter,
            ItemStatusDisplay: {
                ID: {
                    Value:'0'
                },
                ItemId: {
                    Value: itemId
                },
                Description: {
                    Value: '',
                    Required: 'false'
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        eventEmitter: state.eventEmitter,
        ItemStatusDisplay: state.ItemStatusDisplay
    };
};

export const ItemStatusDisplayContainer =
    connect(
        mapStateToProps,
        actions
    )(ItemStatusDisplayComponent) as React.ClassicComponentClass<any>;


export default ItemStatusDisplayComponent;



