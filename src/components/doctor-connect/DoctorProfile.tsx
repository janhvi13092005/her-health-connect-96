
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, PhoneCall } from "lucide-react";
import { Doctor } from "./DoctorList";

interface DoctorProfileProps {
  selectedDoctor: Doctor;
  handleConnect: () => void;
  startCall: () => void;
  isConnecting: boolean;
}

const DoctorProfile = ({ 
  selectedDoctor, 
  handleConnect, 
  startCall, 
  isConnecting 
}: DoctorProfileProps) => {
  return (
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
  );
};

export default DoctorProfile;
