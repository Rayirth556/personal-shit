export type ClassType = "theory" | "practical" | "optional";

export interface PeriodSlot {
  slotNumber: number;
  timeStart: string;
  timeEnd: string;
  label: string; // e.g. "08:00 - 08:50"
}

export interface ClassSession {
  id: string;
  courseName: string;
  courseCode?: string;
  room?: string;
  type: ClassType;
  startSlot: number;
  endSlot: number;
  startTime: string;
  endTime: string;
  durationLabel: string;
}

export interface DayOrderSchedule {
  dayOrder: number; // 1 to 5
  dayName: string; // "Day 1", etc.
  classes: ClassSession[];
}

export const TIME_SLOTS: PeriodSlot[] = [
  { slotNumber: 1, timeStart: "08:00", timeEnd: "08:50", label: "08:00 - 08:50" },
  { slotNumber: 2, timeStart: "08:50", timeEnd: "09:40", label: "08:50 - 09:40" },
  { slotNumber: 3, timeStart: "09:45", timeEnd: "10:35", label: "09:45 - 10:35" },
  { slotNumber: 4, timeStart: "10:40", timeEnd: "11:30", label: "10:40 - 11:30" },
  { slotNumber: 5, timeStart: "11:35", timeEnd: "12:25", label: "11:35 - 12:25" },
  { slotNumber: 6, timeStart: "12:30", timeEnd: "13:20", label: "12:30 - 01:20" },
  { slotNumber: 7, timeStart: "13:25", timeEnd: "14:15", label: "01:25 - 02:15" },
  { slotNumber: 8, timeStart: "14:20", timeEnd: "15:10", label: "02:20 - 03:10" },
  { slotNumber: 9, timeStart: "15:10", timeEnd: "16:00", label: "03:10 - 04:00" },
  { slotNumber: 10, timeStart: "16:00", timeEnd: "16:50", label: "04:00 - 04:50" },
  { slotNumber: 11, timeStart: "16:50", timeEnd: "17:30", label: "04:50 - 05:30" },
  { slotNumber: 12, timeStart: "17:30", timeEnd: "18:10", label: "05:30 - 06:10" },
];

export const TIMETABLE_DAYS: DayOrderSchedule[] = [
  // DAY 1
  {
    dayOrder: 1,
    dayName: "Day 1",
    classes: [
      {
        id: "d1-cn",
        courseName: "Computer Networks",
        courseCode: "21CSC302J",
        room: "CLS1020",
        type: "theory",
        startSlot: 6,
        endSlot: 7,
        startTime: "12:30",
        endTime: "14:15",
        durationLabel: "1h 45m",
      },
      {
        id: "d1-bd",
        courseName: "Big Data Essentials",
        courseCode: "21CSC314P",
        room: "CLS1020",
        type: "theory",
        startSlot: 8,
        endSlot: 9,
        startTime: "14:20",
        endTime: "16:00",
        durationLabel: "1h 40m",
      },
      {
        id: "d1-sm",
        courseName: "Stress Management",
        courseCode: "21MGO104T",
        room: "LH1126",
        type: "theory",
        startSlot: 10,
        endSlot: 10,
        startTime: "16:00",
        endTime: "16:50",
        durationLabel: "50m",
      },
    ],
  },

  // DAY 2
  {
    dayOrder: 2,
    dayName: "Day 2",
    classes: [
      {
        id: "d2-lct",
        courseName: "Linux and Container Technologies",
        courseCode: "21CSE216P",
        room: "LH204",
        type: "theory",
        startSlot: 1,
        endSlot: 2,
        startTime: "08:00",
        endTime: "09:40",
        durationLabel: "1h 40m",
      },
      {
        id: "d2-sm",
        courseName: "Stress Management",
        courseCode: "21MGO104T",
        room: "LH1126",
        type: "theory",
        startSlot: 3,
        endSlot: 4,
        startTime: "09:45",
        endTime: "11:30",
        durationLabel: "1h 45m",
      },
      {
        id: "d2-cn",
        courseName: "Computer Networks",
        courseCode: "21CSC302J",
        room: "CLS1020",
        type: "theory",
        startSlot: 5,
        endSlot: 5,
        startTime: "11:35",
        endTime: "12:25",
        durationLabel: "50m",
      },
      {
        id: "d2-cn-lab",
        courseName: "Computer Networks Lab",
        courseCode: "21CSC302J",
        room: "TP609 / Computing Lab G",
        type: "practical",
        startSlot: 9,
        endSlot: 10,
        startTime: "15:10",
        endTime: "16:50",
        durationLabel: "1h 40m",
      },
    ],
  },

  // DAY 3
  {
    dayOrder: 3,
    dayName: "Day 3",
    classes: [
      {
        id: "d3-dm",
        courseName: "Discrete Mathematics",
        courseCode: "21MAB302T",
        room: "CLS1020",
        type: "theory",
        startSlot: 6,
        endSlot: 7,
        startTime: "12:30",
        endTime: "14:15",
        durationLabel: "1h 45m",
      },
      {
        id: "d3-cn",
        courseName: "Computer Networks",
        courseCode: "21CSC302J",
        room: "CLS1020",
        type: "theory",
        startSlot: 8,
        endSlot: 8,
        startTime: "14:20",
        endTime: "15:10",
        durationLabel: "50m",
      },
      {
        id: "d3-fla",
        courseName: "Formal Language and Automata",
        courseCode: "21CSC301T",
        room: "CLS1020",
        type: "theory",
        startSlot: 9,
        endSlot: 9,
        startTime: "15:10",
        endTime: "16:00",
        durationLabel: "50m",
      },
      {
        id: "d3-lct",
        courseName: "Linux and Container Technologies",
        courseCode: "21CSE216P",
        room: "LH204",
        type: "theory",
        startSlot: 10,
        endSlot: 10,
        startTime: "16:00",
        endTime: "16:50",
        durationLabel: "50m",
      },
    ],
  },

  // DAY 4
  {
    dayOrder: 4,
    dayName: "Day 4",
    classes: [
      {
        id: "d4-fla",
        courseName: "Formal Language and Automata",
        courseCode: "21CSC301T",
        room: "CLS1020",
        type: "theory",
        startSlot: 1,
        endSlot: 2,
        startTime: "08:00",
        endTime: "09:40",
        durationLabel: "1h 40m",
      },
      {
        id: "d4-lct",
        courseName: "Linux and Container Technologies",
        courseCode: "21CSE216P",
        room: "LH204",
        type: "theory",
        startSlot: 3,
        endSlot: 3,
        startTime: "09:45",
        endTime: "10:35",
        durationLabel: "50m",
      },
      {
        id: "d4-dm",
        courseName: "Discrete Mathematics",
        courseCode: "21MAB302T",
        room: "CLS1020",
        type: "theory",
        startSlot: 5,
        endSlot: 5,
        startTime: "11:35",
        endTime: "12:25",
        durationLabel: "50m",
      },
      {
        id: "d4-iaf",
        courseName: "Indian Art Form",
        courseCode: "21LEM301T",
        room: "LH204",
        type: "theory",
        startSlot: 11,
        endSlot: 12,
        startTime: "16:50",
        endTime: "18:10",
        durationLabel: "1h 20m",
      },
    ],
  },

  // DAY 5
  {
    dayOrder: 5,
    dayName: "Day 5",
    classes: [
      {
        id: "d5-dm",
        courseName: "Discrete Mathematics",
        courseCode: "21MAB302T",
        room: "CLS1020",
        type: "theory",
        startSlot: 8,
        endSlot: 8,
        startTime: "14:20",
        endTime: "15:10",
        durationLabel: "50m",
      },
      {
        id: "d5-bd",
        courseName: "Big Data Essentials",
        courseCode: "21CSC314P",
        room: "CLS1020",
        type: "theory",
        startSlot: 9,
        endSlot: 9,
        startTime: "15:10",
        endTime: "16:00",
        durationLabel: "50m",
      },
      {
        id: "d5-fla",
        courseName: "Formal Language and Automata",
        courseCode: "21CSC301T",
        room: "CLS1020",
        type: "theory",
        startSlot: 10,
        endSlot: 10,
        startTime: "16:00",
        endTime: "16:50",
        durationLabel: "50m",
      },
      {
        id: "d5-iaf",
        courseName: "Indian Art Form",
        courseCode: "21LEM301T",
        room: "LH204",
        type: "theory",
        startSlot: 11,
        endSlot: 12,
        startTime: "16:50",
        endTime: "18:10",
        durationLabel: "1h 20m",
      },
    ],
  },
];

