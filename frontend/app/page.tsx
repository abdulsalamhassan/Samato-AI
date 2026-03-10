import { AlertPanel } from "@/components/AlertPanel";
import { CrisisMapPlaceholder } from "@/components/CrisisMapPlaceholder";
import { CrisisRanking } from "@/components/CrisisRanking";
import { Header } from "@/components/Header";
import { SMSPreview } from "@/components/SMSPreview";
import { StatStrip } from "@/components/StatStrip";
import { WaterFinder } from "@/components/WaterFinder";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <Header />
      <StatStrip />
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <CrisisMapPlaceholder />
        <CrisisRanking />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AlertPanel />
        <WaterFinder />
        <SMSPreview />
      </div>
    </main>
  );
}
