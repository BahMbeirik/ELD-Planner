import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  FaMap,
  FaMapMarkerAlt,
  FaTruckLoading,
  FaFlagCheckered,
  FaLightbulb,
  FaRoute,
  FaClock,
  FaRuler
} from 'react-icons/fa';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different locations
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      "></div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapDisplay = ({ tripData }) => {
  // Default coordinates - in real app you would use geocoding
  const defaultPosition = [39.8283, -98.5795]; // Center of US
  
  const routeCoordinates = [
    [34.0522, -118.2437], // Los Angeles
    [36.1699, -115.1398], // Las Vegas
    [39.7392, -104.9903]  // Denver
  ];

  // Custom icons
  const currentLocationIcon = createCustomIcon('#EF4444'); // red-500
  const pickupLocationIcon = createCustomIcon('#10B981'); // green-500
  const dropoffLocationIcon = createCustomIcon('#3B82F6'); // blue-500

  return (
    <div className="m-6 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
              <FaMap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Route Map</h2>
              <p className="text-sm text-gray-600">Visual representation of your trip route</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Pickup</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Dropoff</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container relative">
        <MapContainer 
          center={defaultPosition} 
          zoom={4} 
          style={{ height: '500px', width: '100%' }}
          className="rounded-b-2xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Current Location Marker */}
          <Marker position={[34.0522, -118.2437]} icon={currentLocationIcon}>
            <Popup>
              <div className="p-2">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-800">Current Location</h3>
                </div>
                <p className="text-sm text-gray-600">Los Angeles, CA</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                  Start of your journey
                </div>
              </div>
            </Popup>
          </Marker>
          
          {/* Pickup Location Marker */}
          <Marker position={[36.1699, -115.1398]} icon={pickupLocationIcon}>
            <Popup>
              <div className="p-2">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-800">Pickup Location</h3>
                </div>
                <p className="text-sm text-gray-600">Las Vegas, NV</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <FaTruckLoading className="w-3 h-3 mr-1" />
                  Cargo pickup point
                </div>
              </div>
            </Popup>
          </Marker>
          
          {/* Dropoff Location Marker */}
          <Marker position={[39.7392, -104.9903]} icon={dropoffLocationIcon}>
            <Popup>
              <div className="p-2">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-800">Dropoff Location</h3>
                </div>
                <p className="text-sm text-gray-600">Denver, CO</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <FaFlagCheckered className="w-3 h-3 mr-1" />
                  Final destination
                </div>
              </div>
            </Popup>
          </Marker>
          
          {/* Route Line */}
          <Polyline 
            positions={routeCoordinates}
            color="#3B82F6"
            weight={5}
            opacity={0.8}
            dashArray="10, 10"
          />
        </MapContainer>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
            <FaRoute className="w-3 h-3 mr-1" />
            Route Info
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
            <span>Main Route</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-0.5 bg-blue-500 bg-dashed mr-2"></div>
            <span>Alternative</span>
          </div>
        </div>

        {/* Distance Info */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <FaRuler className="w-3 h-3 mr-1" />
            Trip Distance
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 flex items-center">
                <FaRuler className="w-3 h-3 mr-1" />
                Total:
              </span>
              <span className="font-semibold">1,286 km</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 flex items-center">
                <FaClock className="w-3 h-3 mr-1" />
                Estimated Time:
              </span>
              <span className="font-semibold">14.5 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 border-t border-blue-200 p-4">
        <div className="flex items-start">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
            <FaLightbulb className="w-3 h-3 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> This is a demonstration map. In a production application, actual coordinates from your trip data would be used with real-time geocoding and routing services.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
            <FaMapMarkerAlt className="w-5 h-5 mr-2 text-blue-500" />
            3
          </div>
          <div className="text-xs text-gray-600">Stops</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
            <FaRuler className="w-5 h-5 mr-2 text-green-500" />
            1,286
          </div>
          <div className="text-xs text-gray-600">Kilometers</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
            <FaClock className="w-5 h-5 mr-2 text-purple-500" />
            14.5
          </div>
          <div className="text-xs text-gray-600">Hours</div>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;