import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as HlcDetailStore from '../store/HlcDetail';

type HlcDetailProps =
    HlcDetailStore.HlcDetailState
    & typeof HlcDetailStore.actionCreators
    & RouteComponentProps<{}>;

class HlcDetail extends React.Component<HlcDetailProps, {}> {
    public render() {
        return <div>
            <h1>HLC Detail</h1>

            <p>This is a simple example of a React component.</p>

            <p>Current item ID: <strong>{ this.props.itemId }</strong></p>

        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.hlcDetail, // Selects which state properties are merged into the component's props
    HlcDetailStore.actionCreators                 // Selects which action creators are merged into the component's props
)(HlcDetail) as typeof HlcDetail;