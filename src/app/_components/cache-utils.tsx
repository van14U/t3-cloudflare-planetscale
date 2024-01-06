import { revalidateTag } from "next/cache";
import { LATENCY } from "../_queries/cached";

export function RevalidateButton(props: { tagKey: string }) {
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

export function Chip(props: { text: string }) {
  return (
    <span className="rounded-md border border-zinc-600 bg-zinc-800 px-2 text-base text-white">
      {props.text}
    </span>
  );
}

export async function CachedResults(props: {
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

