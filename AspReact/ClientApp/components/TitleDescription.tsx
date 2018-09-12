import * as React from 'react';
import { connect } from 'react-redux';
import HelpButton from './HelpButton';
import { Label, Input, TextArea } from './Form';
import { ComponentDescriptor } from '../models/generic'
import { ApplicationState }  from '../store';
import * as TitleDescriptionStore from '../store/TitleDescription';

type TitleDescriptionProps =
    TitleDescriptionStore.TitleDescriptionState;

class TitleDescription extends React.Component<TitleDescriptionProps, any> {
    titleHelpText: string = "Titles are required to create an idea or submit a session. Titles should not be more than 90 characters. Character count does not include title tags, such as Workshop or Roundtable. Use action verbs in your title and ensure that your title and description work together. For more information on creating great titles, click <a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/93c6b180-c926-4ed0-a6c1-747c9ce9205b'>here</a>.";
    descHelpText: string = "Descriptions are required to create an idea or submit a session. Descriptions should not be more than 400 characters, including spaces. Character count does not include key issues (if any). Write your description with the client/attendee in mind and assume it will be client-facing at some point. Descriptions should include action verbs, key words, and target industry (if there is one) framed as How To advice. Avoid passive or weak verbs, buzzwords, and cryptic language the attendee wont understand. For more information on writing great descriptions, click <a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/93c6b180-c926-4ed0-a6c1-747c9ce9205b'>here</a>";
    componentDescriptor: ComponentDescriptor;
    constructor(props: any) {
        super(props);
        this.componentDescriptor = {
            name: 'TitleDescription',
            returnObjectType: '',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { TitleDescription: action.newObject});)',
            onComponentOperationComplete: () => {},
            dataDictionary: {
                ID: 0,
                ItemId: 0,
                VendorId: 0
            }
        };
        // Bindings
        this.handleChange = this.handleChange.bind(this);
        this.upsertChange = this.upsertChange.bind(this);
    }
    upsertChange(e: any) {
        this.componentDescriptor.dataDictionary[e.target.id] = e.target.value;
        this.props.componentData(this.componentDescriptor, 'Upsert');

    }
    handleChange(e: any) {
        this.props.updateState(this.componentDescriptor, e.target.id, e.target.value);
    }
    public render() {
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
        </div>);
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.titleDescription, // Selects which state properties are merged into the component's props
    TitleDescriptionStore.actionCreators                 // Selects which action creators are merged into the component's props
)(TitleDescription) as typeof TitleDescription;
