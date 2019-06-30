console.log('main page loaded');

function getWeather(address) {
  var addressEncoded = encodeURIComponent(address);
  return fetch('/weather?address='+addressEncoded)
  .then(resp => {
    return resp.json();
  })
  .then(data => {
    if(data.err){
      return Promise.reject(data.err);
    } else {
      return Promise.resolve({
        weather:data.weather,
        location: data.location
      });
    }
  })
  .catch(err => {
    return Promise.reject(err);
  });
}

const $addressInput = document.querySelector('#address-input');
const $submitBtn = document.querySelector('#submit-btn');
$submitBtn.onclick = submitBtnHandler;
const $successMsg = document.querySelector('#success-msg');
const $failMsg = document.querySelector('#fail-msg');
$successMsg.innerText = '';
$failMsg.innerText = '';

function submitBtnHandler(evt) {
  evt.preventDefault();
  $successMsg.innerText = 'Loading';
  $failMsg.innerText = '';
  const address = $addressInput.value;
  getWeather(address).then(data => {
    const location = data.location;
    const curWeather = data.weather.currently;
    const msg = `Location: ${location.name}
    Weather: ${curWeather.summary}
    Temprature is ${curWeather.temperature}, ${(curWeather.precipProbability*100).toFixed(2)}% probablity to rain.`;
    $successMsg.innerText = msg;
    $failMsg.innerText = '';
  }).catch(err => {
    $successMsg.innerText = '';
    $failMsg.innerText = err;
  });
}