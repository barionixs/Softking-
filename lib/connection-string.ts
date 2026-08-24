export function cleanConnectionString(url: string) {
  const parsed = new URL(url);
  // The `postgres` package can't negotiate channel_binding; Neon-generated
  // connection strings include it, so strip it before connecting.
  parsed.searchParams.delete("channel_binding");
  return parsed.toString();
}
