import type { ProfileDetailResponse } from "@/types";
import { getSearchData, PLATFORMS } from "./dataHelpers";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  // Fallback to search data summary if detailed profile doesn't exist
  for (const platform of PLATFORMS) {
    const searchData = getSearchData(platform);
    const account = searchData.accounts.find((a) => {
      const p = a.account.user_profile;
      const u = p.username || p.handle || p.user_id || "";
      return u.toLowerCase() === username.toLowerCase();
    });
    if (account) {
      const p = account.account.user_profile;
      return {
        data: {
          success: true,
          user_profile: {
            ...p,
            username: p.username || p.handle || p.user_id || ""
          }
        }
      };
    }
  }

  return null;
}
