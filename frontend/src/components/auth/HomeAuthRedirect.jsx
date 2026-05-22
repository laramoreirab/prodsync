"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHomePathByUserType, getUserFromToken } from "@/lib/auth";

export default function HomeAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();
    const homePath = getHomePathByUserType(user?.tipo);

    if (homePath) {
      router.replace(homePath);
    }
  }, [router]);

  return null;
}
