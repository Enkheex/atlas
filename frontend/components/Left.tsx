'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataFormat {
  building: string;
  building_code: string;
  rooms: {
    [key: string]: {
      slots: any[];
    };
  };
  coords: [number, number];
}

export default function Left({
  data,
  activeBuilding,
  setActiveBuilding,
}: {
  data: DataFormat[];
  activeBuilding: string | null;
  setActiveBuilding: (building: string) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="px-8 my-4">
        <Alert className="mx-auto w-fit text-center bg-gray-50 border-gray-200">
          <AlertDescription className="text-gray-500">Loading campus data...</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 overflow-y-auto max-h-[85vh]">
      <h2 className="text-xl font-bold text-[#005596] mb-4 mt-4 px-1">NUM Campus Map</h2>

      <Accordion type="single" collapsible className="w-full space-y-2" value={activeBuilding || ''} onValueChange={(val) => setActiveBuilding(val)}>
        {data.map((building) => (
          <AccordionItem
            id={building.building_code}
            value={building.building_code}
            key={building.building_code}
            className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline transition-all">
              <div className="flex flex-col text-left">
                <span className="font-bold text-gray-800 text-base">{building.building}</span>
                <span className="text-xs text-gray-400 font-mono">CODE: {building.building_code}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="bg-gray-50/50 px-4 py-4 border-t border-gray-100">
              <div className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rooms</div>

              {building.rooms && Object.keys(building.rooms).length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(building.rooms).map((roomName) => (
                    <div
                      key={roomName}
                      className="flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-md hover:border-[#005596] hover:shadow-sm transition-all cursor-default"
                    >
                      <span className="text-sm font-medium text-gray-700">{roomName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 italic text-sm">No room information.</div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
