import React, { useState } from 'react';
import { 
  FaTruck,
  FaSearch,
  FaMapMarkerAlt,
  FaRuler,
  FaClock,
  FaSync,
  FaRoad,
  FaBed,
  FaCalendar,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus
} from 'react-icons/fa';

const TripsList = ({ trips, onViewTrip }) => {
  const [filter, setFilter] = useState('');

  const filteredTrips = trips.filter(trip =>
    trip.current_location.toLowerCase().includes(filter.toLowerCase()) ||
    trip.dropoff_location.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (trip) => {
    const totalHours = trip.current_cycle_used + (trip.estimated_duration || 0);
    return totalHours <= 70 ? 'compliant' : 'violation';
  };

  return (
    <div className="trips-list p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent flex items-center">
              <FaTruck className="mr-3 text-indigo-800" />
              All Trips
            </h2>
            <p className="text-gray-600">Manage and review all your planned trips</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-lg font-bold text-indigo-700 px-4 py-2  shadow-lg flex items-center">
            <span className="font-semibold">{filteredTrips.length}</span>
            <span className="font-bold text-indigo-700 ml-1">trips</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trips by location..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredTrips.length} trips found
            </span>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrips.map(trip => {
          const status = getStatusColor(trip);
          const isCompliant = status === 'compliant';
          
          return (
            <div 
              key={trip.id} 
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header with Status */}
              <div className={`p-4 border-b ${
                isCompliant ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isCompliant ? (
                      <FaCheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <FaExclamationTriangle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <h3 className="font-semibold text-white">Trip {trip.id}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                    isCompliant 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {isCompliant ? (
                      <>
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        COMPLIANT
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        VIOLATION
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Route Information */}
              <div className="p-5">
                <div className='flex justify-between'>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">FROM</div>
                      <div className="text-sm font-semibold text-gray-800">{trip.current_location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-4 h-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">PICKUP</div>
                      <div className="text-sm font-semibold text-gray-800">{trip.pickup_location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">TO</div>
                      <div className="text-sm font-semibold text-gray-800">{trip.dropoff_location}</div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-1 ">
                  <div className="flex justify-between text-center h-8 w-24 px-1 rounded-lg py-0 border border-indigo-300">
                    <div className="text-lg font-bold text-gray-400 flex items-center justify-center">
                      <FaRuler className="mr-1" />
                      {trip.total_distance?.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">km</div>
                  </div>
                  <div className="flex justify-between text-center h-8 w-24 px-1 rounded-lg py-0 border border-indigo-300">
                    <div className="text-lg font-bold text-gray-400 flex items-center justify-center">
                      <FaClock className="mr-1" />
                      {trip.estimated_duration?.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">hours</div>
                  </div>
                  <div className="flex justify-between text-center h-8 w-24 px-1 rounded-lg py-0 border border-indigo-300">
                    <div className="text-lg font-bold text-gray-400 flex items-center justify-center">
                      <FaSync className="mr-1" />
                      {trip.current_cycle_used}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">cycle hrs</div>
                  </div>
                </div>
                </div>
                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 border border-gray-200 p-2 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-indigo-800 flex items-center justify-center">
                      <FaRoad className="mr-1" />
                      {trip.legs?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Legs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-indigo-800 flex items-center justify-center">
                      <FaBed className="mr-1" />
                      {trip.rest_stops?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Rest Stops</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-indigo-800 flex items-center justify-center">
                      <FaCalendar className="mr-1" />
                      {trip.daily_logs?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Daily Logs</div>
                  </div>
                </div>

                {/* Cycle Usage Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="flex items-center">
                      <FaSync className="w-3 h-3 mr-1" />
                      Cycle Usage
                    </span>
                    <span>{trip.current_cycle_used}/70 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompliant ? 'bg-indigo-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((trip.current_cycle_used / 70) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => onViewTrip(trip)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </button>
                  <span className="text-xs text-gray-500 flex items-center">
                    <FaCalendar className="w-3 h-3 mr-1" />
                    {trip.created_at ? new Date(trip.created_at).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
          <FaTruck className="text-6xl mb-4 text-gray-400 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {filter ? 'No matching trips found' : 'No trips available'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {filter 
              ? 'Try adjusting your search terms to find what you\'re looking for.'
              : 'Create your first trip to start planning and tracking your journeys.'
            }
          </p>
          {!filter && (
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center mx-auto">
              <FaPlus className="mr-2" />
              Create First Trip
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TripsList;