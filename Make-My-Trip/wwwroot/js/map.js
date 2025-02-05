let map, locations = [], markers = [], polyline, directionsService, directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 1.3521, lng: 103.8198 }, // Singapore
        zoom: 11
    });

    // Initialize the Directions Service and Directions Renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
            strokeColor: '#FF0000', // Set polyline color
            strokeOpacity: 1.0,
            strokeWeight: 5
        },
        map: map // Render the directions on the map
    });

    map.addListener('click', function (event) {
        const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        locations.push(location);

        const marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push(marker);

        // Update the list of locations on the screen
        document.getElementById('locations').innerHTML += `<li class="list-group-item">Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)}</li>`;

        // If there are at least two locations, calculate the route
        if (locations.length >= 2) {
            calculateRoute();
        }
    });
}

// Function to calculate the route between locations using Directions API
function calculateRoute() {
    if (locations.length < 2) return;

    const waypoints = locations.slice(1, locations.length - 1).map(location => ({
        location: new google.maps.LatLng(location.lat, location.lng),
        stopover: true
    }));

    const request = {
        origin: new google.maps.LatLng(locations[0].lat, locations[0].lng),
        destination: new google.maps.LatLng(locations[locations.length - 1].lat, locations[locations.length - 1].lng),
        waypoints: waypoints,
        travelMode: 'DRIVING',
        provideRouteAlternatives: false,
        optimizeWaypoints: true
    };

    // Request directions from DirectionsService
    directionsService.route(request, function (response, status) {
        if (status === 'OK') {
            // Set the directions result in the renderer to display the polyline
            directionsRenderer.setDirections(response);
            calculateFuelCost(response);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

function calculateFuelCost(routeResponse) {
    const fuelEfficiency = parseFloat(document.getElementById('fuelEfficiency').value);
    const fuelPrice = parseFloat(document.getElementById('fuelPrice').value);

    const route = routeResponse.routes[0];
    let totalDistance = 0;
    let totalDuration = 0;

    // Calculate the total distance and duration from the route's legs
    route.legs.forEach(leg => {
        totalDistance += leg.distance.value; // In meters
        totalDuration += leg.duration.value; // In seconds
    });

    totalDistance = totalDistance / 1000; // Convert to kilometers
    totalDuration = totalDuration / 3600; // Convert to hours

    const fuelCost = (totalDistance / fuelEfficiency) * fuelPrice;

    // Display the results on the page
    document.getElementById('result').innerHTML = `
        <h3>Trip Results</h3>
        <p><strong>Total Distance:</strong> ${totalDistance.toFixed(2)} km</p>
        <p><strong>Total Duration:</strong> ${totalDuration.toFixed(2)} hours</p>
        <p><strong>Fuel Cost:</strong> SGD ${fuelCost.toFixed(2)}</p>
    `;
}

document.getElementById('calculate').addEventListener('click', function () {
    if (locations.length < 2) {
        alert('Please add at least two locations.');
        return;
    }

    // Trigger the calculation without needing to submit the form
    calculateRoute();
});
