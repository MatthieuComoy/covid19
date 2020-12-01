var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy ;

var request = new XMLHttpRequest();
request.open('GET', 'https://coronavirusapi-france.now.sh/AllLiveData', true);
request.onload = function() {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  var nrea = 0
  var rea = 0
  var gueri = 0
  var nbdec = 0
  var titre = ''
  if (request.status >= 200 && request.status < 400) {
    data = data.allLiveFranceData
    console.log(data = data)
    data.forEach(rep => {
      if (rep.sourceType != "ministere-sante" && rep.code == 'FRA') {
        rea += parseInt(rep.reanimation)
        nrea += parseInt(rep.nouvellesReanimations)
        gueri += parseInt(rep.gueris)
        nbdec += parseInt(rep.deces)
      }
      titre = 'Noisy le grand, Fr - ' + today
    });
    document.getElementById("titre").innerHTML = titre;
    document.getElementById("rea").innerHTML = rea;
    document.getElementById("nrea").innerHTML = nrea;
    document.getElementById("gueri").innerHTML = gueri;
    document.getElementById("deces").innerHTML = nbdec;
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send();
