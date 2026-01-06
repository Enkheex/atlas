'use client';
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface dataFormat {
  building: string;
  building_code: string;
  building_status: string;
  rooms: {
    [key: string]: {
      roomNumber: string;
      slots: { StartTime: string; EndTime: string; Status: string }[];
    };
  };
  coords: [number, number];
  distance: number;
}

export default function Map({
  data,
  handleMarkerClick,
  userPos,
}: {
  data: dataFormat[];
  handleMarkerClick: (building: string) => void;
  userPos: any;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [center, setCenter] = useState<[number, number]>([106.920315, 47.922527]);
  const [zoom, setZoom] = useState(17);
  const [pitch, setPitch] = useState(52);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  function getColorByStatus(status: string) {
    switch (status) {
      case 'available':
        return 'h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]';
      case 'unavailable':
        return 'h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]';
      case 'upcoming':
        return 'h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]';
      default:
        return 'gray';
    }
  }
  useEffect(() => {
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
    } else {
      console.error('Mapbox token is not defined');
    }

    mapRef.current = new mapboxgl.Map({
      style: 'mapbox://styles/irmuun360/cmk2pwcoy00e001s98ror2wtf', // Your custom style
      container: mapContainerRef.current as HTMLElement,
      center: center,
      zoom: zoom,
      pitch: pitch,
      maxBounds: [
        [106.91, 47.91],
        [106.925, 47.925],
      ],
      minZoom: 15,
      maxZoom: 18,
    });

    mapRef.current.on('move', () => {
      if (mapRef.current) {
        const mapCenter = mapRef.current.getCenter();
        const mapZoom = mapRef.current.getZoom();
        const mapPitch = mapRef.current.getPitch();

        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
        setPitch(mapPitch);
      }
    });

    // --- UPDATED MARKER LOGIC START ---
    data.map((buildingItem) => {
      // 1. Create a Container for Label + Dot
      const el = document.createElement('div');
      el.className = 'flex flex-col items-center cursor-pointer group hover:z-50'; // Stack vertically

      // 2. Inject HTML: Label on top, Dot on bottom
      // Note: text-[#005596] is the hardcoded NUM Blue.
      // Change to text-num-blue if you updated tailwind.config.js
      el.innerHTML = `
        <div class="mb-1 px-2 py-1 bg-white/95 border border-gray-200 rounded shadow-md">
          <p class="text-[12px] font-bold text-[#005596] whitespace-nowrap leading-none">
            ${buildingItem.building}
          </p>
        </div>
        <div class="${getColorByStatus(buildingItem.building_status)} border-2 border-white"></div>
      `;

      // 3. Add Click Listener
      el.addEventListener('click', () => {
        const accordionItem = document.getElementById(buildingItem.building_code);

        setTimeout(() => {
          if (accordionItem) {
            accordionItem.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 300);

        handleMarkerClick(buildingItem.building_code);
      });

      // 4. Add to Map
      if (mapRef.current && buildingItem.coords) {
        // coords are [long, lat] from your Python API
        new mapboxgl.Marker(el).setLngLat([buildingItem.coords[0], buildingItem.coords[1]]).addTo(mapRef.current);
      }
    });
    // --- UPDATED MARKER LOGIC END ---

    if (userPos) {
      const e2 = document.createElement('div');
      e2.className = 'h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]';

      new mapboxgl.Marker(e2).setLngLat([userPos[1], userPos[0]]).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [data]); // Add 'data' dependency so markers update if data loads later

  // Define your NUM buildings
  const NUM_LOCATIONS = [
    { name: 'Main Building', coords: { lat: 47.92269453067302, lng: 106.919000736241 } },
    { name: 'Engineering Building', coords: { lat: 47.919, lng: 106.9185 } },
    { name: 'Library', coords: { lat: 47.918, lng: 106.917 } },
  ];

  return (
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
      <div id="map-container" ref={mapContainerRef} className="opacity-100" />
      <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px]">
        <div className="flex items-center gap-0">
          <div className="h-2 w-2 rounded-full bg-red-400 flex-none"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">unavailable</div>
        </div>
        <div className="flex items-center gap-0">
          <div className="h-2 w-2 rounded-full bg-amber-400 flex-none"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">opening soon</div>
        </div>
        <div className="flex items-center gap-0">
          <div className="h-2 w-2 rounded-full bg-green-400 flex-none"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">open now</div>
        </div>
      </div>
    </div>
  );
}
