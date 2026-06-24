import { createServerFn } from "@tanstack/react-start";

/**
 * Maps marketplace category ids to Pexels search queries that produce
 * polished, premium-looking cover photography.
 */
const CATEGORY_QUERIES: Record<string, string> = {
  software: "software technology workspace",
  education: "online learning study",
  resources: "design creative desk",
  books: "books reading library",
  services: "business professional team",
  all: "digital technology abstract",
};

export interface PremiumImages {
  /** category id -> list of high-quality image URLs */
  byCategory: Record<string, string[]>;
}

/**
 * Fetches curated premium cover images from Pexels (server-side, key stays
 * secret) for each marketplace category. Used as the marketplace fallback
 * instead of random placeholder images.
 */
export const getPremiumImages = createServerFn({ method: "GET" }).handler(
  async (): Promise<PremiumImages> => {
    const apiKey = process.env.PEXELS_API_KEY;
    const byCategory: Record<string, string[]> = {};
    if (!apiKey) return { byCategory };

    await Promise.all(
      Object.entries(CATEGORY_QUERIES).map(async ([cat, query]) => {
        try {
          const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(
              query,
            )}&per_page=12&orientation=landscape`,
            { headers: { Authorization: apiKey } },
          );
          if (!res.ok) return;
          const json = (await res.json()) as {
            photos?: { src?: { large?: string; landscape?: string } }[];
          };
          byCategory[cat] = (json.photos ?? [])
            .map((p) => p.src?.landscape ?? p.src?.large)
            .filter((u): u is string => Boolean(u));
        } catch {
          // network/quota error — leave this category without premium images
        }
      }),
    );

    return { byCategory };
  },
);
