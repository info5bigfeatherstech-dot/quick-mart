"use client";
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group font-sans"
      icons={{
        success: <CircleCheck className="h-4 w-4 text-emerald-600 shrink-0" />,
        info: <Info className="h-4 w-4 text-primary shrink-0" />,
        warning: <TriangleAlert className="h-4 w-4 text-amber-500 shrink-0" />,
        error: <OctagonX className="h-4 w-4 text-destructive shrink-0" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin text-primary shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:font-sans group-[.toaster]:text-xs group-[.toaster]:p-3.5 group-[.toaster]:border",
          title: "text-xs font-semibold text-foreground",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs font-semibold rounded-xl px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-foreground text-xs rounded-xl px-3 py-1.5",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:border-border group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }
