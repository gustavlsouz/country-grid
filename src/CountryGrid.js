import React from 'react'

import PanelForm from './components/panels/PanelForm'
import PanelTables from './components/panels/PanelTables'

import requests from './utils/requests'
import { onlyChars } from './utils/strings'
import arrayHandler from './utils/array.handler'

class CountryGrid extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			orderBy: "name"
			, groupBy: "region"
			, orderByAZ: "order"
			, search: ""
		}

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

		
		
		this.makeView = this.makeView.bind(this)
		this.prepareCountries = this.prepareCountries.bind(this)
		this.mountRow = this.mountRow.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.getSearchFields = this.getSearchFields.bind(this)
		this.onChange = this.onChange.bind(this)
		
		this.requests = requests()
		this.searchFields = this.getSearchFields()


	}

	getSearchFields() {
		let searchFields = []

		const groupByValues = this.statusOptions.groupBy.map(option => option.value)
		const orderByValues = this.statusOptions.orderBy.map(option => option.value)
		
		searchFields = searchFields.concat(groupByValues)
		searchFields = searchFields.concat(orderByValues)

		searchFields = arrayHandler.distinct(searchFields)
		
		return searchFields
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
		const state = this.state

		let countries = state.countries

		const order = (a, b) => {
			if (a[state.orderBy] < b[state.orderBy]) return -1;
			if (a[state.orderBy] > b[state.orderBy]) return 1;
			return 0;
		}

		const reverseOrder = (a, b) => {
			if (a[state.orderBy] > b[state.orderBy]) return -1;
			if (a[state.orderBy] < b[state.orderBy]) return 1;
			return 0;
		}

		const searchCountries = (countryObj, textToFind) => {
			const regex = new RegExp(textToFind, "gi")
			
			
			const results = this.searchFields.map(fieldSearch => {
				const value = countryObj[fieldSearch]
				return regex.test(value)
			})

			if (results.indexOf(true) > -1) {
				return true
			}

			return false
		}

		const search = onlyChars(state.search.trim(), /[0-9a-z ]/gi)

		if (search.length > 0) {
			countries = countries.filter((country) => searchCountries(country, search))
		}

		const newOrder = countries.sort(state.orderByAZ === "reverseOrder" ? reverseOrder : order)

		const newGroup = newOrder.reduce((obj, currentCountry) => {

			const currentKeyGroup = currentCountry[state.groupBy]

			if (obj[currentKeyGroup] === undefined) {
				const newList = []
				newList.push(currentCountry)
				obj[currentKeyGroup] = newList

			} else {
				obj[currentKeyGroup].push(currentCountry)
			}

			return obj
		}, {})

		this.setState({ view: newGroup })
	}

	mountRow(country, idx) {

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

		return (
			<tr key={`${country}-${idx}`}>
				<th scope="row"><img alt="country-img" className="country-image" src={country.flag} /></th>
				<td>{wiki(country.name)}</td>
				<td>{country.nativeName}</td>
				<td>{wiki(country.region)}</td>
				<td>{wiki(country.capital)}</td>
				<td>{country.alpha3Code}</td>
				<td>{Math.round((country.population / 1000000) * 100) / 100}</td>
				<td>{wiki(country.currency)}</td>
				<td>{wiki(country.language, "language")}</td>
			</tr>
		)
	}

	renderTables() {

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
								<th>Population(Million)</th>
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

		if (typeof submittedValues.orderBy && submittedValues.groupBy) {
			this.setState(submittedValues, this.makeView)
		}
	}

	onChange(formState, formApi) {
		const values = Object.assign({}, this.state, formState.values)

		console.log(values)

		this.setState(values, this.makeView)
	}

	render() {
		return (
			<main id="country-grid">
				<PanelForm statusOptions={this.statusOptions}
					onSubmit={this.onSubmit} 
					onChange={this.onChange}/>
				{
					typeof this.state.view === "object"
						? (<PanelTables list={Object.keys(this.state.view).sort()} />)
						: null
				}
				{typeof this.state.view === "undefined" ? null : this.renderTables()}
			</main>
		)
	}
}

export default CountryGrid