// Where the site lives. On Vercel this follows the project's production
// domain automatically (so it becomes https://rythme.world as soon as that
// domain is connected); NEXT_PUBLIC_SITE_URL overrides it; locally it falls
// back to the domain itself.
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelProduction ? `https://${vercelProduction}` : "https://rythme.world")
).replace(/\/$/, "");

export const siteName = "rythme.world";
