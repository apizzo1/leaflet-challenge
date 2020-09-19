

// choose dataset
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var boundaries_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// add tile layers
// street view layer 
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// satellite layer
var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// grayscale layer
var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});


// create function for marker color
// use ColorBrewer and code from https://leafletjs.com/examples/choropleth/
function getColor(mag) {
    return mag > 5 ? '#bd0026':
           mag > 4 ? '#f03b20' :
           mag > 3 ? '#fd8d3c' :
           mag > 2 ? '#feb24c' :
           mag > 1 ? '#fed976' :
                      '#ffffb2';
}

// styling for fault lines
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// source: https://gis.stackexchange.com/questions/149378/adding-multiple-json-layers-to-leaflet-map
var tectonic = L.geoJSON(null, {
    style: myStyle
  });

// Get GeoJSON data and create features.
// source: https://gis.stackexchange.com/questions/336179/add-more-than-one-layer-of-geojson-data-to-leaflet
$.getJSON(boundaries_url, function(data) {
    tectonic.addData(data);
});

d3.json(url, function(response) {
 
    console.log(response["features"]);

    // plot circle markers based on latitude and longitude from geoJSON
    var earthquakes = [];


    L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
            earthquakes.push(
                L.circleMarker(latlng, {
                    radius:feature.properties.mag*5,
                    color: getColor(feature.properties.mag),
                    opacity:1,
                    fillOpacity: 0.8
                })
                // }).bindPopup(function (layer) {
                    // return (`Location:  <br> Magnitude: ${layer.features.properties.mag}`);
                // })
            )
        }
    })



   

    // make earthquake markers array into a layer group
    var earthquakeLayer = L.layerGroup(earthquakes);

    // base layers that user can choose from
    var baseMaps = {
            Streetview: street,
            Satellite: satellite,
            Grayscale: grayscale
        };
        
    // overlay layers that the user can choose from
    var overlayMaps = {
            Earthquakes: earthquakeLayer,
            "Fault Lines": tectonic
        };
    
       
    // create map object
    var myMap = L.map("map", {
            // center of the United States
            center: [39.8, -98.6], 
            zoom: 5,
            layers: [street, earthquakeLayer]
        });

        // add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap);

    // Add map legend
    // starter code from https://leafletjs.com/examples/choropleth/

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our magnitude intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitudes[i]+1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
    
});