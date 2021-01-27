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

var index = [hier, avhier];
requests = new Array(index.length);
for (let i = 0; i < index.length; i++) {
    var url = 'https://coronavirusapi-france.now.sh/AllDataByDate?date=' + String(index[i]);
    requests[i] = new XMLHttpRequest();
    requests[i].open("GET", url);
    requests[i].onload = function () {

        if (i == 0) {
            // Begin accessing LAST DAY 
            var data = JSON.parse(this.response);
            if (requests[i].status >= 200 && requests[i].status < 400) {
                data = data.allFranceDataByDate
                console.log(data)
                data.forEach(rep => {
                    if (rep.code == "FRA" && rep.sourceType == "ministere-sante") {
                        cas_ajd = rep.casConfirmes
                        deces_ajd = rep.deces

                        document.getElementById("titre").innerHTML = 'Les données les plus récentes dates du ' + String(hier);
                        document.getElementById("deces").innerHTML = deces_ajd;
                        document.getElementById("cas").innerHTML = cas_ajd;
                    }
                });
                
            } else {
                console.log(`Gah, it's not working!`);
            }
        } else {
            // Begin accessing THE DAY BEFORE
            var data = JSON.parse(this.response);
            if (requests[i].status >= 200 && requests[i].status < 400) {
                data = data.allFranceDataByDate
                console.log(data)
                data.forEach(rep => {
                    if (rep.code == "FRA" && rep.sourceType == "ministere-sante") {
                        var cas_hier = rep.casConfirmes
                        var deces_hier = rep.deces
                        console.log(document.getElementById("cas").innerHTML)
                        var cas_new = document.getElementById("cas").innerHTML - cas_hier
                        var deces_new = document.getElementById("deces").innerHTML - deces_hier
                        document.getElementById("ndeces").innerHTML = deces_new;
                        document.getElementById("ncas").innerHTML = cas_new;
                    }
                });
            } else {
                console.log(`Gah, it's not working!`);
            }
        }
    }
    requests[i].send();
}