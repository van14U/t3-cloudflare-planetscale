import { revalidateTag } from "next/cache";
import { Suspense } from "react";
import {
  whyIsThisNotRevalidating,
  oldKeys,
} from "../_queries/cached";
import { CachedResults } from "../_components/cache-utils";

export const runtime = "edge";

function RevalidateButton(props: {
  tagKey: (typeof oldKeys)[keyof typeof oldKeys];
}) {
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
        Latency for key <Chip text={oldKeys.WhyIsThisNotRevalidating} />
      </h2>
      <Suspense fallback="Loading...">
        <CachedResults
          fn={whyIsThisNotRevalidating}
          revalidate={10}
        />
      </Suspense>
      <h2 className="mt-4 text-lg font-semibold">Revalidation</h2>
      <div className="flex gap-4">
        {Object.values(oldKeys).map((key) => (
          <RevalidateButton key={key} tagKey={key} />
        ))}
      </div>
    </main>
  );
}
