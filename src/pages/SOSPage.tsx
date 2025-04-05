
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Heart, AlertCircle, Phone, Loader2, Locate } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  distance: string;
  duration: string;
  address: string;
  phone: string;
  services: string[];
}

const mockHospitals: Hospital[] = [
  {
    id: "h1",
    name: "City General Hospital",
    distance: "1.2 miles",
    duration: "5 mins",
    address: "123 Healthcare Ave, City Center",
    phone: "555-123-4567",
    services: ["Emergency Care", "Gynecology", "Oncology"]
  },
  {
    id: "h2",
    name: "Women's Wellness Center",
    distance: "2.0 miles",
    duration: "8 mins",
    address: "456 Medical Blvd, Westside",
    phone: "555-234-5678",
    services: ["Gynecology", "Breast Health", "PCOS Treatment"]
  },
  {
    id: "h3",
    name: "Memorial Medical Center",
    distance: "3.5 miles",
    duration: "12 mins",
    address: "789 Hospital Drive, Northside",
    phone: "555-345-6789",
    services: ["Emergency Care", "Cancer Treatment", "Women's Health"]
  },
  {
    id: "h4",
    name: "St. Mary's Health",
    distance: "4.3 miles",
    duration: "15 mins",
    address: "101 Saint Way, Eastside",
    phone: "555-456-7890",
    services: ["Emergency Care", "Maternal Care", "Gynecology"]
  }
];

const SOSPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [callingHospital, setCallingHospital] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const sosTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Simulate loading location and hospitals
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate getting location
      setLocation({ lat: 40.7128, lng: -74.006 });
      setHospitals(mockHospitals);
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle SOS progress animation
  useEffect(() => {
    if (sosTriggered && sosProgress < 100) {
      sosTimerRef.current = setTimeout(() => {
        setSosProgress(prev => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            handleSOSComplete();
          }
          return newProgress;
        });
      }, 1000);
    }
    
    return () => {
      if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
    };
  }, [sosTriggered, sosProgress]);
  
  // Handle countdown timer
  useEffect(() => {
    if (sosTriggered && sosCountdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setSosCountdown(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [sosTriggered, sosCountdown]);
  
  // Simulate map rendering (in real app, this would use Google Maps API)
  useEffect(() => {
    if (!loading && location && mapContainerRef.current) {
      // This would be replaced with actual Google Maps initialization
      const mapContainer = mapContainerRef.current;
      mapContainer.innerHTML = `
        <div style="background-color: #e9eef2; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
            </svg>
            <p style="margin-top: 10px; font-weight: bold;">Your Location</p>
            <p>Latitude: ${location.lat.toFixed(4)}, Longitude: ${location.lng.toFixed(4)}</p>
          </div>
        </div>
      `;
    }
  }, [loading, location]);
  
  const handleSOSTrigger = () => {
    setSosTriggered(true);
    setSosProgress(0);
    setSosCountdown(5);
    
    toast({
      title: "SOS Countdown Started",
      description: "Emergency alert will be sent in 5 seconds. Tap Cancel to stop.",
    });
  };
  
  const handleSOSCancel = () => {
    setSosTriggered(false);
    setSosProgress(0);
    setSosCountdown(5);
    
    if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };
  
  const handleSOSComplete = () => {
    setAlertOpen(true);
    setSosTriggered(false);
    
    toast({
      title: "Emergency Alert Sent",
      description: "Help is on the way. Stay calm.",
      variant: "destructive",
    });
  };
  
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };
  
  const handleCallHospital = (hospital: Hospital) => {
    setCallingHospital(true);
    
    // Simulate call delay
    setTimeout(() => {
      setCallingHospital(false);
      
      toast({
        title: `Calling ${hospital.name}`,
        description: `Connected to ${hospital.phone}`,
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Heart className="h-8 w-8 text-red-500 mr-2 animate-pulse" />
            <span className="font-gradient">Emergency SOS</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Quick access to emergency services and nearby hospitals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and SOS Button */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-xl">Your Location</CardTitle>
                <CardDescription className="flex items-center">
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Finding your location...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Locate className="h-4 w-4 mr-2" />
                      Location found ({location?.lat.toFixed(4)}, {location?.lng.toFixed(4)})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapContainerRef} className="w-full h-[400px] bg-gray-100 dark:bg-gray-800">
                  {loading && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="h-12 w-12 animate-spin text-doctalk-purple" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center p-6">
                <div className="w-full max-w-xs mb-4">
                  {sosTriggered ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Sending SOS in...</span>
                        <span className="font-bold">{sosCountdown}s</span>
                      </div>
                      <Progress value={sosProgress} className="h-2" />
                    </>
                  ) : (
                    <p className="text-center text-sm mb-2 text-gray-600 dark:text-gray-300">
                      Press and hold the SOS button for emergency assistance
                    </p>
                  )}
                </div>
                
                {sosTriggered ? (
                  <Button 
                    variant="destructive"
                    size="lg"
                    className="w-full max-w-xs"
                    onClick={handleSOSCancel}
                  >
                    Cancel SOS ({sosCountdown})
                  </Button>
                ) : (
                  <Button 
                    variant="destructive"
                    size="lg"
                    className="w-full max-w-xs shadow-md group relative overflow-hidden"
                    onClick={handleSOSTrigger}
                  >
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform -translate-x-full bg-white group-hover:translate-x-0 opacity-10 rounded-md"></span>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Emergency SOS
                  </Button>
                )}
                
                <p className="mt-4 text-xs text-gray-500">
                  In case of immediate danger, call 911 directly
                </p>
              </CardFooter>
            </Card>
          </div>
          
          {/* Nearby Hospitals */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-xl">Nearby Hospitals</CardTitle>
                <CardDescription>
                  Emergency medical facilities in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {loading ? (
                  <div className="py-8 flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-doctalk-purple mb-2" />
                    <p className="text-gray-500">Finding nearby hospitals...</p>
                  </div>
                ) : hospitals.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No hospitals found nearby</p>
                  </div>
                ) : (
                  hospitals.map((hospital) => (
                    <Card 
                      key={hospital.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedHospital?.id === hospital.id ? 'border-doctalk-purple ring-1 ring-doctalk-purple' : ''
                      }`}
                      onClick={() => handleHospitalSelect(hospital)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{hospital.name}</h3>
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {hospital.distance}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{hospital.address}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{hospital.duration} by car</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallHospital(hospital);
                            }}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Hospital Details Card */}
        {selectedHospital && (
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl">{selectedHospital.name}</CardTitle>
              <CardDescription>{selectedHospital.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p className="text-sm flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedHospital.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Available Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.services.map((service, index) => (
                      <span
                        key={index}
                        className="bg-doctalk-lightGray text-doctalk-purple text-xs px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => handleCallHospital(selectedHospital)}
                disabled={callingHospital}
              >
                {callingHospital ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calling...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Hospital
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      
      {/* SOS Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Emergency Alert Sent
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your emergency alert has been sent to nearby emergency services. They have been notified of your location and will arrive shortly.
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium">While waiting for help:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>Stay in a safe location</li>
                  <li>If possible, stay on the line</li>
                  <li>Follow any instructions from emergency services</li>
                  <li>Have identification ready if possible</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleCallHospital(hospitals[0])}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SOSPage;
