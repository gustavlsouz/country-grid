import React from 'react'

const OptionPanel = props => {
	const childProps = {
		className: "right"
	}
	const children = React.Children.map(props.children, child => {
		return React.cloneElement(child, childProps)
	})

	return (
		<span className="option-panel right">
		{ children }
		</span>
	)
}

export default OptionPanel