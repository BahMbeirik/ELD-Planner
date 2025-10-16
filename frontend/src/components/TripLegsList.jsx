import React, { useState } from 'react';
import { 
  FaRoad,
  FaFilter,
  FaRuler,
  FaClock,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaList,
  FaChartBar,
  FaTruck,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const TripLegsList = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Collect all trip legs
  const allLegs = trips.flatMap(trip => 
    trip.legs?.map(leg => ({ ...leg, trip_id: trip.id, trip_route: `${trip.current_location} → ${trip.dropoff_location}` })) || []
  );

  const filteredLegs = selectedTrip === 'all' 
    ? allLegs 
    : allLegs.filter(leg => leg.trip_id === parseInt(selectedTrip));

  // Pagination calculations
  const totalPages = Math.ceil(filteredLegs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLegs = filteredLegs.slice(startIndex, endIndex);

  const totalDistance = filteredLegs.reduce((sum, leg) => sum + leg.distance, 0);
  const totalDuration = filteredLegs.reduce((sum, leg) => sum + leg.duration, 0);
  const averageSpeed = totalDuration > 0 ? (totalDistance / totalDuration) : 0;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
              <FaRoad className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Trip Legs</h2>
              <p className="text-blue-100">Detailed breakdown of all route segments</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredLegs.length}</div>
            <div className="text-blue-100">Total Legs</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <select 
                value={selectedTrip} 
                onChange={(e) => {
                  setSelectedTrip(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
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
            <FaRuler className="w-4 h-4 mr-2 text-blue-100" />
            <div className="text-sm text-blue-100">
              {totalDistance.toFixed(1)} km • {totalDuration.toFixed(1)} hrs
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center">
            <FaList className="mr-2" />
            {filteredLegs.length}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Legs</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center">
            <FaRuler className="mr-2" />
            {totalDistance.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Distance (km)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1 flex items-center justify-center">
            <FaClock className="mr-2" />
            {totalDuration.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Duration (hrs)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center">
            <FaTachometerAlt className="mr-2" />
            {averageSpeed.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Avg Speed (km/h)</div>
        </div>
      </div>

      {/* Legs Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="legs-table-container overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaTruck className="w-4 h-4 mr-2" />
                    Trip
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaRoad className="w-4 h-4 mr-2" />
                    Leg
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaRuler className="w-4 h-4 mr-2" />
                    Distance
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaClock className="w-4 h-4 mr-2" />
                    Duration
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Instructions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentLegs.map((leg, index) => (
                <tr 
                  key={`${leg.trip_id}-${leg.sequence}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm font-bold">#{leg.trip_id}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {leg.trip_route}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FaRoad className="w-3 h-3 mr-1" />
                      Leg {leg.sequence + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-3 h-3 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">{leg.start_location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-3 h-3 text-red-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">{leg.end_location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaRuler className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900 font-semibold">{leg.distance.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">kilometers</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaClock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900 font-semibold">{leg.duration.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">hours</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs line-clamp-2">
                      {leg.instructions}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLegs.length === 0 && (
          <div className="text-center py-12">
            <FaRoad className="text-6xl mb-4 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No trip legs found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedTrip === 'all' 
                ? 'Create a trip to generate route legs and see them here.'
                : 'The selected trip has no route legs defined.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredLegs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">items per page</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLegs.length)} of {filteredLegs.length} entries
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Summary */}
      {filteredLegs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 border border-indigo-800 rounded-full flex items-center justify-center text-white text-sm mr-2">
              <FaChartBar className="w-3 h-3 text-indigo-800" />
            </div>
            Route Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <FaList className="mr-2" />
                {filteredLegs.length}
              </div>
              <div className="text-sm text-gray-600">Route Segments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <FaRuler className="mr-2" />
                {totalDistance.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Total Kilometers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <FaClock className="mr-2" />
                {totalDuration.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <FaTachometerAlt className="mr-2" />
                {averageSpeed.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Avg Speed km/h</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 flex items-center">
              <FaFilter className="w-4 h-4 mr-2" />
              Showing legs from {selectedTrip === 'all' ? 'all trips' : `Trip #${selectedTrip}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripLegsList;