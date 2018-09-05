import * as React from 'react';

import { Event } from '../models/event';
import { Speaker } from '../models/speaker';
import objectAssign from './../utils/objectAssign';
import SpeakerList from './SpeakerList';
import EventTitle from './EventTitle';
import EditSpeakerListContainer from '../containers/EditSpeakerListContainer';
import EditExternalSpeakerListContainer from '../containers/EditExternalSpeakerListContainer';

export interface SpeakerManagerProps {

    itemEvents: Array<Event>;
    getEvents: Function;
}

const SpeakerManager = React.createClass<SpeakerManagerProps, any>({

    componentDidMount() {
        this.props.getEvents();
    },

    render() {
      //  console.log('Speaker Manager component');
        const { itemEvents } = this.props;

        return (
            <div id="speakers" className="portlet speakers-portlet">
                <div className="portlet-title">
                    <div className="caption">Speakers</div>
                </div>
                <div className="table-responsive">
                    <table className="table table-condensed">
                        {(itemEvents != null) ?
                            <tbody>
                                {itemEvents.map((e: Event) => (
                                    <tr  key={e.EventId}>
                                        <td  style={{ width: '15%' }}>
                                            <EventTitle Code={e.Code} Title={e.Title} Region={e.Region} FormattedStartDate={e.FormattedStartDate}  />

                                        </td>
                                        <td >                                           
                                            <EditSpeakerListContainer Id={"SpeakerListContainer_" + e.EventId} isEnabled={e.IsSpeakerEnabled} IsParent={e.IsParent} EventId={e.EventId} ItemDetailId={e.Id} />
                                        </td>
                                        <td >
                                            <EditExternalSpeakerListContainer Id={"ExternalSpeakerListContainer" + e.EventId} IsParent={e.IsParent} EventId={e.EventId}  ItemDetailId={e.Id}  />
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                            :
                            <tbody>
                                <EventTitle Code={""} Title={"Please add an event to add Speakers"} Region={""} FormattedStartDate={""} />
                            </tbody>
                        }
                    </table>
                </div>
            </div>

        );
    }
});

export default SpeakerManager;