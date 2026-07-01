import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardContent } from "@/components/admin/DashboardContent";
import { fetchInquiries, fetchProperties } from "@/lib/properties";

export const Route = createFileRoute("/admin_page/")({
  loader: async () => {
    const [recentProperties, recentInquiries] = await Promise.all([
      fetchProperties({ sort: "recent" }),
      fetchInquiries(),
    ]);
    return { recentProperties, recentInquiries };
  },
  staleTime: 60_000,
  head: () => ({
    meta: [{ title: "Dashboard — Lótus Imóveis Admin" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { recentProperties, recentInquiries } = Route.useLoaderData();

  return (
    <>
      <AdminHeader />
      <main className="flex-1 px-4 py-6 lg:px-6">
        <DashboardContent recentProperties={recentProperties} recentInquiries={recentInquiries} />
      </main>
    </>
  );
}
