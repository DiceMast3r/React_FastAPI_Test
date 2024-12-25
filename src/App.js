import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  const [locations, setLocations] = useState([]); // Array of locations

  useEffect(() => {
    // Fetch multiple locations from FastAPI
    axios
      .get("http://127.0.0.1:8000/locations") // Replace with your FastAPI endpoint
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  // Generate an array of [lat, lon] for Polyline
  const polylinePositions = locations.map((location) => [
    location.latitude,
    location.longitude,
  ]);

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={[9.503243879785233, 102.83203125]} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <strong>{location.name}</strong>
              <br />
              Latitude: {location.latitude.toFixed(5)}
              <br />
              Longitude: {location.longitude.toFixed(5)}
            </Popup>
          </Marker>
        ))}

        {/* Draw polyline connecting all waypoints */}
        <Polyline positions={polylinePositions} color="red" />
      </MapContainer>
    </div>
  );
}

export default App;
