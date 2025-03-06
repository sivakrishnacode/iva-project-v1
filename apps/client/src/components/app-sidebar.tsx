"use client";

import * as React from "react";
import {
  AudioWaveform,
  CalendarClock,
  ClipboardCheck,
  Command,
  Cpu,
  GalleryVerticalEnd,
  Settings2,
  Users,
  Workflow,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
  user: {
    name: "Dhivya Prabha",
    email: "test@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "HR 1",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "HR 2",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "HR 3",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Candidates",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Add Candidate",
          url: "/dashboard/new-candidate",
        },
        {
          title: "All Candidates",
          url: "/dashboard/all-candidates",
        },
        {
          title: "Shortlisted",
          url: "/dashboard/shortlisted",
        },
        {
          title: "Rejected",
          url: "/dashboard/rejected",
        },
      ],
    },
    {
      title: "Interviews",
      url: "#",
      icon: CalendarClock,
      items: [
        {
          title: "All Interviews",
          url: "/dashboard/interviews",
        },
        {
          title: "Interview Result",
          url: "/dashboard/interviews/result",
        },
        {
          title: "Completed",
          url: "/dashboard/interviews/completed",
        },
        {
          title: "Pending",
          url: "/dashboard/interviews/pending",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Interview Config",
          url: "#",
        },
        {
          title: "AI Models",
          url: "#",
        },
        {
          title: "Access Control",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "AI Interview Model",
      url: "#",
      icon: Cpu,
    },
    {
      name: "HR Automation",
      url: "#",
      icon: Workflow,
    },
    {
      name: "Candidate Evaluation",
      url: "#",
      icon: ClipboardCheck,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* header */}
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      {/* list content */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      {/* profile */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
