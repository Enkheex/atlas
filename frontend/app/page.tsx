'use client';
import Left from '@/components/Left';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Map from '@/components/Map';
import Loading from '@/components/Loading';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Interface matches the one in Left.tsx
interface dataFormat {
  building: string;
  building_code: string;
  building_status: string;
  rooms: {
    [key: string]: {
      slots: any[]; // Flexible to handle empty or future data
    };
  };
  coords: [number, number];
  distance: number;
}

export default function Home() {
  const [data, setData] = useState<dataFormat[]>([]);
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleMarkerClick = (building: string) => {
    setActiveBuilding(building);
  };

  useEffect(() => {
    const fetchLocationAndData = async () => {
      setLoading(true);

      // 1. Try to get User Location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserPos([latitude, longitude]);

            try {
              // Send location to backend to sort by distance
              const res = await fetch('/api/open-classrooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: latitude, lng: longitude }),
              });
              const data = await res.json();
              setData(data);
            } catch (error) {
              console.error('Backend error:', error);
            } finally {
              setLoading(false);
            }
          },
          async (error) => {
            console.warn('Location access denied/error:', error);
            // Fallback: Fetch unsorted data
            const res = await fetch('/api/open-classrooms');
            const defaultData = await res.json();
            setData(defaultData);
            setLoading(false);
          }
        );
      } else {
        // Fallback: Browser doesn't support geolocation
        const res = await fetch('/api/open-classrooms');
        const defaultData = await res.json();
        setData(defaultData);
        setLoading(false);
      }
    };

    fetchLocationAndData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex flex-col sm:flex-row h-screen bg-white">
      {/* --- SIDEBAR SECTION --- */}
      <div className="basis-2/5 h-[40vh] sm:h-full order-last sm:order-first relative flex flex-col border-r border-gray-200 shadow-xl z-20">
        {/* Info Button (Floating Top Right) */}
        <div className="absolute top-4 right-4 z-50">
          <Popover>
            <PopoverTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#005596]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill="none">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </PopoverTrigger>
            <PopoverContent className="bg-zinc-900 border-zinc-700 text-zinc-200 w-72 shadow-xl mr-2">
              <div className="font-bold mb-2 text-white">NUM Atlas Notes:</div>
              <ul className="list-disc pl-4 text-sm space-y-1 text-zinc-300">
                <li>Санал хүслээ Instagram дээрх @irmuun360 хаягаар мэдээллэнэ үү.</li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sidebar Content (Logo is inside Left.tsx) */}
        <ScrollArea className="h-full w-full bg-white">
          <Left data={data} activeBuilding={activeBuilding} setActiveBuilding={setActiveBuilding} />
        </ScrollArea>
      </div>

      {/* --- MAP SECTION --- */}
      <div className="basis-3/5 h-[60vh] sm:h-screen relative z-10">
        <Map data={data} handleMarkerClick={handleMarkerClick} userPos={userPos} />
      </div>
    </main>
  );
}
