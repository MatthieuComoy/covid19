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

console.log(today)
console.log(hier)
console.log(avhier)

// Request pour le premier jour disponible
link = 'https://coronavirusapi-france.now.sh/AllDataByDate?date=' + String(hier)
var request = new XMLHttpRequest();
request.open('GET', link, true);
request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data = data.allFranceDataByDate
        console.log(data)
        data.forEach(rep => {
            if (rep.code == "FRA" && rep.sourceType == "ministere-sante") {
                var cas_ajd = rep.casConfirmes
                var deces_ajd = rep.deces
                document.getElementById("titre").innerHTML = titre;
                document.getElementById("deces").innerHTML = deces_ajd;
                document.getElementById("cas").innerHTML = cas_ajd;
            }
        });
        var titre = 'Noisy le grand, Fr - ' + today
    }
    else {
        console.log(`Gah, it's not working!`);
    }
}
request.send();

// Request pour le jour d'avant
link2 = 'https://coronavirusapi-france.now.sh/AllDataByDate?date=' + String(avhier)
console.log(link2)
var request2 = new XMLHttpRequest();
request2.open('GET', link2, true);
request2.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data = data.allFranceDataByDate
        console.log(data)
        data.forEach(rep => {
            if (rep.code == "FRA" && rep.sourceType == "ministere-sante") {
                var cas_hier = rep.casConfirmes
                var deces_hier = rep.deces
                var cas_new = document.getElementById("cas").innerHTML - cas_hier
                var deces_new = document.getElementById("deces").innerHTML - deces_hier
                document.getElementById("ndeces").innerHTML = deces_new;
                document.getElementById("ncas").innerHTML = cas_new;
            }
        });
        titre = 'Noisy le grand, Fr - ' + today
    }
    else {
        console.log(`Gah, it's not working!`);
    }
}
request2.send();