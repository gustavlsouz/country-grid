import React from 'react'

import { capitalize } from './../../utils/strings'

const mountItem = (item, idx) => {
	const hashtag = capitalize(item).replace(/\s/g, "")

	return (
		<span className="group-item col-md-2" key={`hash-${idx}`}>
			<a href={`#${item}`}>
				#{hashtag}
			</a>
		</span>
	)
}

const PanelTables = props => {

	return (
		<section>
			<div className="container">
				<div className="row">
					{props.list.map(mountItem)}
				</div>
			</div>
		</section>
	)
}

export default PanelTables