import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [search, setSearch] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearch = () => {
        axios
            .get(`https://restcountries.com/v3.1/name/${search}`)
            .then((response) => {
                const data = response.data;
                if (data.length > 10) {
                    setErrorMessage('Too many matches. Please be more specific.');
                    setCountries([]);
                } else {
                    setErrorMessage(null);
                    setCountries(data);
                }
            })
            .catch((error) => {
                setErrorMessage('Error occurred while fetching data. Please try again.');
                setCountries([]);
            });
    };

    const handleCountryClick = (country) => {
        const isSelected = selectedCountries.some((selectedCountry) => selectedCountry.name.common === country.name.common);
        if (isSelected) {
            setSelectedCountries(selectedCountries.filter((selectedCountry) => selectedCountry.name.common !== country.name.common));
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    return (
        <div>
            Find countries: <input type={search} onChange={handleSearchChange} />
            <button onClick={handleSearch}>Search</button>
            {errorMessage && <p>{errorMessage}</p>}
            {selectedCountries.map((country) => (
                <div key={country.name.common}>
                    <h1>{country.name.common}</h1>
                    <img src={country.flags.png} alt={`${country.name.common} flag`} width="200" />
                    <p>Capital: {country.capital[0]}</p>
                    <p>Area: {country.area} km²</p>
                    <p>Languages: {Object.values(country.languages).join(', ')}</p>
                </div>
            ))}
            {countries.map((country) => (
                <li key={country.name.common}>
                    {country.name.common}{' '}
                    <button
                        onClick={() => handleCountryClick(country)}
                        style={{ fontWeight: selectedCountries.includes(country) ? 'bold' : 'normal' }}
                    >
                        {selectedCountries.includes(country) ? 'Hide' : 'Show'}
                    </button>
                </li>
            ))}
        </div>
    );
};

export default App;

