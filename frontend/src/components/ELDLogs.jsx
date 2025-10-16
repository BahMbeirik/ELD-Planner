/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import {  FileText, CheckCircle, AlertCircle, Clock, MapPin, Truck, Calendar, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ELDLogs = ({ tripData }) => {
  const logRef = useRef();
  const [dynamicLogs, setDynamicLogs] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (tripData && tripData.daily_logs) {
      generateDynamicLogEntries();
    }
  }, [tripData]);

  const generateDynamicLogEntries = () => {
    if (!tripData?.daily_logs) return;

    const generatedLogs = tripData.daily_logs.map((log, dayIndex) => {
      const logEntries = [];
      let currentTime = new Date();
      currentTime.setHours(6, 0, 0, 0);

      // Pre-trip Inspection
      logEntries.push({
        time: formatTime(currentTime),
        location: dayIndex === 0 ? tripData.current_location : getRestStopLocation(dayIndex),
        driving: false,
        onDuty: true,
        offDuty: false,
        remarks: 'Pre-trip inspection and vehicle check'
      });

      // Start Driving
      currentTime.setMinutes(currentTime.getMinutes() + 30);
      logEntries.push({
        time: formatTime(currentTime),
        location: 'Departure',
        driving: true,
        onDuty: false,
        offDuty: false,
        remarks: 'Begin driving - Main route'
      });

      // Calculate driving segments with breaks
      const totalDrivingMinutes = log.driving_hours * 60;
      const segments = calculateDrivingSegments(totalDrivingMinutes, log.driving_hours);

      segments.forEach((segment, segmentIndex) => {
        if (segment.type === 'drive') {
          currentTime.setMinutes(currentTime.getMinutes() + segment.duration);
          logEntries.push({
            time: formatTime(currentTime),
            location: getIntermediateLocation(dayIndex, segmentIndex),
            driving: true,
            onDuty: false,
            offDuty: false,
            remarks: `Driving segment ${segmentIndex + 1}`
          });
        } else if (segment.type === 'break') {
          currentTime.setMinutes(currentTime.getMinutes() + 30);
          logEntries.push({
            time: formatTime(currentTime),
            location: 'Rest Area',
            driving: false,
            onDuty: false,
            offDuty: true,
            remarks: '30-minute break - FMCSA requirement'
          });
        }
      });

      // Pickup/Dropoff activities
      if (dayIndex === 0) {
        currentTime.setMinutes(currentTime.getMinutes() + 60);
        logEntries.push({
          time: formatTime(currentTime),
          location: tripData.pickup_location || tripData.current_location,
          driving: false,
          onDuty: true,
          offDuty: false,
          remarks: 'Loading and pickup activities'
        });
      } else if (dayIndex === tripData.daily_logs.length - 1) {
        currentTime.setMinutes(currentTime.getMinutes() + 60);
        logEntries.push({
          time: formatTime(currentTime),
          location: tripData.dropoff_location,
          driving: false,
          onDuty: true,
          offDuty: false,
          remarks: 'Unloading and dropoff activities'
        });
      }

      // Post-trip and rest
      currentTime.setHours(19, 0, 0, 0);
      logEntries.push({
        time: formatTime(currentTime),
        location: dayIndex === tripData.daily_logs.length - 1 ? tripData.dropoff_location : 'Destination',
        driving: false,
        onDuty: true,
        offDuty: false,
        remarks: 'Post-trip inspection and documentation'
      });

      currentTime.setHours(20, 0, 0, 0);
      logEntries.push({
        time: formatTime(currentTime),
        location: 'Hotel/Rest Area',
        driving: false,
        onDuty: false,
        offDuty: true,
        remarks: `10-hour rest period`
      });

      return {
        date: log.date,
        entries: logEntries,
        summary: {
          drivingHours: log.driving_hours,
          onDutyHours: log.on_duty_hours,
          offDutyHours: log.off_duty_hours,
          totalCycleHours: log.total_cycle_hours
        }
      };
    });

    setDynamicLogs(generatedLogs);
  };

  const calculateDrivingSegments = (totalMinutes, drivingHours) => {
    const segments = [];
    let remainingMinutes = totalMinutes;
    const needsBreak = drivingHours > 8;

    while (remainingMinutes > 0) {
      if (needsBreak && segments.length === 1) {
        segments.push({ type: 'break', duration: 30 });
      }
      const segmentDuration = Math.min(240, remainingMinutes);
      segments.push({ type: 'drive', duration: segmentDuration });
      remainingMinutes -= segmentDuration;
    }
    return segments;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRestStopLocation = (dayIndex) => {
    const restStops = ['Rest Area A', 'Truck Stop B', 'Service Plaza C', 'Parking Area D'];
    return restStops[dayIndex % restStops.length];
  };

  const getIntermediateLocation = (dayIndex, segmentIndex) => {
    const locations = ['Highway I-90', 'Route 66', 'Interstate 80', 'State Road 101'];
    return `${locations[(dayIndex + segmentIndex) % locations.length]}`;
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const element = logRef.current;
      
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const padding = {
        top: 20,
        right: 10,
        bottom: 20, 
        left: 10
      };
      
      const contentWidth = pageWidth - padding.left - padding.right;
      const contentHeight = pageHeight - padding.top - padding.bottom;
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let currentHeight = imgHeight;
      let yPosition = padding.top;
      let pageNumber = 1;

      
      addPageHeader(pdf, pageWidth, padding, pageNumber, tripData);

      
      pdf.addImage(imgData, 'PNG', padding.left, yPosition, imgWidth, imgHeight);
      currentHeight -= contentHeight;

      
      addPageFooter(pdf, pageWidth, pageHeight, pageNumber);

      
      while (currentHeight >= 0) {
        pageNumber++;
        pdf.addPage();
        
        
        addPageHeader(pdf, pageWidth, padding, pageNumber, tripData);
        
        yPosition = currentHeight - imgHeight + padding.top;
        pdf.addImage(imgData, 'PNG', padding.left, yPosition, imgWidth, imgHeight);
        
        
        addPageFooter(pdf, pageWidth, pageHeight, pageNumber);
        
        currentHeight -= contentHeight;
      }

      pdf.save(`eld-log-trip-${tripData.id}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };


  const addPageHeader = (pdf, pageWidth, padding, pageNumber, tripData) => {
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    

    pdf.text(`Trip : ${tripData.id}`, padding.left, padding.top - 5);
    pdf.text(`Driver: ${tripData.driver_name || 'Professional Driver'}`, padding.left, padding.top - 2);
    
    
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    pdf.text('ELD Daily Logs - FMCSA Compliant', pageWidth / 2, padding.top - 5, { align: 'center' });
    
    
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(`Page ${pageNumber}`, pageWidth - padding.right, padding.top - 5, { align: 'right' });
    
    
    pdf.setDrawColor(200);
    pdf.line(padding.left, padding.top - 1, pageWidth - padding.right, padding.top - 1);
  };


  const addPageFooter = (pdf, pageWidth, pageHeight, pageNumber) => {
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    
    
    pdf.setDrawColor(200);
    pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
    
    
    pdf.text('Generated by ELD Trip Planner', 10, pageHeight - 10);
    pdf.text(`Page ${pageNumber} of ...`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text(new Date().toLocaleDateString(), pageWidth - 10, pageHeight - 10, { align: 'right' });
  };

  const generateLogDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        displayDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        })
      });
    }
    return dates;
  };

  const logDates = generateLogDates();

  if (!tripData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading trip data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-8 h-8 text-indigo-800" />
              <h2 className="text-2xl font-bold text-gray-800">ELD Daily Logs</h2>
            </div>
            <p className="text-sm text-gray-600">FMCSA 49 CFR Part 395 Compliant</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-800 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isPrinting ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Trip Info */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <Truck className="w-4 h-4 text-indigo-800" />
            <span className="text-gray-600">Trip :</span>
            <span className="font-semibold text-gray-800">{tripData.id}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-indigo-800" />
            <span className="text-gray-600">Distance:</span>
            <span className="font-semibold text-gray-800">{tripData.total_distance?.toFixed(0)} km</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-indigo-800" />
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-800">{tripData.estimated_duration?.toFixed(1)} hrs</span>
          </div>
        </div>
      </div>

      {/* Log Sheets */}
      <div ref={logRef} className="space-y-6">
        {dynamicLogs.map((dailyLog, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Log Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold">{dailyLog.date}</span>
                    <span className="text-blue-200 text-sm">Day {index + 1} of {tripData.daily_logs?.length}</span>
                  </div>
                  <div className="text-blue-100 text-sm">
                    Driver: {tripData.driver_name || 'Professional Driver'} • Vehicle: {tripData.vehicle_id || `Truck ${tripData.id + 100}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-medium">ELD : ELD-{tripData.id}-{index + 1}</div>
                  <div className="text-blue-200 text-xs">24-Hour Period: 12:00 AM - 11:59 PM</div>
                </div>
              </div>
            </div>

            {/* Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Driving</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">On Duty</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Off Duty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dailyLog.entries.map((entry, entryIndex) => (
                    <tr
                      key={entryIndex}
                      className={`${
                        entry.driving ? 'bg-blue-50' : entry.offDuty ? 'bg-green-50' : 'bg-yellow-50'
                      } hover:bg-opacity-75 transition-colors`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{entry.location}</td>
                      <td className="px-4 py-3 text-center">
                        {entry.driving && <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.onDuty && <CheckCircle className="w-5 h-5 text-yellow-600 mx-auto" />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.offDuty && <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t-2 border-gray-200 bg-gray-50 px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">Total Driving</div>
                  <div className="text-2xl font-bold text-blue-600">{dailyLog.summary.drivingHours.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">hours</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">On Duty</div>
                  <div className="text-2xl font-bold text-yellow-600">{dailyLog.summary.onDutyHours.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">hours</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">Off Duty</div>
                  <div className="text-2xl font-bold text-green-600">{dailyLog.summary.offDutyHours.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">hours</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">Cycle Hours</div>
                  <div className="text-2xl font-bold text-purple-600">{dailyLog.summary.totalCycleHours.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">of 70 hrs</div>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">FMCSA Status:</span>
                  {dailyLog.summary.drivingHours <= 11 && dailyLog.summary.totalCycleHours <= 70 ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-bold">COMPLIANT</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 font-bold">VIOLATION</span>
                    </>
                  )}
                  {dailyLog.summary.drivingHours > 8 && (
                    <span className="ml-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">30-min Break Applied</span>
                  )}
                </div>
              </div>

              {/* Certification */}
              <div className="mt-4 p-4 border-t border-gray-200">
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Driver Certification:</span> I certify that my activities are true and correct.
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700">Signature:</span>
                    <span className="ml-2 border-b border-gray-400 inline-block w-48">_________________________</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-600">{dailyLog.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 8-Day Cycle Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">8-Day Cycle Overview</h3>
          <span className="text-sm text-gray-600">FMCSA 70-Hour Rule</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-6">
          {logDates.map((date, index) => {
            const dailyLog = tripData.daily_logs?.[index];
            const isActiveDay = index < (tripData.daily_logs?.length || 0);
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg text-center ${
                  isActiveDay
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="text-xs font-semibold text-gray-600 mb-1">Day {index + 1}</div>
                <div className="text-xs text-gray-500 mb-2">{date.displayDate}</div>
                <div className="text-lg font-bold text-gray-800 mb-1">
                  {dailyLog ? `${dailyLog.driving_hours.toFixed(1)}h` : '-'}
                </div>
                <div className="text-xs">
                  {dailyLog ? (
                    dailyLog.total_cycle_hours <= 70 ? (
                      <span className="text-green-600 font-semibold">✓</span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗</span>
                    )
                  ) : (
                    <span className="text-gray-400">Future</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cycle Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-700">Total Trip:</span>
            <span className="text-gray-600">
              {tripData.total_distance?.toFixed(0)} km • {tripData.estimated_duration?.toFixed(1)} hours • {tripData.daily_logs?.length || 0} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Overall Compliance:</span>
            <div className="flex items-center space-x-2">
              {tripData.daily_logs?.every(log => log.driving_hours <= 11 && log.total_cycle_hours <= 70) ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-700">FULLY COMPLIANT</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-700">COMPLIANCE ISSUES</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELDLogs;