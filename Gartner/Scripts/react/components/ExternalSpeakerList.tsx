import * as React from 'react';
import { ExternalSpeaker } from '../models/externalSpeaker';
import objectAssign from './../utils/objectAssign';

import CancelButton from './CancelButton';
import SaveButton from './SaveButton';


export interface ExternalSpeakerListProps {
    EventId: number;
    IsParent: boolean;
    ItemDetailId: number;
    getExternalSpeakers: Function;
    itemExternalSpeakers: Array<ExternalSpeaker>;

    saveExternalSpeaker: (nonEmployeeName: string, eventId: number, itemDetailId: number, isParent: boolean) => void;
    removeExternalSpeaker: (externalSpeaker: ExternalSpeaker, eventId: number, itemDetailId: number, isParent: boolean) => void;
}

const ExternalSpeakerList = React.createClass<ExternalSpeakerListProps, any>({
    componentDidMount() {
        this.props.getExternalSpeakers(this.props.EventId, this.props.ItemDetailId, this.props.IsParent);
    },

    getInitialState: function () {
        return { input: '' };
    },
    handleChange: function (e) {
        this.setState({ input: e.target.value });
    },

    removeSelectedSpeaker(externalSpeaker: ExternalSpeaker, eventId: number, itemDetailId: number, isParent: boolean) {
        this.props.removeExternalSpeaker(externalSpeaker, eventId, itemDetailId, isParent);
    },

    saveExternalSpeaker(eventId: number, itemDetailId: number, isParent: boolean) 
	{
        if (this.state.input.length > 0) {
            this.props.saveExternalSpeaker(this.state.input, eventId, itemDetailId, isParent);
            this.setState({ input: '' });
        }
    },
    render() {

        const { itemExternalSpeakers } = this.props;
      //  console.log('proposed external speaker list component', itemExternalSpeakers);

        return (
            <div className="portlet-body">
                <h4>Add Proposed External Speaker(s)</h4>

                <div  className="input-group">
                    <span className="k-widget k-combobox k-header">
                        <span className="k-dropdown-wrap k-state-default">
                            <input type="input" value={this.state.input}  className="k-input" role="combobox" placeholder= "Enter external speaker name.."  onChange={ this.handleChange } />
                        </span>
                    </span>
                    <div className="input-group-btn">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-primary"
                                onClick={() => this.saveExternalSpeaker(this.props.EventId, this.props.ItemDetailId, this.props.IsParent) }> Add </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-condensed">
                        <thead></thead>
                        <tbody>
                            {itemExternalSpeakers.filter((externalSpeaker) =>
                            { return externalSpeaker.EventId == this.props.ItemDetailId; })
                                .sort((a, b) => {
                                    var nameA = a.NonEmployeeName.toUpperCase();
                                    var nameB = b.NonEmployeeName.toUpperCase();
                                    if (nameA < nameB) {
                                        return -1;
                                    } else if (nameA > nameB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                })
                                .map((externalSpeaker: ExternalSpeaker) => (
                                    <tr key={externalSpeaker.Id}>
                                        <td>{externalSpeaker.NonEmployeeName}</td>
                                        <td className="text-right">
                                            <button type="button" className="btn btn-xs btn-custom "  onClick={() => this.removeSelectedSpeaker(externalSpeaker, this.props.EventId, this.props.ItemDetailId, this.props.IsParent) }>
                                                <span className="icon-trash"></span>
                                            </button>
                                        </td>
                                    </tr>
                                )) }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

export default ExternalSpeakerList;