import { revalidateTag, unstable_cache } from "next/cache";
import { Suspense } from "react";

export const runtime = "edge";

const keys = {
  "cf:time:inf": "cf:time:inf",
  "cf:time:20sec": "cf:time:20sec",
  "cf:slow-time:20sec": "cf:slow-time:20sec",
} as const;

const getCachedTimeInfinity = unstable_cache(
  () => Promise.resolve(new Date().toISOString()),
  [keys["cf:time:inf"]],
  {
    tags: [keys["cf:time:inf"]],
  },
);

const getCachedTime20sec = unstable_cache(
  () => Promise.resolve(new Date().toISOString()),
  [keys["cf:time:20sec"]],
  {
    tags: [keys["cf:time:20sec"]],
    revalidate: 20,
  },
);

const LATENCY = 200;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getCachedTime20secWithLatency = unstable_cache(
  () => sleep(LATENCY).then(() => new Date().toISOString()),
  [keys["cf:slow-time:20sec"]],
  {
    tags: [keys["cf:slow-time:20sec"]],
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
          Has additional simulated latency for
          <code className="ml-2 rounded-md border bg-gray-200 px-1 text-base">
            {LATENCY}ms
          </code>
        </li>
      )}
      <li>
        Revalidate for{" "}
        <code className="rounded-md border bg-gray-200 px-1">
          {props.revalidate ?? "undefined"}
        </code>
      </li>
      <li>
        Cache Access Latency{" "}
        <span className="rounded-md border bg-gray-200 px-1">{duration}ms</span>
      </li>
      <li>Value {time}</li>
      <li>EST Value {estTime}</li>
    </ul>
  );
}

export default () => {
  const now = new Date();
  return (
    <main className="mx-auto h-screen min-h-screen w-full max-w-5xl font-mono">
      <h1 className="pt-8 text-xl font-semibold">Cache latency test</h1>
      <p>
        Current time:{" "}
        {`${now.toISOString()} - EST ${now.toLocaleString("en-US", {
          timeZone: "America/New_York",
        })}`}
      </p>
      <h2 className="mt-4 text-xl font-semibold">Cache keys</h2>
      <ul className="list-disc pl-5">
        <li>
          <code className="mr-2 rounded-md border bg-gray-200 px-1">
            {keys["cf:time:inf"]}
          </code>
          revalidate time is undefined with no simulated latency
        </li>
        <li>
          <code className="mr-2 rounded-md border bg-gray-200 px-1">
            {keys["cf:time:20sec"]}
          </code>
          revalidates for 20 secods with no simulated latency
        </li>
        <li>
          <code className="mr-2 rounded-md border bg-gray-200 px-1">
            {keys["cf:slow-time:20sec"]}
          </code>
          revalidates for 20 secods with {LATENCY}ms simulated latency
        </li>
      </ul>
      <h3 className="mt-4 text-lg font-semibold">
        Latency for
        <code className="ml-2 mr-2 rounded-md border bg-gray-200 px-1 text-base">
          {keys["cf:time:inf"]}
        </code>
      </h3>
      <Suspense fallback="Calculating...">
        <CachedResults fn={getCachedTimeInfinity} />
      </Suspense>
      <h3 className="mt-4 text-lg font-semibold">
        Latency for
        <code className="ml-2 mr-2 rounded-md border bg-gray-200 px-1 text-base">
          {keys["cf:time:20sec"]}
        </code>
      </h3>
      <Suspense fallback="Calculating...">
        <CachedResults fn={getCachedTime20sec} revalidate={20} />
      </Suspense>
      <h3 className="mt-4 text-lg font-semibold">
        Latency for
        <code className="ml-2 mr-2 rounded-md border bg-gray-200 px-1 text-base">
          {keys["cf:slow-time:20sec"]}
        </code>
      </h3>
      <Suspense fallback="Calculating...">
        <CachedResults
          fn={getCachedTime20secWithLatency}
          revalidate={20}
          latency
        />
      </Suspense>
      <h3 className="mt-4 text-lg font-semibold">Revalidation</h3>
      <div className="flex gap-4">
        {Object.keys(keys).map((key) => (
          <RevalidateButton key={key} tagKey={key as keyof typeof keys} />
        ))}
      </div>
    </main>
  );
};
