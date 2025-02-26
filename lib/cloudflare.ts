export async function createDNSRecord(subdomain: string, target: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
      },
      body: JSON.stringify({
        type: "CNAME",
        name: `${subdomain}.oxelta.io`,
        content: target,
        ttl: 3600,
        proxied: false
      })
    }
  );

  const data = await response.json();

  if (!data.success) {
    console.error("Erreur lors de la création de l'enregistrement DNS :", data.errors);
    throw new Error("Impossible de créer l'enregistrement DNS");
  }

  return data.result;
}
