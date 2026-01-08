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
    name: 'Хичээлийн 1-р байр',
    code: 'MB',
    coords: [106.91900731736291, 47.9227976745249],
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
    name: 'Хичээлийн 3-р байр',
    code: 'LEAB',
    coords: [106.91844856701238, 47.92400101407196],
    rooms: [
      { number: '120', floor: 1, type: 'Physics Lab' },
      { number: '215', floor: 2, type: 'Computer Lab' },
      { number: '301', floor: 3, type: 'Dean Office' },
    ],
  },
  {
    id: 'LIB',
    name: 'Номын сан',
    code: 'LIB',
    coords: [106.92057817158883, 47.92282117839716],
    rooms: [
      { number: '101', floor: 1, type: 'Reading Hall' },
      { number: '201', floor: 2, type: 'Quiet Zone' },
    ],
  },
  {
    id: 'lit',
    name: 'Хичээлийн 2-р байр',
    code: 'lit',
    coords: [106.9221196452063, 47.92284389553936],
    rooms: [
      { number: '101', floor: 1, type: 'Reading Hall' },
      { number: '201', floor: 2, type: 'Quiet Zone' },
    ],
  },
];