import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import CheckBox from './CheckBox';


export interface NeedsExternalReviewFieldProps {

    getComponentData: (component: Object) => void;
    NeedsExternalReviewField: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const NeedsExternalReviewFieldComponent = React.createClass<NeedsExternalReviewFieldProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'NeedsExternalReviewField',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { NeedsExternalReviewField: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                NeedsExternalReviewFlg: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.NeedsExternalReviewField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'GetData');

    },

    upsertChange: function () {
        this.componentDescriptor.dataDictionary['NeedsExternalReviewFlg'] = this.props.NeedsExternalReviewField.NeedsExternalReviewFlg.Value == 'N' ? 'Y' : 'N';
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.NeedsExternalReviewField.ID.Value;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        return (
            <div id="NeedsExternalReviewField">
                <div>
                    <div className="form-group" >
                        <CheckBox
                            noForm={true}
                            isDisabled={!this.props.NeedsExternalReviewField.NeedsExternalReviewFlg.IsEnabled}
                            isChecked={this.props.NeedsExternalReviewField.NeedsExternalReviewFlg.Value == 'N' ? false : true}
                            onChange={() => this.upsertChange(this.props.NeedsExternalReviewField.NeedsExternalReviewFlg.Value) }>
                            NEEDS EXTERNAL REVIEW
                        </CheckBox>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.NeedsExternalReviewField) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            NeedsExternalReviewField: {
                ID: {
                    Value: '0'
                },
                ItemId: {
                    Value: itemId
                },
                NeedsExternalReviewFlg: {
                    Value: ''
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        NeedsExternalReviewField: state.NeedsExternalReviewField
    };
};

export const NeedsExternalReviewFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(NeedsExternalReviewFieldComponent as React.ClassicComponentClass<any>);


export default NeedsExternalReviewFieldComponent;



