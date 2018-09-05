import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';
import HelpButton from './HelpButton';
const titleHelpText = "Titles are required to create an idea or submit a session. Titles should not be more than 90 characters. Character count does not include title tags, such as Workshop or Roundtable. Use action verbs in your title and ensure that your title and description work together. For more information on creating great titles, click <a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/93c6b180-c926-4ed0-a6c1-747c9ce9205b'>here</a>.";
const descHelpText = "Descriptions are required to create an idea or submit a session. Descriptions should not be more than 400 characters, including spaces. Character count does not include key issues (if any). Write your description with the client/attendee in mind and assume it will be client-facing at some point. Descriptions should include action verbs, key words, and target industry (if there is one) framed as How To advice. Avoid passive or weak verbs, buzzwords, and cryptic language the attendee wont understand. For more information on writing great descriptions, click <a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/93c6b180-c926-4ed0-a6c1-747c9ce9205b'>here</a>";

export interface TitleDescriptionProps {

    getComponentData: (component: Object) => void;
    TitleDescription: Object;
    componentDescriptor: ComponentDescriptor;
    updateState: Function;
}

export const TitleDescriptionComponent = React.createClass<TitleDescriptionProps, any>({

    componentWillMount() {
    },


    componentDidMount() {
        this.componentDescriptor = {
            name: 'TitleDescription',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { TitleDescription: action.newObject[0]});)',
            dataDictionary: {
                ID: '', Title: '', Description: ''
            }
        }

        this.componentDescriptor.dataDictionary = {
            ID: this.props.TitleDescription.ID.Value,
            Title: this.props.TitleDescription.Title.Value,
            Description: this.props.TitleDescription.Description.Value
        }

        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidUpdate() {

        this.componentDescriptor.dataDictionary = {
            ID: this.props.TitleDescription.ID.Value,
            Title: this.props.TitleDescription.Title.Value,
            Description: this.props.TitleDescription.Description.Value
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
            <div id="titleDescription">
                <div >
                    <div className="form-group" >
                        <Label id="Title_Label" text="TITLE  " required={this.props.TitleDescription.Title.IsRequired} />
                        <span  className="pull-right" >
                            <HelpButton  title="Title"  text={titleHelpText}  />
                        </span>
                        <div  >
                            <Input className="form-control"
                                id='Title'
                                value={this.props.TitleDescription.Title.Value}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.TitleDescription.Title.MaxLength} />
                        </div>
                        <span className="help-block">For more information on creating high-quality titles, click (<a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/93c6b180-c926-4ed0-a6c1-747c9ce9205b'>here</a>).</span>
                    </div>
                    <div className="form-group" >
                        <Label id="Description_Label" text="DESCRIPTION  " required={this.props.TitleDescription.Description.IsRequired} />
                        <span  className="pull-right" >
                            <HelpButton title="Description"  text={descHelpText}  />
                        </span>
                        <div >
                            <TextArea className="form-control" rows="3"
                                id='Description'
                                value={this.props.TitleDescription.Description.Value}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.TitleDescription.Description.MaxLength} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.TitleDescription) {

        const { itemId } = state;

        return {
            TitleDescription: {
                ID: {
                    Value: itemId
                },
                Title: {
                    Value: '',
                    MaxLength: 0,
                    IsRequired: false
                },
                Description: {
                    Value: '',
                    MaxLength: 0
                },
                IsDeleted: {
                    Value: ''
                },
                IsMigrated: {
                    Value: ''
                },
                ItemTypeId: {
                    Value: ''
                }
            }
        };
    }

    return {
        TitleDescription: state.TitleDescription
    };
};

export const TitleDescriptionContainer =
    connect(
        mapStateToProps,
        actions
    )(TitleDescriptionComponent) as React.ClassicComponentClass<any>;


export default TitleDescriptionComponent;


