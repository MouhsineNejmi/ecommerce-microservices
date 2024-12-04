'use client';

import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationMapProps {
  center: [number, number];
  zoom: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapEvents({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      map.setView(center, zoom);
      initializedRef.current = true;
      return;
    }

    const handler = setTimeout(() => {
      map.setView(center, zoom, { animate: true });
    }, 0);

    return () => clearTimeout(handler);
  }, [center, zoom, map]);

  return null;
}

export function LocationMap({
  center,
  zoom,
  onLocationSelect,
}: LocationMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{
        height: '600px',
        width: '100%',
        borderRadius: '0.5rem',
        zIndex: 10,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={center} icon={icon} />
      <MapEvents onLocationSelect={onLocationSelect} />
      <MapUpdater center={center} zoom={zoom} />
    </MapContainer>
  );
}
