import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NexusLogo } from "@/components/NexusLogo";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl rounded-[36px] border border-white/10 bg-[#0b1016] p-8 shadow-[0_35px_120px_rgba(103,80,200,0.2)]">
        <div className="mb-8 flex items-center justify-center">
          <NexusLogo theme="dark" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Profile</p>
                <h1 className="mt-2 text-3xl font-black">{session.user?.name ?? "NEXUS Creator"}</h1>
              </div>
              <button className="rounded-full border border-sky-400/60 px-4 py-2 text-sm font-bold text-sky-300">Edit</button>
            </div>

            <div className="flex items-center gap-5">
              <img src={session.user?.image ?? "https://i.pravatar.cc/150?img=68"} className="h-20 w-20 rounded-full border-4 border-white/10 object-cover" alt="Profile avatar" />
              <div>
                <div className="text-lg font-bold">@{(session.user?.email ?? "nexus").split("@")[0]}</div>
                <div className="text-sm text-slate-400">Creative strategist · digital builder</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#121a25] p-4">
                <div className="text-2xl font-black">248</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Followers</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#121a25] p-4">
                <div className="text-2xl font-black">118</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Following</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#121a25] p-4">
                <div className="text-2xl font-black">39</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Posts</div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#0e1620] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-pink-300">Upload polish</p>
            <h2 className="mt-3 text-2xl font-black">Ready to personalize</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-dashed border-sky-400/50 bg-sky-500/5 p-4 text-sm text-slate-200">
                Upload profile avatar
              </div>
              <div className="rounded-2xl border border-dashed border-pink-400/50 bg-pink-500/5 p-4 text-sm text-slate-200">
                Upload cover photo
              </div>
              <div className="rounded-2xl border border-dashed border-violet-400/50 bg-violet-500/5 p-4 text-sm text-slate-200">
                Upload brand-inspired face mask
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
