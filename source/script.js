const wrapper = document.querySelector('.wrapper')
const inputPart = wrapper.querySelector('.input-part')
const infoTxt = inputPart.querySelector('.info-txt')
const inputField = inputPart.querySelector('input')
const locationBtn = inputPart.querySelector('button')
const wIcon = document.querySelector('.weather-part img')
const arrowBack = wrapper.querySelector('header i')

inputField.addEventListener('keyup', (e) => {
  if (e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value)
  }
})

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSucsess, onError)
  } else {
    alert('Your browser not support geolocation api')
  }
})

function onSucsess(position) {
  const { latitude, longitude } = position.coords
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${'a78a9ebe1fbfd1c4e14ec10f012a18d5'}&units=metric`
  fetchData(api)
  console.log(position)
}

function onError(error) {
  console.log(error)
  infoTxt.classList.add('error')
  infoTxt.innerText = error.message
}

function requestApi(city) {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a78a9ebe1fbfd1c4e14ec10f012a18d5&units=metric`
  infoTxt.innerText = 'Geting wether details'
  infoTxt.classList.add('pending')
  fetchData(api)
}

function fetchData(api) {
  fetch(api).then((response) =>
    response.json().then((result) => weatherDetails(result))
  )
}

function weatherDetails(info) {
  if (info.cod == '404') {
    infoTxt.innerText = `${inputField.value} is not a valid city name`
    infoTxt.classList.replace('pending', 'error')
  } else {
    const city = info.name
    const country = info.sys.country
    const { description, id } = info.weather[0]
    const { feels_like, humidity, temp } = info.main

    if (id == 800) {
      wIcon.src = 'source/icons/sun.png'
    } else if (id > 800 && id <= 804) {
      wIcon.src = 'source/icons/cloudy.png'
    } else if (id >= 200 && id <= 232) {
      wIcon.src = 'source/icons/storm.png'
    } else if (id >= 500 && id <= 531) {
      wIcon.src = 'source/icons/rainy.png'
    }

    wrapper.querySelector('.temp .numb').innerText = Math.floor(temp)
    wrapper.querySelector('.weather').innerText = description
    wrapper.querySelector('.location span').innerText = city
    wrapper.querySelector('.temp .numb2').innerText = Math.floor(feels_like)
    wrapper.querySelector('.column.humidity span').innerText = humidity + ' %'

    infoTxt.classList.remove('pending', 'error')
    wrapper.classList.add('active')
    console.log(info)
  }
}

arrowBack.addEventListener('click', () => {
  wrapper.classList.remove('active')
})
