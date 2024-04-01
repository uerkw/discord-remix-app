// app/routes/auth.discord.tsx
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { auth } from "@/auth.server";

export const loader: LoaderFunction = () => redirect("/login");

export const action: ActionFunction = ({ request }) => {
  return auth.authenticate("discord", request);
};