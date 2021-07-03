let request = require('request');

const headers = [    {
  "key": "Connection",
  "value": "keep-alive"
},
{
  "key": "sec-ch-ua",
  "value": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\""
},
{
  "key": "Accept",
  "value": "application/json, text/javascript, */*; q=0.01"
},
{
  "key": "X-Requested-With",
  "value": "XMLHttpRequest"
},
{
  "key": "sec-ch-ua-mobile",
  "value": "?0"
},
{
  "key": "User-Agent",
  "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
},
{
  "key": "Content-Type",
  "value": "application/x-www-form-urlencoded; charset=UTF-8"
},
{
  "key": "Origin",
  "value": "https://www.suvtv.com.ar"
},
{
  "key": "Sec-Fetch-Site",
  "value": "same-origin"
},
{
  "key": "Sec-Fetch-Mode",
  "value": "cors"
},
{
  "key": "Sec-Fetch-Dest",
  "value": "empty"
},
{
  "key": "Referer",
  "value": "https://www.suvtv.com.ar/turnos/"
},
{
  "key": "Accept-Language",
  "value": "en,es-ES;q=0.9,es;q=0.8"
},
{
  "key": "Cookie",
  "value": "PHPSESSID=212nkmq92olcd8l8c4naov2rd1"
}];

let options = {
  url: 'https://www.suvtv.com.ar/controller/ControllerDispatcher.php',
  form: {
    controllerName: "AgendaController",
    actionName: "obtenerDiasDisponibles",
    plantas: [00001, 00006],
    sobreTurno: true,
    mes: 8,
    year: 2021
  },
  headers: [],
};
const newHeaders = [];
var availableDates = [{}];

let main = function() {
  headers.forEach(header => {
    var key = header.key;
    var obj = {};
    obj[key] = header.value;
    newHeaders.push(obj);
  });
  options.headers = newHeaders;
  console.log("Running");
  let trying = 1;
  setInterval(function(){ 
      request.post(options, (error, res, body) => {
      if (error) {
        console.log(error);
      }
      body = JSON.parse(body);
      if (body.success && !body.results) {
        console.log("No date available. Try N° " + trying +  " Last available date was: ", availableDates[availableDates.length - 1]);
      }
      if (body.success && body.result && body.result.length) {
        console.log("Date found: ", body.result);
        body.result.try = trying;
        availableDates.push(body.result);
      }
      trying++;
    });
   }, 5000);
}

main();