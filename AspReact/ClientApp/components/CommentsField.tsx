import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { TextArea, Label } from './Form';
import { ApplicationState }  from '../store';
import * as CommentsStore from '../store/Comments';
import componentData from '../utils/componentData';

type CommentsFieldProps = CommentsStore.CommentsState &
                          typeof CommentsStore.actionCreators;

interface ComponentCommentsFieldState {
    text: string;
};

class Comments extends React.Component<CommentsFieldProps, ComponentCommentsFieldState> {
    componentDescriptor: ComponentDescriptor;
    constructor(props: any) {
        super(props);
        this.componentDescriptor = {
            name: 'CommentsField',
            returnObjectType: '',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { CommentsField: action.newObject[0]});)',
            dataDictionary: {
                ID: '',
                Comments: ''
            }
         };

        this.componentDescriptor.dataDictionary = {
            ID: this.props.comments.ID.Value,
            Comments: this.props.comments.Comments.Value
        };

        componentData(this.componentDescriptor, 'GetData');

        // Initialize component state
        this.state = {
          text: ''
        };

        // Bindings
        this.upsertChange = this.upsertChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidUpdate() {
        this.componentDescriptor.dataDictionary = {
            ID: this.props.comments.ID.Value,
            Comments: this.props.comments.Comments.Value
        }
    }

    upsertChange(e:any) {
        this.componentDescriptor.dataDictionary[e.target.id] = e.target.value;
        componentData(this.componentDescriptor, 'Upsert');
    }

    handleChange(e:any) {
      let text: string = e.target.value;
      this.setState(() => { return { text: text } });
    }

    public render() {

        return (
            <div id="Comments">
                <div >
                    <div className="form-group" >
                        <Label id="Comments_Label" text="COMMENTS  " required={this.props.comments.Comments.IsRequired} />
                        <div  >
                            <TextArea className="form-control"
                                id='Comments'
                                value={this.state.text}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.comments.Comments.MaxLength} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.comments, // Selects which state properties are merged into the component's props
    CommentsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Comments) as typeof Comments;


