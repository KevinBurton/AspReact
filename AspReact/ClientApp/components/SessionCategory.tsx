import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import { Label } from './Form';
import HelpButton from './HelpButton';
import Dropdown from './Dropdown';
import componentData from '../utils/componentData';

const sessCategoryHelpText = "Session Category is required to create an idea or submit a session. Session Category defines the type of session going to be presented. You can find out more about session categories by clicking <a href='http://share.gartner.com/share/page/site/respub/document-details?nodeRef=workspace://SpacesStore/08610bd8-dee2-4f03-9d93-22a949f38133'>here</a>. If you have further questions, contact <a href='mailto:research.events@gartner.com'>Research Events</a>.";

export interface SessionCategoryProps {

    getComponentData: (component: Object) => void;
    SessionCategory: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    listOptions: Array<IOption>;
}

export const SessionCategoryComponent = React.createClass<SessionCategoryProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'SessionCategory',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { SessionCategory: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                SessionCategoryId: '0'
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

        componentData(this.componentDescriptor, 'GetData');

    },

    upsertChange: function (e: any) {
        this.componentDescriptor.dataDictionary['SessionCategoryId'] = e;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.componentDescriptor.dataDictionary["ID"] = this.props.SessionCategory.ID.Value;
        componentData(this.componentDescriptor, 'Upsert');
    },

    render() {

        const listOptions: Array<IOption> = this.props.SessionCategory.DataList;

        let selectedValue = this.props.SessionCategory.SessionCategoryId
            ? this.props.SessionCategory.SessionCategoryId.Value
            : "0";

        return (
            <div id="sessionCategory">
                    <div>
                        <div className="form-group" >
                        <Label id="SessionCategory_Label" text="SESSION CATEGORY   " required={this.props.SessionCategory.SessionCategoryId.IsRequired} />
                            <span  className="pull-right" >
                                <HelpButton  title="Session Category"  text={sessCategoryHelpText}  />
                            </span>

                            {(listOptions[0].text != 'default') ?
                                <Dropdown id="sessionCategoryList" listOptions={listOptions} placeholder="Select Session Category" selectedValue={selectedValue} onSelect={(selectedItem) => this.upsertChange(selectedItem) } isEnabled={this.props.SessionCategory.SessionCategoryId.IsEnabled} />
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
    if (!state.SessionCategory) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            SessionCategory: {
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
        SessionCategory: state.SessionCategory
    };
};

export const SessionCategoryContainer =
    connect(
        mapStateToProps,
        actions
    )(SessionCategoryComponent as React.ClassicComponentClass<any>);


export default SessionCategoryComponent;



