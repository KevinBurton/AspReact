import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as HlcItemDetailStore from '../store/HlcItemDetail';

type HlcItemDetailProps =
    HlcItemDetailStore.HlcItemDetailState
    & typeof HlcItemDetailStore.actionCreators
    & RouteComponentProps<{}>;

class HlcItemDetail extends React.Component<HlcItemDetailProps, {}> {
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
    (state: ApplicationState) => state.hlcItemDetail, // Selects which state properties are merged into the component's props
    HlcItemDetailStore.actionCreators                 // Selects which action creators are merged into the component's props
)(HlcItemDetail) as typeof HlcItemDetail;