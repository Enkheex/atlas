'use client';
import { useState, useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { BuildingData } from '@/data/campus';

export default function Left({
  data,
  activeBuilding,
  setActiveBuilding,
  onRoomClick,
}: {
  data: BuildingData[];
  activeBuilding: string | null;
  setActiveBuilding: (id: string) => void;
  onRoomClick: (coords: [number, number]) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Search Logic
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();

    return data
      .map((building) => {
        const matchingRooms = building.rooms.filter((room) => room.number.toLowerCase().includes(lowerQuery));

        if (matchingRooms.length > 0) {
          return { ...building, rooms: matchingRooms };
        }
        return null;
      })
      .filter((item): item is BuildingData => item !== null);
  }, [data, searchQuery]);

  return (
    <div className="px-4 md:px-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4 mt-6 px-1 flex-shrink-0">
        <div className="relative h-14 w-14 flex-shrink-0">
          <Image src="/logo.svg" alt="NUM Logo" fill className="object-contain" priority />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-[#0052AC] leading-none tracking-tight">NUM ATLAS</h1>
          <p className="text-[11px] text-gray-500 font-semibold tracking-wide uppercase mt-1">Campus Map</p>
        </div>
      </div>

      {/* SEARCH BAR (Sticky) */}
      <div className="sticky top-0 bg-white z-10 pb-4 pt-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search room (e.g., 202, 305)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setActiveBuilding('');
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052AC] focus:border-transparent transition-all shadow-sm"
          />
          {/* Search Icon */}
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-y-auto pb-10">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No rooms found.</div>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3"
            value={activeBuilding || ''}
            onValueChange={(val) => {
              setActiveBuilding(val);
              const b = data.find((x) => x.id === val);
              if (b) onRoomClick(b.coords);
            }}
          >
            {filteredData.map((building) => (
              <AccordionItem
                id={building.id}
                value={building.id}
                key={building.id}
                className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline transition-all">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-gray-800 text-base">{building.name}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="bg-gray-50/50 px-4 py-4 border-t border-gray-100">
                  {/* REMOVED: The "Room / Floor" header row to simplify */}

                  {building.rooms && building.rooms.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {' '}
                      {/* Changed to 2 columns for better density */}
                      {building.rooms.map((room) => (
                        <button
                          key={`${building.id}-${room.number}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRoomClick(building.coords);
                          }}
                          className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-md hover:border-[#0052AC] hover:shadow-md transition-all group text-center h-full"
                        >
                          <span className="text-sm font-bold text-gray-700 group-hover:text-[#0052AC]">{room.number}</span>
                          {/* Optional: Show room type if you want, or remove this line for extreme minimalism */}
                          <span className="text-[10px] text-gray-400 line-clamp-1">{room.type}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400 italic text-sm">No rooms match.</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
