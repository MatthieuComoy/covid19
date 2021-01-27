var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy ;

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
});
