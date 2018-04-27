import React from 'react'
import ToggleButton from 'react-toggle-button'

import { Form, Select, Text } from 'react-form';

import { FormGroup } from './../form/FormGroup'

import Row from './../row/Row'

const toggleButtonColors = {
	activeThumb: {
		base: 'rgb(250,250,250)',
	},
	inactiveThumb: {
		base: 'rgb(62,130,247)',
	},
	active: {
		base: 'rgb(207,221,245)',
		hover: 'rgb(177, 191, 215)',
	},
	inactive: {
		base: 'rgb(65,66,68)',
		hover: 'rgb(95,96,98)',
	}
}


const PanelForm = props => {

	if (typeof props.statusOptions !== "object" || props.statusOptions === null) {
		return (null)
	}

	if (typeof props.statusOptions.groupBy !== "object" || props.statusOptions.groupBy === null
		|| typeof props.statusOptions.orderBy !== "object" || props.statusOptions.orderBy === null
		|| typeof props.statusOptions.orderByAZ !== "object" || props.statusOptions.orderByAZ === null) {
		return (null)
	}

	const toggle = (
		<ToggleButton
			inactiveLabel={'#'}
			activeLabel={'#'}
			colors={toggleButtonColors}
			thumbAnimateRange={[0, 36]}
			value={props.showHashtags}
			onToggle={props.onToggle}
		/>
	)

	return (
		<div className="container col-md-6 form-wrap">
			<Form onChange={props.onChange} >
				{formApi => (
					<form onSubmit={formApi.submitForm} id="col-md-10 select-input-form" className="form">

						<Row>

							<FormGroup component={Select} field="groupBy" label="Group By" options={props.statusOptions.groupBy} />
							<FormGroup component={Select} field="orderBy" label="Order By" options={props.statusOptions.orderBy} />
							<FormGroup component={Select} field="orderByAZ" label="Order" options={props.statusOptions.orderByAZ} />

							<FormGroup component={Text} field="search" label="Search" />

							<span className="form-group col-md-2">
								<label>Mostrar Hashtags</label>
								{toggle}
							</span>
						</Row>

					</form>
				)}
			</Form>
		</div>
	)
}

export default PanelForm