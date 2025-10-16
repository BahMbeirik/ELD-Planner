import React, { useState } from 'react';
import { 
  FaTruck, 
  FaExclamationCircle, 
  FaBars, 
  FaTimes, 
  FaChevronDown,
  FaMap,
  FaFileAlt,
  FaChartBar,
  FaRoad,
  FaBed,
  FaCalendar,
  FaPlus,
  FaDatabase
} from 'react-icons/fa';

const Navbar = ({ activeView, setActiveView, activeTab, setActiveTab, tripData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDataDropdown, setShowDataDropdown] = useState(false);

  const navigationItems = [
    {
      id: 'plan',
      label: 'Plan Trip',
      description: 'Create new trip',
      icon: FaPlus
    },
    {
      id: 'view',
      label: 'View Data',
      description: 'Browse all data',
      icon: FaDatabase,
      subItems: [
        { id: 'trips', label: 'Trips', icon: FaTruck },
        { id: 'legs', label: 'Trip Legs', icon: FaRoad },
        { id: 'rest-stops', label: 'Rest Stops', icon: FaBed },
        { id: 'daily-logs', label: 'Daily Logs', icon: FaCalendar }
      ]
    }
  ];

  const tripTabs = [
    { id: 'route', label: 'Route & Map', icon: FaMap },
    { id: 'logs', label: 'ELD Logs', icon: FaFileAlt },
    { id: 'details', label: 'Trip Details', icon: FaChartBar }
  ];

  const handleNavItemClick = (itemId) => {
    if (itemId === 'view') {
      setShowDataDropdown(!showDataDropdown);
      setActiveView('view');
    } else {
      setActiveView(itemId);
      setActiveTab('route');
      setShowDataDropdown(false);
    }
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSubItemClick = (subItemId) => {
    setActiveView('view');
    setActiveTab(subItemId);
    setShowDataDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const handleTripTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // const closeMobileMenu = () => {
  //   setIsMobileMenuOpen(false);
  // };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-lg shadow-md">
                <FaTruck className="w-6 h-6 text-blue-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl tracking-tight">ELD Planner</span>
                <span className="text-blue-200 text-xs font-medium">FMCSA Compliant</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => handleNavItemClick(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeView === item.id
                          ? 'bg-white text-blue-900 shadow-md'
                          : 'text-white hover:bg-blue-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                      {item.subItems && (
                        <FaChevronDown className={`w-3 h-3 transition-transform ${
                          showDataDropdown && activeView === 'view' ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {item.subItems && showDataDropdown && activeView === 'view' && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                        {item.subItems.map(subItem => {
                          const SubIconComponent = subItem.icon;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => handleSubItemClick(subItem.id)}
                              className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                                activeTab === subItem.id
                                  ? 'bg-blue-50 text-blue-900 border-r-2 border-blue-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <SubIconComponent className="w-4 h-4" />
                              <span className="font-medium">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700">
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleNavItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        activeView === item.id
                          ? 'bg-white text-blue-900'
                          : 'text-white hover:bg-blue-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.subItems && <FaChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {item.subItems && activeView === 'view' && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems.map(subItem => {
                          const SubIconComponent = subItem.icon;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => handleSubItemClick(subItem.id)}
                              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                                activeTab === subItem.id
                                  ? 'bg-blue-600 text-white'
                                  : 'text-blue-100 hover:bg-blue-700'
                              }`}
                            >
                              <SubIconComponent className="w-4 h-4" />
                              <span className="text-sm">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* FMCSA Compliance Badge */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <FaExclamationCircle className="w-4 h-4 text-orange-600" />
            <span className="text-gray-700">
              <span className="font-semibold">FMCSA HOS Regulations:</span> 11-Hour Driving Limit • 14-Hour Window • 30-Min Break Required
            </span>
          </div>
        </div>
      </div>

      {/* Trip Tabs - Secondary Navigation */}
      {tripData && activeView === 'plan' && (
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
          <div className="flex justify-between px-4 sm:px-6 lg:px-8">
            {/* Trip Info Banner */}
            <div className="py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FaTruck className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{tripData.current_location}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold">{tripData.dropoff_location}</span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-4 text-sm">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                      {tripData.total_distance?.toFixed(0)} km
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                      {tripData.estimated_duration?.toFixed(1)} hrs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 py-2 overflow-x-auto">
              {tripTabs.map(tab => {
                const TabIconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTripTabClick(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? ' text-indigo-600 shadow-md border-2 border-indigo-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <TabIconComponent className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
          </div>
        </div>
      )}

      
    </>
  );
};

export default Navbar;