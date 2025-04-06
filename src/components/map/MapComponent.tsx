
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/components/ui/use-toast";

// Define clinic type for the component
interface Clinic {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  specialties: string[];
}

interface MapComponentProps {
  userLocation: [number, number] | null;
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
}

// This would typically come from an environment variable
// For better security, consider using a form for users to enter their own key
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const MapComponent = ({
  userLocation,
  clinics,
  selectedClinic,
  onSelectClinic,
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation || [-74.006, 40.7128], // Default to NYC if no user location
      zoom: 12,
    });

    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    newMap.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "top-right"
    );

    newMap.on("load", () => {
      setMapLoaded(true);
    });

    map.current = newMap;

    return () => {
      newMap.remove();
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation && !selectedClinic) {
      map.current.flyTo({
        center: userLocation,
        zoom: 12,
      });

      // Add user marker
      new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat(userLocation)
        .addTo(map.current)
        .setPopup(
          new mapboxgl.Popup().setHTML("<strong>Your location</strong>")
        );
    }
  }, [userLocation, mapLoaded]);

  // Update markers when clinics change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers for each clinic
    clinics.forEach((clinic) => {
      // Create HTML element for the marker
      const el = document.createElement("div");
      el.className = "clinic-marker";
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239b87f5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E")`;
      el.style.backgroundSize = "cover";
      el.style.cursor = "pointer";

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${clinic.name}</strong>
        <p>${clinic.address}</p>
        <p>${clinic.specialties.join(", ")}</p>`
      );

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(clinic.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event
      marker.getElement().addEventListener("click", () => {
        onSelectClinic(clinic);
      });

      markersRef.current[clinic.id] = marker;
    });

    // If we have clinics but no selected clinic or user location, fit map to show all clinics
    if (clinics.length > 0 && !selectedClinic && !userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      clinics.forEach(clinic => {
        bounds.extend(clinic.coordinates);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [clinics, mapLoaded]);

  // Highlight selected clinic
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Reset all markers to default style
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.zIndex = "0";
    });

    // Highlight selected clinic's marker
    if (selectedClinic && markersRef.current[selectedClinic.id]) {
      const marker = markersRef.current[selectedClinic.id];
      const el = marker.getElement();
      el.style.width = "35px";
      el.style.height = "35px";
      el.style.zIndex = "1";

      // Fly to the selected clinic
      map.current.flyTo({
        center: selectedClinic.coordinates,
        zoom: 14,
      });

      // Open popup
      marker.togglePopup();
    }
  }, [selectedClinic, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-t-doctalk-purple border-r-doctalk-purple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
