// app/routes/dashboard.tsx
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { auth } from "@/auth.server";
import type { DiscordUser } from "@/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export default function DashboardPage() {
  const user = useLoaderData<DiscordUser>();
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {user.displayName}</h2>
    </div>
  );
}