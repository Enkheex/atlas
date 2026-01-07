export interface Room {
  number: string;
  floor: number;
  type: string; // e.g., "Lecture", "Lab", "Office"
}

export interface BuildingData {
  id: string; // Unique ID (e.g., 'MB')
  name: string;
  code: string;
  coords: [number, number]; // [Lng, Lat]
  rooms: Room[];
}

export const CAMPUS_DATA: BuildingData[] = [
  {
    id: 'MB',
    name: 'Main Building',
    code: 'MB',
    coords: [106.919000736241, 47.92269453067302],
    rooms: [
      { number: '101', floor: 1, type: 'Lecture Hall' },
      { number: '102', floor: 1, type: 'Office' },
      { number: '201', floor: 2, type: 'Classroom' },
      { number: '202', floor: 2, type: 'Lab' },
      { number: '305', floor: 3, type: 'Seminar' },
    ],
  },
  {
    id: 'LEAB',
    name: 'Engineering Building',
    code: 'LEAB',
    coords: [106.9185, 47.919],
    rooms: [
      { number: '120', floor: 1, type: 'Physics Lab' },
      { number: '215', floor: 2, type: 'Computer Lab' },
      { number: '301', floor: 3, type: 'Dean Office' },
    ],
  },
  {
    id: 'LIB',
    name: 'Library',
    code: 'LIB',
    coords: [106.917, 47.918],
    rooms: [
      { number: '101', floor: 1, type: 'Reading Hall' },
      { number: '201', floor: 2, type: 'Quiet Zone' },
    ],
  },
  {
    id: 'lit',
    name: 'lite',
    code: 'lit',
    coords: [106.9165654912963, 47.91929467723432],
    rooms: [
      { number: '101', floor: 1, type: 'Reading Hall' },
      { number: '201', floor: 2, type: 'Quiet Zone' },
    ],
  },
];