import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "gradient";
	size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "default", ...props }, ref) => {
		return (
			<button
				className={cn(
					"inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
					{
						"bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md focus-visible:ring-indigo-500":
							variant === "default",
						"bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md focus-visible:ring-red-500":
							variant === "destructive",
						"border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm":
							variant === "outline",
						"bg-gray-100 text-gray-900 hover:bg-gray-200":
							variant === "secondary",
						"text-gray-600 hover:bg-gray-100 hover:text-gray-900":
							variant === "ghost",
						"bg-linear-to-l from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg":
							variant === "gradient",
						"h-10 px-5 py-2 text-sm": size === "default",
						"h-9 rounded-lg px-3.5 text-xs": size === "sm",
						"h-11 rounded-xl px-8 text-base": size === "lg",
						"h-10 w-10 rounded-xl": size === "icon",
					},
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button };
