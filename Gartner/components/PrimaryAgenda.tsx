import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import ComboBox from './kendo/ComboBox';
import HelpButton from './HelpButton';
import { Label } from './Form';

export interface PrimaryAgendaProps {
    getComponentData: (component: Object) => void;
    PrimaryAgenda: Object;
    componentDescriptor: ComponentDescriptor;
}

export const PrimaryAgendaComponent = React.createClass<PrimaryAgendaProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'PrimaryAgenda',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { PrimaryAgenda: action.newObject[0]});)',
            dataDictionary: {
                ID: '0', ItemId: '', AgendaId: '0', PrimaryFlag: '', PrimaryMgrEmpCd: ''
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidMount() {
    },
   
    savePrimaryAgenda(e) {
        if (e != "") {
            this.componentDescriptor.dataDictionary["AgendaId"] = e.split('/')[0];
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["PrimaryFlag"] = 'Y';
            this.componentDescriptor.dataDictionary["PrimaryMgrEmpCd"] = e.split('/')[1];
            this.componentDescriptor.dataDictionary["ID"] = this.props.PrimaryAgenda.ID.Value;
          
            var self = this;
            this.componentDescriptor.onComponentOperationComplete = () => {
                self.props.eventEmitter.emitEvent('ReviewerRefresh', [self.props.itemId]);
                self.props.eventEmitter.emitEvent('QVRRefresh', [self.props.itemId]);
            };

            this.props.componentData(this.componentDescriptor, 'Upsert');
        }
    },
    render() {
        
        return (
            <div id="primaryAgenda">
                <div>
                    <div className="form-group" >
                        <Label id="PrimaryAgenda_Label" text="PRIMARY AGENDA  " required={this.props.PrimaryAgenda.AgendaId.IsRequired} />

                        <div>
                            <ComboBox
                                id="primaryAgendaList"
                                name="primaryAgendaList"
                                onSelect={(selectedItem) => this.savePrimaryAgenda(selectedItem) }
                                url="/GenericApiHelper/GetPrimaryAgendas"
                                dataTextField="Text"
                                dataValueField="Value"
                                placeholder="Select Primary Agenda"
                                isEnabled= {true}
                                ></ComboBox>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
  
const mapStateToProps = (state) => {
    if (!state.PrimaryAgenda) {

        const { itemId } = state;

        return {
            itemId: state.itemId,
            PrimaryAgenda: {
                ID: {
                    Value: ''
                },
                ItemId: {
                    Value: itemId
                },
                AgendaId: {
                    Value: ''
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        PrimaryAgenda: state.PrimaryAgenda
    };
};

export const PrimaryAgendaContainer =
    connect(
        mapStateToProps,
        actions
    )(PrimaryAgendaComponent) as React.ClassicComponentClass<any>;


export default PrimaryAgendaComponent;


