import { pgTable, text, timestamp, boolean, integer, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const eventTypeEnum = pgEnum("event_type", ["exam", "assignment", "project", "personal"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "doing", "done"]);
export const projectStageEnum = pgEnum("project_stage", [
  "spec_review",
  "hardware_proto",
  "navigation_stack",
  "final_defense",
]);

// Profiles (linked to auth.users)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  currentTerm: text("current_term").default("Autumn Term"),
  currentWeek: integer("current_week").default(6),
  totalWeeks: integer("total_weeks").default(14),
  wifiNetwork: text("wifi_network").default("Eduroam 5GHz"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Courses
export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  code: text("code").notNull(), // e.g. "CS499A"
  name: text("name").notNull(), // e.g. "Theory of Computation"
  color: text("color").notNull().default("#5E5CE6"),
  instructor: text("instructor"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Projects
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(), // e.g. "Autonomous Campus Rover"
  slug: text("slug").notNull(), // e.g. "final-year-project"
  labTag: text("lab_tag"), // e.g. "Autonomous Systems Lab"
  courseTag: text("course_tag"), // e.g. "CS499A • Capstone"
  description: text("description"),
  deadline: timestamp("deadline", { withTimezone: true }),
  advisor: text("advisor"), // e.g. "Dr. Aris Thorne"
  teamSize: integer("team_size").default(3),
  currentStage: projectStageEnum("current_stage").default("navigation_stack"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Tasks (Rollover enabled, Top 3 priority support, Kanban status, Subtasks)
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "set null" }),
  parentTaskId: uuid("parent_task_id"), // For subtasks
  title: text("title").notNull(),
  description: text("description"),
  category: eventTypeEnum("category").notNull().default("personal"),
  priority: priorityEnum("priority").notNull().default("medium"),
  status: taskStatusEnum("status").notNull().default("todo"),
  isTopPriorityToday: boolean("is_top_priority_today").default(false).notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  rolledOverFrom: timestamp("rolled_over_from", { withTimezone: true }),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Calendar Events & Scheduled Assessments
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  type: eventTypeEnum("type").notNull(), // exam, assignment, project, personal
  location: text("location"), // e.g. "Turing Hall B (Floor 3)"
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  weight: integer("weight"), // e.g. 30 (for 30% of course grade)
  topics: text("topics").array(), // e.g. ["Virtual Memory", "Semaphores", "Scheduling"]
  isMidtermOrFinal: boolean("is_midterm_or_final").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Time Blocks for Today's Schedule Timeline
export const timeBlocks = pgTable("time_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  category: eventTypeEnum("category").notNull(),
  location: text("location"), // e.g. "Library 3F", "Hall B"
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Daily Check-ins / Reflections (History & One-line Journal)
export const dailyLogs = pgTable("daily_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  date: text("date").notNull(), // 'YYYY-MM-DD'
  reflection: text("reflection"),
  focusHours: integer("focus_hours").default(0), // in tenths of hour or minutes
  tasksPlanned: integer("tasks_planned").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  lecturesAttended: integer("lectures_attended").default(0),
  pagesLogged: integer("pages_logged").default(0),
  consistencyScore: integer("consistency_score").default(0), // percentage
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Project Logs (Engineering Lab Notebook)
export const projectLogs = pgTable("project_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  hoursLogged: integer("hours_logged").default(0), // in minutes
  tags: text("tags").array(), // ['#hardware', '#code', '#meeting']
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Table relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  courses: many(courses),
  projects: many(projects),
  tasks: many(tasks),
  events: many(events),
  dailyLogs: many(dailyLogs),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(profiles, {
    fields: [projects.userId],
    references: [profiles.id],
  }),
  tasks: many(tasks),
  logs: many(projectLogs),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(profiles, {
    fields: [tasks.userId],
    references: [profiles.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  course: one(courses, {
    fields: [tasks.courseId],
    references: [courses.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
    relationName: "subtasks",
  }),
  subtasks: many(tasks, { relationName: "subtasks" }),
}));
