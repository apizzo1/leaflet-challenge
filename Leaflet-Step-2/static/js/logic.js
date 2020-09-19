

// choose dataset
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



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
    id: 'mapbox/satellite-v9',
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


d3.json(url, function(response) {
 
    console.log(response);

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
                }).bindPopup(function (layer) {
                    return (`Location: ${layer.feature.properties.place} <br> Magnitude: ${layer.feature.properties.mag}`);
                })
            )
        }
    })

    var earthquakeLayer = L.layerGroup(earthquakes);



//         pointToLayer: function (feature, latlng) {
//                 L.circleMarker(latlng, {
//                 radius: feature.properties.mag*5,
//                 color: getColor(feature.properties.mag),
//                 // weight: 20,
//                 // color: "black",
//                 opacity: 1,
//                 fillOpacity: 0.8
//             })}).bindPopup(`Location: ${layer.feature.properties.place} <br> Magnitude: ${layer.feature.properties.mag}`);
// });

    var baseMaps = {
        Streetview: street,
        Satellite: satellite,
        Grayscale: grayscale
    };
    
    var overlayMaps = {
        Earthquakes: earthquakeLayer,
        // "Fault Lines": tectonic
    };
    
       
    // create map object
    var myMap = L.map("map", {
        // center of the United States
        center: [39.8, -98.6], 
        zoom: 5,
        layers: [street, earthquakeLayer]
    });
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