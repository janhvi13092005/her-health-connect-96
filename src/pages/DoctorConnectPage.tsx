
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  MessageSquare, 
  Phone,
  PhoneCall, 
  Video, 
  Send,
  MicIcon,
  SmileIcon,
  PaperclipIcon,
  PauseIcon,
  Loader2
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: "Available" | "Busy" | "Away";
  image: string;
  rating: number;
  experience: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isUser: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: "dr-1",
    name: "Dr. Sarah Johnson",
    specialty: "Gynecologist",
    availability: "Available",
    image: "https://randomuser.me/api/portraits/women/40.jpg",
    rating: 4.9,
    experience: "15+ years"
  },
  {
    id: "dr-2",
    name: "Dr. Emily Chen",
    specialty: "Breast Specialist",
    availability: "Busy",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    rating: 4.8,
    experience: "12+ years"
  },
  {
    id: "dr-3",
    name: "Dr. Michael Rodriguez",
    specialty: "Endocrinologist",
    availability: "Available",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.7,
    experience: "10+ years"
  },
  {
    id: "dr-4",
    name: "Dr. Aisha Patel",
    specialty: "PCOS Specialist",
    availability: "Away",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    experience: "8+ years"
  },
  {
    id: "dr-5",
    name: "Dr. James Wilson",
    specialty: "Oncologist",
    availability: "Available",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 4.6,
    experience: "20+ years"
  }
];

