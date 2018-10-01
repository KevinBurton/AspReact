import * as React from 'react';
import { Keywords, KeywordsProps } from '../components/Keywords';
import { connect } from 'react-redux';
import * as actions from '../actions/keywordsActions';

const mapStateToProps = (state) => {
	return {
		keywords: state.keywords.keywords,
		isEditing: state.keywords.isEditing,
		isSaving: state.keywords.isSaving,
		isReadOnly: state.itemShared.isReadOnly
	};
};

const KeywordsContainer =
	connect(
		mapStateToProps,
		actions
	)(Keywords) as React.ClassicComponentClass<any>;

export default KeywordsContainer;