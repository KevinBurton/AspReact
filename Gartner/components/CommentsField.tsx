import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import HelpButton from './HelpButton';

export interface CommentsFieldProps {

    getComponentData: (component: Object) => void;
    Comments: Object;
    componentDescriptor: ComponentDescriptor;
    updateState: Function;
}

export const CommentsComponent = React.createClass<CommentsFieldProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'CommentsField',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { CommentsField: action.newObject[0]});)',
            dataDictionary: {
                ID: '', Comments: ''
            }
        }

        this.componentDescriptor.dataDictionary = {
            ID: this.props.CommentsField.ID.Value,
            Comments: this.props.CommentsField.Comments.Value
        }

        this.props.componentData(this.componentDescriptor, 'GetData');


    },


    componentDidMount() {


    },

    componentDidUpdate() {

        this.componentDescriptor.dataDictionary = {
            ID: this.props.CommentsField.ID.Value,
            Comments: this.props.CommentsField.Comments.Value
        }

    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary[e.target.id] = e.target.value;
        this.props.componentData(this.componentDescriptor, 'Upsert');

    },

    handleChange(e) {
        this.props.updateState(this.componentDescriptor, e.target.id, e.target.value);
    },

    render() {

        return (
            <div id="Comments">
                <div >
                    <div className="form-group" >
                        <Label id="Comments_Label" text="COMMENTS  " required={this.props.CommentsField.Comments.IsRequired} />
                        <div  >
                            <TextArea className="form-control"
                                id='Comments'
                                value={this.props.CommentsField.Comments.Value}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.CommentsField.Comments.MaxLength} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.CommentsField) {

        const { itemId } = state;
       
        return {
            CommentsField: {
                ID: {
                    Value: itemId
                },
                Comments: {
                    Value: ''
                }
            }
        };
    }

    return {
        CommentsField: state.CommentsField
    };
};

export const CommentsFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(CommentsComponent) as React.ClassicComponentClass<any>;


export default CommentsComponent;



