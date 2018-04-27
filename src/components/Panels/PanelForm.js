import React from 'react'

import { Form, Select, Text } from 'react-form';

import { FormGroup } from './../form/FormGroup'

import Row from './../row/Row'

const PanelForm = props => {

	if (typeof props.statusOptions !== "object" || props.statusOptions === null) {
		return (null)
	}

	if (typeof props.statusOptions.groupBy !== "object" || props.statusOptions.groupBy === null
		|| typeof props.statusOptions.orderBy !== "object" || props.statusOptions.orderBy === null
		|| typeof props.statusOptions.orderByAZ !== "object" || props.statusOptions.orderByAZ === null) {
		return (null)
	}

	return (
		<div className="container col-md-6 form-wrap">
			<Form onChange={props.onChange} >
				{formApi => (
					<form onSubmit={formApi.submitForm} id="col-md-10 select-input-form" className="form">

						<Row>

							<FormGroup component={Text} field="search" label="Search" />

							<FormGroup component={Select} field="groupBy" label="Group By" options={props.statusOptions.groupBy} />
							<FormGroup component={Select} field="orderBy" label="Order By" options={props.statusOptions.orderBy} />
							<FormGroup component={Select} field="orderByAZ" label="Order" options={props.statusOptions.orderByAZ} />
						</Row>

					</form>
				)}
			</Form>
		</div>
	)
}

export default PanelForm