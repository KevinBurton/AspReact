import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';

export interface CreateNewCancelProps {

    getComponentData: (component: Object) => void;
    CreateNewCancel: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    upsertChange: Function;
}

export const CreateNewCancelComponent = React.createClass<CreateNewCancelProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'CreateNewCancel',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign_1.default({}, state, { CreateNewCancel: action.newObject[0]});)',
            dataDictionary: { ID: '', IsDeleted: '' }
        }

        this.componentDescriptor.dataDictionary["ID"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidUpdate() {
        if (this.props.CreateNewCancel.IsDeleted.Value == "Y") {
            window.location.href = "/HighLeverageContent/Cancel/" + this.componentDescriptor.dataDictionary.ID;;
        }
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['ID'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['IsDeleted'] = 'Y';
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        return (
            <div id="CreateNewCancel">
                <div >
                    <div className="form-group" >
                        <button className="btn btn-secondary pull-left"
                            onClick={this.upsertChange}
                            disabled={!this.props.CreateNewCancel.ID.IsEnabled}>
                            Cancel 
                        </button>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.CreateNewCancel) {
        const { itemId } = state;
        return {
            itemId: state.itemId,
            CreateNewCancel: {
                ID: {
                    Value: itemId, 
                    IsEnabled: false
                }, 
                IsDeleted: {
                  Value: ''   
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        CreateNewCancel: state.CreateNewCancel
    };
};

export const CreateNewCancelContainer =
    connect(
        mapStateToProps,
        actions
    )(CreateNewCancelComponent) as React.ClassicComponentClass<any>;


export default CreateNewCancelContainer;



