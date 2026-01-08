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

  // Initial state only
  const [center] = useState<[number, number]>([106.920315, 47.922527]);
  const [zoom] = useState(16);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // 1. Initialize Map (RUNS EXACTLY ONCE)
  useEffect(() => {
    if (!mapboxToken) {
      console.error('❌ Mapbox token is missing.');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    if (!mapContainerRef.current) return;

    // Initialize Map
    mapRef.current = new mapboxgl.Map({
      style: 'mapbox://styles/irmuun360/cmk2pwcoy00e001s98ror2wtf',
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      pitch: 52,
      maxBounds: [
        [106.915963, 47.916643], // Southwest Corner (West Limit, New South Limit)
        [106.960447, 47.926301], // Northeast Corner (New East Limit, North Limit)
      ],
      minZoom: 14,
      maxZoom: 18,
    });

    // Add 3D Building layer when map loads
    mapRef.current.on('load', () => {
      if (!mapRef.current) return;

      // Add source for custom 3D buildings (if any)
      if (!mapRef.current.getSource('custom-missing-building')) {
        mapRef.current.addSource('custom-missing-building', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
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

        mapRef.current.addLayer({
          id: 'custom-building-extrusion',
          type: 'fill-extrusion',
          source: 'custom-missing-building',
          paint: {
            'fill-extrusion-color': '#f5f0e5',
            'fill-extrusion-height': 9.9,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 1,
            'fill-extrusion-vertical-gradient': true,
          },
        });
      }
    });

    // Cleanup
    return () => {
      mapRef.current?.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <--- Empty dependency array + suppression = Runs ONCE safely.

  // 2. Handle "Fly To" Animation
  useEffect(() => {
    if (mapRef.current && flyToLocation) {
      const currentCenter = mapRef.current.getCenter();

      // Calculate distance (Manhattan distance is enough for this check)
      const distLng = Math.abs(currentCenter.lng - flyToLocation[0]);
      const distLat = Math.abs(currentCenter.lat - flyToLocation[1]);

      // Threshold: ~0.02 degrees is roughly 1.5 - 2km.
      // If further than this, we Teleport. If closer, we Fly.
      const isFarAway = distLng > 0.02 || distLat > 0.02;

      if (isFarAway) {
        // OPTION A: INSTANT TELEPORT (No lag, best for 5km+ jumps)
        mapRef.current.jumpTo({
          center: flyToLocation,
          zoom: 18,
          pitch: 60,
          bearing: 0,
        });
      } else {
        // OPTION B: SMOOTH FLY (For nearby buildings)
        mapRef.current.flyTo({
          center: flyToLocation,
          zoom: 18,
          pitch: 60,
          bearing: 0,
          speed: 0.8, // Moderate speed
          curve: 1, // Gentle curve
          essential: true,
        });
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, userPos]); // <--- Suppression allows us to omit handleMarkerClick

  return (
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
