import React from 'react'

const PanelTables = props => {
	const mountItem = (item, idx) => {
		if (idx % 10 === 0 ) {
			return (
				<div className="group-item" key={`hash-${idx}`}>
					<a href={`#${item}`}>
						#{item}
					</a>
				</div>
			)
		}
		return (
			<span className="group-item" key={`hash-${idx}`}>
				<a href={`#${item}`}>
					#{item}
				</a>
			</span>
		)
	}
	return (
		<div>
		{props.list.map(mountItem)}
		</div>
	)
}

export default PanelTables