import * as React from 'react';
import ReviewerList from '../components/QVR/ReviewerList';
import * as actions from '../actions/qvrActions';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		showQvr: state.qvr.showQvr,
		reviewers: state.qvr.reviewers
	};
};

const Container =
	connect(
		mapStateToProps,
		actions
	)(ReviewerList) as React.ClassicComponentClass<any>;

export default Container;