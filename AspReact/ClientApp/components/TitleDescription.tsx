import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as TitleDescriptionStore from '../store/TitleDescription';

type TitleDescriptionProps =
    TitleDescriptionStore.TitleDescriptionState
    & typeof TitleDescriptionStore.actionCreators;

class TitleDescription extends React.Component<TitleDescriptionProps, any> {
    public render() {
        return <div>
            <h1>l</h1>

            <p>This is a simple example of a React component.</p>

            <p>Current item ID: <strong>{ this.props.itemId }</strong></p>

        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.titleDescription, // Selects which state properties are merged into the component's props
    TitleDescriptionStore.actionCreators                 // Selects which action creators are merged into the component's props
)(TitleDescription) as typeof TitleDescription;
