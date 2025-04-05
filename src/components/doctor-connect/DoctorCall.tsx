
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Phone, PhoneCall, Video, Mic as MicIcon, Pause as PauseIcon } from "lucide-react";
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

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  );
};

export default DoctorCall;
