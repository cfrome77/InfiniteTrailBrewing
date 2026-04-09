import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Logout() {
  (await cookies()).set({
    name: "admin_token",
    value: "",
    path: "/",
    maxAge: 0,
  });
  redirect("/login");
}