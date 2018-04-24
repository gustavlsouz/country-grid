import React from 'react'

import { Form, Select } from 'react-form';

const PanelForm = props => {

	if (typeof props.statusOptions !== "object" || props.statusOptions === null) {
		return (null)
	}

	if (typeof props.statusOptions.groupBy !== "object" || props.statusOptions.groupBy === null
		|| typeof props.statusOptions.orderBy !== "object" || props.statusOptions.orderBy === null
		|| typeof props.statusOptions.orderByAZ !== "object" || props.statusOptions.orderByAZ === null) {
		return (null)
	}

	const FieldForm = props => {
		return (
			<span>
				<label htmlFor={`select-input-${props.name}`}>{props.label}</label>
				<Select field={props.field} id={`select-input-${props.name}`} options={props.options} className="mb-4" />
			</span>
		)
	}
	
	return (
		<span className="container">
			<Form onSubmit={submittedValues => props.onSubmit(submittedValues)}>
				{formApi => (
					<form onSubmit={formApi.submitForm} id="select-input-form" className="form">
						<FieldForm
							label="Group By"
							name="group-by"
							options={props.statusOptions.groupBy}
							field="groupBy" />
						<FieldForm
							label="Order By"
							name="order-by"
							options={props.statusOptions.orderBy}
							field="orderBy" />
						<FieldForm
							label="Order"
							name="order-by-az"
							options={props.statusOptions.orderByAZ}
							field="orderByAZ" />

						<button type="submit" className="mb-4 btn btn-primary">Atualizar</button>
					</form>
				)}
			</Form>
		</span>
	)
}

export default PanelForm