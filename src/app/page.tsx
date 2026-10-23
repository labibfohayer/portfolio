import StudioRoom3D from "@/components/room/StudioRoom3D";
import CommandPalette from "@/components/CommandPalette";
import PageTracker from "@/components/PageTracker";

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#06080d] text-white select-none">
      <PageTracker />
      <CommandPalette />
      <StudioRoom3D />
    </main>
  );
}
