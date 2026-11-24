import { Suspense } from "react";
import { notFound } from "next/navigation";
import StationClient from "./station-client";

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default function StationPage({
  params,
}: PageProps<"/estacion/[id]">) {
  return (
    <Suspense
      fallback={
        <main className="page-shell station-shell">
          <section className="station-card panel">
            <p className="muted">Preparando el reto...</p>
          </section>
        </main>
      }
    >
      <StationContent params={params} />
    </Suspense>
  );
}

async function StationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stationId = Number(id);

  if (!Number.isInteger(stationId) || stationId < 1 || stationId > 10 || String(stationId) !== id) {
    notFound();
  }

  return <StationClient stationId={stationId} />;
}
