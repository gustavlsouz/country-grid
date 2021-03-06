import React from 'react'
import Q from 'q'
import { ToastContainer, toast } from 'react-toastify';

import PanelForm from './components/panels/PanelForm'
import PanelTables from './components/panels/PanelTables'

import requests from './utils/requests'
import { onlyChars } from './utils/strings'
import wiki from './utils/wiki'
import arrayHandler from './utils/array.handler'


class CountryGrid extends React.Component {
	constructor(props) {
		super(props)

		const initialState = {
			orderBy: "name"
			, groupBy: "region"
			, orderByAZ: "order"
			, search: ""
			, showHashtags: true
			, async: true
		}

		this.initialState = initialState;
		this.state = initialState;

		this.toastOptions = {
			position: toast.POSITION.TOP_LEFT
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

		const statusOptions = {
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
					label: 'Capital',
					value: 'capital',
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

		this.statusOptions = Object.keys(statusOptions).reduce((obj, key) => {

			const option = statusOptions[key].sort((a, b) => {
				if (a["value"] < b["value"]) return -1
				if (a["value"] > b["value"]) return 1
				return 0
			})

			obj[key] = option

			return obj
		}, {})

		this.requests = requests()
		this.searchFields = this.getSearchFields()

	}

	getSearchFields = () => {

		const searchFields = [];

		const statusOptions = this.statusOptions

		const groupByValues = statusOptions.groupBy.map(option => option.value)
		const orderByValues = statusOptions.orderBy.map(option => option.value)

		const searchFieldsGroupByValuesList = searchFields.concat(groupByValues)
		const searchFieldsGroupByValOrderByVal = searchFieldsGroupByValuesList.concat(orderByValues)
		const finalSearchFields = arrayHandler.distinct(searchFieldsGroupByValOrderByVal)

		return finalSearchFields

	}

	renderView = () => {
		if (this.state.async) {
			this.makeView()
		} else {
			this.makeViewSync()
		}
	}

	componentDidMount = () => {
		this.requests.get(`/all`)
			.then(resp => {
				/**
				 * neste caso para simplificar o agrupamento.
				 */
				const countries = this.prepareCountries(resp.data)
				this.setState({ countries }, this.renderView)
			})
	}

	prepareCountries = (countries) => {
		countries = countries.map((country) => {

			country.currency = country.currencies[0]["name"]
			country.language = country.languages[0]["name"]

			return country
		})
		return countries
	}

	orderCountries = (countries) => {

		const { state } = this
			, { orderBy } = state

		const order = (a, b) => {
			if (a[orderBy] < b[orderBy]) return -1
			if (a[orderBy] > b[orderBy]) return 1
			return 0
		}

		const reverseOrder = (a, b) => {
			if (a[orderBy] > b[orderBy]) return -1
			if (a[orderBy] < b[orderBy]) return 1
			return 0
		}

		countries = countries.sort(state.orderByAZ === "reverseOrder" ? reverseOrder : order)

		return Q.resolve(countries)
	}

	groupCountries = countries => {
		const state = this.state;

		countries = countries.reduce((obj, currentCountry) => {

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

		return Q.resolve(countries)
	}

	searchText = countries => {

		const { state } = this

		const searchCountries = (countryObj, textToFind) => {
			const regex = new RegExp(textToFind, "gi")
			const searchFields = this.searchFields

			for (let idx = 0; idx < searchFields.length; idx++) {
				const fieldSearch = searchFields[idx]
				const value = countryObj[fieldSearch]
				const hasWords = regex.test(value)
				if (hasWords) return true
			}
			return false
		}

		const search = onlyChars(state.search.trim(), /[0-9a-z ]/gi)

		if (search.length > 0) {
			countries = countries.filter((country) => searchCountries(country, search))
		}

		return Q.resolve(countries)
	}

	makeView = () => {

		const { countries } = this.state;

		this.orderCountries(countries)
			.then(this.searchText)
			.then(this.groupCountries)
			.then(countries => {
				this.setState({ view: countries })
			})
			.catch(err => {
				toast.error("Ocorreu um erro ao realizar o filtro :(", this.toastOptions)
				toast.error(err.message);
			})
	}

	makeViewSync = () => {

		const initialTime = Date.now()

		const state = this.state
			, orderBy = state.orderBy
			;


		let countries = state.countries

		const order = (a, b) => {
			if (a[orderBy] < b[orderBy]) return -1
			if (a[orderBy] > b[orderBy]) return 1
			return 0
		}

		const reverseOrder = (a, b) => {
			if (a[orderBy] > b[orderBy]) return -1
			if (a[orderBy] < b[orderBy]) return 1
			return 0
		}

		const searchCountries = (countryObj, textToFind) => {
			const regex = new RegExp(textToFind, "gi")
			const searchFields = this.searchFields

			for (let idx = 0; idx < searchFields.length; idx++) {
				const fieldSearch = searchFields[idx]
				const value = countryObj[fieldSearch]
				const hasWords = regex.test(value)
				if (hasWords) return true
			}
			return false
		}

		const search = onlyChars(state.search.trim(), /[0-9a-z ]/gi)

		if (search.length > 0) {
			countries = countries.filter((country) => searchCountries(country, search))
		}

		countries = countries.sort(state.orderByAZ === "reverseOrder" ? reverseOrder : order)

		const newGroup = countries.reduce((obj, currentCountry) => {

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

		console.log(`${Date.now() - initialTime} ms`)
		this.setState({ view: newGroup })
	}

	mountRow = (country, idx) => {

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

	renderTables = () => {
		const view = this.state.view

		const tables = Object.keys(view).sort().map((key, idx) => {
			const countryList = view[key]

			return (
				<div id={`${key}`} key={key} className="container group-container">
					<div className="panel panel-primary">
						<div className="panel-heading">
							<h4 className="panel-title">{key}</h4>
						</div>

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
				</div>
			)
		})

		return (
			<div id="tables-wrapper">
				{tables}
			</div>
		)
	}

	onChange = (formState) => {
		const values = Object.assign({}, this.state, formState.values)
		this.setState(values, this.renderView)
	}

	onToggle = (value) => {
		this.setState(prevState => ({ showHashtags: !prevState.showHashtags }))
	}

	onToggleSearch = () => {
		this.setState(prevState => ({ async: !prevState.async }))
	}

	renderPanelTables = () => {
		if (typeof this.state.view === "object" && this.state.showHashtags) {
			return (<PanelTables list={Object.keys(this.state.view).sort()} />)
		}
		return null
	}

	render = () => {
		return (
			<div id="country-grid">
				<ToastContainer />

				<PanelForm statusOptions={this.statusOptions}
					onChange={this.onChange}
					showHashtags={this.state.showHashtags}
					onToggle={this.onToggle}
					async={this.state.async}
					onToggleSearch={this.onToggleSearch}
				/>


				<this.renderPanelTables />

				{typeof this.state.view === "undefined" ? null : <this.renderTables />}
			</div>
		)
	}
}

export default CountryGrid