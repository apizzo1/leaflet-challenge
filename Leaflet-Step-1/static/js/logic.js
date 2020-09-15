

// choose dataset
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create map object
var myMap = L.map("map", {
    // center of the United States
    center: [39.8, -98.6], 
    zoom: 5
});

// add tile layer 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

d3.json(url, function(response) {
 
    console.log(response);

  
    // L.geoJSON(response, {
    //     style: function (feature) {
    //         return {color: feature.properties.mag};
    //     }
    // }).bindPopup(function (layer) {
    //     return layer.feature.properties.place;
    // }).addTo(myMap);

    // var geojsonMarkerOptions = {
    //     radius: feature.properties.mag,
    //     fillColor: "blue",
    //     color: "red",
    //     weight: 20,
    //     opacity: 1,
    //     fillOpacity: 0.8
    // };
    
    L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*10,
                color: feature.properties.mag,
                // weight: 20,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).bindPopup(function (layer) {
            return (layer.feature.properties.place);
        }).addTo(myMap);
    
});