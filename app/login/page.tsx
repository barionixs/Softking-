import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { LoginForm } from "./LoginForm";
import "../admin/admin.css";

export const metadata = {
  title: "Iniciar sesión | SoftKing",
};

export default async function LoginPage() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (session?.userId) {
    redirect("/admin");
  }

  return (
    <section className="admin-login">
      <div className="container admin-login__container">
        <div className="admin-login__card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="admin-login__logo" src="/img/logo-softking.png" alt="SoftKing" />
          <h1 className="admin-login__title">Panel privado</h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
