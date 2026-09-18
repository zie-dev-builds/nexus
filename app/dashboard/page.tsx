import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NexusDashboard } from "@/components/NexusDashboard";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <NexusDashboard />;
}
