import { Suspense } from "react";
import { keys, getCachedTime10secWithLatency } from "../_queries/cached";
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
          Latency for key <Chip text={keys.Reval10SecWithLatency} />
        </h2>
        <Suspense fallback="loading...">
          <CachedResults
            fn={getCachedTime10secWithLatency}
            revalidate={10}
            latency
          />
        </Suspense>
      </>
      <h2 className="mt-4 text-lg font-semibold">Revalidation</h2>
      <div className="flex gap-4">
        {Object.values(keys)
          .filter((k) => k === "tag:withLatency:time:10sec")
          .map((key) => (
            <RevalidateButton key={key} tagKey={key} />
          ))}
      </div>
    </main>
  );
}
