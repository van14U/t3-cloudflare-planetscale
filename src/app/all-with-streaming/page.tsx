import {
  getCachedTime10secReval,
  getCachedTime20secReval,
  getCachedTime10secWithLatency,
  getCachedTime20secWithLatency,
  getCachedTimeNoReval,
  keys,
} from "../_queries/cached";
import { Suspense } from "react";
import {
  CachedResults,
  Chip,
  RevalidateButton,
} from "../_components/cache-utils";

export const runtime = "edge";

export default function All() {
  const now = new Date();
  return (
    <main className="mx-auto h-screen min-h-screen w-full max-w-5xl font-mono">
      <h1 className="pt-8 text-xl font-semibold">Cache tests with streaming</h1>
      <p>
        Current time:{" "}
        {`EST ${now.toLocaleString("en-US", {
          timeZone: "America/New_York",
        })}`}
      </p>
      <>
        <h2 className="mt-4 text-lg font-semibold">
          Latency for key <Chip text={keys.NoReval} />
        </h2>
        <CachedResults fn={getCachedTimeNoReval} />
      </>
      <>
        <h2 className="mt-4 text-lg font-semibold">
          Latency for key <Chip text={keys.Reval10Sec} />
        </h2>
        <CachedResults fn={getCachedTime10secReval} revalidate={10} />
      </>
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
      <>
        <h2 className="mt-4 text-lg font-semibold">
          Latency for key <Chip text={keys.Reval20Sec} />
        </h2>
        <CachedResults fn={getCachedTime20secReval} revalidate={20} />
      </>
      <>
        <h2 className="mt-4 text-lg font-semibold">
          Latency for key <Chip text={keys.Reval20SecWithLatency} />
        </h2>
        <Suspense fallback="loading...">
          <CachedResults
            fn={getCachedTime20secWithLatency}
            revalidate={20}
            latency
          />
        </Suspense>
      </>
      <h2 className="mt-4 text-lg font-semibold">Revalidation</h2>
      <p>revalidateTag</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(keys).map((key) => (
          <RevalidateButton key={key} tagKey={key} />
        ))}
      </div>
    </main>
  );
}
