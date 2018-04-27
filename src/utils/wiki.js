import React from 'react'

const wiki = (data, sufix = "") => {
	if (sufix !== "") {
		sufix = `_${sufix}`
	}
	return (
		<a target="_blank" href={`https://en.wikipedia.org/wiki/${data.replace(/ /g, "_")}${sufix}`}>
			{data}
		</a>
	)
}

export default wiki