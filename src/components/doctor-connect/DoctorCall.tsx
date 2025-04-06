
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Phone, PhoneCall, Video, Mic as MicIcon, MicOff, Pause as PauseIcon, Play, Camera, CameraOff } from "lucide-react";
import { Doctor } from "./DoctorList";

interface DoctorCallProps {
  selectedDoctor: Doctor | null;
  inCall: boolean;
  isConnecting: boolean;
  callDuration: number;
  startCall: () => void;
  endCall: () => void;
}

const DoctorCall = ({ 
  selectedDoctor, 
  inCall, 
  isConnecting, 
  callDuration, 
  startCall, 
  endCall 
}: DoctorCallProps) => {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Excellent");

  // Monitor call quality with a simulated varying connection
  useEffect(() => {
    if (inCall) {
      const connectionStates = ["Excellent", "Good", "Fair", "Poor"];
      const connectionInterval = setInterval(() => {
        const randomState = connectionStates[Math.floor(Math.random() * connectionStates.length)];
        setConnectionStatus(randomState);
      }, 10000); // Change connection status every 10 seconds
      
      return () => clearInterval(connectionInterval);
    }
  }, [inCall]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you",
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Call Resumed" : "Call Paused",
      description: isPaused ? "You've rejoined the call" : "You've temporarily paused the call",
    });
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Camera Turned Off" : "Camera Turned On",
      description: isVideoOn ? "Others cannot see you" : "Others can now see you",
    });
  };

  return (
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
        <div className="h-full flex flex-col items-center justify-between text-center">
          <div className="relative mb-4 mt-4">
            <div className={`w-56 h-56 rounded-lg overflow-hidden border-4 ${connectionStatus === 'Poor' ? 'border-red-500' : 'border-doctalk-purple'}`}>
              {isVideoOn ? (
                <img 
                  src={selectedDoctor?.image} 
                  alt={selectedDoctor?.name}
                  className={`w-full h-full object-cover ${isPaused ? 'blur-sm' : ''}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <PhoneCall className="h-12 w-12 text-gray-500" />
                </div>
              )}
              
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <p className="text-white font-semibold">Call Paused</p>
                </div>
              )}
            </div>
            
            <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs text-white ${
              connectionStatus === 'Excellent' ? 'bg-green-500' :
              connectionStatus === 'Good' ? 'bg-blue-500' :
              connectionStatus === 'Fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {connectionStatus}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold">{selectedDoctor?.name}</h3>
            <p className="text-gray-500">{selectedDoctor?.specialty}</p>
            
            <div className="mt-2 text-lg font-mono">
              {formatCallDuration(callDuration)}
            </div>
          </div>
          
          <div className="mt-8 mb-4 flex space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className={`h-12 w-12 rounded-full ${isMuted ? 'bg-red-100 dark:bg-red-900 border-red-400' : ''}`}
              onClick={handleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5 text-red-500" /> : <MicIcon className="h-5 w-5" />}
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
              className={`h-12 w-12 rounded-full ${isPaused ? 'bg-amber-100 dark:bg-amber-900 border-amber-400' : ''}`}
              onClick={handlePause}
            >
              {isPaused ? <Play className="h-5 w-5 text-amber-500" /> : <PauseIcon className="h-5 w-5" />}
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="mb-2"
            onClick={handleToggleVideo}
          >
            {isVideoOn ? <><CameraOff className="h-4 w-4 mr-2" /> Turn off camera</> : <><Camera className="h-4 w-4 mr-2" /> Turn on camera</>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorCall;
