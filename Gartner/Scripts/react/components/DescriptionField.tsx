import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import HelpButton from './HelpButton';
const descHelpText = "Descriptions are required to create an idea or submit a session. Descriptions should not be more than 400 characters, including spaces. Character count does not include key issues (if any). Write your description with the client/attendee in mind and assume it will be client-facing at some point. Descriptions should include action verbs, key words, and target industry (if there is one) framed as How To advice. Avoid passive or weak verbs, buzzwords, and cryptic language the attendee wont understand. For more information on writing great descriptions, click <a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/93c6b180-c926-4ed0-a6c1-747c9ce9205b'>here</a>";


export interface DescriptionFieldProps {

    getComponentData: (component: Object) => void;
    Description: Object;
    componentDescriptor: ComponentDescriptor;
    updateState: Function;
}

export const DescriptionComponent = React.createClass<DescriptionFieldProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'DescriptionField',
            returnObjectIndexed: true, 
            stateFunction:
            '(objectAssign.default({}, state, { DescriptionField: action.newObject[0]});)',
            dataDictionary: {
                ID: '', Description: ''
            }
        }

        this.componentDescriptor.dataDictionary = {
            ID: this.props.DescriptionField.ID.Value,
            Description: this.props.DescriptionField.Description.Value
        }

        this.props.componentData(this.componentDescriptor, 'GetData');


    },


    componentDidMount() {


    },

    componentDidUpdate() {

        this.componentDescriptor.dataDictionary = {
            ID: this.props.DescriptionField.ID.Value,
            Description: this.props.DescriptionField.Description.Value
        }

    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary[e.target.id] = e.target.value.replace(/#|&|,/g, '');
        this.props.componentData(this.componentDescriptor, 'Upsert');

    },

    handleChange(e) {
        e.target.value = e.target.value.replace(/#|&|,/g, '');
        this.props.updateState(this.componentDescriptor, e.target.id, e.target.value);
    },

    render() {

        return (




            <div id="Description">
                <div >
                    <div className="form-group" >
                        <Label id="Description_Label" text="DESCRIPTION  " required={this.props.DescriptionField.Description.IsRequired} />
                        <span  className="pull-right" >
                            <HelpButton  title="Description"  text={descHelpText}  />
                        </span>
                        <div  >
                            <TextArea className="form-control"
                                id='Description'
                                enabled ={this.props.DescriptionField.Description.IsEnabled}
                                value={this.props.DescriptionField.Description.Value}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.DescriptionField.Description.MaxLength} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.DescriptionField) {

        const { itemId } = state;

        return {
            DescriptionField: {
                ID: {
                    Value: itemId
                },
                Description: {
                    Value: ''
                }
            }
        };
    }

    return {
        DescriptionField: state.DescriptionField
    };
};

export const DescriptionFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(DescriptionComponent) as React.ClassicComponentClass<any>;


export default DescriptionComponent;



