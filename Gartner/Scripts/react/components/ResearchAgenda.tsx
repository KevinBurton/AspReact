import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import ComboBox from './kendo/ComboBox';
import HelpButton from './HelpButton';
import { Label } from './Form';
import { SetComponentDescriptorRefresh } from '../utils/eventEmitter';

export interface ResearchAgendaProps {

    getComponentData: (component: Object) => void;
    ResearchAgenda: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    itemid: string;
}


export const ResearchAgendaComponent = React.createClass<ResearchAgendaProps, any>({


    componentWillMount() {
        this.componentDescriptor = {
            name: 'ResearchAgenda',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { ResearchAgenda: action.newObject[0]});)',
            dataDictionary: {
                ID: '0', ItemId: '', AgendaId: '', PrimaryFlag: '', PrimaryMgrEmpCd: ''
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');
        
    },

    componentWillUnmount() {

    },

    componentDidMount() {

    },


    makePrimary: function (Agenda: any) {
        if (Agenda != "") {
            this.componentDescriptor.dataDictionary['ID'] = Agenda.ID.Value;
            this.componentDescriptor.dataDictionary['AgendaId'] = Agenda.AgendaId.Value;
            this.componentDescriptor.dataDictionary["PrimaryMgrEmpCd"] = Agenda.PrimaryMgrEmpCd.Value;
            this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
            this.componentDescriptor.dataDictionary["PrimaryFlag"] = "MakePrimary";
            this.props.componentData(this.componentDescriptor, 'Upsert');
            this.props.eventEmitter.emitEvent('ReviewerRefresh', [this.props.itemId]);
        }

        

    },

    deleteSelected(agenda: any) {
        this.componentDescriptor.dataDictionary['ID'] = agenda.ID.Value;
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['AgendaId'] = agenda.AgendaId.Value;
        this.props.componentData(this.componentDescriptor, 'Delete');

    },


    saveResearchAgenda(e) {
        if (e != "") {
            this.componentDescriptor.dataDictionary["AgendaId"] = e.split('/')[0];
            this.componentDescriptor.dataDictionary["PrimaryMgrEmpCd"] = e.split('/')[1];
            this.componentDescriptor.dataDictionary["ID"] = '0';
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["PrimaryFlag"] = "N";
            this.props.componentData(this.componentDescriptor, 'Upsert');
        }
    },
    render() {

        const ResearchAgendaBench = this.props.ResearchAgenda;

        return (
            <div className="portlet" id="ResearchAgenda">
                        <div className="portlet-title">
                            <div className="caption">
                                 Research Agenda Alignment
                            </div>
                        </div>

                        <div className="portlet-body">
                            <ComboBox
                                id="ResearchAgendaList"
                                name="ResearchAgendaList"
                                onSelect={(selectedItem) => this.saveResearchAgenda(selectedItem) }
                                url="/GenericApiHelper/GetPrimaryAgendas"
                                dataTextField="Text"
                                dataValueField="Value"
                                placeholder="Select Research Agenda"
                                isEnabled= {true}
                                ></ComboBox>
                      


                        <div className="table-responsive">
                            <table className="table table-condensed">
                                <tbody>
                                    {ResearchAgendaBench[0].ID.Value != '0' ?
                                        ResearchAgendaBench.sort((a, b) => {
                                            var nameA = a.AgendaName.Value.toUpperCase();
                                            var nameB = b.AgendaName.Value.toUpperCase();
                                            if (nameA < nameB) {
                                                return -1;
                                            } else if (nameA > nameB) {
                                                return 1;
                                            } else {
                                                return 0;
                                            }
                                        })
                                            .filter((Agenda) => { return Agenda.PrimaryFlag.Value == 'Y'; })
                                            .map((Agenda: any) => (
                                                <tr  key={"Agenda.ID.Value"}>
                                                    <td  className="text-middle" >
                                                        {Agenda.AgendaName.Value} (Primary)
                                                    </td>
                                                </tr>
                                            )
                                            )
                                        : <tr></tr>
                                    }
                                </tbody>
                            </table>
                        </div>


                        <div className="table-responsive">
                            <table className="table table-condensed">
                                <tbody>

                                    {ResearchAgendaBench[0].ID.Value != '' ?

                                        ResearchAgendaBench.sort((a, b) => {
                                            var nameA = a.AgendaName.Value.toUpperCase();
                                            var nameB = b.AgendaName.Value.toUpperCase();
                                            if (nameA < nameB) {
                                                return -1;
                                            } else if (nameA > nameB) {
                                                return 1;
                                            } else {
                                                return 0;
                                            }
                                        })
                                            .filter((Agenda) => { return Agenda.PrimaryFlag.Value == 'N'; })
                                            .map((Agenda: any) => (
                                                <tr  key={Agenda.ID.Value}>
                                                    <td  className="text-middle" width="50%" >
                                                        {Agenda.AgendaName.Value}
                                                    </td>
                                                    {Agenda.ActionButton.DefaultValue == 'Make Primary' ?
                                                        <td className="text-middle" width="50%">
                                                            {Agenda.ActionButton.IsVisible ?
                                                                <button type="button"
                                                                    className="btn btn-xs btn-custom btn-secondary btn-hlc"
                                                                    onClick={() => this.makePrimary(Agenda) }
                                                                    disabled={!Agenda.ActionButton.IsEnabled}>Make Primary
                                                                </button>
                                                                :
                                                                <div></div>}
                                                            <button type="button"
                                                                className="btn btn-xs btn-custom delete-button"
                                                                onClick={() => this.deleteSelected(Agenda) }
                                                                disabled={!Agenda.ActionButton.IsEnabled}>
                                                                <span className="icon-trash">
                                                                </span>
                                                            </button>
                                                        </td>
                                                        :
                                                        <td></td>}
                                                </tr>
                                            )
                                            )
                                        : <tr></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
          
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ResearchAgenda) {

        const { itemId } = state;

        return {
            itemId: state.itemId,
            eventEmitter: state.eventEmitter,
            ResearchAgenda: [{
                ID: {
                    Value: ''
                },
                ItemId: {
                    Value: itemId
                },
                AgendaId: {
                    Value: '',
                    IsRequired: ''
                },
                PrimaryFlag:
                {
                    Value: ''
                },
                PrimaryMgrEmpCd: { Value: '' }
            }]
        };
    }

    return {
        itemId: state.itemId,
        eventEmitter: state.eventEmitter,
        ResearchAgenda: state.ResearchAgenda
    };
};

export const ResearchAgendaContainer =
    connect(
        mapStateToProps,
        actions
    )(ResearchAgendaComponent) as React.ClassicComponentClass<any>;


export default ResearchAgendaComponent;


