const cityName = document.querySelector('.city-name');
const countryName = document.querySelector('.country-name');

const currentTemp = document.querySelector('.current-temp-text');
const date = document.querySelector('.dates');
const feelsLike = document.querySelector('.feels-like-temp');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');
const precipitation = document.querySelector('.precipitation');
const maxTemp = document.querySelectorAll('.day-max-temp');
const minTemp = document.querySelectorAll('.day-min-temp');

const hoursContainer = document.querySelector('.hours-container');
const selectDays = document.querySelector('.select-days');
const listDays = document.querySelector('.list-days');
const selectDayIcon = document.querySelector('.select-day-icon');
const today = document.querySelector('.today');

const CelsiusSwitch = document.getElementById('switch-i-m');
const CelsiusSwitchLabel = document.getElementById('switch-i-m-label');
const dailyFBox = document.querySelectorAll('.daily-f-box');

const CelsiusLi = document.querySelector('.celsius');
const FahrenheitLi = document.querySelector('.fahrenheit');
const KmHourLi = document.querySelector('.km-hour');
const MphHourLi = document.querySelector('.mp-hour');
const MmLi = document.querySelector('.milimeter');
const InchLi = document.querySelector('.inches');

const citiesList = document.querySelector('.cities-list');
const searchInProgress = document.querySelector('.search-in-progress');

const NoResult = document.querySelector('.no-result');
const MainSection = document.querySelector('.sec-2');


let currentLatitude = null;
let currentLongitude = null;

