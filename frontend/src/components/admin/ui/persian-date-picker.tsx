"use client";

import * as React from "react";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, TextFieldProps } from "@mui/material";
import { cn } from "@/lib/utils";

export interface PersianDatePickerProps {
	label?: string;
	value: string | null; // ISO date string or null
	onChange: (value: string | null) => void; // Returns ISO date string or null
	fullWidth?: boolean;
	size?: "small" | "medium";
	error?: boolean;
	helperText?: string;
	disabled?: boolean;
	className?: string;
	placeholder?: string;
}

export const PersianDatePicker = React.forwardRef<
	HTMLDivElement,
	PersianDatePickerProps
>(
	(
		{
			label,
			value,
			onChange,
			fullWidth = false,
			size = "small",
			error = false,
			helperText,
			disabled = false,
			className,
			placeholder,
		},
		ref
	) => {
		// Convert ISO string to Date object for the picker
		const dateValue = value ? new Date(value) : null;

		// Handle date change and convert back to ISO string
		const handleChange = (newValue: Date | null) => {
			if (newValue && !isNaN(newValue.getTime())) {
				// Valid date - convert to ISO string
				onChange(newValue.toISOString().split("T")[0]);
			} else {
				// Invalid or null date
				onChange(null);
			}
		};

		return (
			<LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
				<DatePicker
					ref={ref}
					label={label}
					value={dateValue}
					onChange={handleChange}
					disabled={disabled}
					slots={{
						textField: (params) => (
							<TextField
								{...params}
								fullWidth={fullWidth}
								size={size}
								error={error}
								helperText={helperText}
								placeholder={placeholder}
								className={cn(className)}
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: "12px",
										"&:hover fieldset": {
											borderColor: "var(--admin-primary)",
										},
										"&.Mui-focused fieldset": {
											borderColor: "var(--admin-primary)",
											borderWidth: "2px",
										},
									},
									"& .MuiInputLabel-root": {
										fontFamily: "var(--font-vazirmatn)",
										"&.Mui-focused": {
											color: "var(--admin-primary)",
										},
									},
								}}
							/>
						),
					}}
					slotProps={{
						popper: {
							sx: {
								"& .MuiPaper-root": {
									borderRadius: "16px",
									boxShadow: "var(--admin-shadow-lg)",
									marginTop: "8px",
								},
								"& .MuiPickersDay-root": {
									fontFamily: "var(--font-vazirmatn)",
									"&.Mui-selected": {
										backgroundColor: "var(--admin-primary)",
										"&:hover": {
											backgroundColor: "var(--admin-primary-dark)",
										},
									},
								},
								"& .MuiPickersCalendarHeader-label": {
									fontFamily: "var(--font-vazirmatn)",
									fontWeight: 600,
								},
								"& .MuiDayCalendar-weekDayLabel": {
									fontFamily: "var(--font-vazirmatn)",
								},
							},
						},
					}}
				/>
			</LocalizationProvider>
		);
	}
);

PersianDatePicker.displayName = "PersianDatePicker";
