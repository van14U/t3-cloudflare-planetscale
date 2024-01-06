import { Suspense } from "react";
import { whyIsThisNotRevalidating, oldKeys } from "../_queries/cached";
import {
  CachedResults,
  Chip,
  RevalidateButton,
} from "../_components/cache-utils";

export const runtime = "edge";

export default function IsBugged() {
  const now = new Date();
  return (
    <main className="mx-auto h-screen min-h-screen w-full max-w-5xl font-mono">
      <h1 className="pt-8 text-xl font-semibold">Cache tests</h1>
      <p>
        Current time:{" "}
        {`EST ${now.toLocaleString("en-US", {
          timeZone: "America/New_York",
        })}`}
      </p>
      <>
        <h2 className="mt-4 text-lg font-semibold">
          Latency for key <Chip text={oldKeys.WhyIsThisNotRevalidating} />
        </h2>
        <Suspense fallback="Loading...">
          <CachedResults fn={whyIsThisNotRevalidating} revalidate={10} />
        </Suspense>
      </>
      <h2 className="mt-4 text-lg font-semibold">Revalidation</h2>
      <div className="flex gap-4">
        {Object.values(oldKeys).map((key) => (
          <RevalidateButton key={key} tagKey={key} />
        ))}
      </div>
    </main>
  );
}
