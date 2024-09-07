let map;
let markers = [];

// Initialize the map
function initMap() {
    map = new MapmyIndia.Map('map', {
        center: [28.6139, 77.2090], // Default center (Delhi)
        zoom: 12
    });
    
    // Get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = [position.coords.latitude, position.coords.longitude];
            console.log('User Location:', userLocation); // Log the user's location
            map.setCenter(userLocation);
            addMarker(userLocation, "Your Location");
            searchNearbyGynecologists(userLocation);
        }, (error) => {
            console.error('Error getting user location:', error); // Log error if geolocation fails
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Add a marker to the map
function addMarker(location, title) {
    const marker = new MapmyIndia.Marker({
        position: location,
        map: map,
        title: title
    });
    markers.push(marker);
    console.log('Marker added:', { location, title }); // Log marker details
}

// Search for nearby gynecologists
function searchNearbyGynecologists(location) {
    const lat = location[0];
    const lng = location[1];
    const radius = 5000; // 5 km radius

    fetch(`https://atlas.mapmyindia.com/api/places/nearby/json?keywords=gynecologist&refLocation=${lat},${lng}&radius=${radius}&access_token=9dd1aa3e-c376-4cb0-afe5-42a8ddb6360d`)
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data); // Log the API response for debugging
            const results = data.suggestedLocations;
            if (results && results.length > 0) {
                results.forEach(result => {
                    console.log('Gynecologist details:', result); // Log each result for further inspection
                    const location = [result.latitude, result.longitude];
                    addMarker(location, result.placeName);
                    displayDetails(result);
                });
            } else {
                console.log('No gynecologists found in the area.');
                const detailsDiv = document.getElementById('details');
                detailsDiv.innerHTML = '<p>No gynecologists found in the area.</p>';
            }
        })
        .catch(error => console.error('Error fetching nearby gynecologists:', error)); // Log error if fetch fails
}

// Display details of the place
function displayDetails(place) {
    const detailsDiv = document.getElementById('details');
    const placeName = place.placeName || 'Name not available';
    const address = place.address || 'Address not available';
    const contact = place.contact || 'Contact information not available';
    const timings = place.openingHours || 'Timings not available';

    console.log('Displaying details for:', place); // Log the place details being displayed

    const placeDetails = `
        <div>
            <h3>${placeName}</h3>
            <p>Address: ${address}</p>
            <p>Contact: ${contact}</p>
            <p>Timings: ${timings}</p>
        </div>
    `;

    detailsDiv.innerHTML += placeDetails;
}

// Initialize the map when the window loads
window.onload = initMap;
