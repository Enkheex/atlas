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

  const [center] = useState<[number, number]>([106.920315, 47.922527]);
  const [zoom] = useState(16);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // 1. Initialize Map
  useEffect(() => {
    if (!mapboxToken) {
      console.error('❌ Mapbox token is missing. Please check .env.local');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      style: 'mapbox://styles/irmuun360/cmk2pwcoy00e001s98ror2wtf',
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      pitch: 52,
      maxBounds: [
        [106.913993, 47.917133], // Southwest Corner (West limit, South limit)
        [106.930869, 47.9265], // Northeast Corner (East limit, North limit)
      ],

      minZoom: 15,
      maxZoom: 18,
    });

    // --- ADD CUSTOM BUILDING (3D Shape) ---
    mapRef.current.on('load', () => {
      if (!mapRef.current) return;

      // Check if source already exists to prevent errors on hot-reload
      if (!mapRef.current.getSource('custom-missing-building')) {
        mapRef.current.addSource('custom-missing-building', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon', // Changed from LineString to Polygon for 3D
              coordinates: [
                [
                  [106.91845019391809, 47.923336570830344],
                  [106.918715589008, 47.92335137656889],
                  [106.9186019157687, 47.92392479339236],
                  [106.91909484805876, 47.92398185583042],
                  [106.91898617767174, 47.92444638314285],
                  [106.91824852212318, 47.924379927628706],
                  [106.91845026859647, 47.92333663321952],
                ],
              ],
            },
            properties: {},
          },
        });

        // 2. Draw the 3D extrusion
        mapRef.current.addLayer({
          id: 'custom-building-extrusion',
          type: 'fill-extrusion',
          source: 'custom-missing-building',
          paint: {
            // Color: #f5f0e5 to match default map buildings
            'fill-extrusion-color': '#f5f0e5',
            // Height: 12 meters (3 floors)
            'fill-extrusion-height': 9.9,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 1,
            // This creates the 3D shading look
            'fill-extrusion-vertical-gradient': true,
          },
        });
      }
    });
    // --- END CUSTOM BUILDING ---

    return () => {
      mapRef.current?.remove();
    };
  }, [mapboxToken]);

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
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
