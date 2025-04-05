
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Phone, Loader2 } from "lucide-react";

// Import our refactored components
import DoctorList, { Doctor } from "@/components/doctor-connect/DoctorList";
import DoctorChat from "@/components/doctor-connect/DoctorChat";
import DoctorCall from "@/components/doctor-connect/DoctorCall";
import DoctorProfile from "@/components/doctor-connect/DoctorProfile";
import EmptyState from "@/components/doctor-connect/EmptyState";
import { mockDoctors } from "@/components/doctor-connect/data/mockDoctors";

const DoctorConnectPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("chat");
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>(mockDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsConnected(false);
    setInCall(false);
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    setCallDuration(0);
  };

  const handleConnect = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to connect with doctors.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedDoctor) {
      toast({
        title: "No Doctor Selected",
        description: "Please select a doctor to connect with.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1500);
  };

  const startCall = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to start a call.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedDoctor) {
      toast({
        title: "No Doctor Selected",
        description: "Please select a doctor to call.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setInCall(true);
      
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setCallTimer(timer);
    }, 2000);
  };

  const endCall = () => {
    setInCall(false);
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    toast({
      title: "Call Ended",
      description: `Call with ${selectedDoctor?.name} has ended.`,
    });
    
    // Reset call duration after a short delay (to show the final duration)
    setTimeout(() => {
      setCallDuration(0);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 font-gradient">
            Connect with Healthcare Professionals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Chat or call with specialists for advice on breast cancer, PCOD, PCOS and other women's health concerns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor List */}
          <div className="lg:col-span-1">
            <DoctorList 
              doctors={availableDoctors}
              selectedDoctor={selectedDoctor}
              onDoctorSelect={handleDoctorSelect}
            />
          </div>
          
          {/* Chat/Call Area */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                {selectedDoctor ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={selectedDoctor.image} alt={selectedDoctor.name} />
                        <AvatarFallback>
                          {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedDoctor.name}</h3>
                        <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
                      </div>
                    </div>
                    {!isConnected && !inCall ? (
                      <button 
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        disabled={isConnecting || selectedDoctor.availability !== "Available"} 
                        onClick={handleConnect}
                      >
                        {isConnecting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-2" />
                        )}
                        Connect
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <CardTitle className="text-xl">Select a doctor to begin</CardTitle>
                )}
                
                {selectedDoctor && (isConnected || inCall) && (
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="chat">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="call">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </CardHeader>
              
              <CardContent className="p-0">
                {!selectedDoctor ? (
                  <EmptyState />
                ) : !isConnected && !inCall ? (
                  <DoctorProfile 
                    selectedDoctor={selectedDoctor}
                    handleConnect={handleConnect}
                    startCall={startCall}
                    isConnecting={isConnecting}
                  />
                ) : (
                  <>
                    <TabsContent value="chat" className={selectedTab === "chat" ? "block" : "hidden"}>
                      <DoctorChat 
                        selectedDoctor={selectedDoctor} 
                        user={user} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="call" className={selectedTab === "call" ? "block" : "hidden"}>
                      <DoctorCall 
                        selectedDoctor={selectedDoctor}
                        inCall={inCall}
                        isConnecting={isConnecting}
                        callDuration={callDuration}
                        startCall={startCall}
                        endCall={endCall}
                      />
                    </TabsContent>
                  </>
                )}
              </CardContent>
              
              {selectedDoctor && !isConnected && !inCall && (
                <CardFooter className="flex justify-between px-6 py-4 border-t dark:border-gray-800">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Next availability:</span> {selectedDoctor.availability === "Available" ? "Now" : "In 30 minutes"}
                  </div>
                  <span className="text-sm text-gray-500">
                    All communications are private and secure
                  </span>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConnectPage;
