export interface Profile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  currentTerm: string;
  currentWeek: number;
  totalWeeks: number;
  wifiNetwork: string;
}

export interface Task {
  id: string;
  title: string;
  category: "exam" | "assignment" | "project" | "personal";
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  isTopPriorityToday?: boolean;
  dueDate?: string;
  dueLabel?: string;
  subtitle?: string;
  projectSlug?: string;
  projectName?: string;
  completedAt?: string;
  subtasksCompleted?: number;
  subtasksTotal?: number;
  tags?: string[];
  assigneeInitials?: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  category: "exam" | "assignment" | "project" | "personal";
  startTime: string; // e.g. "09:30"
  endTime: string;   // e.g. "10:30"
  location: string;
  subtitle?: string;
  completed?: boolean;
}

export interface ComingUpItem {
  id: string;
  title: string;
  type: "exam" | "assignment" | "project" | "personal";
  dueDate: string;
  countdown: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  labTag: string;
  courseTag: string;
  description: string;
  deadline: string;
  deadlineDaysLeft: number;
  advisor: string;
  teamCount: number;
  progressPercent: number;
  deliverablesDone: number;
  deliverablesTotal: number;
  inProgressCount: number;
  dueThisWeekCount: number;
  blockersCount: number;
  currentStage: "spec_review" | "hardware_proto" | "navigation_stack" | "final_defense";
  stages: { id: string; label: string; status: "completed" | "current" | "upcoming" }[];
  columns: {
    todo: Task[];
    doing: Task[];
    done: Task[];
  };
  logs: {
    id: string;
    dateLabel: string;
    timeAgo: string;
    hoursLogged: number;
    content: string;
    tags: string[];
  }[];
}

export interface HistoryDay {
  id: string;
  dateString: string; // "Wednesday, 21 October"
  relativeLabel: string; // "Yesterday"
  tasksCompleted: number;
  tasksTotal: number;
  completionPercent: number;
  deepWorkHours: number;
  reflection: string;
  tasks: {
    id: string;
    title: string;
    category: "exam" | "assignment" | "project" | "personal";
    timeLabel: string;
    details: string;
  }[];
  summary: {
    deepWorkHours: number;
    lecturesAttended: number;
    pagesLogged: number;
  };
}

export const mockProfile: Profile = {
  id: "user-1",
  fullName: "Rayirth Misra",
  email: "",
  avatarUrl: "",
  currentTerm: "Semester 5",
  currentWeek: 0,
  totalWeeks: 0,
  wifiNetwork: "",
};

export const mockTop3Tasks: Task[] = [
  {
    id: "top-1",
    title: "Finish DBMS assignment",
    category: "assignment",
    priority: "high",
    status: "todo",
    isTopPriorityToday: true,
    dueLabel: "due Sat, 24 Oct • Database Normalization 3NF",
  },
  {
    id: "top-2",
    title: "Push login module",
    category: "project",
    priority: "high",
    status: "todo",
    isTopPriorityToday: true,
    dueLabel: "Final-year project • OAuth2 PKCE callback handling",
  },
  {
    id: "top-3",
    title: "Revise Theory of Computation, Unit 3",
    category: "exam",
    priority: "medium",
    status: "done",
    isTopPriorityToday: true,
    dueLabel: "Completed at 10:15 AM • Pushdown Automata",
  },
];

