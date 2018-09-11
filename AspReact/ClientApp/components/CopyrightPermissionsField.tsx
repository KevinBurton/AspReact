
import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { TextArea, Label } from './Form';



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
        this.props.componentData(this.componentDescriptor, 'GetData');


	    

},



upsertChange : function (e: any) 
{
	if (e != '') 
	{

		
		this.props.componentData(this.componentDescriptor, 'Upsert');
		  
	}

},
	
componentDidMount : function ()
{

		  
	
},
	

componentDidUpdate : function (e: any) 
{
	if (e != '') 
	{

		
		this.props.componentData(this.componentDescriptor, 'Upsert');
		  
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
			
			eventEmitter: state.eventEmitter,
			
            CopyrightPermissionsField: [{
			
			ItemId: {	Value: '' }
			,CopyrightPermissions: {	Value: '' }
			
        }]
        };
    }

	 return {
        itemId: state.itemId,
		
		eventEmitter: state.eventEmitter,
		
        CopyrightPermissionsField: state.CopyrightPermissionsField
    };
};

export const CopyrightPermissionsFieldContainer =
    connect(
        mapStateToProps,
        actions
    )(CopyrightPermissionsFieldComponent) as React.ClassicComponentClass<any>;


export default CopyrightPermissionsFieldComponent;

