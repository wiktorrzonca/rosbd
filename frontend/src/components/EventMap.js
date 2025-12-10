import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from '../../node_modules/leaflet/dist/images/marker-icon-2x.png';
import iconUrl from '../../node_modules/leaflet/dist/images/marker-icon.png';
import shadowUrl from '../../node_modules/leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function LocationMarker({ onLocationSelected }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelected(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
}

const EventMap = ({ location, onLocationSelected }) => {
  return (
    <MapContainer center={[51.9194, 19.1451]} zoom={6} scrollWheelZoom={true} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelected={onLocationSelected} />
      {location && <Marker position={location} />}
    </MapContainer>
  );
};

export default EventMap;
