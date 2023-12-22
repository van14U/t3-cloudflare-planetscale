import { api } from "@/trpc/server";
import { revalidateTag } from "next/cache";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import { api } from "@/trpc/react";

async function addPost(data: FormData) {
  "use server"
  const title = data.get("title") as string;
  // console.log("title", title);
  await api.post.create.mutate({ name: title });
  revalidateTag("global:post.getLatest");
}

export function CreatePost() {
  // const router = useRouter();
  // const [name, setName] = useState("");

  // const createPost = api.post.create.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //     setName("");
  //   },
  // });

  return (
    <form
      // onSubmit={(e) => {
      //   e.preventDefault();
      //   createPost.mutate({ name });
      // }}
      action={addPost}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        name="title"
        // value={name}
        // onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        // disabled={createPost.isLoading}
      >
        Submit
        {/* {createPost.isLoading ? "Submitting..." : "Submit"} */}
      </button>
    </form>
  );
}
