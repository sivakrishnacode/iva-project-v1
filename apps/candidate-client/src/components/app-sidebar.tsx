"use client";

import * as React from "react";
import {
  AudioWaveform,
  CalendarClock,
  ClipboardCheck,
  Command,
  Cpu,
  GalleryVerticalEnd,
  Users,
  Workflow,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  user: {
    name: `${localStorage.getItem("candidateName")}`,
    email: `${localStorage.getItem("candidateEmail")}`,
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
          title: "Candidate Details",
          url: "/dashboard/details",
        },
      ],
    },
    {
      title: "Interviews",
      url: "#",
      icon: CalendarClock,
      isActive: true,
      items: [
        {
          title: "Available Interviews",
          url: "/dashboard/available-interviews",
        },
        {
          title: "Result",
          url: "/dashboard/results",
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
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}

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
