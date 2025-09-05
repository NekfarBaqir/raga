"use client";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/token")
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          setToken(data.accessToken);
          console.log("Access Token (browser):", data.accessToken);
        } else {
          console.error("Failed to get token:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return <div className="text-black">Token: {token}</div>;
}
