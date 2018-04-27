import React from 'react'

import { Form, Select, Text } from 'react-form';

import {FormGroup} from './../form/FormGroup'

const PanelForm = props => {

	if (typeof props.statusOptions !== "object" || props.statusOptions === null) {
		return (null)
	}

	if (typeof props.statusOptions.groupBy !== "object" || props.statusOptions.groupBy === null
		|| typeof props.statusOptions.orderBy !== "object" || props.statusOptions.orderBy === null
		|| typeof props.statusOptions.orderByAZ !== "object" || props.statusOptions.orderByAZ === null) {
		return (null)
	}


	const FieldGroup = props => {
		return React.Children.map(props.children, child => {
			// return React.createElement(child)
		})
	}
	
	return (
		<span className="container">
			<Form onSubmit={submittedValues => props.onSubmit(submittedValues)}
				onChange={props.onChange} >
				{formApi => (
					<form onSubmit={formApi.submitForm} id="select-input-form" className="form">
												
						<FormGroup component={Text} field="search" label="Search" />

						<FormGroup component={Select} field="groupBy" label="Search" options={props.statusOptions.groupBy} />
						<FormGroup component={Select} field="orderBy" label="Search" options={props.statusOptions.orderBy} />
						<FormGroup component={Select} field="orderByAZ" label="Search" options={props.statusOptions.orderByAZ} />

						<button type="submit" className="mb-4 btn btn-primary">Atualizar</button>
					</form>
				)}
			</Form>
		</span>
	)
}

export default PanelForm