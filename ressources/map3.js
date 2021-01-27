const width = 550, height = 550;
//Ensuite, nous créons un objet path pour manipuler nos données geoJSON.

const path = d3.geoPath();
//La partie la plus délicate de ce tutoriel, la définition de la projection utilisée. Ici, nous choisissons une projection assez habituelle pour la cartographie (une liste des projections est disponible sur le site de D3JS). Nous centrons cette projection sur la France (latitude & longitude) et l'agrandissons pour finalement la centrer.

const projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2600)
    .translate([width / 2, height / 2]);
//La projection est ensuite assignée au path, le SVG est ajouté sur le DOM avec les dimensions pré-définies (l'id ne sert que pour le CSS) et un groupe est ajouté au SVG pour contenir tous les path. Attention, votre DOM doit déjà posséder un DIV dont l'ID est map, le code d3.select('#map') permet de récupérer ce DIV.

path.projection(projection);

const svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

const deps = svg.append("g");
//Le code suivant (et il n'y en a pas d'autres pour afficher la carte) charge le fichier geoJSON et pour chaque entrée de ce fichier ajoute un noeud path associé à un CSS particulier. Il est finalement rattaché au path que nous avions précédement déclaré.

d3.json('map/departements.geojson').then(function(geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path);
});