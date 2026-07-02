import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/lib/api";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 60_000,
  });

  return {
    ...query,
    settings: query.data ?? DEFAULT_SITE_SETTINGS,
  };
}
