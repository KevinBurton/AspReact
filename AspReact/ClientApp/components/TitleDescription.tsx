import * as React from 'react';
import { connect } from 'react-redux';
import HelpButton from './HelpButton';
import { Input, TextArea, Label } from './Form';
import { ApplicationState }  from '../store';
import * as TitleDescriptionStore from '../store/TitleDescription';

type TitleDescriptionProps =
    TitleDescriptionStore.TitleDescriptionState;

class TitleDescription extends React.Component<TitleDescriptionProps, any> {
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
