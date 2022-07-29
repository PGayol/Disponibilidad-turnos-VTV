let request = require('request');
const readline = require('readline')

// To prevent Windows executable file to close after execution.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Plantas:
// 00001: Donado
// 00002: 27 de febrero
// 00003: Velez Sarsfield
// 00004: Santa Maria del Buen Ayre
// 00005: Osvaldo Cruz
// 00006: Tronador
// 00007: 9 de Julio sur

var places = [00001, 00006];
var placesAsString = ["00001", "00006"];
var month = null;
var year = null;
var repeat = false; // Change to true if want to check every second.
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
    plantas: places,
    sobreTurno: true,
    mes: month,
    year: year
  },
  headers: [],
};
const newHeaders = [];
var availableDates = [{}];

rl.question('Insert month (number): ', (answerMonth) => {
  month = answerMonth;
  options.form.mes = month;
    rl.question('Insert year: ', (answerYear) => {
      year = answerYear;
      options.form.year = year;
      main(repeat);
    });
  // rl.close();
});

let main = function(repeatRequest) {
  headers.forEach(header => {
    var key = header.key;
    var obj = {};
    obj[key] = header.value;
    newHeaders.push(obj);
  });
  options.headers = newHeaders;
  console.log("Running");
  if (repeatRequest) {
      setInterval(() => {check(repeatRequest)}, 1000);
  } else {
    check(repeatRequest);
  }
}

let check = function(repeatRequest) { 
    let trying = 1;
    request.post(options, (error, res, body) => {
      if (error) {
        console.log(error);
      }
      body = JSON.parse(body);
      if (body.success && !body.result.length) {
        if (repeatRequest) {
          console.log("No date available. Try N° " + trying +  " Last available date was: ", availableDates[availableDates.length - 1]);
        } else {
            console.log("No date available");
        }
      }
      if (body.success && body.result && body.result.length) {
        body.result.forEach(date => {
          // Need to check for idPlanta again since API is not filtering well.
          if (placesAsString.includes(date.idPlanta)) {
            console.log("Date available: " + date.fecha + " - " + date.planta);
            body.result.try = trying;
            availableDates.push(date);
          }
        });
      }
      trying++;
  });
 }  