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
          const el = document.createElement('div');
          // 'group' allows us to animate the label when hovering the dot
          el.className = 'flex flex-col items-center cursor-pointer group z-10 hover:z-50';

          el.innerHTML = `
        <!-- LABEL CONTAINER -->
        <div class="mb-3 transform transition-all duration-300 ease-out group-hover:-translate-y-1">
          
          <!-- The Card -->
          <div class="relative flex items-center bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)] overflow-hidden">
            
            <!-- Blue Accent Strip -->
            <div class="w-1.5 self-stretch bg-[#005596]"></div>
            
            <!-- Text Content (Building Name Only) -->
            <div class="px-3 py-2">
              <p class="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider whitespace-nowrap leading-none">
                ${buildingItem.building}
              </p>
            </div>

            <!-- Little Arrow pointing down -->
            <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-sm z-[-1]"></div>
          </div>
        </div>

        <!-- THE DOT (Anchor) -->
        <div class="relative flex items-center justify-center">
          <div class="w-3.5 h-3.5 bg-[#005596] rounded-full border-2 border-white shadow-md z-10 transition-transform duration-300 group-hover:scale-125"></div>
          <div class="absolute w-8 h-8 bg-[#005596]/20 rounded-full animate-pulse z-0"></div>
        </div>
      `;


          // Click Listener
          el.addEventListener('click', () => {
            const accordionItem = document.getElementById(buildingItem.building_code);
            setTimeout(() => {
              if (accordionItem) {
                accordionItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 300);
            handleMarkerClick(buildingItem.building_code);
          });

          if (mapRef.current && buildingItem.coords) {
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
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-gray-100 rounded-[20px] overflow-hidden border border-gray-200">
      <div id="map-container" ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
