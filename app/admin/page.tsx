import Link from "next/link";
import { getClients } from "@/lib/actions/clients";
import { NewClientForm } from "./NewClientForm";

export default async function AdminDashboard() {
  const clients = await getClients();

  return (
    <>
      <h1 className="admin-shell__title">Clientes</h1>

      <div className="admin-grid">
        <section className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td colSpan={3} className="admin-table__empty">
                    Todavía no hay clientes registrados.
                  </td>
                </tr>
              )}
              {clients.map((client) => (
                <tr key={client.id} className="admin-table__row">
                  <td>
                    <Link href={`/admin/clients/${client.id}`}>
                      {client.name}
                    </Link>
                  </td>
                  <td>{client.phone || "—"}</td>
                  <td>{client.email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-panel">
          <h2 className="admin-panel__title">Nuevo cliente</h2>
          <NewClientForm />
        </section>
      </div>
    </>
  );
}
