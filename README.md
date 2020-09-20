# leaflet-challenge

## Map Details

This challenge was to create a map of earthquake locations using Leaflet, with tile functionality from Mapbox. Each map shows earthquakes using a circular marker, with radius and color indicating the magnitude of the earthquake. The maps allow the user to select a specific earthquake marker and see data (location and magnitude details). Data sources include:
* https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
* https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json

### Map Interaction

Leaflet-Step-1 folder holds code to produce a basic map that allows the user to select the earthquake points, but does not have any layer functionality.

Leaflet-Step-2 folder holds code to produce a map with multiple opportunities of user interaction: the user can choose between 3 different base maps (street, satellite, or grayscale) and two different layers (earthquakes or fault lines). Only one base map can be chosen at a time, and one must be chosen at all times. The overlay maps, on the other hand, can be toggled as desired by the user (one displayed at a time, both displayed, or neither displayed).


### Files Included

Both folders hold files with the same names:

* index.html will render the map in a browser window - this can be viewed using a live server or by using command python -m http.server in command line
* Static folder containing: 
  * js folder containing logic.js file - this file holds all functionality to bring in geoJSON data, create markers and layers, and render this information on the index.html
  * css folder containing the style.css which formats the map on the index.html and the legend
 
Please note: Mapbox requires an API key to utilize the map tiles - this key was brought in using a config.js file in the js folders of each Leaflet Step folder with format: 

API_KEY = "Your API Key here";

This file was added to the gitignore so the API key remained private.


