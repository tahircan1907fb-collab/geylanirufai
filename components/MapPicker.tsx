import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
     iconUrl: icon,
     shadowUrl: iconShadow,
     iconSize: [25, 41],
     iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
     initialLat: number;
     initialLng: number;
     initialZoom: number;
     onLocationSelect: (lat: number, lng: number, zoom: number) => void;
}

function LocationMarker({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) {
     const map = useMapEvents({
          click(e) {
               setPosition([e.latlng.lat, e.latlng.lng]);
               map.flyTo(e.latlng, map.getZoom());
          },
     });

     return position === null ? null : (
          <Marker position={position}></Marker>
     );
}

const MapPicker: React.FC<MapPickerProps> = ({ initialLat, initialLng, initialZoom, onLocationSelect }) => {
     const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

     useEffect(() => {
          setPosition([initialLat, initialLng]);
     }, [initialLat, initialLng]);

     // Notify parent when position changes
     useEffect(() => {
          // We can't easily get zoom level change without another event listener, 
          // but let's just pass specific zoom or current map zoom if possible.
          // For simplicity, we trigger update on marker move.
          // Ideally we want to capture zoom end too.
          onLocationSelect(position[0], position[1], initialZoom);
     }, [position]);

     return (
          <MapContainer
               center={[initialLat, initialLng]}
               zoom={initialZoom}
               scrollWheelZoom={true}
               style={{ height: '400px', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
          >
               <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
               <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
     );
};

export default MapPicker;