export const mockTimeBlocks: TimeBlock[] = [
  {
    id: "tb-1",
    startTime: "09:30",
    endTime: "10:30",
    title: "Study block: Discrete Mathematics",
    subtitle: "Review recurrence relations & generating functions",
    category: "personal",
    location: "Library 3F",
    completed: true,
  },
  {
    id: "tb-2",
    startTime: "11:00",
    endTime: "12:30",
    title: "Lecture: Computer Architecture",
    subtitle: "Pipelining hazards and branch prediction mechanisms",
    category: "assignment",
    location: "Hall B",
    completed: true,
  },
  {
    id: "tb-3",
    startTime: "14:00",
    endTime: "16:00",
    title: "Coding session: API & Auth",
    subtitle: "Team sync scheduled at 15:30 via Discord channel",
    category: "project",
    location: "CS Lab 2",
    completed: false,
  },
  {
    id: "tb-4",
    startTime: "18:00",
    endTime: "19:15",
    title: "Gym: Strength training",
    subtitle: "Upper body compound routine + mobility cooldown",
    category: "personal",
    location: "Recreation Ctr",
    completed: false,
  },
];

export const mockComingUp: ComingUpItem[] = [
  {
    id: "cu-fla",
    title: "FLA Chart Prep & Viva",
    type: "project",
    dueDate: "Tue, 27 Oct • Team Presentation",
    countdown: "5 days",
  },
  {
    id: "cu-bd",
    title: "Big Data Project Review",
    type: "assignment",
    dueDate: "Wed, 28 Oct • In Class",
    countdown: "6 days",
  },
  {
    id: "cu-dm-ft4",
    title: "Discrete Math FT-IV Exam",
    type: "exam",
    dueDate: "Mon, 02 Nov • Units 4 & 5",
    countdown: "11 days",
  },
  {
    id: "cu-llt",
    title: "LLT Assessment Exam",
    type: "exam",
    dueDate: "Tue, 03 Nov • LCT Lab",
    countdown: "12 days",
  },
];

export const mockCampusRoverProject: ProjectData = {
  id: "proj-1",
  slug: "final-year-project",
  title: "Autonomous Campus Rover",
  labTag: "Autonomous Systems Lab",
  courseTag: "CS499A • Capstone",
  description:
    "ROS2-driven navigation platform engineered for indoor multi-floor courier logistics, featuring real-time SLAM and low-power LiDAR telemetry.",
  deadline: "Dec 15, 2024",
  deadlineDaysLeft: 54,
  advisor: "Dr. Aris Thorne",
  teamCount: 3,
  progressPercent: 68,
  deliverablesDone: 17,
  deliverablesTotal: 25,
  inProgressCount: 4,
  dueThisWeekCount: 3,
  blockersCount: 0,
  currentStage: "navigation_stack",
  stages: [
    { id: "1", label: "Spec Review", status: "completed" },
    { id: "2", label: "Hardware Proto", status: "completed" },
    { id: "3", label: "Navigation Stack", status: "current" },
    { id: "4", label: "Final Defense", status: "upcoming" },
  ],
  columns: {
    todo: [
      {
        id: "task-todo-1",
        title: "Benchmark LiDAR SLAM in low-light corridors",
        category: "project",
        priority: "high",
        status: "todo",
        subtitle: "Quantify point cloud drift across basement tunnels...",
        dueDate: "Nov 4",
        tags: ["Hardware", "Testing"],
        assigneeInitials: "AI",
      },
      {
        id: "task-todo-2",
        title: "Draft ethics review section for dissertation",
        category: "project",
        priority: "medium",
        status: "todo",
        subtitle: "Detail autonomous bystander privacy protocols...",
        dueDate: "Nov 12",
        tags: ["Writing"],
        assigneeInitials: "TM",
      },
      {
        id: "task-todo-3",
        title: "Order backup LiPo battery pack",
        category: "project",
        priority: "low",
        status: "todo",
        dueDate: "Nov 15",
        tags: ["Procurement"],
        assigneeInitials: "AR",
      },
    ],
    doing: [
      {
        id: "task-doing-1",
        title: "Implement OAuth2 PKCE token refresh for base station",
        category: "project",
        priority: "high",
        status: "doing",
        dueDate: "Oct 25",
        subtasksCompleted: 3,
        subtasksTotal: 4,
        tags: ["Software", "API"],
        assigneeInitials: "ME",
      },
      {
        id: "task-doing-2",
        title: "Calibrate ultrasonic obstacle detection range",
        category: "project",
        priority: "medium",
        status: "doing",
        subtitle: "Perform acoustic echo profiling near glass partitions...",
        dueDate: "Oct 29",
        tags: ["Robotics"],
        assigneeInitials: "AL",
      },
      {
        id: "task-doing-3",
        title: "Fine tune path planner velocity curves",
        category: "project",
        priority: "medium",
        status: "doing",
        dueDate: "Oct 31",
        tags: ["Algorithm"],
        assigneeInitials: "TM",
      },
    ],
    done: [
      {
        id: "task-done-1",
        title: "Chassis 3D-printing & motor mount assembly",
        category: "project",
        priority: "medium",
        status: "done",
        subtitle: "Structural stress testing passed with 8.5kg payload.",
        dueDate: "DONE OCT 18",
        tags: ["Hardware"],
      },
      {
        id: "task-done-2",
        title: "Sensor-telemetry WebSocket bridge",
        category: "project",
        priority: "high",
        status: "done",
        subtitle: "60Hz latency sustained under 18ms over local mesh.",
        dueDate: "DONE OCT 14",
        tags: ["Backend"],
      },
      {
        id: "task-done-3",
        title: "Literature survey on ROS2 navigation packages",
        category: "project",
        priority: "low",
        status: "done",
        dueDate: "DONE OCT 02",
        tags: ["Research"],
      },
    ],
  },
  logs: [
    {
      id: "log-1",
      dateLabel: "Yesterday at 6:45 PM",
      timeAgo: "3.5 hrs logged",
      hoursLogged: 3.5,
      content:
        "Resolved motor controller PWM glitch. Tested steering servo angle mapping with Dr. Thorne. Next step is wiring the secondary battery bus.",
      tags: ["#hardware", "#debugging"],
    },
    {
      id: "log-2",
      dateLabel: "Monday, 19 Oct",
      timeAgo: "4.0 hrs logged",
      hoursLogged: 4.0,
      content:
        "Configured Ubuntu 22.04 LTS on Raspberry Pi 5. Flashed ROS2 Humble desktop build and verified camera pipeline via RTSP.",
      tags: ["#software", "#setup"],
    },
    {
      id: "log-3",
      dateLabel: "Friday, 16 Oct",
      timeAgo: "1.5 hrs logged",
      hoursLogged: 1.5,
      content:
        "Bi-weekly team sync: Divided midterm presentation slides and assigned benchmark simulations.",
      tags: ["#meeting"],
    },
  ],
};

export const mockPortfolioProject: ProjectData = {
  ...mockCampusRoverProject,
  id: "proj-2",
  slug: "portfolio-website",
  title: "Portfolio Website",
  labTag: "Personal Project",
  courseTag: "Design & Engineering",
  description: "Next.js + Tailwind modern academic and design portfolio showcasing engineering capstone and research papers.",
  deadline: "Nov 30, 2024",
  deadlineDaysLeft: 39,
  progressPercent: 85,
  deliverablesDone: 11,
  deliverablesTotal: 13,
};

