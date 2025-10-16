import React, { useState, useEffect } from 'react';
import { 
  FaTruck, 
  FaMap, 
  FaFileAlt, 
  FaList, 
  FaArrowRight,
  FaRocket,
  FaShieldAlt,
  FaGasPump
} from 'react-icons/fa';
import TripForm from './components/TripForm';
import TripResults from './components/TripResults';
import MapDisplay from './components/MapDisplay';
import ELDLogs from './components/ELDLogs';
import TripDetails from './components/TripDetails';
import TripsList from './components/TripsList';
import TripLegsList from './components/TripLegsList';
import RestStopsList from './components/RestStopsList';
import DailyLogsList from './components/DailyLogsList';
import Navbar from './components/Navbar';

function App() {
  const [tripData, setTripData] = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('route');
  const [activeView, setActiveView] = useState('plan');

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    try {
      const response = await fetch('https://eld-planner-y3cx.onrender.com/api/trips/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Error loading trips. Please check if the server is running.');
    }
  };

  const handleTripSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/trips/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTripData(data);
      setActiveTab('route');
      setActiveView('plan');
      await fetchAllTrips();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Error creating trip. Please try again.');
    }
    setLoading(false);
  };

  const handleViewTrip = (trip) => {
    setTripData(trip);
    setActiveView('plan');
    setActiveTab('route');
  };

  const handleActiveViewChange = (view) => {
    setActiveView(view);
    if (view === 'plan') {
      setActiveTab('route');
    } else if (view === 'view' && !activeTab) {
      setActiveTab('trips');
    }
  };

  const handleActiveTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar 
        activeView={activeView}
        setActiveView={handleActiveViewChange}
        activeTab={activeTab}
        setActiveTab={handleActiveTabChange}
        tripData={tripData}
      />
      
      <div className=" max-w-7xl mx-auto px-0 py-6">
        {activeView === 'plan' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <TripForm onSubmit={handleTripSubmit} loading={loading} />
              </div>
              
              {/* Mini Trips List */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Recent Trips
                </h3>
                {allTrips.length > 0 ? (
                  <div className="space-y-3">
                    {allTrips
                      .slice() // إنشاء نسخة من المصفوفة لتجنب تعديل الأصل
                      .reverse() // عكس ترتيب المصفوفة (الأحدث أولاً)
                      .slice(0, 3) // أخذ أول 3 عناصر بعد العكس
                      .map(trip => (
                        <div 
                          key={trip.id} 
                          className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                          onClick={() => handleViewTrip(trip)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1 flex items-center">
                                <FaTruck className="text-blue-500 mr-1" size={12} />
                                {trip.current_location} 
                                <FaArrowRight className="mx-1 text-gray-400" size={10} />
                                {trip.dropoff_location}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <FaList className="mr-1" size={10} />
                                Trip {trip.id}
                              </div>
                            </div>
                            <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              {trip.total_distance?.toFixed(0)} km
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: '75%' }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaTruck className="text-gray-400 mx-auto mb-2" size={24} />
                    <p className="text-gray-500 text-sm">No trips available</p>
                    <p className="text-gray-400 text-xs mt-1">Create your first trip to get started</p>
                  </div>
                )}
              </div>

            </div>
            
            {/* Main Content */}
            <div className="lg:w-2/3 xl:w-3/4">
              {tripData ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="tab-content">
                    {activeTab === 'route' && (
                      <div className="space-y-6 pb-6">
                        <TripResults tripData={tripData} />
                        <MapDisplay tripData={tripData} />
                      </div>
                    )}
                    
                    {activeTab === 'logs' && (
                      <ELDLogs tripData={tripData} />
                    )}
                    
                    {activeTab === 'details' && (
                      <TripDetails tripData={tripData} />
                    )}
                  </div>
                </div>
              ) : (
                <div className=" flex items-center justify-center min-h-[60vh]">
                  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl text-center border border-gray-200">
                    <div className="w-20 h-20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FaTruck className="text-blue-900" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                      Welcome to ELD Trip Planner
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Enter your trip details to generate FMCSA-compliant logs and optimized routes with intelligent planning.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="feature p-4 rounded-xl bg-blue-50 border border-blue-200 hover:shadow-md transition-shadow">
                        <FaMap className="text-2xl mb-2 text-blue-600" />
                        <p className="font-semibold text-gray-800">Optimized Route Planning</p>
                        <p className="text-sm text-gray-600 mt-1">Smart routing with real-time optimization</p>
                      </div>
                      <div className="feature p-4 rounded-xl bg-green-50 border border-green-200 hover:shadow-md transition-shadow">
                        <FaFileAlt className="text-2xl mb-2 text-green-600" />
                        <p className="font-semibold text-gray-800">Automated ELD Logs</p>
                        <p className="text-sm text-gray-600 mt-1">Compliant electronic logging</p>
                      </div>
                      <div className="feature p-4 rounded-xl bg-purple-50 border border-purple-200 hover:shadow-md transition-shadow">
                        <FaShieldAlt className="text-2xl mb-2 text-purple-600" />
                        <p className="font-semibold text-gray-800">FMCSA Compliance</p>
                        <p className="text-sm text-gray-600 mt-1">Regulatory compliance guaranteed</p>
                      </div>
                      <div className="feature p-4 rounded-xl bg-orange-50 border border-orange-200 hover:shadow-md transition-shadow">
                        <FaGasPump className="text-2xl mb-2 text-orange-600" />
                        <p className="font-semibold text-gray-800">Fuel Stop Planning</p>
                        <p className="text-sm text-gray-600 mt-1">Optimized refueling locations</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-center">
                      <FaRocket className="mr-2" />
                      Get started by entering your trip details in the form
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Data View
          <div >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 min-h-[600px]">
              {activeTab === 'trips' && (
                <TripsList trips={allTrips} onViewTrip={handleViewTrip} />
              )}
              {activeTab === 'legs' && (
                <TripLegsList trips={allTrips} />
              )}
              {activeTab === 'rest-stops' && (
                <RestStopsList trips={allTrips} />
              )}
              {activeTab === 'daily-logs' && (
                <DailyLogsList trips={allTrips} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;