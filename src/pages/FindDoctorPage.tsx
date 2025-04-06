
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Clock } from "lucide-react";
import MapComponent from "@/components/map/MapComponent";
import { useToast } from "@/components/ui/use-toast";
import { Doctor } from "@/components/doctor-connect/DoctorList";
import { mockDoctors } from "@/components/doctor-connect/data/mockDoctors";

// Define the Clinic type
interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: [number, number]; // [longitude, latitude]
  specialties: string[];
  doctors: Doctor[];
  hours: string;
}

// Mock data for clinics
const mockClinics: Clinic[] = [
  {
    id: "clinic1",
    name: "Women's Health Center",
    address: "123 Medical Drive, New York, NY",
    phone: "(212) 555-1234",
    coordinates: [-74.006, 40.7128], // NYC coordinates
    specialties: ["Gynecology", "Obstetrics", "Breast Health"],
    doctors: [mockDoctors[0], mockDoctors[1]],
    hours: "Mon-Fri: 8am-6pm"
  },
  {
    id: "clinic2",
    name: "City Medical Group",
    address: "456 Health Avenue, New York, NY",
    phone: "(212) 555-5678",
    coordinates: [-73.986, 40.7328], // Slightly different NYC coordinates
    specialties: ["Oncology", "Breast Health", "General Practice"],
    doctors: [mockDoctors[2], mockDoctors[3]],
    hours: "Mon-Sat: 9am-7pm"
  },
  {
    id: "clinic3",
    name: "Downtown Women's Clinic",
    address: "789 Wellness Blvd, New York, NY",
    phone: "(212) 555-9012",
    coordinates: [-74.016, 40.7028], // Another NYC location
    specialties: ["Gynecology", "PCOS Treatment", "Fertility"],
    doctors: [mockDoctors[4], mockDoctors[0]],
    hours: "Mon-Fri: 8am-8pm"
  }
];

const FindDoctorPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const { toast } = useToast();

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "We couldn't access your location. Using default view.",
            variant: "destructive",
          });
          // Default to NYC if location access is denied
          setUserLocation([-74.006, 40.7128]);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Using default view.",
        variant: "destructive",
      });
      // Default to NYC if geolocation is not supported
      setUserLocation([-74.006, 40.7128]);
    }
  }, [toast]);

  // Extract all unique specialties from clinics
  const allSpecialties = Array.from(
    new Set(mockClinics.flatMap((clinic) => clinic.specialties))
  ).sort();

  // Filter clinics based on search query and selected specialty
  const filteredClinics = mockClinics.filter((clinic) => {
    const matchesSearch =
      searchQuery === "" ||
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.doctors.some((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      clinic.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSpecialty =
      selectedSpecialty === null || clinic.specialties.includes(selectedSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 font-gradient">Find a Doctor</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Locate nearby clinics and specialists for women's health services
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by doctor, clinic, specialty, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSpecialty === null ? "default" : "outline"}
              onClick={() => setSelectedSpecialty(null)}
            >
              All
            </Button>
            {allSpecialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List - Desktop: Left, Mobile: Top */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {filteredClinics.length} {filteredClinics.length === 1 ? "Result" : "Results"}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {filteredClinics.map((clinic) => (
                    <Card
                      key={clinic.id}
                      className={`cursor-pointer transition-all ${
                        selectedClinic?.id === clinic.id
                          ? "border-doctalk-purple shadow-md"
                          : ""
                      }`}
                      onClick={() => setSelectedClinic(clinic)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{clinic.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-start">
                          <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                          <span>{clinic.address}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                          <Phone className="h-4 w-4 mr-1 shrink-0" />
                          <span>{clinic.phone}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                          <Clock className="h-4 w-4 mr-1 shrink-0" />
                          <span>{clinic.hours}</span>
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {clinic.specialties.map((specialty) => (
                            <Badge
                              key={`${clinic.id}-${specialty}`}
                              variant="outline"
                              className="bg-doctalk-purple/10 text-doctalk-purple border-doctalk-purple/20"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className="w-full button-gradient mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                clinic.address
                              )}`,
                              "_blank"
                            );
                          }}
                        >
                          Get Directions
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredClinics.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No clinics found matching your criteria.</p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedSpecialty(null);
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Section - Desktop: Right, Mobile: Bottom */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapComponent
                  userLocation={userLocation}
                  clinics={filteredClinics}
                  selectedClinic={selectedClinic}
                  onSelectClinic={setSelectedClinic}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Details Section - Shows when clinic is selected */}
        {selectedClinic && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{selectedClinic.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="doctors">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="doctors">Doctors</TabsTrigger>
                  <TabsTrigger value="info">Clinic Info</TabsTrigger>
                </TabsList>
                <TabsContent value="doctors" className="pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedClinic.doctors.map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden">
                        <CardContent className="p-4 flex items-center">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h4 className="font-medium">{doctor.name}</h4>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-doctalk-purple"
                              onClick={() => {
                                // Could navigate to doctor page or open modal with details
                              }}
                            >
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                      <p className="mb-2">
                        <strong>Address:</strong> {selectedClinic.address}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {selectedClinic.phone}
                      </p>
                      <p className="mb-4">
                        <strong>Hours:</strong> {selectedClinic.hours}
                      </p>
                      <Button
                        onClick={() => {
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              selectedClinic.address
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedClinic.specialties.map((specialty) => (
                          <Badge
                            key={specialty}
                            className="bg-doctalk-purple/10 text-doctalk-purple border-doctalk-purple/20"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindDoctorPage;
