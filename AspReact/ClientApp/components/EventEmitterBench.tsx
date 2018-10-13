import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { SetComponentDescriptorRefresh } from '../utils/eventEmitter';


function ReviewerRefresh(itemId: number) {
	var cd = {
		name: 'ReviewerBench',
		returnObjectIndexed: false,
		dataDictionary: {
			ID: '0', ItemId: itemId, Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: ''
		}
	}
	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);

}

function QVRByReviewerRefresh(itemId: number) {
	var cd = {
		name: 'QVRBench',
		returnObjectIndexed: false,
		dataDictionary: {
			ID: '0', ItemId: itemId, Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: '',
			Rating: '', QvrReasonId: '', Name: '', QvrComment: '', QvrId: ''
		}
	}

	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);
}

function ItemStatusDatesRefresh(itemId: number) {
	var cd = {
		name: 'HlcItemStatusDates',
		returnObjectIndexed: true,
		dataDictionary: {
			ID: '0',
			ItemId: itemId,
			ItemStatusId: '',
			DateValue: '',
			EmployeeId: ''
		}
	}
	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);
}

function QVRRefresh(itemId: number) {
	var cd = {
		name: 'QVRBench',
		returnObjectIndexed: false,
		dataDictionary: {
			ID: '0', ItemId: itemId, Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: '',
			Rating: '', QvrReasonId: '', Name: '', QvrComment: '', QvrId: ''
		}
	}

	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);
}

function ItemStatusDisplayRefresh(itemId: number) {
	var cd = {
		name: 'ItemStatusDisplay',
		returnObjectIndexed: true,
		dataDictionary: {
			ID: '0', ItemId: itemId, Description: ''
		}
	}
	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);
}

function ResearchAgendaRefresh(itemId: number) {
	var cd = {
		name: 'ResearchAgenda',
		returnObjectIndexed: false,
		dataDictionary: {
			ID: '0', ItemId: itemId, AgendaId: '', PrimaryFlag: '', PrimaryMgrEmpCd: ''
		}
	}

	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);
}

function DiscussionRefresh(itemId: number) {
	var cd = {
		name: 'Discussion',
		returnObjectIndexed: false,
		dataDictionary: {
			ID: '0', ItemId: itemId, CommentDetail: ''
		}
	}

	return this.emitEvent('SetComponentDescriptorRefresh', [cd]);
}



export interface EventEmitterBenchProps {
	getComponentData: (component: Object) => void;
	EventEmitterBench: Object;
	componentDescriptor: ComponentDescriptor;
}


export const EventEmitterBenchComponent = React.createClass<EventEmitterBenchProps, any>({

	componentWillMount() {
		this.componentDescriptor = {
			name: 'EventEmitterBench',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', ItemId: ''
			}
		}

		this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;

		this.props.eventEmitter.addListener('QVRByReviewerRefresh', QVRByReviewerRefresh);
		this.props.eventEmitter.addListener('ReviewerRefresh', ReviewerRefresh);
		this.props.eventEmitter.addListener('SetComponentDescriptorRefresh', SetComponentDescriptorRefresh);
		this.props.eventEmitter.addListener('ItemStatusDisplayRefresh', ItemStatusDisplayRefresh);
		this.props.eventEmitter.addListener('ItemStatusDatesRefresh', ItemStatusDatesRefresh);
		this.props.eventEmitter.addListener('QVRRefresh', QVRRefresh);
		this.props.eventEmitter.addListener('ResearchAgendaRefresh', ResearchAgendaRefresh);
		this.props.eventEmitter.addListener('DiscussionRefresh', DiscussionRefresh);
	},


	componentWillUnmount() {
		this.props.eventEmitter.removeListener('QVRByReviewerRefresh');
		this.props.eventEmitter.removeListener('ReviewerRefresh');
		this.props.eventEmitter.removeListener('SetComponentDescriptorRefresh');
		this.props.eventEmitter.removeListener('ItemStatusDisplayRefresh');
		this.props.eventEmitter.removeListener('ItemStatusDatesRefresh');
		this.props.eventEmitter.removeListener('QVRRefresh');
		this.props.eventEmitter.removeListener('ResearchAgendaRefresh');
		this.props.eventEmitter.removeListener('DiscussionRefresh');
	},

	render() {

		return (
			<div id="EventEmitterBench">

			</div>
		);
	}
});

const mapStateToProps = (state) => {
	if (!state.EventEmitterBench) {
		const { itemId } = state;
		return {
			eventEmitter: state.eventEmitter,
			itemId: state.itemId,
			EventEmitterBench: [{
				ID: { Value: '' },
				ItemId: { Value: itemId }
			}]
		};
	}

	return {
		eventEmitter: state.eventEmitter,
		itemId: state.itemId,
		EventEmitterBench: state.EventEmitterBench
	};
};

export const EventEmitterBenchContainer =
	connect(
		mapStateToProps,
		actions
	)(EventEmitterBenchComponent) as React.ClassicComponentClass<any>;


export default EventEmitterBenchComponent;

