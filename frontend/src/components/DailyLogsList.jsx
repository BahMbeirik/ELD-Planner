import React, { useState } from 'react';
import { 
  FaCalendar,
  FaFilter,
  FaCalendarDay,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTachometerAlt,
  FaClock,
  FaBed,
  FaSync,
  FaChartBar,
  FaTruck,
  FaTimesCircle,
  FaEraser
} from 'react-icons/fa';

const DailyLogsList = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Collect all daily logs
  const allDailyLogs = trips.flatMap(trip => 
    trip.daily_logs?.map(log => ({ 
      ...log, 
      trip_id: trip.id, 
      trip_route: `${trip.current_location} → ${trip.dropoff_location}`,
      total_distance: trip.total_distance,
      estimated_duration: trip.estimated_duration
    })) || []
  );

  const filteredLogs = allDailyLogs.filter(log => {
    const tripMatch = selectedTrip === 'all' || log.trip_id === parseInt(selectedTrip);
    const dateMatch = !dateFilter || log.date.includes(dateFilter);
    return tripMatch && dateMatch;
  });

  // Group logs by trip
  const logsByTrip = filteredLogs.reduce((acc, log) => {
    if (!acc[log.trip_id]) {
      acc[log.trip_id] = [];
    }
    acc[log.trip_id].push(log);
    return acc;
  }, {});

  const isCompliant = (log) => {
    return log.driving_hours <= 11 && log.total_cycle_hours <= 70;
  };

  const getComplianceRate = (logs) => {
    const compliant = logs.filter(isCompliant).length;
    return ((compliant / logs.length) * 100).toFixed(0);
  };

  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
              <FaCalendar className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Daily Logs</h2>
              <p className="text-blue-100">FMCSA-compliant electronic logging records</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredLogs.length}</div>
            <div className="text-blue-100">Total Logs</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                  placeholder="Filter by date..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80">
                  <FaCalendarDay className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center">
            <FaCalendar className="w-4 h-4 mr-2 text-blue-100" />
            <div className="text-sm text-blue-100">
              {filteredLogs.length} logs • {trips.length} trips
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center">
            <FaCalendar className="mr-2" />
            {filteredLogs.length}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Logs</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center">
            <FaCheckCircle className="mr-2" />
            {filteredLogs.filter(isCompliant).length}
          </div>
          <div className="text-sm text-gray-600 font-medium">Compliant Logs</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1 flex items-center justify-center">
            <FaChartBar className="mr-2" />
            {filteredLogs.length > 0 ? ((filteredLogs.filter(isCompliant).length / filteredLogs.length) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-gray-600 font-medium">Overall Compliance</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center">
            <FaBed className="mr-2" />
            {filteredLogs.filter(log => log.driving_hours > 8).length}
          </div>
          <div className="text-sm text-gray-600 font-medium">Logs with Breaks</div>
        </div>
      </div>

      {/* Trip Logs Sections */}
      {Object.entries(logsByTrip).map(([tripId, tripLogs]) => {
        const trip = trips.find(t => t.id === parseInt(tripId));
        const complianceRate = getComplianceRate(tripLogs);
        
        return (
          <div key={tripId} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Trip Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 border border-indigo-800 rounded-full flex items-center justify-center mr-4">
                    <FaTruck className="text-indigo-800 text-sm" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {trip?.current_location && trip?.dropoff_location
                        ? `${trip.current_location} → ${trip.dropoff_location}`
                        : 'Unknown Trip'}
                    </h3>

                    <p className="text-gray-600 text-sm flex items-center">
                      <FaCalendar className="w-3 h-3 mr-1" />
                      {tripLogs.length} daily logs • 
                      <FaTachometerAlt className="w-3 h-3 mx-1" />
                      {trip?.total_distance?.toFixed(0)} km • 
                      <FaClock className="w-3 h-3 mx-1" />
                      {trip?.estimated_duration?.toFixed(0)} hours
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${getComplianceColor(complianceRate)}`}>
                  <FaChartBar className="w-3 h-3 mr-1" />
                  {complianceRate}% Compliant
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaCalendarDay className="w-4 h-4 mr-2" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaTachometerAlt className="w-4 h-4 mr-2" />
                        Driving Hours
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 mr-2" />
                        On Duty
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaBed className="w-4 h-4 mr-2" />
                        Off Duty
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaSync className="w-4 h-4 mr-2" />
                        Cycle Hours
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Compliance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tripLogs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((log, index) => (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isCompliant(log) ? 'bg-green-50/50' : 'bg-red-50/50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <FaCalendarDay className="w-4 h-4 mr-2 text-gray-400" />
                          {log.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FaCalendar className="w-3 h-3 mr-1" />
                          Day {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${
                          log.driving_hours > 11 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {log.driving_hours.toFixed(1)} / 11h
                        </div>
                        {log.driving_hours > 11 && (
                          <div className="text-xs text-red-500 flex items-center">
                            <FaExclamationTriangle className="w-3 h-3 mr-1" />
                            Exceeded by {(log.driving_hours - 11).toFixed(1)}h
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaClock className="w-4 h-4 mr-2 text-gray-400" />
                          {log.on_duty_hours.toFixed(1)}h
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaBed className="w-4 h-4 mr-2 text-gray-400" />
                          {log.off_duty_hours.toFixed(1)}h
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${
                          log.total_cycle_hours > 70 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {log.total_cycle_hours.toFixed(1)} / 70h
                        </div>
                        {log.total_cycle_hours > 70 && (
                          <div className="text-xs text-red-500 flex items-center">
                            <FaExclamationTriangle className="w-3 h-3 mr-1" />
                            Exceeded by {(log.total_cycle_hours - 70).toFixed(1)}h
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          isCompliant(log) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isCompliant(log) ? (
                            <>
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              COMPLIANT
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="w-3 h-3 mr-1" />
                              VIOLATION
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {log.driving_hours > 11 && (
                            <div className="flex items-center text-xs text-red-600">
                              <FaTimesCircle className="w-3 h-3 mr-1" />
                              Driving hours exceeded
                            </div>
                          )}
                          {log.total_cycle_hours > 70 && (
                            <div className="flex items-center text-xs text-red-600">
                              <FaTimesCircle className="w-3 h-3 mr-1" />
                              Cycle hours exceeded
                            </div>
                          )}
                          {isCompliant(log) && (
                            <div className="flex items-center text-xs text-green-600">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              All regulations met
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
          <FaCalendar className="text-6xl mb-4 text-gray-400 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            No daily logs found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {selectedTrip === 'all' && !dateFilter
              ? 'Daily logs will be generated when you create and execute trips.'
              : 'No logs match your current filters. Try adjusting your selection.'
            }
          </p>
          {(selectedTrip !== 'all' || dateFilter) && (
            <button 
              onClick={() => {
                setSelectedTrip('all');
                setDateFilter('');
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center mx-auto"
            >
              <FaEraser className="mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Compliance Overview */}
      {filteredLogs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 border border-indigo-800 rounded-full flex items-center justify-center text-white text-sm mr-2">
              <FaChartBar className="w-3 h-3 text-indigo-800" />
            </div>
            FMCSA Compliance Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <FaCalendar className="mr-2" />
                {filteredLogs.length}
              </div>
              <div className="text-sm text-gray-600">Total Logs Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
                <FaCheckCircle className="mr-2" />
                {((filteredLogs.filter(isCompliant).length / filteredLogs.length) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Overall Compliance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                <FaTachometerAlt className="mr-2" />
                {filteredLogs.filter(log => log.driving_hours <= 11).length}
              </div>
              <div className="text-sm text-gray-600">Within Driving Limits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                <FaSync className="mr-2" />
                {filteredLogs.filter(log => log.total_cycle_hours <= 70).length}
              </div>
              <div className="text-sm text-gray-600">Within Cycle Limits</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogsList;