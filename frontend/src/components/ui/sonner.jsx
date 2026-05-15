"use client"

import { Toaster as Sonner } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-500" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "#ffffff",
        "--normal-text": "#000000",
        "--normal-border": "transparent",
        "--border-radius": "var(--radius)",
      }}
      toastOptions={{
        classNames: {
          toast: "!shadow-md !shadow-gray-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster }