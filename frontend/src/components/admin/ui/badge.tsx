import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
	size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = "default", size = "sm", ...props }, ref) => {
		return (
			<span
				ref={ref}
				className={cn(
					"inline-flex items-center font-medium rounded-full transition-colors",
					{
						"bg-gray-100 text-gray-700": variant === "default",
						"bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200":
							variant === "success",
						"bg-amber-50 text-amber-700 ring-1 ring-amber-200":
							variant === "warning",
						"bg-red-50 text-red-700 ring-1 ring-red-200":
							variant === "error",
						"bg-blue-50 text-blue-700 ring-1 ring-blue-200":
							variant === "info",
						"border border-gray-200 text-gray-600 bg-white":
							variant === "outline",
						"px-2 py-0.5 text-[11px]": size === "sm",
						"px-2.5 py-1 text-xs": size === "md",
					},
					className,
				)}
				{...props}
			/>
		);
	},
);
Badge.displayName = "Badge";

export { Badge };
