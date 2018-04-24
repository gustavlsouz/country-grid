import React from 'react'

import PanelForm from './components/Panels/PanelForm'

import requests from './utils/requests'

class CountryGrid extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			orderBy: "name"
			, groupBy: "region"
			, orderByAZ: "order"
		}

					// , view: { }
		/** orderBy
		 * name
			population
			currency
			language
		*/

		/** groupBy
		 * region
		 * currency
		 * language
		*/

		this.statusOptions = {
			groupBy: [
				{
					label: 'Region',
					value: 'region',
				},
				{
					label: "Currency",
					value: 'currency',
				},
				{
					label: "Language",
					value: 'language',
				},
			]
			, orderBy: [
				{
					label: 'Name',
					value: 'name',
				},
				{
					label: 'Population',
					value: 'population',
				},
				{
					label: "Currency",
					value: 'currency',
				},
				{
					label: "Language",
					value: 'language',
				}
			]
			, orderByAZ: [
				{
					label: "A-Z",
					value: 'order',
				}, {
					label: "Z-A",
					value: 'reverseOrder',
				}
			]
		}


		this.requests = requests()

		this.makeView = this.makeView.bind(this)
		this.prepareCountries = this.prepareCountries.bind(this)
		this.mountRow = this.mountRow.bind(this)
		this.onSubmit = this.onSubmit.bind(this)

	}

	componentDidMount() {
		this.requests.get(`/all`)
			.then(resp => {
				/**
				 * neste caso para simplificar o agrupamento.
				 */
				const countries = this.prepareCountries(resp.data)				
				this.setState({ countries }, this.makeView)
			})
	}

	prepareCountries(countries) {
		countries = countries.map((country) => {
			
			country.currency = country.currencies[0]["name"]
			country.language = country.languages[0]["name"]
			
			return country
		})
		return countries
	}

	makeView() {

		const order = (a, b) => {
			if (a[this.state.orderBy] < b[this.state.orderBy]) return -1;
			if (a[this.state.orderBy] > b[this.state.orderBy]) return 1;
			return 0;
		}

		const reverseOrder = (a, b) => {
			if (a[this.state.orderBy] > b[this.state.orderBy]) return -1;
			if (a[this.state.orderBy] < b[this.state.orderBy]) return 1;
			return 0;
		}

		const newOrder = this.state.countries.sort(this.state.orderByAZ === "reverseOrder" ? reverseOrder : order)

		// console.log("newOrder")
		// console.log(newOrder)
		const newGroup = newOrder.reduce((obj, currentCountry) => {

			const currentKeyGroup = currentCountry[this.state.groupBy]
			// console.log(currentKeyGroup)

			// console.log("content")
			// console.log(obj[currentKeyGroup])

			if (obj[currentKeyGroup] === undefined) {
				const newList = []
				newList.push(currentCountry)
				obj[currentKeyGroup] = newList
				
			} else {
				obj[currentKeyGroup].push(currentCountry)
			}

			return obj
		}, {})
		
		// Object.keys(newGroup).forEach(key => {
		// 	console.log(key)
		// 	console.log(newGroup[key])
		// })

		// Object.values(newGroup).forEach(group => console.log(group))
		
		this.setState({ view: newGroup})
	}

	mountRow(country, idx) {

		const wiki = (data, sufix="") => {
			if (sufix !== "") {
				sufix = `_${sufix}`
			}
			return (
				<a target="_blank" href={`https://en.wikipedia.org/wiki/${data.replace(/ /g, "_")}${sufix}`}>
					{data}
				</a>
			)
		}

		return (
			<tr key={`${country}-${idx}`}>
				<th scope="row"><img alt="country-img" className="country-image" src={country.flag} /></th>
				<td>{wiki(country.name)}</td>
				<td>{country.nativeName}</td>
				<td>{wiki(country.region)}</td>
				<td>{wiki(country.capital)}</td>
				<td>{country.alpha3Code}</td>
				<td>{country.population}</td>
				<td>{wiki(country.currency)}</td>
				<td>{wiki(country.language, "language")}</td>
			</tr>
		)
	}

	renderTables() {

		console.log("renderTables")

		const tables = Object.keys(this.state.view).sort().map((key, idx) => {
			const countryList = this.state.view[key]

			return (
				<div id={`${key}`} key={key} className="container group-container">
					<span>
						<h4>{key}</h4>
					</span>
					<table id={`${key}-${idx}`} className="table table-striped">
						<thead>
							<tr>
								<th>Flag</th>
								<th>Name</th>
								<th>Native Name</th>
								<th>Region</th>
								<th>Capital</th>
								<th>Code</th>
								<th>Population</th>
								<th>Currency</th>
								<th>Language</th>
							</tr>
						</thead>
						<tbody>
								{
									countryList.map(this.mountRow)
								}
						</tbody>
					</table>
				</div>
			)
		})
		
		return (
			<div>
				{tables}
			</div>
		)
	}

	onSubmit(submittedValues) {
		console.log(submittedValues)
		if (typeof submittedValues.orderBy && submittedValues.groupBy) {
			this.setState(submittedValues, this.makeView)
		}
	}

	render() {
		return (
			<div id="country-grid">
				<PanelForm statusOptions={this.statusOptions}
					onSubmit={this.onSubmit}/>
			{ typeof this.state.view === "undefined" ? null : this.renderTables() }
			</div>
		)
	}
}

export default CountryGrid