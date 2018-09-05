import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/removeAssociationActions';
import RemoveAssociationModal from '../components/RemoveAssociationModal';

const mapStateToProps = (state) => {
	return {
		isRemovingAssociation: state.removeAssociation.isRemovingAssociation
	};
};

const AddAssociationModalContainer =
	connect(
		mapStateToProps,
		actions
	)(RemoveAssociationModal) as () => JSX.Element;

export default AddAssociationModalContainer;
