import { useEffect, useState } from "react";
import { getProfile } from "../services/user.service";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getProfile()
      .then((data) => {
        if (mounted) setProfile(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { profile, loading };
}
