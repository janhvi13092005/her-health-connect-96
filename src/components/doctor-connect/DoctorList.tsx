
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: "Available" | "Busy" | "Away";
  image: string;
  rating: number;
  experience: string;
}

interface DoctorListProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
}

const DoctorList = ({ 
  doctors, 
  selectedDoctor, 
  onDoctorSelect 
}: DoctorListProps) => {
  return (
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
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedDoctor?.id === doctor.id ? 'border-doctalk-purple ring-1 ring-doctalk-purple' : ''
                }`}
                onClick={() => onDoctorSelect(doctor)}
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
  );
};

export default DoctorList;
