"use client";
import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/payment/create-session", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };
  return <button disabled={loading}>{loading ? "Loading…" : "Buy now"}</button>;
}
