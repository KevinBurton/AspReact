import * as React from 'react';
import { connect } from 'react-redux';
import ChangeAssociationModal from '../components/ChangeAssociationModal';
import * as actions from '../actions/changeAssociationActions';

const mapStateToProps = (state) => {
	return {
		parentItemTitle: state.itemShared.parentItemTitle,
		isSaving: state.changeAssociation.isSaving,
		savedAssociation: state.itemShared.associationSelected,
		selectedAssociation: state.changeAssociation.selectedAssociation
	};
};

const ChangeAssociationModalContainer =
	connect(
        mapStateToProps,
		actions
    )(ChangeAssociationModal) as () => JSX.Element;

export default ChangeAssociationModalContainer;



