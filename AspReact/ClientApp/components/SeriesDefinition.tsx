import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor, IOption } from '../models/generic';
import { Label } from './Form';
import Dropdown from './Dropdown';


export interface SeriesDefinitionProps {

    getComponentData: (component: Object) => void;
    SeriesDefinition: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const SeriesDefinitionComponent = React.createClass<SeriesDefinitionProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'SeriesDefinition',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { SeriesDefinition: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                SeriesDefinitionId: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    componentDidMount() {
        
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['SeriesDefinitionId'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.SeriesDefinition.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.SeriesDefinition.DataList;
       
        let selectedValue = this.props.SeriesDefinition.SeriesDefinitionId
            ? this.props.SeriesDefinition.SeriesDefinitionId.Value
            : "0";

        return (
            <div id="seriesDefinition">
                    <div>
                        <div className="form-group" >
                        <Label id="SeriesDefinition_Label" text="SERIES   " required={false} />
                            {(listOptions[0].text != 'default') ?
                                <Dropdown id="seriesDefinitionList" listOptions={listOptions} placeholder="Select Series" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.SeriesDefinition.SeriesDefinitionId.IsEnabled} />
                            :
                            <div>
                            </div>
                            }
                        </div>
                    </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.SeriesDefinition) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            SeriesDefinition: {
                ItemId: {
                    Value: itemId
                },
                SessionCategoryId: {
                    Value: ''
                },
                SessionCategoryName: {
                    Value: ''
                },
                DataList: [{ value: '', text: 'default' }]
            }
        };
    }

    return {
        itemId: state.itemId,
        SeriesDefinition: state.SeriesDefinition
    };
};

export const SeriesDefinitionContainer =
    connect(
        mapStateToProps,
        actions
    )(SeriesDefinitionComponent as React.ClassicComponentClass<any>);


export default SeriesDefinitionComponent;



