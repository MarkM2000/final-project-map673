var map = L.map('map', {
    zoomSnap: .1,
    center: [35.3737, -75.4953],
    zoom: 10,
    minZoom: 6,
});

// mapbox API parameters
const accessToken = `pk.eyJ1IjoibWFya20wMCIsImEiOiJjbHMzbXhmcDAwMDA0MnBucmp0YTI2dHN0In0.Ns7cziMPFHfQp-GBe_MWig`
const yourName = 'markm00'
const yourMap = 'clsmdvehq042801p21h468tcz'

// request a mapbox raster tile layer and add to map
L.tileLayer(`https://api.mapbox.com/styles/v1/${yourName}/${yourMap}/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, and <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);

// Hotspots
/// This hotspot will feature other attractions besides lighthouses.
var hotspots = [{
    name: "Wright Brothers National Memorial",
    properties: {
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/First_Flight_Memorial_5.jpg/256px-First_Flight_Memorial_5.jpg",
        location: "Kill Devil Hills",
        coordinates: [36.0143, -75.6679],
        information: "This granite monument honors the Wright Brothers, who conducted the first successful air flight.",
        url: 'https://www.nps.gov/wrbr/index.htm',
        icon: '../svg/monument-15.svg'
    }
}]

var bounds = L.latLngBounds();

for (var i = 0; i < hotspots.length; i++) {
    var props = hotspots[i].properties;
    console.log(props);

    // assign a string, wrapping the name of the place within two HTML bold tags
    var popup = `<h3>${hotspots[i].name}</h3>
    <img src='${props.image}'>
    <p>${props.location}</p>
    <p>${props.information}</p>
    <p><b>URL</b>: <a href='${props.url}'>Link</a></p>
`

    var icon = L.icon({
        iconUrl: props.icon,
        iconSize: [20, 20],
        popupAnchor: [0, -22],
        className: "icon"
    });

    var marker = L.marker(hotspots[i].properties.coordinates, {
        icon: icon
    })
        .addTo(map)
        .bindPopup(popup);

    //  Extend the bounds as features are added
    bounds.extend(hotspots[i].properties.coordinates)

    marker.on("mouseover", function () {
        this.openPopup();
    });
    marker.on("mouseout", function () {
        this.closePopup();
    });
}

// Omnivore CSV file 
omnivore.csv("csv/outer-banks-hotels.csv")
    .on("ready", function (e) {
        drawMap(e.target.toGeoJSON());
    })
    .on("error", function (e) {
        console.log(e.error[0].message);
    });

// Start CSV layers
function drawMap(data) {
    const options = {
        pointToLayer: function (feature, ll) {
            return L.circleMarker(ll, {
                opacity: 1,
                weight: 2,
                fillOpacity: 0,
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(layer.feature.properties.NAME);

            console.log(feature.properties)
        }
    };

    // create a separate layer from GeoJSON data
    const hotels = L.geoJson(data, options).addTo(map);
} // end drawMap()

var hotels = L.geoJson(hotels, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            color: '#613c33',
            weight: 1,
            fillColor: '#613c33',
            fillOpacity: .8,
            radius: 10
        });
    },
    onEachFeature: function (feature, layer) {
        layer.bindTooltip(layer.feature.properties.name);

        layer.on('mouseover', function () {
            // code goes in here
            layer.setStyle({
                fillColor: 'red'
            });
        });
        layer.on('mouseout', function () {
            // code goes in here
            layer.setStyle({
                fillColor: '#613c33'
            });
        });
    }
}).addTo(map);
