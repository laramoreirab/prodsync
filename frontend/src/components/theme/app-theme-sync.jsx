"use client"

import { useEffect } from "react"

const THEME_STORAGE_KEY = "prodsync-theme"

function applyStoredTheme() {
  const isDark = window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
  document.documentElement.classList.toggle("dark", isDark)
}

export default function AppThemeSync() {
  useEffect(() => {
    applyStoredTheme()

    window.addEventListener("storage", applyStoredTheme)

    return () => {
      window.removeEventListener("storage", applyStoredTheme)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return null
}
