"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Sparkles, Trophy, Clock, CheckCircle2, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const weeklyVelocityData = [
  { week: "W1", focusHours: 18, tasks: 22 },
  { week: "W2", focusHours: 24, tasks: 26 },
  { week: "W3", focusHours: 20, tasks: 19 },
  { week: "W4", focusHours: 28, tasks: 31 },
  { week: "W5", focusHours: 26, tasks: 28 },
  { week: "W6", focusHours: 29, tasks: 34 },
];

const courseTimeData = [
  { course: "Capstone", hours: 42, fill: "var(--primary)" },
  { course: "DBMS", hours: 28, fill: "var(--secondary)" },
  { course: "Theory Comp", hours: 26, fill: "var(--exam)" },
  { course: "Architecture", hours: 24, fill: "var(--tertiary)" },
  { course: "Discrete Math", hours: 22, fill: "var(--personal)" },
];

export default function InsightsPage() {
  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
          <span>Term Analytics &amp; Velocity</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Academic Insights
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Autumn Term 2024 • Weeks 1 to 6 focus distribution and cognitive load
        </p>
      </header>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Term GPA Pacing
            </span>
            <Trophy className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            3.84
          </span>
          <span className="text-[11px] text-[var(--personal)] font-medium">
            +0.12 vs Spring Term
          </span>
        </Card>

        <Card className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Total Deep Work
            </span>
            <Clock className="h-4 w-4 text-[var(--secondary)]" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            147.5h
          </span>
          <span className="text-[11px] text-[var(--secondary)] font-medium">
            Avg 24.5h / week
          </span>
        </Card>

        <Card className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Deliverables Closed
            </span>
            <CheckCircle2 className="h-4 w-4 text-[var(--exam)]" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            160
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            88% completion rate
          </span>
        </Card>

        <Card className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Lecture Attendance
            </span>
            <BookOpen className="h-4 w-4 text-[var(--personal)]" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            94%
          </span>
          <span className="text-[11px] text-[var(--personal)] font-medium">
            32 of 34 lectures
          </span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Focus & Velocity Line Chart (7 cols) */}
        <Card className="lg:col-span-7 p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Weekly Focus Volume &amp; Velocity
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Recorded deep-work hours vs completed assignments
              </p>
            </div>
            <Badge variant="default" className="text-[10px]">
              Autumn Term
            </Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyVelocityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="focusHours"
                  name="Focus Hours"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--primary)" }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  name="Tasks Done"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--secondary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Course Time Allocation Bar Chart (5 cols) */}
        <Card className="lg:col-span-5 p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Focus by Course Module
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Cumulative hours across term
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="course"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="hours" name="Hours Logged" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
