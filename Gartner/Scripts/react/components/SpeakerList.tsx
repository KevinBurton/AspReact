import * as React from 'react';
import { Speaker, SpeakerRoleOption, SpeakerRoleDDL } from '../models/speaker';
import objectAssign from './../utils/objectAssign';
import EmployeePicker from './EmployeePicker';
import Dropdown from './Dropdown';
import Avatar from './Avatar';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import { IOption } from '../models/generic';


export interface SpeakerListProps {
    EventId: number;
    IsParent: boolean;
    ItemDetailId: number;
    getSpeakers: (eventId: number, itemDetailId: number, isParent: boolean) => Function;
    getRoles: () => Function;
    itemSpeakers: Array<Speaker>;
    speakerRoles: Array<SpeakerRoleOption>;
	saveRole: (roleId: number) => void;
    saveSpeaker: (employeeId: number) => void;
    removeSpeaker: (speaker: Speaker, eventId: number, itemDetailId: number, isParent: boolean) => void; 
    onSave: (speaker: Speaker, eventId: number, itemDetailId: number, isParent: boolean) => void;
    isEnabled: boolean;
}

const SpeakerList = React.createClass<SpeakerListProps, any>({
    componentDidMount() {
        this.props.getSpeakers(this.props.EventId, this.props.ItemDetailId, this.props.IsParent);
        this.props.getRoles();
    },

        selectedSpeaker(employeeId: any) {

            const speaker: Speaker = {
                EmployeeId: employeeId,
                EmployeeName: 'Name',
                Id: 0,
                RoleId: 0,
                RoleDescription: '',
                EventId: this.props.ItemDetailId,
                isEnabled: true
            };

            this.props.onSave(speaker, this.props.EventId, this.props.ItemDetailId, this.props.IsParent);
        },


        removeSelectedSpeaker(speaker: Speaker) {
            this.props.removeSpeaker(speaker, this.props.EventId, this.props.ItemDetailId, this.props.IsParent);
        },

        saveRole(speakertoEdit: Speaker, roleId: number) {
            speakertoEdit.RoleId = roleId;
            this.props.onSave(speakertoEdit,this.props.EventId,this.props.ItemDetailId, this.props.IsParent);
        }, 

 
    render() {
       
        const { itemSpeakers } = this.props;
     //   console.log('speaker list component', itemSpeakers);
        let isSpeakerEnabled = this.props.isEnabled;
        if (isSpeakerEnabled == undefined) {
            isSpeakerEnabled = true;
        }
        const { speakerRoles } = this.props;

		return (
				<div className="portlet-body">
				    <h4>Add a Speaker(s)</h4>
				    <div>
				        <EmployeePicker id={"addSpeakersEmployeePicker" + this.props.EventId}
				                        buttonText="Add"
				                        onSelect={(employee) => this.selectedSpeaker(employee.id) }
				                        isEnabled={isSpeakerEnabled}/>
				    </div>

				    <div className="table-responsive">
				        <table className="table table-condensed">
				            <tbody>
				            {itemSpeakers
                                .filter((speaker) => { return speaker.EventId == this.props.ItemDetailId; })
                                .sort((a, b) => {
                                    var nameA = a.EmployeeName.toUpperCase();
                                    var nameB = b.EmployeeName.toUpperCase();
                                    if (nameA < nameB) {
                                        return -1;
                                    } else if (nameA > nameB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                })
                                .map((speaker: Speaker) => (
                                    <tr  key={speaker.Id}>
                                        <td  style={{ width: '15%' }}>
                                            <div >
                                                <Avatar employeeId={speaker.EmployeeId} />
                                            </div>
                                        </td>
                                        <td  className="text-middle" >
                                            {speaker.EmployeeName}
                                        </td>
                                        <td  className="text-middle" >
                                            {speaker.EmployeeId}
                                        </td>
                                        <td  className="text-middle" >
                                            <Dropdown id="SpeakerRoleList" listOptions={speakerRoles} placeholder="Select Role" selectedValue={speaker.RoleId} onSelect={(selectedItem) => this.saveRole(speaker,
                                                selectedItem) } isEnabled={isSpeakerEnabled}/>
                                        </td>
                                        <td  className="text-middle" >
                                            <button type="button"
                                                className="btn btn-xs btn-custom delete-button"                                              
                                                onClick={() => this.removeSelectedSpeaker(speaker) }
                                                disabled={!isSpeakerEnabled}>
                                                <span className="icon-trash">
                                                </span></button>                                            
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

export default SpeakerList;