export const ENROLLED_COURSES = [
  {
    code: "21CSC302J",
    name: "Computer Networks",
    category: "Professional Core Courses (C)",
    credits: 4,
    theoryRoom: "CLS1020",
    labRoom: "TP609 / Computing Lab G",
    color: "#5E5CE6",
    type: "Theory & Practical",
  },
  {
    code: "21CSC301T",
    name: "Formal Language and Automata",
    category: "Professional Core Courses (C)",
    credits: 3,
    theoryRoom: "CLS1020",
    color: "#AF52DE",
    type: "Theory",
  },
  {
    code: "21CSE216P",
    name: "Linux and Container Technologies",
    category: "Professional Elective Courses (E)",
    credits: 3,
    theoryRoom: "LH204",
    color: "#007AFF",
    type: "Theory & Lab",
  },
  {
    code: "21MAB302T",
    name: "Discrete Mathematics",
    category: "Basic Science Courses (B)",
    credits: 4,
    theoryRoom: "CLS1020",
    color: "#34C759",
    type: "Theory",
  },
  {
    code: "21CSC314P",
    name: "Big Data Essentials",
    category: "Professional Core Courses (C)",
    credits: 3,
    theoryRoom: "CLS1020",
    color: "#FF9500",
    type: "Practical / Lab",
  },
  {
    code: "21MGO104T",
    name: "Stress Management",
    category: "Open Elective Courses (O)",
    credits: 3,
    theoryRoom: "LH1126",
    color: "#30B0C7",
    type: "Theory",
  },
  {
    code: "21LEM301T",
    name: "Indian Art Form",
    category: "Non Credit Courses (M)",
    credits: 0,
    theoryRoom: "LH204",
    color: "#FF2D55",
    type: "Non-Credit Course",
  },
];

export interface SacredTimeBlock {
  id: string;
  title: string;
  startTime: string; // "16:00"
  endTime: string;   // "19:00"
  tag: string;
  description: string;
}

export const GIRLFRIEND_TIME_BLOCK: SacredTimeBlock = {
  id: "stb-girlfriend",
  title: "Girlfriend Time",
  startTime: "16:00",
  endTime: "19:00",
  tag: "Sacred Personal Block",
  description: "Protected relationship & unwind time (4:00 PM – 7:00 PM). Focus-free zone.",
};
