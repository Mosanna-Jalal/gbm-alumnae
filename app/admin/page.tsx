import { AdminDashboard } from "./admin-dashboard";

export const metadata = {
  title: "Admin | GBM Alumni Association",
};

export default function AdminPage() {
  return (
    <main className="min-h-dvh bg-black">
      <AdminDashboard />
    </main>
  );
}
