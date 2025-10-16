import React from 'react';
import { 
  FaRoute,
  FaRuler,
  FaClock,
  FaSync,
  FaClipboardList,
  FaMapMarkerAlt,
  FaBed,
  FaExclamationTriangle
} from 'react-icons/fa';

const TripResults = ({ tripData }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
          Trip Information
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
      </div>

      {/* Route Summary Card */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10  border border-blue-600  rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaRoute className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Route Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <FaRuler className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Distance</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{tripData.total_distance?.toFixed(2)} <span className="text-sm text-gray-500">km</span></p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                <FaClock className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Estimated Duration</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{tripData.estimated_duration?.toFixed(2)} <span className="text-sm text-gray-500">hours</span></p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                <FaSync className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Cycle Used</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{tripData.current_cycle_used} <span className="text-sm text-gray-500">hours</span></p>
          </div>
        </div>
      </div>

      {/* Route Instructions */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaClipboardList className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Route Instructions</h3>
        </div>

        <div className="space-y-6">
          {tripData.legs?.map((leg, index) => (
            <div key={index} className="bg-gray-50 rounded p-5 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="w-6 h-6 bg-indigo-300 text-white rounded-full flex items-center justify-center text-sm mr-2">
                      {index + 1}
                    </span>
                    Leg {index + 1}: {leg.start_location} to {leg.end_location}
                  </h4>
                </div>
                <div className="flex gap-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <FaRuler className="w-3 h-3 mr-1" />
                    {leg.distance.toFixed(2)} km
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <FaClock className="w-3 h-3 mr-1" />
                    {leg.duration.toFixed(2)} hours
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 mt-3 border">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{leg.instructions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rest Stops */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaBed className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Scheduled Rest Stops</h3>
        </div>

        {tripData.rest_stops?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tripData.rest_stops.map((stop, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-5 border border-orange-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-800">Stop {index + 1}</h4>
                      <p className="text-sm text-gray-600">{stop.location}</p>
                    </div>
                  </div>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <FaClock className="w-3 h-3 mr-1" />
                    {stop.duration_hours}h
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FaClock className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-gray-700"><strong>Duration:</strong> {stop.duration_hours} hours</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaExclamationTriangle className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-gray-700"><strong>Reason:</strong> {stop.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <FaBed className="text-4xl mb-3 text-gray-400 mx-auto" />
            <p className="text-gray-600 font-medium">No rest stops required for this trip</p>
            <p className="text-gray-500 text-sm mt-1">You're good to go without scheduled breaks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripResults;