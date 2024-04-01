// app/routes/auth.discord.callback.tsx
import type { LoaderFunction } from "@remix-run/node";
import { auth } from "@/auth.server";

export const loader: LoaderFunction = ({ request }) => {
  return auth.authenticate("discord", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};