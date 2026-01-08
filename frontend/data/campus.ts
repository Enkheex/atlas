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
    id: 'Төв байр',
    name: 'Хичээлийн 1-р байр',
    code: 'Төв байр',
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
    id: 'ШУС',
    name: 'Хичээлийн 2-р байр',
    code: 'ШУС',
    coords: [106.9221196452063, 47.92284389553936],
    rooms: [
      { number: '101', floor: 1, type: 'Reading Hall' },
      { number: '201', floor: 2, type: 'Quiet Zone' },
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
    id: 'Бизнесийн сургууль',
    name: 'Хичээлийн 4-р байр',
    code: 'Бизнесийн сургууль',
    coords: [106.92134890412672, 47.9259591328059],
    rooms: [
      { number: '120', floor: 1, type: 'Physics Lab' },
      { number: '215', floor: 2, type: 'Computer Lab' },
      { number: '301', floor: 3, type: 'Dean Office' },
    ],
  },
  {
    id: 'УТСОУХНУС',
    name: 'Хичээлийн 5-р байр',
    code: 'УТСОУХНУС',
    coords: [106.92170171130499, 47.925518884994375],
    rooms: [
      { number: '120', floor: 1, type: 'Physics Lab' },
      { number: '215', floor: 2, type: 'Computer Lab' },
      { number: '301', floor: 3, type: 'Dean Office' },
    ],
  },
  {
    id: '7',
    name: 'Хичээлийн 7-р байр',
    code: '7',
    coords: [106.92743123210045, 47.9202532357975],
    rooms: [
      { number: '120', floor: 1, type: 'Physics Lab' },
      { number: '215', floor: 2, type: 'Computer Lab' },
      { number: '301', floor: 3, type: 'Dean Office' },
    ],
  },
  {
    id: '8',
    name: 'Хичээлийн 8-р байр',
    code: '8',
    coords: [106.92842127114955, 47.91979936297804],
    rooms: [
      { number: '120', floor: 1, type: 'Physics Lab' },
      { number: '215', floor: 2, type: 'Computer Lab' },
      { number: '301', floor: 3, type: 'Dean Office' },
    ],
  },
  {
    id: 'E-Lib',
    name: 'Номын сан',
    code: 'E-Lib',
    coords: [106.92057817158883, 47.92282117839716],
    rooms: [
      { number: '101', floor: 1, type: 'Reading Hall' },
      { number: '201', floor: 2, type: 'Quiet Zone' },
    ],
  },
  {
    id: 'БОХТ',
    name: 'Багш, оюутны хөгжлийн төв',
    code: 'БОХТ',
    coords: [106.92176353997206, 47.9234219053543],
    rooms: [],
  },
];