function getapi(source) {
  var myJson
  $.getJSON(source, function(json){
      myJson = json;
      setTimeout(() => {  return myJson; }, 4000);
  });
};
