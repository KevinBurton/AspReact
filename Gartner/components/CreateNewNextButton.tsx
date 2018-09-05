import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Input, FormGroup, TextArea, Label } from './Form';

export interface CreateNewNextButtonProps {
    getComponentData: (component: Object) => void;
    CreateNewNextButton: Object;
    componentDescriptor: ComponentDescriptor;
    upsertChange: Function;
}

export const CreateNewNextButtonComponent = React.createClass<CreateNewNextButtonProps, any>({
	componentWillMount() {

		this.componentDescriptor = {
			name: 'CreateNewNextButton',
			returnObjectIndexed: true,
			stateFunction:
			'(objectAssign_1.default({}, state, { CreateNewNextButton: action.newObject[0]});)',
			dataDictionary: { ID: '', IsSuccess: '' }
		}

		this.componentDescriptor.dataDictionary["ID"] = this.props.itemId;
		this.props.componentData(this.componentDescriptor, 'GetData');
	},
    componentDidUpdate() {
        if (this.props.CreateNewNextButton.IsSuccess.Value == "Y") {
            window.location.href = "/HighLeverageContent/Details/" + this.componentDescriptor.dataDictionary.ID;
        } else {
            // Re-enable button when updated from redux
            this.btn.removeAttribute("disabled");
        }
    },
	btn: null,
	upsertChange: function (e) {
		this.btn.setAttribute("disabled", "disabled");
		this.componentDescriptor.dataDictionary["ID"] = this.props.itemId;
		this.props.componentData(this.componentDescriptor, 'PromoteFromCreateToIdea');
	},

	render() {

		return (
			<div id="CreateNewNextButton">
				<div >
					<div className="form-group" >
						<button ref={btn => { this.btn = btn; } }
							className="btn btn-primary pull-right"
							onClick={this.upsertChange}>
							Next {this.props.CreateNewNextButton.ButtonText.Value}
						</button>
					</div>
				</div>
			</div>
		);
	}
});

const mapStateToProps = (state) => {
	if (!state.CreateNewNextButton) {
		const { itemId } = state;
		return {
			itemId: state.itemId,
			CreateNewNextButton: {
				ID: {
					Value: itemId
				},
				ButtonText: {
					Value: ''
				},
				IsSuccess: {
					Value: ''
				}
			}
		};
	}

	return {
		itemId: state.itemId,
		CreateNewNextButton: state.CreateNewNextButton
	};
};

export const CreateNewNextButtonContainer =
	connect(
		mapStateToProps,
		actions
	)(CreateNewNextButtonComponent) as React.ClassicComponentClass<any>;


export default CreateNewNextButtonComponent;



