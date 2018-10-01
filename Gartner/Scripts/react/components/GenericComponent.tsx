import * as React from 'react';

import { Something } from '../models/generic';
import objectAssign from './../utils/objectAssign';
import SpeakerList from './SpeakerList';
import EventTitle from './EventTitle';
import EditSpeakerListContainer from '../containers/EditSpeakerListContainer';
import EditExternalSpeakerListContainer from '../containers/EditExternalSpeakerListContainer';

export interface GenericComponentProps {

    myCollection: Array<Something>;
   // getData: Function;

    getData: (base: string) => void;
    getComponentData: (component: Object) => void;
    name: string;

}

export const GenericComponent = React.createClass<GenericComponentProps, any>({

    componentDidMount() {
       
        this.props.getData();
    },

    render() {
        
        const { myCollection } = this.props;

        return (
            <div id="speakers" className="portlet speakers-portlet">
                <div className="portlet-title">
                    <div className="caption">Speakers</div>
                </div>
                <div className="table-responsive">
                    <table className="table table-condensed">
                        {(myCollection != null) ?
                            <tbody>
                                {myCollection.map((e: Something) => (
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

export default GenericComponent;