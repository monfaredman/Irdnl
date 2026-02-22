"use client";

import { Box, IconButton, Popover, Typography } from "@mui/material";
import { useState, useRef } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

// Popular emoji categories
const EMOJI_DATA = {
	"😊 لبخند": ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗", "😙", "🥲", "😚", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷"],
	"❤️ احساسات": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💔", "❤️‍🔥", "❤️‍🩹", "💯", "💢", "💥", "💫", "💦", "💨", "🕊️", "🔥", "⭐", "🌟", "✨", "⚡", "💪", "🙏", "🤝", "👍", "👎", "👏", "🤞", "✌️", "🤟"],
	"👋 دست": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "🫵", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿"],
	"🎬 سینما": ["🎬", "🎥", "📽️", "🎞️", "📺", "📻", "🎵", "🎶", "🎤", "🎧", "🎹", "🥁", "🎸", "🎺", "🎻", "🪕", "🎭", "🎪", "🎨", "🖌️", "🖍️", "📸", "📷", "🎯", "🎮", "🕹️", "🎲", "🧩", "🎰", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎗️", "🏵️", "🎀", "🎁", "🎊"],
	"🍕 غذا": ["🍕", "🍔", "🍟", "🌭", "🍿", "🧈", "🥚", "🍳", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍰", "🎂", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "☕", "🫖", "🍵", "🧃", "🥤", "🧋", "🍺", "🍻", "🥂", "🍷"],
	"🌍 طبیعت": ["🌍", "🌎", "🌏", "🌐", "🗺️", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🌆", "🏙️", "🌃", "🌌", "🌉", "🌁", "🌈", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "🌬️"],
	"🚗 سفر": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🛺", "✈️", "🛫", "🛬", "🛩️", "🚀", "🛸", "🚁", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝"],
};

interface EmojiPickerProps {
	onEmojiSelect: (emoji: string) => void;
	/** Custom trigger button. If not provided, a default emoji button is shown */
	trigger?: React.ReactNode;
}

export function EmojiPicker({ onEmojiSelect, trigger }: EmojiPickerProps) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_DATA)[0]);

	const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSelect = (emoji: string) => {
		onEmojiSelect(emoji);
	};

	const open = Boolean(anchorEl);

	return (
		<>
			{trigger ? (
				<Box onClick={handleOpen} sx={{ cursor: "pointer", display: "inline-flex" }}>
					{trigger}
				</Box>
			) : (
				<IconButton
					onClick={handleOpen}
					size="small"
					sx={{
						color: glassColors.text.secondary,
						"&:hover": { color: glassColors.persianGold },
						fontSize: "1.2rem",
					}}
					title="ایموجی"
				>
					😊
				</IconButton>
			)}

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				transformOrigin={{ vertical: "bottom", horizontal: "center" }}
				slotProps={{
					paper: {
						sx: {
							background: `linear-gradient(135deg, rgba(20,20,30,0.95), rgba(15,15,25,0.98))`,
							backdropFilter: `blur(${glassBlur.strong})`,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: glassBorderRadius.lg,
							width: 340,
							maxHeight: 400,
							overflow: "hidden",
						},
					},
				}}
			>
				{/* Category Tabs */}
				<Box
					sx={{
						display: "flex",
						overflowX: "auto",
						gap: 0.5,
						p: 1,
						borderBottom: `1px solid ${glassColors.glass.border}`,
						"&::-webkit-scrollbar": { height: 0 },
					}}
				>
					{Object.keys(EMOJI_DATA).map((cat) => (
						<Box
							key={cat}
							onClick={() => setActiveCategory(cat)}
							sx={{
								cursor: "pointer",
								px: 1.5,
								py: 0.5,
								borderRadius: glassBorderRadius.md,
								fontSize: "0.75rem",
								whiteSpace: "nowrap",
								background: activeCategory === cat ? `${glassColors.persianGold}20` : "transparent",
								color: activeCategory === cat ? glassColors.persianGold : glassColors.text.secondary,
								border: `1px solid ${activeCategory === cat ? `${glassColors.persianGold}40` : "transparent"}`,
								"&:hover": { background: `${glassColors.glass.strong}` },
								transition: "all 0.2s",
							}}
						>
							{cat}
						</Box>
					))}
				</Box>

				{/* Emoji Grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(8, 1fr)",
						gap: 0.5,
						p: 1.5,
						maxHeight: 300,
						overflowY: "auto",
						"&::-webkit-scrollbar": { width: 4 },
						"&::-webkit-scrollbar-thumb": {
							background: glassColors.glass.border,
							borderRadius: 4,
						},
					}}
				>
					{(EMOJI_DATA as Record<string, string[]>)[activeCategory]?.map((emoji, i) => (
						<Box
							key={`${emoji}-${i}`}
							onClick={() => handleSelect(emoji)}
							sx={{
								cursor: "pointer",
								fontSize: "1.4rem",
								p: 0.5,
								borderRadius: glassBorderRadius.sm,
								textAlign: "center",
								"&:hover": {
									background: `${glassColors.persianGold}20`,
									transform: "scale(1.2)",
								},
								transition: "all 0.15s",
							}}
						>
							{emoji}
						</Box>
					))}
				</Box>
			</Popover>
		</>
	);
}
