import { FileText, Users } from "lucide-react";
import React, { useMemo, useState } from "react";
import RequestCard from "./components/Cards/RequestCard";
import SitterCard from "./components/Cards/SitterCard";
import RequestDetails from "./components/Details/RequestDetails";
import SitterDetails from "./components/Details/SitterDetails";
import NewRequestForm from "./components/Forms/NewRequestForm";
import FloatingActionButton from "./components/Layout/FloatingActionButton";
import SearchBar from "./components/Layout/SearchBar";
import TopTabs from "./components/Layout/TopTabs";
import AuthModal from "./components/Modals/AuthModal";
import FilterModal from "./components/Modals/FilterModal";
import { mockRequests, mockSitters } from "./data/mockData";
import { AuthContext, useAuthState } from "./hooks/useAuth";
import {
  clientContactSitter,
  expressInterest,
  fetchPublicRequests,
  fetchPublicSitters,
  initiatePayment,
} from "./lib/api";
import { supabase } from "./lib/supabaseClient";
import { FilterOptions, Request, SERVICE_TYPES, Sitter } from "./types";

function App() {
  const authState = useAuthState();
  const [activeTab, setActiveTab] = useState<"requests" | "sitters">(
    "requests"
  );
  const [searchQuery, setSearchQuery] = useState("");
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
    availability: "",
    dogSize: [],
  });

  // Determine default tab based on user type
  const defaultTab = useMemo(() => {
    if (!authState.isAuthenticated) return "requests";
    return authState.userType === "client" ? "requests" : "sitters";
  }, [authState.isAuthenticated, authState.userType]);

  // Update active tab when user type changes
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Load data from Supabase
  const [dbSitters, setDbSitters] = useState<any[]>([]);
  const [dbRequests, setDbRequests] = useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      const [sitters, requests] = await Promise.all([
        fetchPublicSitters().catch(() => []),
        fetchPublicRequests().catch(() => []),
      ]);
      setDbSitters(sitters);
      setDbRequests(requests);
    })();

    // realtime notifications example (no UI change)
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "app", table: "notifications" },
        () => {}
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter and search logic
  const filteredSitters = useMemo(() => {
    const sitters = mockSitters; // keep UI types; mapping to DB view can be added without design changes
    return sitters.filter((sitter) => {
      // Search query
      if (
        searchQuery.trim() &&
        !sitter.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
        !sitter.neighborhoods.some((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase().trim())
        ) &&
        !sitter.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()) &&
        !sitter.services.some((service) =>
          SERVICE_TYPES[service.type]
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())
        )
      ) {
        return false;
      }

      // Neighborhood filter
      if (
        filters.neighborhoods.length > 0 &&
        !filters.neighborhoods.some((n) => sitter.neighborhoods.includes(n))
      ) {
        return false;
      }

      // Service type filter
      if (
        filters.serviceTypes.length > 0 &&
        !filters.serviceTypes.some((s) =>
          sitter.services.some((service) => service.type === s)
        )
      ) {
        return false;
      }

      // Price filter
      const maxPrice = Math.max(...sitter.services.map((s) => s.price));
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
    const requests = mockRequests; // keep UI types; mapping to DB view can be added without design changes
    return requests.filter((request) => {
      // Search query
      if (
        searchQuery.trim() &&
        !request.client.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()) &&
        !request.neighborhood
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()) &&
        !request.dog.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()) &&
        !SERVICE_TYPES[request.serviceType]
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()) &&
        !request.dog.breed
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      ) {
        return false;
      }

      // Neighborhood filter
      if (
        filters.neighborhoods.length > 0 &&
        !filters.neighborhoods.includes(request.neighborhood)
      ) {
        return false;
      }

      // Service type filter
      if (
        filters.serviceTypes.length > 0 &&
        !filters.serviceTypes.includes(request.serviceType)
      ) {
        return false;
      }

      // Price filter
      if (request.offeredPrice > filters.priceRange[1]) {
        return false;
      }

      // Dog size filter
      if (
        filters.dogSize.length > 0 &&
        !filters.dogSize.includes(request.dog.size)
      ) {
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

    if (activeTab === "requests" && authState.userType === "client") {
      setShowNewRequestForm(true);
    } else if (activeTab === "sitters" && authState.userType === "sitter") {
      // Handle availability update
      console.log("Update availability");
    }
  };

  const handleNewRequest = (requestData: any) => {
    console.log("New request:", requestData);
    // In a real app, this would make an API call
  };

  return (
    <AuthContext.Provider value={authState}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        {/* Top Tabs */}
        <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
            {activeTab === "sitters" ? (
              <div className="space-y-4">
                {filteredSitters.length === 0 ? (
                  <div className="text-center py-16 mx-4">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        לא נמצאו סיטרים
                      </h3>
                      <p className="text-gray-500">
                        נסה לשנות את הסינון או החיפוש
                      </p>
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        לא נמצאו בקשות
                      </h3>
                      <p className="text-gray-500">
                        נסה לשנות את הסינון או החיפוש
                      </p>
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
        <FloatingActionButton activeTab={activeTab} onAction={handleFABClick} />

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
            onContact={async () => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                // open or get chat via RPC
                // assuming selectedSitter exists
                try {
                  await clientContactSitter(
                    authState.user!.id,
                    selectedSitter.id,
                    authState.user!.id
                  );
                } catch {}
              }
            }}
            onBooking={async () => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                // ensure chat exists first, then init payment via min price
                try {
                  const chatId = await clientContactSitter(
                    authState.user!.id,
                    selectedSitter!.id,
                    authState.user!.id
                  );
                  const minPrice = Math.min(
                    ...(selectedSitter?.services || []).map((s) => s.price)
                  );
                  const url = await initiatePayment({
                    chat_id: chatId,
                    client_id: authState.user!.id,
                    sitter_id: selectedSitter!.id,
                    amount_cents: Math.round((minPrice || 0) * 100),
                    success_url: window.location.href,
                    cancel_url: window.location.href,
                  });
                  window.location.href = url;
                } catch {}
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
            onAccept={async () => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                try {
                  await expressInterest(
                    selectedRequest!.id,
                    authState.user!.id,
                    authState.user!.id
                  );
                } catch {}
              }
            }}
            onContact={async () => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                try {
                  // request has client id embedded in mock
                  await clientContactSitter(
                    selectedRequest!.clientId,
                    authState.user!.id,
                    authState.user!.id
                  );
                } catch {}
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
