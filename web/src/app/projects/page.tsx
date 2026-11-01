import type { Metadata } from "next";
import { ProjectsView } from "@/components/site/pages";

export const metadata: Metadata = { title: "Work", description: "Brand identities, print and video by Jawad Khamaysa." };

export default function ProjectsPage() {
  return <ProjectsView />;
}
