
import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { TextArea, Label } from './Form';
import componentData from '../utils/componentData';

export interface CopyrightPermissionsFieldProps {
    getComponentData: (component: Object) => void;
    CopyrightPermissionsField: Object;
    componentDescriptor: ComponentDescriptor;
	updateState: Function;

}




export const CopyrightPermissionsFieldComponent = React.createClass<CopyrightPermissionsFieldProps, any>({

componentWillMount() {
	this.componentDescriptor = {
		name: 'CopyrightPermissionsField',
		returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { CopyrightPermissionsField: action.newObject});)',
		dataDictionary: {

			ItemId: '',
			CopyrightPermissions: ''
		}
	}
		this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        componentData(this.componentDescriptor, 'GetData');




},



upsertChange : function (e: any)
{
	if (e != '')
	{


		componentData(this.componentDescriptor, 'Upsert');

	}

},

componentDidMount : function ()
{



},


componentDidUpdate : function (e: any)
{
	if (e != '')
	{


		componentData(this.componentDescriptor, 'Upsert');

	}

},


render() {
const CopyrightPermissionsField = this.props.CopyrightPermissionsField;




return (
			            <div id="CopyrightPermissions">
                <div >
                    <div className="form-group" >
                        <Label id="CopyrightPermissions_Label" text="COPYRIGHT PERMISSIONS  " required={this.props.CopyrightPermissionsField.CopyrightPermissions.IsRequired} />
                        <div  >
                            <TextArea className="form-control"
                                id='CopyrightPermissions'
                                value={this.props.CopyrightPermissionsField.CopyrightPermissions.Value}
                                onChange={this.handleChange}
                                onBlur={this.upsertChange}
                                maxLength={this.props.CopyrightPermissionsField.CopyrightPermissions.MaxLength} />
                        </div>
                    </div>
                </div>
            </div>

	);
}
});

	const mapStateToProps = (state) => {
    if (!state.CopyrightPermissionsField) {
        return {
            itemId: state.itemId,
            CopyrightPermissionsField: [{

			ItemId: {	Value: '' }
			,CopyrightPermissions: {	Value: '' }

        }]
        };
    }

	 return {
        itemId: state.itemId,
        CopyrightPermissionsField: state.CopyrightPermissionsField
    };
};

export const CopyrightPermissionsFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(CopyrightPermissionsFieldComponent) as React.ClassicComponentClass<any>;


export default CopyrightPermissionsFieldComponent;

