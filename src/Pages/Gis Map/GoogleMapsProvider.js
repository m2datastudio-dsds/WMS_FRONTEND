// src/Pages/Gis Map/GoogleMapsProvider.js
import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsProvider = ({ children }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>❌ Google Maps API key is missing.</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
