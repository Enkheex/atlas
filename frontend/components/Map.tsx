'use client';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BuildingData } from '@/data/campus';

export default function Map({
  data,
  handleMarkerClick,
  userPos,
  flyToLocation,
}: {
  data: BuildingData[];
  handleMarkerClick: (buildingId: string) => void;
  userPos: [number, number] | null;
  flyToLocation: [number, number] | null;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
 // Default Position
  const [center] = useState<[number, number]>([106.920315, 47.922527]);
  const [zoom] = useState(16);

  // Access the token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // 1. Initialize Map
  useEffect(() => {
    // Safety Check: If no token, stop here to prevent crash
    if (!mapboxToken) {
      console.error('❌ Mapbox token is missing. Please check .env.local');
      return;
    }

    // Assign token BEFORE creating the map
    mapboxgl.accessToken = mapboxToken;

    // Ensure map container exists
    if (!mapContainerRef.current) return;

    // Create the Map
    mapRef.current = new mapboxgl.Map({
      style: 'mapbox://styles/irmuun360/cmk2pwcoy00e001s98ror2wtf',
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      pitch: 52,
      maxBounds: [
        [106.91, 47.91],
        [106.925, 47.925],
      ],
      minZoom: 15,
      maxZoom: 18,
    });

    // Cleanup when component unmounts
    return () => {
      mapRef.current?.remove();
    };
  }, [mapboxToken]); // Run this effect when token loads

  // 2. Handle "Fly To" Animation
  useEffect(() => {
    if (mapRef.current && flyToLocation) {
      mapRef.current.flyTo({
        center: flyToLocation,
        zoom: 18,
        pitch: 60,
        bearing: 0,
        essential: true,
        duration: 2000,
      });
    }
  }, [flyToLocation]);

  // 3. Render Markers
  useEffect(() => {
    if (!mapRef.current) return;

    const markers: mapboxgl.Marker[] = [];

    data.forEach((building) => {
      const el = document.createElement('div');
      el.className = 'flex flex-col items-center cursor-pointer group z-10 hover:z-50';
      el.innerHTML = `
        <div class="mb-3 transform transition-all duration-300 ease-out group-hover:-translate-y-1">
          <div class="relative flex items-center bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)] overflow-hidden">
            <div class="w-1.5 self-stretch bg-[#0052AC]"></div>
            <div class="px-3 py-2">
              <p class="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider whitespace-nowrap leading-none">
                ${building.name}
              </p>
            </div>
            <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-sm z-[-1]"></div>
          </div>
        </div>
        <div class="relative flex items-center justify-center">
          <div class="w-3.5 h-3.5 bg-[#0052AC] rounded-full border-2 border-white shadow-md z-10 transition-transform duration-300 group-hover:scale-125"></div>
          <div class="absolute w-8 h-8 bg-[#0052AC]/20 rounded-full animate-pulse z-0"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        handleMarkerClick(building.id);
      });

      const marker = new mapboxgl.Marker(el).setLngLat(building.coords).addTo(mapRef.current!);

      markers.push(marker);
    });

    // User Position Marker
    if (userPos) {
      const elUser = document.createElement('div');
      elUser.className = 'h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]';
      new mapboxgl.Marker(elUser).setLngLat([userPos[1], userPos[0]]).addTo(mapRef.current);
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [data, userPos]);

  return (
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-white rounded-[20px]  overflow-hidden border border-gray-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