export const mockHistoryDays: HistoryDay[] = [
  {
    id: "hist-1",
    dateString: "Wednesday, 21 October",
    relativeLabel: "Yesterday",
    tasksCompleted: 4,
    tasksTotal: 4,
    completionPercent: 100,
    deepWorkHours: 5.5,
    reflection:
      "Mastered Chomsky Normal Form; felt super locked in after afternoon coffee at the library. Group meeting ran crisp.",
    tasks: [
      {
        id: "ht-1",
        title: "Theory of Computation: CNF conversions",
        category: "exam",
        timeLabel: "9:00 AM",
        details: "2.0h Focus block",
      },
      {
        id: "ht-2",
        title: "System sync: Database sharding scheme",
        category: "project",
        timeLabel: "1:30 PM",
        details: "CS Seminar",
      },
      {
        id: "ht-3",
        title: "Submit Assignment 3 code artifact",
        category: "assignment",
        timeLabel: "4:30 PM",
        details: "GitHub Classroom",
      },
      {
        id: "ht-4",
        title: "Evening meditation & 5k run",
        category: "personal",
        timeLabel: "6:30 PM",
        details: "45m",
      },
    ],
    summary: {
      deepWorkHours: 4.5,
      lecturesAttended: 3,
      pagesLogged: 18,
    },
  },
  {
    id: "hist-2",
    dateString: "Tuesday, 20 October",
    relativeLabel: "2 days ago",
    tasksCompleted: 3,
    tasksTotal: 4,
    completionPercent: 75,
    deepWorkHours: 3.8,
    reflection:
      "Finished OAuth PKCE implementation with Alex. Took it easy in the evening to recharge before tomorrow's midterm prep.",
    tasks: [
      {
        id: "ht-5",
        title: "Pair programming: Auth microservice token refresh",
        category: "project",
        timeLabel: "10:00 AM",
        details: "2.5h pair session",
      },
      {
        id: "ht-6",
        title: "Operating Systems: Virtual memory notes",
        category: "exam",
        timeLabel: "2:00 PM",
        details: "Turing Hall 104",
      },
      {
        id: "ht-7",
        title: "Design System critique with Studio",
        category: "assignment",
        timeLabel: "4:00 PM",
        details: "Online call",
      },
      {
        id: "ht-8",
        title: "Draft portfolio case study: Plan HQ",
        category: "personal",
        timeLabel: "Intentionally deferred",
        details: "Moved to Thu 22",
      },
    ],
    summary: {
      deepWorkHours: 3.8,
      lecturesAttended: 2,
      pagesLogged: 12,
    },
  },
  {
    id: "hist-3",
    dateString: "Monday, 19 October",
    relativeLabel: "3 days ago",
    tasksCompleted: 5,
    tasksTotal: 5,
    completionPercent: 100,
    deepWorkHours: 5.0,
    reflection:
      "Tough lecture on pipelining hazards, but office hours cleared up branch prediction stalls. Feels great to have that conceptual foundation solidified.",
    tasks: [
      {
        id: "ht-9",
        title: "Comp Arch lecture: Super-scalar hazards",
        category: "exam",
        timeLabel: "9:30 AM",
        details: "Davis Center",
      },
      {
        id: "ht-10",
        title: "Prof. Vance Office Hours: Homework algorithm review",
        category: "project",
        timeLabel: "1:00 PM",
        details: "Faculty Tower 402",
      },
      {
        id: "ht-11",
        title: "Problem Set 4: Branch predictor simulations",
        category: "assignment",
        timeLabel: "4:00 PM",
        details: "PS4 Autograder submit",
      },
    ],
    summary: {
      deepWorkHours: 5.0,
      lecturesAttended: 3,
      pagesLogged: 24,
    },
  },
  {
    id: "hist-4",
    dateString: "Sunday, 18 October",
    relativeLabel: "Rest & Planning",
    tasksCompleted: 2,
    tasksTotal: 2,
    completionPercent: 100,
    deepWorkHours: 1.5,
    reflection:
      "Weekly planning done, read two chapters of OS architecture and went on a long run around the lake. Ready for the week.",
    tasks: [
      {
        id: "ht-12",
        title: "Term sprint calibration & calendar blocks",
        category: "personal",
        timeLabel: "11:00 AM",
        details: "Weekly reset",
      },
      {
        id: "ht-13",
        title: "Read Silberschatz OS: Ch 8-9-10",
        category: "exam",
        timeLabel: "3:00 PM",
        details: "Light reading",
      },
    ],
    summary: {
      deepWorkHours: 1.5,
      lecturesAttended: 0,
      pagesLogged: 45,
    },
  },
];
