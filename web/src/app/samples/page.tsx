import type { Metadata } from "next";
import { SamplesView } from "@/components/site/pages";

export const metadata: Metadata = { title: "Voice", description: "Arabic voice over samples by Jawad Khamaysa. Commercials and narration." };

export default function SamplesPage() {
  return <SamplesView />;
}