// Automated responses for the chat
const automatedResponses = [
  "Hello, how can I help you today?",
  "Could you tell me more about your symptoms?",
  "How long have you been experiencing these symptoms?",
  "Are you currently taking any medications?",
  "Have you had any medical tests done recently?",
  "I understand your concerns. Based on what you've described, I recommend scheduling an in-person consultation.",
  "Let me know if you have any other questions.",
  "Would it be possible to provide more details about your medical history?",
  "Have you noticed any patterns when these symptoms occur?",
  "That's important information. Thank you for sharing."
];

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setMessages([]);
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

      // Add initial doctor message
      const initialMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: selectedDoctor.id,
        text: `Hello, I'm ${selectedDoctor.name}. How can I help you today?`,
        timestamp: new Date().toISOString(),
        isUser: false,
      };

      setMessages([initialMessage]);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "user",
      text: newMessage,
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate doctor typing
    setIsTyping(true);
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Get a random response
      const responseText = automatedResponses[Math.floor(Math.random() * automatedResponses.length)];
      
      const doctorResponse: Message = {
        id: `msg-${Date.now()}`,
        senderId: selectedDoctor?.id || "doctor",
        text: responseText,
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
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

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">Available Doctors</CardTitle>
                <CardDescription>
                  Select a doctor to connect with
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="px-4 pb-4 space-y-4">
                    {availableDoctors.map((doctor) => (
                      <Card 
                        key={doctor.id} 
                        className={`cursor-pointer hover:shadow-md transition-shadow ${
                          selectedDoctor?.id === doctor.id ? 'border-doctalk-purple ring-1 ring-doctalk-purple' : ''
                        }`}
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={doctor.image} alt={doctor.name} />
                              <AvatarFallback>
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-gray-500">{doctor.specialty}</p>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg 
                                      key={i} 
                                      className={`h-3 w-3 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs ml-1">{doctor.rating}</span>
                                <span className="text-xs text-gray-500 ml-2">• {doctor.experience}</span>
                              </div>
                            </div>
                            <Badge 
                              className={`
                                ${doctor.availability === 'Available' ? 'bg-green-500' : 
                                  doctor.availability === 'Busy' ? 'bg-amber-500' : 'bg-gray-500'}
                              `}
                            >
                              {doctor.availability}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
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
                      <Button 
                        disabled={isConnecting || selectedDoctor.availability !== "Available"} 
                        onClick={handleConnect}
                      >
                        {isConnecting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-2" />
                        )}
                        Connect
                      </Button>
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
                  <div className="h-[500px] flex flex-col items-center justify-center p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Doctor Selected</h3>
                    <p className="text-gray-500">
                      Select a doctor from the list to chat or start a call.
                    </p>
                  </div>
                ) : !isConnected && !inCall ? (
                  <div className="h-[500px] flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-6">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={selectedDoctor.image} alt={selectedDoctor.name} />
                        <AvatarFallback className="text-lg">
                          {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                      <p className="text-gray-500">{selectedDoctor.specialty}</p>
                      
                      <div className="flex items-center justify-center mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(selectedDoctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm ml-1">{selectedDoctor.rating}</span>
                        <span className="text-sm text-gray-500 ml-2">• {selectedDoctor.experience}</span>
                      </div>
                    </div>
                    
                    <Badge 
                      className={`mb-6 ${
                        selectedDoctor.availability === 'Available' ? 'bg-green-500' : 
                        selectedDoctor.availability === 'Busy' ? 'bg-amber-500' : 'bg-gray-500'
                      }`}
                    >
                      {selectedDoctor.availability === 'Available' ? 'Available Now' : 
                       selectedDoctor.availability === 'Busy' ? 'In Session (wait time ~10 min)' : 'Away (Returns in 1 hr)'}
                    </Badge>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={handleConnect} 
                        disabled={isConnecting || selectedDoctor.availability !== "Available"}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={startCall}
                        disabled={isConnecting || selectedDoctor.availability !== "Available"}
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Start Call
                      </Button>
                    </div>
                  </div>
                ) : (
                  <TabsContent value="chat" className={selectedTab === "chat" ? "block" : "hidden"}>
                    <div className="h-[500px] flex flex-col">
                      <div 
                        id="messages-container"
                        className="flex-grow overflow-y-auto p-4"
                      >
                        {messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <MessageSquare className="h-10 w-10 text-gray-400 mb-4" />
                            <h3 className="text-base font-medium mb-1">No messages yet</h3>
                            <p className="text-sm text-gray-500">
                              Send a message to start the conversation.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                              >
                                {!message.isUser && (
                                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1">
                                    <AvatarImage src={selectedDoctor?.image} />
                                    <AvatarFallback>
                                      {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`max-w-[75%] rounded-lg p-3 ${
                                    message.isUser 
                                      ? 'bg-doctalk-purple text-white' 
                                      : 'bg-gray-100 dark:bg-gray-800'
                                  }`}
                                >
                                  <p className={`text-sm ${message.isUser ? 'text-white' : ''}`}>
                                    {message.text}
                                  </p>
                                  <p className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                {message.isUser && (
                                  <Avatar className="h-8 w-8 ml-2 flex-shrink-0 mt-1">
                                    <AvatarImage src={user?.id ? `https://ui-avatars.com/api/?name=${user.name}` : undefined} />
                                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            ))}
                            {isTyping && (
                              <div className="flex justify-start">
                                <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1">
                                  <AvatarImage src={selectedDoctor?.image} />
                                  <AvatarFallback>
                                    {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-500"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 border-t dark:border-gray-800">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button size="icon" onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-gray-500">
                              <PaperclipIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                              <MicIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                              <SmileIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 self-center">
                            Messages are encrypted and secure
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
                
                <TabsContent value="call" className={selectedTab === "call" ? "block" : "hidden"}>
                  <div className="h-[500px] p-4 flex flex-col">
                    {!inCall ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <Phone className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Start a Call</h3>
                        <p className="text-gray-500 mb-6">
                          Connect with {selectedDoctor?.name} through voice or video call.
                        </p>
                        <div className="flex space-x-4">
                          <Button 
                            variant="outline" 
                            className="flex-1" 
                            onClick={startCall}
                            disabled={isConnecting}
                          >
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Voice Call
                          </Button>
                          <Button 
                            className="flex-1" 
                            onClick={startCall}
                            disabled={isConnecting}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="relative mb-6">
                          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-doctalk-purple">
                            <img 
                              src={selectedDoctor?.image} 
                              alt={selectedDoctor?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 transform translate-x-1/4 bg-green-500 p-2 rounded-full animate-pulse-soft">
                            <PhoneCall className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold">{selectedDoctor?.name}</h3>
                        <p className="text-gray-500">{selectedDoctor?.specialty}</p>
                        
                        <div className="mt-2 text-lg font-mono">
                          {formatCallDuration(callDuration)}
                        </div>
                        
                        <div className="mt-8 flex space-x-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-12 rounded-full"
                            onClick={() => toast({
                              title: "Muted",
                              description: "You've muted your microphone",
                            })}
                          >
                            <MicIcon className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-14 w-14 rounded-full"
                            onClick={endCall}
                          >
                            <Phone className="h-6 w-6" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-12 rounded-full"
                            onClick={() => toast({
                              title: "Call Paused",
                              description: "You've paused the call",
                            })}
                          >
                            <PauseIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
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
