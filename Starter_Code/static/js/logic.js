// Initialize the map and set its view to a starting position
let map = L.map("map").setView([37.7749, -122.4194], 5); // Centered on San Francisco with zoom level 5

// Add a tile layer to the map (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a function to style each earthquake point based on magnitude
function getStyle(feature) {
  return {
    radius: feature.properties.mag * 4, // Magnify radius for better visibility
    fillColor: getColor(feature.properties.mag),
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

// Define a function to get color based on earthquake magnitude
function getColor(magnitude) {
  return magnitude > 5 ? "#d73027" :
         magnitude > 4 ? "#fc8d59" :
         magnitude > 3 ? "#fee08b" :
         magnitude > 2 ? "#d9ef8b" :
         magnitude > 1 ? "#91cf60" :
                         "#1a9850";
}

// Function to convert GeoJSON points into circle markers
function pointToLayer(feature, latlng) {
  return L.circleMarker(latlng, getStyle(feature));
}

// Function to display a popup with earthquake details
function onEachFeature(feature, layer) {
  layer.bindPopup(
    `<h3>Location: ${feature.properties.place}</h3>
     <p>Magnitude: ${feature.properties.mag}</p>
     <p>Time: ${new Date(feature.properties.time).toLocaleString()}</p>`
  );
}

// Load GeoJSON data from the USGS earthquakes API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
  // Add the GeoJSON data to the map
  L.geoJSON(data, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  }).addTo(map);
}).catch(error => {
  console.error("Error loading GeoJSON data:", error);
});