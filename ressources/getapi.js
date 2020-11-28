
function getapi(source) {
var data = [];
  var request = new XMLHttpRequest();
  request.open('GET', source, true);
  request.onload = function() {
    // Begin accessing JSON data here
    var recu = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {

      recu = recu.allLiveFranceData
      data = recu.cards;
      return data
    } else {
      return('Ca marche po')
    }
  }
  request.send();

}
