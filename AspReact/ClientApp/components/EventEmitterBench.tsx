import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import eventEmitter from '../utils/eventEmitter'
import { SetComponentDescriptorRefresh } from '../utils/eventEmitter';


function ReviewerRefresh(itemId: number) {
	var cd = {
		name: 'ReviewerBench',
		returnObjectIndexed: false,
		dataDictionary: {
			ID: '0', ItemId: itemId, Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: ''
		}
	}
	return eventEmitter.emitEvent('SetComponentDescriptorRefresh', [cd]);

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

	return eventEmitter.emitEvent('SetComponentDescriptorRefresh', [cd]);
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
	return eventEmitter.emitEvent('SetComponentDescriptorRefresh', [cd]);
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

	return eventEmitter.emitEvent('SetComponentDescriptorRefresh', [cd]);
}

function ItemStatusDisplayRefresh(itemId: number) {
	var cd = {
		name: 'ItemStatusDisplay',
		returnObjectIndexed: true,
		dataDictionary: {
			ID: '0', ItemId: itemId, Description: ''
		}
	}
	return eventEmitter.emitEvent('SetComponentDescriptorRefresh', [cd]);
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

	return eventEmitter.emitEvent('SetComponentDescriptorRefresh', [cd]);
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

		eventEmitter.addListener('QVRByReviewerRefresh', QVRByReviewerRefresh);
	  eventEmitter.addListener('ReviewerRefresh', ReviewerRefresh);
		eventEmitter.addListener('SetComponentDescriptorRefresh', SetComponentDescriptorRefresh);
		eventEmitter.addListener('ItemStatusDisplayRefresh', ItemStatusDisplayRefresh);
		eventEmitter.addListener('ItemStatusDatesRefresh', ItemStatusDatesRefresh);
		eventEmitter.addListener('QVRRefresh', QVRRefresh);
		eventEmitter.addListener('ResearchAgendaRefresh', ResearchAgendaRefresh);
		eventEmitter.addListener('DiscussionRefresh', DiscussionRefresh);
	},


	componentWillUnmount() {
		eventEmitter.removeListener('QVRByReviewerRefresh');
		eventEmitter.removeListener('ReviewerRefresh');
		eventEmitter.removeListener('SetComponentDescriptorRefresh');
		eventEmitter.removeListener('ItemStatusDisplayRefresh');
		eventEmitter.removeListener('ItemStatusDatesRefresh');
		eventEmitter.removeListener('QVRRefresh');
		eventEmitter.removeListener('ResearchAgendaRefresh');
		eventEmitter.removeListener('DiscussionRefresh');
	},

	render() {

		return (
			<div id="EventEmitterBench">

			</div>
		);
	}
});

const mapStateToProps = (state:any) => {
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

