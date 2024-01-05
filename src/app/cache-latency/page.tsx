import { revalidateTag, unstable_cache } from 'next/cache';
import { Suspense } from 'react';

export const runtime = "edge";

const keys = {
  NoReval: "time:undefined",
  Reval10Sec: "time:10sec",
  Reval20SecWithLatency: "latency:time:20sec",
} as const;

const LATENCY = 200;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getCachedTimeNoReval = unstable_cache(
  () => Promise.resolve(new Date().toISOString()),
  [keys.NoReval],
  {
    tags: [keys.NoReval],
  },
);

const getCachedTime10secReval = unstable_cache(
  () => Promise.resolve(new Date().toISOString()),
  [keys.Reval10Sec],
  {
    tags: [keys.Reval10Sec],
    revalidate: 10,
  },
);

const getCachedTime20secWithLatency = unstable_cache(
  () => wait(LATENCY).then(() => new Date().toISOString()),
  [keys.Reval20SecWithLatency],
  {
    tags: [keys.Reval20SecWithLatency],
    revalidate: 20,
  },
);

function RevalidateButton(props: { tagKey: keyof typeof keys }) {
  async function testRevalidation() {
    "use server";
    revalidateTag(props.tagKey);
  }
  return (
    <form action={testRevalidation}>
      <button className="rounded-md border border-zinc-700 bg-zinc-900 px-2 text-base text-white shadow-sm hover:bg-zinc-800">
        Revalidate {props.tagKey}
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

export default function Home() {
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
      <h2 className="mt-4 text-lg font-semibold">
        Latency for key{" "}
        <Chip text={keys.NoReval} />
      </h2>
      <Suspense fallback="Loading...">
        <CachedResults fn={getCachedTimeNoReval} />
      </Suspense>
      <h2 className="mt-4 text-lg font-semibold">
        Latency for key{" "}
        <Chip text={keys.Reval10Sec} />
      </h2>
      <Suspense fallback="Loading...">
        <CachedResults fn={getCachedTime10secReval} revalidate={10} />
      </Suspense>
      <h2 className="mt-4 text-lg font-semibold">
        Latency for key{" "}
        <Chip text={keys.Reval20SecWithLatency} />
      </h2>
      <Suspense fallback="Loading...">
        <CachedResults
          fn={getCachedTime20secWithLatency}
          revalidate={20}
          latency
        />
      </Suspense>
      <h2 className="mt-4 text-lg font-semibold">Revalidation</h2>
      <div className="flex gap-4">
        {Object.values(keys).map((key) => (
          <RevalidateButton key={key} tagKey={key as keyof typeof keys} />
        ))}
      </div>
    </main>
  );
}

