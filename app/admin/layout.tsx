import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";
import "./admin.css";

export const metadata = {
  title: "Panel | SoftKing",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="container admin-shell__header-inner">
          <Link href="/admin" className="admin-shell__brand">
            SoftKing <span>Panel</span>
          </Link>
          <nav className="admin-shell__nav">
            <Link href="/admin">Clientes</Link>
            <Link href="/admin/reportes">Reportes</Link>
          </nav>
          <div className="admin-shell__user">
            <span>{session.username}</span>
            <form action={logout}>
              <button className="btn btn--ghost" type="submit">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container admin-shell__main">{children}</main>
    </div>
  );
}