navigator.geolocation.getCurrentPosition(async (position) => {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;

    const locationRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${currentLatitude}&longitude=${currentLongitude}&localityLanguage=en`);
    const locationData = await locationRes.json();

    cityName.textContent = locationData.city;
    countryName.textContent = locationData.countryName;

    fetchWeatherMetric(currentLatitude, currentLongitude);
});


async function fetchWeatherMetric(lat, long) {

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
    const weatherData = await weatherRes.json();

    currentTemp.textContent = weatherData.current.temperature_2m + '°';
    date.textContent = new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    feelsLike.textContent = weatherData.current.apparent_temperature + '°';
    humidity.textContent = weatherData.current.relative_humidity_2m + weatherData.current_units.relative_humidity_2m;
    windSpeed.textContent = weatherData.current.wind_speed_10m + ' ' + weatherData.current_units.wind_speed_10m;
    precipitation.textContent = weatherData.current.precipitation + ' ' + weatherData.current_units.precipitation;

    setTimeout(() => {
        const currentTempInfoBoxLoading = document.querySelector('.current-temp-info-box-loading');
        const currentTempInfoBox = document.querySelector('.current-temp-info-box');
        const currentTempBoxLoading = document.querySelector('.current-temp-box-loading');
        const currentTempBox = document.querySelector('.current-temp-box');
        const dailyFboxLoading = document.querySelectorAll('.daily-f-box-loading');
        const dailyFcontainer = document.querySelector('.daily-f-container');
        const hoursContainerLoading = document.querySelector('.hours-container-loading');
        const hoursContainer = document.querySelector('.hours-container');

        currentTempInfoBoxLoading.classList.add('d-none');
        currentTempInfoBoxLoading.classList.remove('d-grid');
        currentTempInfoBox.classList.remove('d-none');
        currentTempInfoBox.classList.add('d-grid');

        currentTempBoxLoading.classList.add('d-none');
        currentTempBoxLoading.classList.remove('d-flex');
        currentTempBox.classList.remove('d-none');
        currentTempBox.classList.add('d-flex');

        dailyFboxLoading.forEach(element => {
            element.classList.add('d-none');
            element.classList.remove('d-grid');
        });
        dailyFcontainer.classList.remove('d-none');
        dailyFcontainer.classList.add('d-grid');
        hoursContainerLoading.classList.add('d-none');
        hoursContainerLoading.classList.remove('d-flex');
        hoursContainer.classList.add('d-flex');
        hoursContainer.classList.remove('d-none');
    });

    const currentTempIcon = document.querySelector('.current-temp-icon');
    currentTempIcon.src = FilterWeatherIcons(weatherData.current.weather_code);

    const dailyFIcons = document.querySelectorAll('.daily-f-icon');
    dailyFIcons.forEach((icon, index) => {
        icon.src = FilterWeatherIcons(weatherData.daily.weather_code[index]);
    })

    const apidays = weatherData.daily.time;
    const dayNames = [];
    apidays.forEach(date => {
        const day = new Date(date).toLocaleDateString('en', { weekday: 'short' });
        dayNames.push(day);
    })
    const days = document.querySelectorAll('.day');
    days.forEach((day, index) => {
        day.textContent = dayNames[index];
    })

    const dayNamesLong = [];
    apidays.forEach(date => {
        const day = new Date(date).toLocaleDateString('en', { weekday: 'long' });
        dayNamesLong.push(day);
    })
    const daysLong = document.querySelectorAll('.day-long');
    today.textContent = dayNamesLong[0];
    daysLong.forEach((day, index) => {
        day.textContent = dayNamesLong[index];
    })


    const maxtempsC = weatherData.daily.temperature_2m_max;
    const mintempsC = weatherData.daily.temperature_2m_min;

    maxTemp.forEach((temp, index) => {
        temp.textContent = maxtempsC[index] + '°';
    })

    minTemp.forEach((temp, index) => {
        temp.textContent = mintempsC[index] + '°';
    })

    function HourlyForecastC(dayIndex) {
        hoursContainer.innerHTML = '';
        const start = dayIndex * 24;
        const end = start + 24;
        const dayHours = weatherData.hourly.time.slice(start, end);
        const dayTemps = weatherData.hourly.temperature_2m.slice(start, end);
        const dayIcons = weatherData.hourly.weather_code.slice(start, end);

        dayHours.forEach((time, i) => {
            const hour = new Date(time).toLocaleTimeString('en', { hour: 'numeric' });
            const temp = dayTemps[i];

            const hourElements = document.createElement('div');
            hourElements.classList.add('hour-box', 'd-flex', 'align-i-center', 'just-c-sb', 'bor-rad-10', 'pad-05r');
            hourElements.innerHTML = `
                <div class="d-flex align-i-center gap-05r">
                    <img src="" alt="" class="hourly-f-icon">
                    <p class="color-w hour">${hour}</p>
                </div>
                <p class="color-w hour-temp">${temp}°</p>
                `;
            hoursContainer.appendChild(hourElements);
        });


        const hourlyIcons = document.querySelectorAll('.hourly-f-icon');
        hourlyIcons.forEach((icon, i) => {
            icon.src = FilterWeatherIcons(dayIcons[i]);
        });
    }

    const daysLi = document.querySelectorAll('.days');
    daysLi.forEach((day, index) => {
        day.addEventListener('click', () => {
            today.textContent = day.textContent;
            HourlyForecastC(index);
        })
    })
    HourlyForecastC(0);
}

async function fetchWeatherImperial(lat, long) {
    const WeatherResF = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`)
    const WeatherDataF = await WeatherResF.json();

    currentTemp.textContent = WeatherDataF.current.temperature_2m + '°';
    date.textContent = new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    feelsLike.textContent = WeatherDataF.current.apparent_temperature + '°';
    humidity.textContent = WeatherDataF.current.relative_humidity_2m + '%';
    windSpeed.textContent = WeatherDataF.current.wind_speed_10m + ' ' + WeatherDataF.current_units.wind_speed_10m;
    precipitation.textContent = WeatherDataF.current.precipitation + ' ' + WeatherDataF.current_units.precipitation;

    const maxTempsF = WeatherDataF.daily.temperature_2m_max;
    const minTempsF = WeatherDataF.daily.temperature_2m_min;

    maxTemp.forEach((temp, index) => {
        temp.textContent = maxTempsF[index] + '°';
    })
    minTemp.forEach((temp, index) => {
        temp.textContent = minTempsF[index] + '°';
    })

    function HourlyForecastF(dayIndex) {
        hoursContainer.innerHTML = '';
        const start = dayIndex * 24;
        const end = start + 24;
        const dayTemps = WeatherDataF.hourly.temperature_2m.slice(start, end);
        const dayHours = WeatherDataF.hourly.time.slice(start, end);
        const dayIcons = WeatherDataF.hourly.weather_code.slice(start, end);

        dayHours.forEach((time, i) => {
            const hour = new Date(time).toLocaleTimeString('en', { hour: 'numeric' });
            const temp = dayTemps[i];

            const hourElements = document.createElement('div');
            hourElements.classList.add('hour-box', 'd-flex', 'align-i-center', 'just-c-sb', 'bor-rad-10', 'pad-05r');
            hourElements.innerHTML = `
                <div class="d-flex align-i-center gap-05r">
                    <img src="" alt="" class="hourly-f-icon">
                    <p class="color-w hour">${hour}</p>
                </div>
                <p class="color-w hour-temp">${temp}°</p>
                `;
            hoursContainer.appendChild(hourElements);
        });
        const hourlyIcons = document.querySelectorAll('.hourly-f-icon');
        hourlyIcons.forEach((icon, i) => {
            icon.src = FilterWeatherIcons(dayIcons[i]);
        });
    }

    const daysLi = document.querySelectorAll('.days');
    daysLi.forEach((day, index) => {
        day.addEventListener('click', () => {
            today.textContent = day.textContent;
            HourlyForecastF(index);
        })
    })

    HourlyForecastF(0);
}

