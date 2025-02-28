"use client";

import * as React from "react";
import {
  AudioWaveform,
  CalendarClock,
  ClipboardCheck,
  Command,
  Cpu,
  GalleryVerticalEnd,
  LayoutDashboard,
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
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Analytics",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Candidates",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Add Candidates",
          url: "/dashboard/new-candidate",
        },
        {
          title: "All Candidates",
          url: "/dashboard/all-candidates",
        },
        {
          title: "Shortlisted",
          url: "#",
        },
        {
          title: "Rejected",
          url: "#",
        },
      ],
    },
    {
      title: "Interviews",
      url: "#",
      icon: CalendarClock,
      items: [
        {
          title: "Scheduled",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        },
        {
          title: "Pending",
          url: "#",
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
