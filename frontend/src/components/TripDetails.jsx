/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { 
  FaChartBar,
  FaRuler,
  FaClock,
  FaCalendar,
  FaTrafficLight,
  FaFileAlt,
  FaSync,
  FaGasPump,
  FaChartLine,
  FaDollarSign,
  FaBed,
  FaMap,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTachometerAlt,
  FaRoad,
  FaMapMarkerAlt
} from 'react-icons/fa';

const TripDetails = ({ tripData }) => {
  const [tripAnalysis, setTripAnalysis] = useState(null);
  const [complianceStats, setComplianceStats] = useState(null);

  useEffect(() => {
    if (tripData) {
      calculateTripAnalysis();
      calculateComplianceStats();
    }
  }, [tripData]);

  const calculateTripAnalysis = () => {
    if (!tripData) return;

    const totalDrivingHours = tripData.daily_logs?.reduce((sum, log) => sum + log.driving_hours, 0) || 0;
    const totalOnDutyHours = tripData.daily_logs?.reduce((sum, log) => sum + log.on_duty_hours, 0) || 0;
    const averageDailyDriving = totalDrivingHours / (tripData.daily_logs?.length || 1);
    const totalRestStops = tripData.rest_stops?.length || 0;
    const fuelStops = Math.floor((tripData.total_distance || 0) / 1000);
    
    // Calculate trip costs
    const fuelCost = ((tripData.total_distance || 0) * 0.35).toFixed(2);
    const tollsCost = ((tripData.total_distance || 0) * 0.05).toFixed(2);
    const accommodationCost = ((tripData.daily_logs?.length || 0) * 80).toFixed(2);

    setTripAnalysis({
      totalDrivingHours,
      totalOnDutyHours,
      averageDailyDriving,
      totalRestStops,
      fuelStops,
      fuelCost,
      tollsCost,
      accommodationCost,
      totalCost: (parseFloat(fuelCost) + parseFloat(tollsCost) + parseFloat(accommodationCost)).toFixed(2)
    });
  };

  const calculateComplianceStats = () => {
    if (!tripData?.daily_logs) return;

    const totalDays = tripData.daily_logs.length;
    const compliantDays = tripData.daily_logs.filter(log => 
      log.driving_hours <= 11 && log.total_cycle_hours <= 70
    ).length;
    
    const daysWithBreaks = tripData.daily_logs.filter(log => 
      log.driving_hours > 8
    ).length;

    const cycleUtilization = ((tripData.daily_logs[tripData.daily_logs.length - 1]?.total_cycle_hours || 0) / 70 * 100).toFixed(1);

    // Calculate potential violations
    const potentialViolations = tripData.daily_logs.filter(log => 
      log.driving_hours > 11 || log.total_cycle_hours > 70
    ).map(log => ({
      date: log.date,
      issues: [
        ...(log.driving_hours > 11 ? [`Driving hours exceeded: ${log.driving_hours}h/11h`] : []),
        ...(log.total_cycle_hours > 70 ? [`Cycle hours exceeded: ${log.total_cycle_hours}h/70h`] : [])
      ]
    }));

    setComplianceStats({
      totalDays,
      compliantDays,
      complianceRate: ((compliantDays / totalDays) * 100).toFixed(1),
      daysWithBreaks,
      cycleUtilization,
      potentialViolations
    });
  };

  const calculateEfficiency = () => {
    if (!tripData || !tripAnalysis) return {};
    
    const distance = tripData.total_distance || 0;
    const duration = tripData.estimated_duration || 1;
    
    return {
      averageSpeed: (distance / duration).toFixed(1),
      drivingEfficiency: ((duration / (tripAnalysis.totalDrivingHours || 1)) * 100).toFixed(1),
      dailyProgress: (distance / (tripData.daily_logs?.length || 1)).toFixed(1)
    };
  };

  const efficiency = calculateEfficiency();

  if (!tripData || !tripAnalysis || !complianceStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating trip analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <FaChartBar className="mr-3" />
              Detailed Trip Analysis
            </h2>
            <p className="text-blue-100">Comprehensive breakdown of your trip performance and compliance</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-center flex items-center justify-center">
              <FaRuler className="mr-2" />
              {tripData.total_distance?.toFixed(0)} km
            </div>
            <div className="text-blue-100 text-sm">Total Distance</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-sm text-blue-200">Trip</div>
            <div className="font-semibold">{tripData.id}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-blue-200">Duration</div>
            <div className="font-semibold flex items-center justify-center">
              <FaClock className="mr-1" />
              {tripData.estimated_duration?.toFixed(1)} hours
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-blue-200">Days</div>
            <div className="font-semibold flex items-center justify-center">
              <FaCalendar className="mr-1" />
              {tripData.daily_logs?.length || 0} days
            </div>
          </div>
        </div>
      </div>

      {/* FMCSA Compliance Status */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaTrafficLight className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">FMCSA Compliance Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${
            complianceStats.complianceRate >= 90 
              ? ' border-green-500' 
              : ' border-yellow-500'
          }`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                complianceStats.complianceRate >= 90 ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <FaFileAlt className={complianceStats.complianceRate >= 90 ? 'text-green-600' : 'text-yellow-600'} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Overall Compliance</div>
                <div className={`text-2xl font-bold ${
                  complianceStats.complianceRate >= 90 ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {complianceStats.complianceRate}%
                </div>
                <div className="text-xs text-gray-500">{complianceStats.compliantDays}/{complianceStats.totalDays} days</div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border ${
            tripAnalysis.averageDailyDriving <= 11 
              ? ' border-green-500' 
              : ' border-red-500'
          }`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                tripAnalysis.averageDailyDriving <= 11 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <FaClock className={tripAnalysis.averageDailyDriving <= 11 ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Daily Driving</div>
                <div className={`text-2xl font-bold ${
                  tripAnalysis.averageDailyDriving <= 11 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {tripAnalysis.averageDailyDriving.toFixed(1)}/11h
                </div>
                <div className="text-xs text-gray-500">Average per day</div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border ${
            complianceStats.cycleUtilization <= 100 
              ? ' border-green-500' 
              : ' border-red-500'
          }`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                complianceStats.cycleUtilization <= 100 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <FaSync className={complianceStats.cycleUtilization <= 100 ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Cycle Usage</div>
                <div className={`text-2xl font-bold ${
                  complianceStats.cycleUtilization <= 100 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {complianceStats.cycleUtilization}%
                </div>
                <div className="text-xs text-gray-500">70-hour cycle</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border  border-blue-500">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FaGasPump className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Fuel Stops</div>
                <div className="text-2xl font-bold text-blue-700">{tripAnalysis.fuelStops}</div>
                <div className="text-xs text-gray-500">Every 1,000 km</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Efficiency Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaChartLine className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Trip Efficiency Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-2 flex items-center justify-center">
              <FaTachometerAlt className="mr-2" />
              {efficiency.averageSpeed}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Average Speed</div>
            <div className="text-xs text-gray-500">Overall trip speed including stops</div>
            <div className="text-blue-500 text-xs mt-2">km/h</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-2">{efficiency.drivingEfficiency}%</div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Driving Efficiency</div>
            <div className="text-xs text-gray-500">Time spent driving vs total time</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center border border-purple-200">
            <div className="text-3xl font-bold text-purple-700 mb-2 flex items-center justify-center">
              <FaRoad className="mr-2" />
              {efficiency.dailyProgress}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Daily Progress</div>
            <div className="text-xs text-gray-500">Average distance per day</div>
            <div className="text-purple-500 text-xs mt-2">km/day</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 text-center border border-orange-200">
            <div className="text-3xl font-bold text-orange-700 mb-2 flex items-center justify-center">
              <FaBed className="mr-2" />
              {tripAnalysis.totalRestStops}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Rest Stops</div>
            <div className="text-xs text-gray-500">Scheduled breaks and rests</div>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaDollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Trip Cost Analysis</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <FaGasPump className="mr-1" />
                  Fuel Cost
                </span>
                <span className="text-lg font-bold text-gray-800">${tripAnalysis.fuelCost}</span>
              </div>
              <div className="text-xs text-gray-500">
                ${(tripAnalysis.fuelCost / (tripData.total_distance || 1)).toFixed(3)}/km
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <FaRoad className="mr-1" />
                  Tolls & Fees
                </span>
                <span className="text-lg font-bold text-gray-800">${tripAnalysis.tollsCost}</span>
              </div>
              <div className="text-xs text-gray-500">
                ${(tripAnalysis.tollsCost / (tripData.total_distance || 1)).toFixed(3)}/km
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <FaBed className="mr-1" />
                  Accommodation
                </span>
                <span className="text-lg font-bold text-gray-800">${tripAnalysis.accommodationCost}</span>
              </div>
              <div className="text-xs text-gray-500">
                ${(tripAnalysis.accommodationCost / (tripData.daily_logs?.length || 1)).toFixed(0)}/night
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-indigo-800 border border-indigo-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold flex items-center">
                <FaDollarSign className="mr-2" />
                Estimated Total Cost
              </span>
              <span className="text-3xl font-bold">${tripAnalysis.totalCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaCalendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Daily Performance Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripData.daily_logs?.map((log, index) => (
            <div key={index} className={`rounded-xl p-4 border ${
              log.driving_hours <= 11 && log.total_cycle_hours <= 70 
                ? ' border-green-500' 
                : ' border-red-500'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-800">Day {index + 1}</span>
                <span className="text-sm text-gray-500">{log.date}</span>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <FaTachometerAlt className="mr-1" />
                    Driving:
                  </span>
                  <span className={`font-semibold ${
                    log.driving_hours > 11 ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {log.driving_hours.toFixed(1)}h
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On Duty:</span>
                  <span className="font-semibold text-gray-800">{log.on_duty_hours.toFixed(1)}h</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <FaSync className="mr-1" />
                    Cycle:
                  </span>
                  <span className={`font-semibold ${
                    log.total_cycle_hours > 70 ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {log.total_cycle_hours.toFixed(1)}/70h
                  </span>
                </div>
              </div>
              
              <div className={`text-center py-1 rounded-lg text-sm font-medium flex items-center justify-center ${
                log.driving_hours <= 11 && log.total_cycle_hours <= 70 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {log.driving_hours <= 11 && log.total_cycle_hours <= 70 ? (
                  <>
                    <FaCheckCircle className="mr-1" />
                    Compliant
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-1" />
                    Issues
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Potential Issues */}
      {complianceStats.potentialViolations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3 shadow-md">
              <FaExclamationTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Potential Compliance Issues</h3>
          </div>

          <div className="space-y-3">
            {complianceStats.potentialViolations.map((violation, index) => (
              <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="font-semibold text-red-800 mb-2 flex items-center">
                  <FaCalendar className="mr-2" />
                  {violation.date}
                </div>
                <div className="space-y-1">
                  {violation.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="text-sm text-red-700 flex items-start">
                      <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Information */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <FaMap className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Route Information</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
              <FaRoad className="mr-2" />
              Route Segments
            </h4>
            <div className="space-y-4">
              {tripData.legs?.map((leg, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">Leg {index + 1}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                      <FaRuler className="mr-1" />
                      {leg.distance.toFixed(1)} km
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-green-500" />
                    {leg.start_location} 
                    <FaRoad className="mx-2 text-gray-400" />
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    {leg.end_location}
                  </div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <FaClock className="mr-1" />
                    Duration: {leg.duration.toFixed(1)} hours
                  </div>
                  <div className="text-sm text-gray-500 bg-white p-2 rounded border">
                    {leg.instructions}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
              <FaBed className="mr-2" />
              Scheduled Rest Stops
            </h4>
            {tripData.rest_stops?.length > 0 ? (
              <div className="space-y-3">
                {tripData.rest_stops.map((stop, index) => (
                  <div key={index} className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-gray-800 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        {stop.location}
                      </div>
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                        <FaClock className="mr-1" />
                        {stop.duration_hours}h rest
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      <span className="font-medium">Reason:</span> {stop.reason}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-8 text-center border border-dashed border-gray-300">
                <FaBed className="text-4xl mb-3 text-gray-400 mx-auto" />
                <p className="text-gray-600 font-medium">No additional rest stops required</p>
                <p className="text-gray-500 text-sm mt-1">You're good to go without scheduled breaks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;