import React, { useState } from 'react';
import { 
  FaBed,
  FaFilter,
  FaChartBar,
  FaMoon,
  FaCoffee,
  FaBolt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaHourglassHalf,
  FaStar
} from 'react-icons/fa';

const RestStopsList = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState('all');

  // Collect all rest stops
  const allRestStops = trips.flatMap(trip => 
    trip.rest_stops?.map(stop => ({ 
      ...stop, 
      trip_id: trip.id, 
      trip_route: `${trip.current_location} → ${trip.dropoff_location}` 
    })) || []
  );

  const filteredStops = selectedTrip === 'all' 
    ? allRestStops 
    : allRestStops.filter(stop => stop.trip_id === parseInt(selectedTrip));

  const totalRestHours = filteredStops.reduce((sum, stop) => sum + stop.duration_hours, 0);

  const getStopType = (stop) => {
    if (stop.duration_hours >= 10) return 'overnight';
    if (stop.duration_hours >= 0.5) return 'break';
    return 'quick';
  };

  const getStopTypeLabel = (type) => {
    switch (type) {
      case 'overnight': return 'Overnight';
      case 'break': return 'Break';
      case 'quick': return 'Quick Stop';
      default: return 'Stop';
    }
  };

  const getStopTypeColor = (type) => {
    switch (type) {
      case 'overnight': return 'from-purple-500 to-indigo-600';
      case 'break': return 'from-orange-500 to-red-500';
      case 'quick': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStopTypeBg = (type) => {
    switch (type) {
      case 'overnight': return 'bg-purple-50 border-purple-200';
      case 'break': return 'bg-orange-50 border-orange-200';
      case 'quick': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStopTypeIcon = (type) => {
    switch (type) {
      case 'overnight': return FaMoon;
      case 'break': return FaCoffee;
      case 'quick': return FaBolt;
      default: return FaBed;
    }
  };

  // Statistics
  const overnightStops = filteredStops.filter(s => getStopType(s) === 'overnight').length;
  const breakStops = filteredStops.filter(s => getStopType(s) === 'break').length;
  const quickStops = filteredStops.filter(s => getStopType(s) === 'quick').length;

  return (
    <div className="rest-stops-list p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
              <FaBed className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Rest Stops</h2>
              <p className="text-orange-100">Scheduled breaks and overnight stops</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredStops.length}</div>
            <div className="text-orange-100">Total Stops</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <select 
                value={selectedTrip} 
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 appearance-none"
              >
                <option value="all" className="text-gray-800">All Trips</option>
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id} className="text-gray-800">
                    {trip.current_location} → {trip.dropoff_location}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80">
                <FaFilter className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center">
            <FaBed className="w-4 h-4 mr-2 text-orange-100" />
            <div className="text-sm text-orange-100">
              {filteredStops.length} stops • {totalRestHours.toFixed(1)} total rest hours
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center">
            <FaBed className="mr-2" />
            {filteredStops.length}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Stops</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1 flex items-center justify-center">
            <FaClock className="mr-2" />
            {totalRestHours.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Rest Hours</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-1 flex items-center justify-center">
            <FaMoon className="mr-2" />
            {overnightStops}
          </div>
          <div className="text-sm text-gray-600 font-medium">Overnight Stops</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center">
            <FaCoffee className="mr-2" />
            {breakStops}
          </div>
          <div className="text-sm text-gray-600 font-medium">Break Stops</div>
        </div>
      </div>

      {/* Stop Type Distribution */}
      {filteredStops.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
              <FaChartBar className="w-3 h-3" />
            </div>
            Stop Type Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1 flex items-center justify-center">
                <FaMoon className="mr-2" />
                {overnightStops}
              </div>
              <div className="text-sm text-gray-600">Overnight Stops</div>
              <div className="text-xs text-gray-500">10+ hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center">
                <FaCoffee className="mr-2" />
                {breakStops}
              </div>
              <div className="text-sm text-gray-600">Break Stops</div>
              <div className="text-xs text-gray-500">30min - 10hrs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1 flex items-center justify-center">
                <FaBolt className="mr-2" />
                {quickStops}
              </div>
              <div className="text-sm text-gray-600">Quick Stops</div>
              <div className="text-xs text-gray-500">Under 30min</div>
            </div>
          </div>
        </div>
      )}

      {/* Rest Stops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStops.map(stop => {
          const stopType = getStopType(stop);
          const typeColor = getStopTypeColor(stopType);
          const typeBg = getStopTypeBg(stopType);
          const StopIcon = getStopTypeIcon(stopType);
          
          return (
            <div 
              key={`${stop.trip_id}-${stop.sequence}`} 
              className={`bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${typeBg}`}
            >
              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${typeColor} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
                      <StopIcon className="text-lg text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{getStopTypeLabel(stopType)}</div>
                      <div className="text-white/80 text-sm">Stop {stop.sequence + 1}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold flex items-center">
                      <FaClock className="mr-1" />
                      {stop.duration_hours}h
                    </div>
                    <div className="text-white/80 text-sm">Duration</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Location */}
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 font-medium">Location</div>
                    <div className="text-gray-800 font-semibold">{stop.location}</div>
                  </div>
                </div>

                {/* Trip Information */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-1 flex items-center">
                    <FaTruck className="w-3 h-3 mr-1" />
                    TRIP INFORMATION
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800 font-semibold">
                      Trip {stop.trip_id}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      Sequence {stop.sequence + 1}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {stop.trip_route}
                  </div>
                </div>

                {/* Reason */}
                {stop.reason && (
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium mb-1">REASON FOR STOP</div>
                    <div className="text-sm text-gray-700">{stop.reason}</div>
                  </div>
                )}

                {/* Compliance Info */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div>
                    {stopType === 'overnight' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        10-hour Rest
                      </span>
                    )}
                    {stopType === 'break' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        30-min Break
                      </span>
                    )}
                    {stopType === 'quick' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        <FaBolt className="w-3 h-3 mr-1" />
                        Quick Stop
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <FaCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    FMCSA Compliant
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStops.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl border-2 border-dashed border-gray-300">
          <FaBed className="text-6xl mb-4 text-gray-400 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            No rest stops found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {selectedTrip === 'all'
              ? 'Rest stops will be automatically generated when you create and plan trips.'
              : 'The selected trip has no scheduled rest stops.'
            }
          </p>
          {selectedTrip !== 'all' && (
            <button 
              onClick={() => setSelectedTrip('all')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center mx-auto"
            >
              <FaFilter className="mr-2" />
              View All Trips
            </button>
          )}
        </div>
      )}

      {/* Rest Hours Summary */}
      {filteredStops.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 border border-indigo-800 rounded-full flex items-center justify-center text-white text-sm mr-2">
              <FaHourglassHalf className="w-3 h-3 text-indigo-800" />
            </div>
            Rest Hours Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1 flex items-center justify-center">
                <FaClock className="mr-2" />
                {totalRestHours.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Total Rest Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center">
                <FaChartBar className="mr-2" />
                {(totalRestHours / filteredStops.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average per Stop</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center">
                <FaStar className="mr-2" />
                {Math.max(...filteredStops.map(s => s.duration_hours)).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Longest Stop</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 flex items-center">
              <FaFilter className="w-4 h-4 mr-2" />
              Showing stops from {selectedTrip === 'all' ? 'all trips' : `Trip #${selectedTrip}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestStopsList;