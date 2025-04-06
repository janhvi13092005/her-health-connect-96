
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip as PaperclipIcon, Mic as MicIcon, MicOff, Smile as SmileIcon, MessageSquare, Play, Trash2, Loader2 } from "lucide-react";
import { Doctor } from "./DoctorList";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  type?: "text" | "voice";
  audioUrl?: string;
  duration?: number;
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
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  
  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        type: "text"
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

  // Cleanup recording resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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
      type: "text"
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
        type: "text"
      };
      
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const handleVoiceRecording = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to send voice messages.",
      });
      return;
    }

    try {
      if (isRecording) {
        // Stop recording
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsProcessingAudio(true);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);
        return;
      }
      
      // Start new recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsProcessingAudio(false);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Access Error",
        description: "Please grant permission to access your microphone.",
      });
    }
  };

  const cancelVoiceMessage = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const sendVoiceMessage = () => {
    if (!audioBlob || !audioUrl) return;
    
    // Create and add voice message to the chat
    const voiceMessage: Message = {
      id: `msg-voice-${Date.now()}`,
      senderId: user?.id || "user",
      text: "Voice message",
      timestamp: new Date().toISOString(),
      isUser: true,
      type: "voice",
      audioUrl: audioUrl,
      duration: recordingTime
    };
    
    setMessages(prev => [...prev, voiceMessage]);
    
    // Reset voice recording states
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    
    // Simulate doctor typing after voice message
    setIsTyping(true);
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Get a random response
      const responseText = "Thank you for your voice message. Could you please provide more details in text format?";
      
      const doctorResponse: Message = {
        id: `msg-${Date.now()}`,
        senderId: selectedDoctor?.id || "doctor",
        text: responseText,
        timestamp: new Date().toISOString(),
        isUser: false,
        type: "text"
      };
      
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const insertEmoji = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
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
                  {message.type === "voice" ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/20"
                        onClick={() => {
                          const audio = new Audio(message.audioUrl);
                          audio.play();
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="flex-grow">
                        <div className="h-2 bg-white/30 rounded-full w-full">
                          <div className="bg-white/80 h-full rounded-full" style={{width: "100%"}}></div>
                        </div>
                      </div>
                      <span className="text-xs">{formatTime(message.duration || 0)}</span>
                    </div>
                  ) : (
                    <p className={`text-sm ${message.isUser ? 'text-white' : ''}`}>
                      {message.text}
                    </p>
                  )}
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
        {/* Voice recording preview */}
        {audioUrl && !isRecording && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const audio = new Audio(audioUrl);
                audio.play();
              }}
            >
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-grow">
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full w-full">
                <div className="bg-doctalk-purple h-full rounded-full" style={{width: "100%"}}></div>
              </div>
            </div>
            <span className="text-xs text-gray-500">{formatTime(recordingTime)}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700"
              onClick={cancelVoiceMessage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={sendVoiceMessage}
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
        )}
        
        {isRecording && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-500 font-medium">Recording {formatTime(recordingTime)}</span>
            <div className="flex-grow">
              <Progress value={Math.min(recordingTime / 60 * 100, 100)} className="h-1" />
            </div>
            <Button 
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={handleVoiceRecording}
            >
              <MicOff className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </div>
        )}
        
        {/* Text input and action buttons */}
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
            disabled={isRecording || isProcessingAudio}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isRecording || isProcessingAudio || !newMessage.trim()}>
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
              variant={isRecording ? "destructive" : "ghost"}
              size="icon" 
              className={isRecording ? "" : "text-gray-500"}
              onClick={handleVoiceRecording}
              disabled={isProcessingAudio || !!audioUrl}
            >
              {isProcessingAudio ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MicIcon className="h-4 w-4" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-500"
                  disabled={isRecording || isProcessingAudio}
                >
                  <SmileIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-lg" align="start" sideOffset={5}>
                <Picker 
                  data={data} 
                  onEmojiSelect={insertEmoji}
                  theme="light"
                  previewPosition="none"
                  skinTonePosition="none"
                />
              </PopoverContent>
            </Popover>
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
