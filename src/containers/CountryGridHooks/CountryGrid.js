import React, { useEffect, useState, useMemo } from 'react';
// import Q from 'q'
import { ToastContainer, toast } from 'react-toastify';

import PanelForm from '../../components/Panels/PanelForm';
import PanelTables from '../../components/Panels/PanelTables';

import HttpClient from '../../utils/HttpClient';
import { onlyChars } from '../../utils/strings';
import wiki from '../../utils/wiki';
import ArrayHandler from '../../utils/ArrayHandler';
import { searhFilter } from './../../utils/regex'
import Cache from './../../utils/Cache'
const searchCache = Cache.create('search')
import statusOptionsDefault from './statusOptions';
// import { func } from 'prop-types';

const initialState = {
  orderBy: 'name',
  groupBy: 'region',
  orderByAZ: 'order',
  search: '',
  showHashtags: true,
  async: true,
};

const toastOptions = {
  position: toast.POSITION.TOP_LEFT,
};

const statusOptions = Object.keys(statusOptionsDefault).reduce((obj, key) => {
  const option = statusOptionsDefault[key].sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

  obj[key] = option;

  return obj;
}, {});

// const httpClient = new HttpClient({ baseURL: 'https://restcountries.eu/rest/v2' })
const searchFields = getSearchFields(statusOptions);

function getSearchFields(statusOptions) {
  const searchFields = [];

  const groupByValues = statusOptions.groupBy.map((option) => option.value);
  const orderByValues = statusOptions.orderBy.map((option) => option.value);

  const searchFieldsGroupByValuesList = searchFields
    .concat(groupByValues);
  const searchFieldsGroupByValOrderByVal = searchFieldsGroupByValuesList
    .concat(orderByValues);
  const finalSearchFields = ArrayHandler
    .distinct(searchFieldsGroupByValOrderByVal);

  return finalSearchFields;
}

function prepareCountries(countries) {
  return countries.map((country) => {
    country.currency = country.currencies[0].name;
    country.language = country.languages[0].name;

    return country;
  });
}

async function orderCountries({ countries, orderBy, orderByAZ }) {
  const order = (a, b) => {
    if (a[orderBy] < b[orderBy]) return -1;
    if (a[orderBy] > b[orderBy]) return 1;
    return 0;
  };

  const reverseOrder = (a, b) => {
    if (a[orderBy] > b[orderBy]) return -1;
    if (a[orderBy] < b[orderBy]) return 1;
    return 0;
  };

  return countries.sort(orderByAZ === 'reverseOrder' ? reverseOrder : order);
}

async function groupCountries({ countries, groupBy }) {
  return countries.reduce((group, currentCountry) => {
    const currentKeyGroup = currentCountry[groupBy];
    const list = group[currentKeyGroup] || [];
    list.push(currentCountry);
    group[currentKeyGroup] = list;
    return group;
  }, {});
}

function searchCountries({ country, regex }) {
  for (let idx = 0; idx < searchFields.length; idx++) {
    const fieldSearch = searchFields[idx];
    const value = country[fieldSearch];
    const hasWords = regex.test(value);
    if (hasWords) {
      return hasWords
    }
  }
  return false;
};

async function searchText({ countries, search }) {
  const filteredSearch = onlyChars(search.trim(), searhFilter);

  if (filteredSearch.length > 0) {
    const regex = new RegExp(filteredSearch, 'gi');
    return countries.filter((country) => searchCountries({ country, regex }));
  }

  return countries;
}

function renderView({ countries, setView, form }) {
  const queueInit = Date.now()
  const key = `${countries.length}.${form.groupBy}.${form.orderBy}.${form.orderByAZ}.${form.search}.${form.showHashtags}`
  const cached = searchCache.get(key)
  if (cached) {
    setView(cached.value);
    const final = Date.now() - queueInit;
    return
  }
  window.queueMicrotask(async () => {
    const init = Date.now();
    try {
      const {
        orderBy,
        orderByAZ,
        search,
        groupBy,
      } = form;
      const orderedCountries = await orderCountries({ countries, orderBy, orderByAZ });
      const filteredCountries = await searchText({ countries: orderedCountries, search });
      const groupedCountries = await groupCountries({ countries: filteredCountries, groupBy });
      searchCache.set(key, groupedCountries, { expireAt: Date.now() + (1000 * 60 * 10) })
      setView(groupedCountries);
      const final = Date.now() - init;
    } catch (error) {
      toast.error('Ocorreu um erro ao realizar o filtro :(', toastOptions);
      toast.error(error.message);
    }
  });
}

function mountRow(country, idx) {
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
      <td>{wiki(country.language, 'language')}</td>
    </tr>
  );
}

function RenderTables(props) {
  const { view } = props;

  const tables = Object.keys(view).sort().map((key, idx) => {
    const countryList = view[key];
    const countryComponents = countryList.map(mountRow)
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
              {countryComponents}
            </tbody>
          </table>
        </div>
      </div>
    );
  });

  return (
    <div id="tables-wrapper">
      {tables}
    </div>
  );
}

function onChange({ form, formState, setForm }) {
  return setForm({ ...form, ...formState.values });
}

function RenderPanelTables(props) {
  if (Object.is(props.view, Object.prototype) && props.showHashtags) {
    return (<PanelTables list={Object.keys(props.view).sort()} />);
  }
  return null;
}

async function loadCountries({
  setCountries,
  setView,
  form,
}) {
  const data = await new HttpClient({
    baseURL: 'https://restcountries.eu/rest/v2',
  }).get('/all');
  const transformedCountries = prepareCountries(data);
  setCountries(transformedCountries);
  renderView({
    countries: transformedCountries, setView, form,
  });
}

function CountryGrid() {
  const [countries, setCountries] = useState([]);
  const [view, setView] = useState(null);
  // const [screenConfig, setScreenConfig] = useState(initialState)
  const [form, setForm] = useState(initialState);
  const [showHashtags, setShowHashtags] = useState(true);

  useEffect(() => {
    loadCountries({
      setCountries, setView, form,
    });
  }, []);

  useEffect(() => {
    renderView({
      countries,
      setView,
      form,
    });
  }, [
    countries.length,
    form.groupBy,
    form.orderBy,
    form.orderByAZ,
    form.search,
    form.showHashtags
  ]);
  return (
    <div id="country-grid">
      <ToastContainer />

      <PanelForm
        statusOptions={statusOptions}
        onChange={(formState) => onChange({ form, formState, setForm })}
        showHashtags={showHashtags}
        onToggle={() => setShowHashtags(!showHashtags)}
        async={true}
        onToggleSearch={() => null}
      />

      <RenderPanelTables
        view={view}
        showHashtags={showHashtags}
      />

      {view ? <RenderTables view={view} /> : view}
    </div>
  );
}

export default CountryGrid;
