import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { InputNumber, Label } from './Form';

interface TotalPagesProps {
};

interface TotalPagesState {
    totalPages: number;
};

export const TotalPagesComponent = React.createClass<TotalPagesProps, TotalPagesState>({
    getInitialState(): TotalPagesState {
        return {
            totalPages: 0
        };
    },
    componentWillMount() {

        this.componentDescriptor = {
            name: 'TotalPagesField',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { TotalPagesField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                TotalPages: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.TotalPagesField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData', (newObject) => {
            let pages: number = newObject.ObjectToReturn[0].TotalPages.Value;
            this.setState((prevState) => { return { totalPages: pages } });
        });
    },

    componentDidUpdate() {
        if (this.props.TotalPagesField.TotalPages.DefaultValue) {
            if (this.props.TotalPagesField.TotalPages.DefaultValue != '0') {
                if (this.props.TotalPagesField.TotalPages.Value == '') {
                    this.upsertChange(this.props.TotalPagesField.TotalPages.DefaultValue);
                }
            }
        }
    },

    upsertChange: function (e) {
        this.componentDescriptor.dataDictionary['TotalPages'] = e.target.value;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.TotalPagesField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    handleChange(e) {
        let pages: number = e.target.value;
        this.setState((prevState) => { return { totalPages: pages } });
    },

    render() {

        return (
            <div id="TotalPages">
                <div>
                    <div className="form-group" >
                        <Label id="TotalPages_Label" text="TOTAL NUMBER OF PAGES IN PRESENTATION  " required={this.props.TotalPagesField.TotalPages.IsRequired} />
                        <div  >
                            <InputNumber className="form-control"
                                id='TotalPages'
                                value={this.state.totalPages}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.TotalPagesField.TotalPages.MaxLength} />
                        </div>
                       
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.TotalPagesField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            TotalPagesField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                TotalPages: {
                    Value: ''
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        TotalPagesField: state.TotalPagesField
    };
};

export const TotalPagesFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(TotalPagesComponent as React.ClassicComponentClass<any>);


export default TotalPagesComponent;



