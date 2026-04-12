import { cn } from '@/lib/utils';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coordinates, Geofence } from '@/types';
import { useEffect } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const childIcon = new L.DivIcon({
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,hsl(220,70%,45%),hsl(200,80%,50%));border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FitBounds({ coords }: { coords: Coordinates[] }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 50);
    if (coords.length > 1) {
      const bounds = L.latLngBounds(coords.map((c) => [c.lat, c.lng] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 16 });
    } else if (coords.length === 1) {
      map.setView([coords[0].lat, coords[0].lng], 15);
    }
  }, [coords, map]);
  return null;
}

interface MapCardProps {
  center?: Coordinates;
  childPosition?: Coordinates;
  expectedRoute?: Coordinates[];
  actualRoute?: Coordinates[];
  geofences?: Geofence[];
  stopPoints?: { location: Coordinates; durationMins: number; isExpected: boolean; label?: string }[];
  className?: string;
  height?: string;
}

export function MapCard({
  center = { lat: 19.0760, lng: 72.8777 },
  childPosition,
  expectedRoute = [],
  actualRoute = [],
  geofences = [],
  stopPoints = [],
  className,
  height = 'h-[380px]',
}: MapCardProps) {
  const mapCenter = childPosition ?? center;
  const allCoords = [...expectedRoute, ...actualRoute, ...(childPosition ? [childPosition] : [])];

  return (
    <div className={cn('w-full overflow-hidden rounded-2xl border bg-card shadow-safe-md', height, className)}>
      <MapContainer
        key={`${mapCenter.lat}-${mapCenter.lng}`}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {allCoords.length > 0 && <FitBounds coords={allCoords} />}

        {expectedRoute.length > 1 && (
          <Polyline positions={expectedRoute.map((c) => [c.lat, c.lng] as L.LatLngTuple)} pathOptions={{ color: 'hsl(220,70%,45%)', weight: 4, opacity: 0.35, dashArray: '8 8' }} />
        )}

        {actualRoute.length > 1 && (
          <Polyline positions={actualRoute.map((c) => [c.lat, c.lng] as L.LatLngTuple)} pathOptions={{ color: 'hsl(185,60%,42%)', weight: 4, opacity: 0.9 }} />
        )}

        {geofences.map((g, i) => (
          <Circle key={i} center={[g.center.lat, g.center.lng]} radius={g.radiusMeters} pathOptions={{ color: g.type === 'home' ? 'hsl(220,70%,45%)' : g.type === 'school' ? 'hsl(152,60%,42%)' : 'hsl(38,92%,50%)', fillOpacity: 0.08, weight: 2 }}>
            <Popup><span className="font-medium text-sm">{g.label}</span></Popup>
          </Circle>
        ))}

        {stopPoints.map((sp, i) => (
          <Circle key={`stop-${i}`} center={[sp.location.lat, sp.location.lng]} radius={30} pathOptions={{ color: sp.isExpected ? 'hsl(220,70%,45%)' : 'hsl(25,95%,53%)', fillOpacity: 0.3, weight: 2 }}>
            <Popup><div className="text-sm"><p className="font-medium">{sp.label || 'Stop Point'}</p><p className="text-muted-foreground">{sp.durationMins} min</p></div></Popup>
          </Circle>
        ))}

        {childPosition && <Marker position={[childPosition.lat, childPosition.lng]} icon={childIcon}><Popup><span className="font-medium text-sm">Current Location</span></Popup></Marker>}
      </MapContainer>
    </div>
  );
}
