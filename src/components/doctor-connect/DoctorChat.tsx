
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip as PaperclipIcon, Mic as MicIcon, Smile as SmileIcon, MessageSquare } from "lucide-react";
import { Doctor } from "./DoctorList";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isUser: boolean;
}

interface DoctorChatProps {
  selectedDoctor: Doctor | null;
  user: any;
}

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

const DoctorChat = ({ selectedDoctor, user }: DoctorChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with a welcome message when connecting with a doctor
  useEffect(() => {
    // Add initial doctor message when the chat begins
    if (selectedDoctor && messages.length === 0) {
      const initialMessage: Message = {
        id: `msg-init-${Date.now()}`,
        senderId: selectedDoctor.id,
        text: `Hello! I'm Dr. ${selectedDoctor.name.split(' ')[1]}, how can I help you today?`,
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      
      setMessages([initialMessage]);
    }
  }, [selectedDoctor]); 

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to send messages.",
      });
      return;
    }

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

  return (
    <div className="h-[500px] flex flex-col">
      <div 
        id="messages-container"
        ref={messagesContainerRef}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500"
              onClick={() => toast({ 
                title: "Feature Coming Soon", 
                description: "File attachments will be available in the next update."
              })}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500"
              onClick={() => toast({ 
                title: "Feature Coming Soon", 
                description: "Voice messages will be available in the next update."
              })}
            >
              <MicIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500"
              onClick={() => toast({ 
                title: "Feature Coming Soon", 
                description: "Emojis will be available in the next update."
              })}
            >
              <SmileIcon className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 self-center">
            Messages are encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;
