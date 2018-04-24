import React from 'react'



const Header = props => {

	return (
		<header className="App-header">
			{
				typeof props.logo === "string"
					? (<img src={props.logo} className="App-logo" alt="logo" />)
					: null
			}
			<h1 className="App-title">{props.title}</h1>
		</header>
	)
}

export default Header