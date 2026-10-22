export interface AcademicDeadline {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  category: "exam" | "assignment" | "project" | "personal";
  targetDate: string; // "YYYY-MM-DD"
  targetTime?: string; // "10:00"
  location?: string;
  details?: string;
}

export interface RunwayMilestone {
  id: string;
  deadlineId: string;
  deadlineTitle: string;
  category: "exam" | "assignment" | "project" | "personal";
  stageLabel: string;
  daysRemaining: number;
  targetDate: string;
  title: string;
  actionableStep: string;
  estimatedMinutes: number;
  completed: boolean;
  isToday?: boolean;
}

// Default Semester 5 Academic Deadlines
export const SEMESTER_5_DEADLINES: AcademicDeadline[] = [
  {
    id: "dl-fla",
    title: "FLA Chart Preparation & Viva Presentation",
    courseCode: "21CSC301T",
    courseName: "Formal Language and Automata",
    category: "project",
    targetDate: "2026-10-27",
    targetTime: "10:00",
    location: "CLS1020",
    details: "Prepare chart before class with team. Presentation & viva evaluation during class hours.",
  },
  {
    id: "dl-bde",
    title: "Big Data Essentials Project Review",
    courseCode: "21CSC314P",
    courseName: "Big Data Essentials",
    category: "assignment",
    targetDate: "2026-10-28",
    targetTime: "14:20",
    location: "CLS1020",
    details: "Project review on Wednesday 28th. Check milestone outputs & pipeline scripts.",
  },
  {
    id: "dl-dm-ft4",
    title: "Discrete Math FT-IV Examination",
    courseCode: "21MAB302T",
    courseName: "Discrete Mathematics",
    category: "exam",
    targetDate: "2026-11-02",
    targetTime: "14:20",
    location: "CLS1020",
    details: "Rescheduled FT-IV Exam. Syllabus: Unit 4 and Unit 5.",
  },
  {
    id: "dl-llt",
    title: "Linux & Container Technologies LLT Exam",
    courseCode: "21CSE216P",
    courseName: "Linux and Container Technologies",
    category: "exam",
    targetDate: "2026-11-03",
    targetTime: "08:00",
    location: "LH204",
    details: "Rescheduled LLT assessment. Hands-on Docker, cgroups & bash namespaces.",
  },
];

/**
 * Calculates days difference between target date and current date
 */
export function getDaysDiff(targetDateStr: string, currentDateStr: string = "2026-10-22"): number {
  const target = new Date(targetDateStr);
  const current = new Date(currentDateStr);
  const diffTime = target.getTime() - current.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generates staged Reverse Runway milestones for any upcoming exam or assignment deadline
 */
export function generateRunwayMilestones(
  deadline: AcademicDeadline,
  currentDateStr: string = "2026-10-22"
): RunwayMilestone[] {
  const daysDiff = getDaysDiff(deadline.targetDate, currentDateStr);

  if (deadline.category === "exam") {
    return [
      {
        id: `${deadline.id}-m1`,
        deadlineId: deadline.id,
        deadlineTitle: deadline.title,
        category: "exam",
        stageLabel: "T-5 Blueprint",
        daysRemaining: Math.max(1, daysDiff - 4),
        targetDate: deadline.targetDate,
        title: `Structure syllabus notes: ${deadline.courseName}`,
        actionableStep: "Index core formulas, recurrence relations, and key theorems (Unit 4 & 5).",
        estimatedMinutes: 45,
        completed: daysDiff > 5,
        isToday: daysDiff <= 5 && daysDiff > 3,
      },
      {
        id: `${deadline.id}-m2`,
        deadlineId: deadline.id,
        deadlineTitle: deadline.title,
        category: "exam",
        stageLabel: "T-3 Practice",
        daysRemaining: Math.max(1, daysDiff - 2),
        targetDate: deadline.targetDate,
        title: `Solve 5 past paper problems: ${deadline.courseName}`,
        actionableStep: "Work through 5 high-yield university exam questions without looking at solutions.",
        estimatedMinutes: 50,
        completed: false,
        isToday: daysDiff <= 3 && daysDiff > 1,
      },
      {
        id: `${deadline.id}-m3`,
        deadlineId: deadline.id,
        deadlineTitle: deadline.title,
        category: "exam",
        stageLabel: "T-1 Mock Run",
        daysRemaining: 1,
        targetDate: deadline.targetDate,
        title: `Speed formula review & mock test: ${deadline.courseName}`,
        actionableStep: "Simulated 30-min timed practice session. Verify edge cases & time management.",
        estimatedMinutes: 35,
        completed: false,
        isToday: daysDiff <= 1,
      },
    ];
  }

  // Projects & Assignments (e.g. FLA Chart, Big Data Review)
  return [
    {
      id: `${deadline.id}-m1`,
      deadlineId: deadline.id,
      deadlineTitle: deadline.title,
      category: deadline.category,
      stageLabel: "T-4 Concept & Layout",
      daysRemaining: Math.max(1, daysDiff - 3),
      targetDate: deadline.targetDate,
      title: `Draft chart structure: ${deadline.title}`,
      actionableStep: "Sketch transition diagram on paper before drawing on the chart paper.",
      estimatedMinutes: 40,
      completed: daysDiff > 4,
      isToday: daysDiff <= 4 && daysDiff > 2,
    },
    {
      id: `${deadline.id}-m2`,
      deadlineId: deadline.id,
      deadlineTitle: deadline.title,
      category: deadline.category,
      stageLabel: "T-2 Deliverable Polish",
      daysRemaining: Math.max(1, daysDiff - 1),
      targetDate: deadline.targetDate,
      title: `Complete execution & artifacts: ${deadline.title}`,
      actionableStep: "Finalize visual presentation, verify test runs, and test output demo.",
      estimatedMinutes: 45,
      completed: false,
      isToday: daysDiff <= 2 && daysDiff > 1,
    },
    {
      id: `${deadline.id}-m3`,
      deadlineId: deadline.id,
      deadlineTitle: deadline.title,
      category: deadline.category,
      stageLabel: "T-1 Viva Dry-Run",
      daysRemaining: 1,
      targetDate: deadline.targetDate,
      title: `Mock viva questions with team: ${deadline.title}`,
      actionableStep: "Practice explaining your chart decisions, grammar definitions, and complexity.",
      estimatedMinutes: 30,
      completed: false,
      isToday: daysDiff <= 1,
    },
  ];
}
