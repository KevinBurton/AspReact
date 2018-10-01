import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { TextArea, Label } from './Form';

interface CommentsFieldProps {
}
interface CommentsFieldState {
    text: string;
};

export const CommentsComponent = React.createClass<CommentsFieldProps, CommentsFieldState>({
    getInitialState(): CommentsFieldState {
        return {
            text: ''
        };
    },
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

        this.props.componentData(this.componentDescriptor, 'GetData', (newObject) => {
            let text: string = newObject.ObjectToReturn[0].Comments.Value;
            this.setState(() => { return { text: text } });
        });
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
        let text: string = e.target.value;
        this.setState(() => { return { text: text } });
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
                                value={this.state.text}
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



