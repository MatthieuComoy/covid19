const app = document.getElementById('root');

const list = document.createElement('ul');

app.appendChild(list);

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
      const li = document.createElement('li');
      li.textContent = rep.nom + ' - Rea:' + rep.reanimation + ' - Deaths:' + rep.deces;

      list.appendChild(li);
      if (rep.sourceType != "ministere-sante" && rep.code == 'FRA') {
        rea = rea + parseInt(rep.reanimation)
        nrea = nrea + parseInt(rep.nouvellesReanimations)
        gueri = gueri + parseInt(rep.gueris)
        nbdec = nbdec + parseInt(rep.deces)
      }
      titre = 'Rapport covid-19 du ' + String(rep.date)
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
