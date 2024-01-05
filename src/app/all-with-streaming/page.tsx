// import { CachedResults, Chip, RevalidateButton } from "@/components";
import {
  getCachedTime10secReval,
  getCachedTime20secReval,
  getCachedTime10secWithLatency,
  getCachedTime20secWithLatency,
  getCachedTimeNoReval,
  keys,
  type KeyValue,
  LATENCY
} from "../_queries/cached";
import { Suspense } from "react";
import { revalidateTag } from "next/cache";

export const runtime = "edge";

function RevalidateButton(props: { tagKey: KeyValue }) {
  async function testRevalidation() {
    "use server";
    revalidateTag(props.tagKey);
  }
  return (
    <form action={testRevalidation}>
      <button className="rounded-md h-8 border border-zinc-700 bg-zinc-900 px-2 text-base text-white shadow-sm hover:bg-zinc-800">
        {props.tagKey}
      </button>
    </form>
  );
}

function Chip(props: { text: string }) {
  return (
    <span className="rounded-md border border-zinc-600 bg-zinc-800 px-2 text-base text-white">
      {props.text}
    </span>
  );
}

async function CachedResults(props: {
  fn: () => Promise<string>;
  revalidate?: number;
  latency?: boolean;
}) {
  const start = Date.now();
  const time = await props.fn();
  const duration = Date.now() - start;
  const estTime = new Date(time).toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  return (
    <ul className="list-disc pl-5">
      {props.latency && (
        <li>
          Has additional simulated latency for{" "}
          <Chip text={`${LATENCY}ms`} />
        </li>
      )}
      <li>
        Revalidate for{" "}
        <Chip text={props.revalidate ? `${props.revalidate}sec` : "undefined"} />
      </li>
      <li>
        Cache Access Latency{" "}
        <Chip text={`${duration}ms`} />
      </li>
      <li>EST Value {estTime}</li>
    </ul>
  );
}


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
          <CachedResults fn={getCachedTime10secWithLatency} revalidate={10} latency />
        </Suspense>
      </>
      <>
        <h2 className="mt-4 text-lg font-semibold">
          Latency for key <Chip text={keys.Reval20Sec} />
        </h2>
        <CachedResults
          fn={getCachedTime20secReval}
          revalidate={20}
        />
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
      <div className="grid gap-2 grid-cols-2">
        {Object.values(keys).map((key) => (
          <RevalidateButton key={key} tagKey={key} />
        ))}
      </div>
    </main>
  );
}

