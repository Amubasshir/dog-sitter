import React, { useState, useMemo } from 'react';
import { Users, FileText } from 'lucide-react';
import { AuthContext, useAuthState } from './hooks/useAuth';
import TopTabs from './components/Layout/TopTabs';
import SearchBar from './components/Layout/SearchBar';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import SitterCard from './components/Cards/SitterCard';
import RequestCard from './components/Cards/RequestCard';
import FilterModal from './components/Modals/FilterModal';
import AuthModal from './components/Modals/AuthModal';
import SitterDetails from './components/Details/SitterDetails';
import RequestDetails from './components/Details/RequestDetails';
import NewRequestForm from './components/Forms/NewRequestForm';
import { mockSitters, mockRequests } from './data/mockData';
import { FilterOptions, Sitter, Request, SERVICE_TYPES } from './types';

function App() {
  const authState = useAuthState();
  const [activeTab, setActiveTab] = useState<'requests' | 'sitters'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSitterDetails, setShowSitterDetails] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    neighborhoods: [],
    serviceTypes: [],
    priceRange: [0, 200],
    rating: 0,
    availability: '',
    dogSize: []
  });

  // Determine default tab based on user type
  const defaultTab = useMemo(() => {
    if (!authState.isAuthenticated) return 'requests';
    return authState.userType === 'client' ? 'requests' : 'sitters';
  }, [authState.isAuthenticated, authState.userType]);

  // Update active tab when user type changes
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Filter and search logic
  const filteredSitters = useMemo(() => {
    return mockSitters.filter(sitter => {
      // Search query
      if (searchQuery.trim() && 
          !sitter.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !sitter.neighborhoods.some(n => n.toLowerCase().includes(searchQuery.toLowerCase().trim())) &&
          !sitter.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !sitter.services.some(service => SERVICE_TYPES[service.type].toLowerCase().includes(searchQuery.toLowerCase().trim()))) {
        return false;
      }

      // Neighborhood filter
      if (filters.neighborhoods.length > 0 &&
          !filters.neighborhoods.some(n => sitter.neighborhoods.includes(n))) {
        return false;
      }

      // Service type filter
      if (filters.serviceTypes.length > 0 &&
          !filters.serviceTypes.some(s => sitter.services.some(service => service.type === s))) {
        return false;
      }

      // Price filter
      const maxPrice = Math.max(...sitter.services.map(s => s.price));
      if (maxPrice > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && sitter.rating < filters.rating) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const filteredRequests = useMemo(() => {
    return mockRequests.filter(request => {
      // Search query
      if (searchQuery.trim() && 
          !request.client.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.neighborhood.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.dog.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !SERVICE_TYPES[request.serviceType].toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.dog.breed.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }

      // Neighborhood filter
      if (filters.neighborhoods.length > 0 &&
          !filters.neighborhoods.includes(request.neighborhood)) {
        return false;
      }

      // Service type filter
      if (filters.serviceTypes.length > 0 &&
          !filters.serviceTypes.includes(request.serviceType)) {
        return false;
      }

      // Price filter
      if (request.offeredPrice > filters.priceRange[1]) {
        return false;
      }

      // Dog size filter
      if (filters.dogSize.length > 0 &&
          !filters.dogSize.includes(request.dog.size)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const handleSitterClick = (sitter: Sitter) => {
    setSelectedSitter(sitter);
    setShowSitterDetails(true);
  };

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleFABClick = () => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (activeTab === 'requests' && authState.userType === 'client') {
      setShowNewRequestForm(true);
    } else if (activeTab === 'sitters' && authState.userType === 'sitter') {
      // Handle availability update
      console.log('Update availability');
    }
  };

  const handleNewRequest = (requestData: any) => {
    console.log('New request:', requestData);
    // In a real app, this would make an API call
  };

  return (
    <AuthContext.Provider value={authState}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        {/* Top Tabs */}
        <TopTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Search Bar */}
        <SearchBar
          onSearch={setSearchQuery}
          onFilter={() => setShowFilterModal(true)}
          searchQuery={searchQuery}
          onAuthClick={() => setShowAuthModal(true)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-2xl mx-auto py-4">
            {activeTab === 'sitters' ? (
              <div className="space-y-4">
                {filteredSitters.length === 0 ? (
                  <div className="text-center py-16 mx-4">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">לא נמצאו סיטרים</h3>
                      <p className="text-gray-500">נסה לשנות את הסינון או החיפוש</p>
                    </div>
                  </div>
                ) : (
                  filteredSitters.map((sitter) => (
                    <SitterCard
                      key={sitter.id}
                      sitter={sitter}
                      onClick={() => handleSitterClick(sitter)}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-16 mx-4">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">לא נמצאו בקשות</h3>
                      <p className="text-gray-500">נסה לשנות את הסינון או החיפוש</p>
                    </div>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onClick={() => handleRequestClick(request)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          activeTab={activeTab}
          onAction={handleFABClick}
        />

        {/* Modals */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={setFilters}
          activeTab={activeTab}
          currentFilters={filters}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />

        {selectedSitter && (
          <SitterDetails
            sitter={selectedSitter}
            isOpen={showSitterDetails}
            onClose={() => {
              setShowSitterDetails(false);
              setSelectedSitter(null);
            }}
            onContact={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Contact sitter');
              }
            }}
            onBooking={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Book sitter');
              }
            }}
          />
        )}

        {selectedRequest && (
          <RequestDetails
            request={selectedRequest}
            isOpen={showRequestDetails}
            onClose={() => {
              setShowRequestDetails(false);
              setSelectedRequest(null);
            }}
            onAccept={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Accept request');
              }
            }}
            onContact={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Contact client');
              }
            }}
          />
        )}

        <NewRequestForm
          isOpen={showNewRequestForm}
          onClose={() => setShowNewRequestForm(false)}
          onSubmit={handleNewRequest}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;