function FilterWeatherIcons(code) {
    if (code === 0 || code === 1) {
        return './assets/images/icon-sunny.webp';
    } else if (code === 2) {
        return './assets/images/icon-partly-cloudy.webp';
    } else if (code === 3) {
        return './assets/images/icon-overcast.webp';
    } else if (code >= 45 && code <= 48) {
        return './assets/images/icon-fog.webp';
    } else if (code >= 51 && code <= 57) {
        return './assets/images/icon-drizzle.webp';
    } else if (code >= 61 && code <= 67 || code >= 80 && code <= 85) {
        return './assets/images/icon-rain.webp';
    } else if (code >= 71 && code <= 77) {
        return './assets/images/icon-snow.webp';
    } else if (code >= 95 && code <= 99) {
        return './assets/images/icon-storm.webp';
    }
}


selectDays.addEventListener('click', () => {
    listDays.classList.toggle('open');
    selectDayIcon.classList.toggle('trans-rotate-180deg');
});

const SearchInput = document.getElementById('search-input');
const SearchBtn = document.querySelector('.search-btn');

async function fetchWeatherByCityName(city) {
    searchInProgress.classList.add('open');

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&timezone=&count=10&language=en&format=json`);

        if (!res.ok) {
            throw new Error('City not found');
        }
        if (res.ok) {
            MainSection.classList.add('d-grid');
            MainSection.classList.remove('d-none');
            NoResult.classList.add('d-none');
            NoResult.classList.remove('d-flex');
        }

        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }

        currentLatitude = data.results[0].latitude;
        currentLongitude = data.results[0].longitude;

        fetchWeatherMetric(currentLatitude, currentLongitude);

        cityName.textContent = data.results[0].name;
        countryName.textContent = data.results[0].country;

    } catch (error) {
        NoResult.classList.remove('d-none');
        NoResult.classList.add('d-flex');
        MainSection.classList.add('d-none');
        MainSection.classList.remove('d-grid');

    } finally {
        searchInProgress.classList.remove('open');
    }
}

SearchBtn.addEventListener('click', () => {
    if (SearchInput.value === '') {
        return;
    } else {
        fetchWeatherByCityName(SearchInput.value.trim());
        citiesList.classList.remove('open');
        SearchInput.value = '';
    }
});



CelsiusSwitch.addEventListener('click', () => {
    CelsiusSwitchLabel.textContent = CelsiusSwitch.checked ? 'Switch to Metric' : 'Switch to Imperial';
    if (!CelsiusSwitch.checked) {
        fetchWeatherMetric(currentLatitude, currentLongitude);
        CelsiusLi.classList.add('active');
        FahrenheitLi.classList.remove('active');
        KmHourLi.classList.add('active');
        MphHourLi.classList.remove('active');
        MmLi.classList.add('active');
        InchLi.classList.remove('active');
    } else {
        fetchWeatherImperial(currentLatitude, currentLongitude);
        CelsiusLi.classList.remove('active');
        FahrenheitLi.classList.add('active');
        KmHourLi.classList.remove('active');
        MphHourLi.classList.add('active');
        MmLi.classList.remove('active');
        InchLi.classList.add('active');
    }
});

SearchInput.addEventListener('input', () => {
    const query = SearchInput.value.trim();
    try {
        if (query.length >= 2) {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&timezone=&count=10&language=en&format=json`)
                .then(res => res.json())
                .then(data => {
                    citiesList.innerHTML = '';
                    if (data.results && data.results.length > 0) {
                        data.results.forEach(city => {
                            const cityElement = document.createElement('li');
                            cityElement.classList.add('color-w', 'city', 'bor-rad-10', 'pad-05r', 'tr-a-03s-ea', 'cursor-p');
                            cityElement.textContent = `${city.name}, ${city.country}`;
                            citiesList.classList.add('open');
                            cityElement.addEventListener('click', () => {
                                fetchWeatherByCityName(city.name);
                                citiesList.classList.remove('open');
                            });
                            citiesList.appendChild(cityElement);
                        });
                    }
                })
        }
    } catch (error) {
        console.error(error);
    }
});

SearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (SearchInput.value === '') {
            return;
        } else {
            fetchWeatherByCityName(SearchInput.value.trim());
            citiesList.classList.remove('open');
            SearchInput.value = '';
        }
    }
    if (SearchInput.value === '') {
        citiesList.classList.remove('open');
    }
})