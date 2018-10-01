import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/addAssociationActions';
import AddAssociationModal from '../components/AddAssociationModal';

const mapStateToProps = (state) => {
	return {
		selectedAssociation: state.addAssociation.selectedAssociation,
		isSaving: state.addAssociation.isSaving
	};
};

const AddAssociationModalContainer =
	connect(
		mapStateToProps,
		actions
	)(AddAssociationModal) as () => JSX.Element;

export default AddAssociationModalContainer;