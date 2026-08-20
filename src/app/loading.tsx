"use client";
import { useEffect } from "react";
import Loader from "@/components/layouts/Loader";

export default function Loading() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="w-full flex h-screen items-center justify-center">
      <Loader />
    </div>
  );
}
