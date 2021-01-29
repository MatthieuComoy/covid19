// Définition des dates pour les request
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

var hier = new Date();
hier.setDate(hier.getDate() - 1); // <-- add this
var curr_date = hier.getDate();
var curr_month = String(hier.getMonth() + 1).padStart(2, '0');
var curr_year = hier.getFullYear();
hier = curr_year + "-" + curr_month + "-" + curr_date;

var avhier = new Date();
avhier.setDate(avhier.getDate() - 2); // <-- add this
var curr_date = avhier.getDate();
var curr_month = String(avhier.getMonth() + 1).padStart(2, '0');
var curr_year = avhier.getFullYear();
avhier = curr_year + "-" + curr_month + "-" + curr_date;

//Ask API for KPI
$.getJSON('https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=France', function (json) {
  //get and parse the data
  var myJson = json
  data = myJson.allDataByDepartement
  data = data.filter(function (d) {
    return d.sourceType === "ministere-sante"
  });
  data_today = data.slice(-2, -1)
  data_yesterday = data.slice(-3, -2)
  var cas_new = data_today[0].casConfirmes - data_yesterday[0].casConfirmes
  var deces_new = data_today[0].deces - data_yesterday[0].deces
  document.getElementById("ndeces").innerHTML = deces_new;
  document.getElementById("ncas").innerHTML = cas_new;
  document.getElementById("titre").innerHTML = 'Les données les plus récentes dates du ' + String(hier);
  document.getElementById("deces").innerHTML = data_today[0].deces;
  document.getElementById("cas").innerHTML = data_today[0].casConfirmes;
});