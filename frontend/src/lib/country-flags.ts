/**
 * Country code to flag emoji mapping utility.
 * Converts ISO 3166-1 alpha-2 codes to emoji flags,
 * and also maps common country names (English/Persian) to codes.
 */

// Map of common country names (English + Persian) to ISO 3166-1 alpha-2 codes
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
	// English names
	iran: "IR",
	"united states": "US",
	usa: "US",
	"united kingdom": "GB",
	uk: "GB",
	france: "FR",
	germany: "DE",
	japan: "JP",
	"south korea": "KR",
	korea: "KR",
	china: "CN",
	india: "IN",
	italy: "IT",
	spain: "ES",
	canada: "CA",
	australia: "AU",
	russia: "RU",
	brazil: "BR",
	mexico: "MX",
	turkey: "TR",
	sweden: "SE",
	norway: "NO",
	denmark: "DK",
	finland: "FI",
	netherlands: "NL",
	belgium: "BE",
	switzerland: "CH",
	austria: "AT",
	poland: "PL",
	portugal: "PT",
	ireland: "IE",
	"new zealand": "NZ",
	argentina: "AR",
	colombia: "CO",
	chile: "CL",
	egypt: "EG",
	"south africa": "ZA",
	thailand: "TH",
	indonesia: "ID",
	malaysia: "MY",
	philippines: "PH",
	vietnam: "VN",
	taiwan: "TW",
	"hong kong": "HK",
	singapore: "SG",
	"united arab emirates": "AE",
	uae: "AE",
	"saudi arabia": "SA",
	israel: "IL",
	pakistan: "PK",
	bangladesh: "BD",
	nigeria: "NG",
	kenya: "KE",
	ghana: "GH",
	morocco: "MA",
	tunisia: "TN",
	algeria: "DZ",
	iraq: "IQ",
	afghanistan: "AF",
	lebanon: "LB",
	jordan: "JO",
	syria: "SY",
	qatar: "QA",
	kuwait: "KW",
	bahrain: "BH",
	oman: "OM",
	greece: "GR",
	romania: "RO",
	hungary: "HU",
	"czech republic": "CZ",
	czechia: "CZ",
	slovakia: "SK",
	croatia: "HR",
	serbia: "RS",
	ukraine: "UA",
	iceland: "IS",
	luxembourg: "LU",

	// Persian names
	ایران: "IR",
	"آمریکا": "US",
	"ایالات متحده": "US",
	"انگلستان": "GB",
	"بریتانیا": "GB",
	فرانسه: "FR",
	آلمان: "DE",
	ژاپن: "JP",
	"کره جنوبی": "KR",
	کره: "KR",
	چین: "CN",
	هند: "IN",
	ایتالیا: "IT",
	اسپانیا: "ES",
	کانادا: "CA",
	استرالیا: "AU",
	روسیه: "RU",
	برزیل: "BR",
	مکزیک: "MX",
	ترکیه: "TR",
	سوئد: "SE",
	نروژ: "NO",
	دانمارک: "DK",
	فنلاند: "FI",
	هلند: "NL",
	بلژیک: "BE",
	سوئیس: "CH",
	اتریش: "AT",
	لهستان: "PL",
	پرتغال: "PT",
	ایرلند: "IE",
	"نیوزیلند": "NZ",
	آرژانتین: "AR",
	کلمبیا: "CO",
	شیلی: "CL",
	مصر: "EG",
	"آفریقای جنوبی": "ZA",
	تایلند: "TH",
	اندونزی: "ID",
	مالزی: "MY",
	فیلیپین: "PH",
	ویتنام: "VN",
	تایوان: "TW",
	"هنگ کنگ": "HK",
	سنگاپور: "SG",
	امارات: "AE",
	"عربستان سعودی": "SA",
	عربستان: "SA",
	اسرائیل: "IL",
	پاکستان: "PK",
	بنگلادش: "BD",
	نیجریه: "NG",
	کنیا: "KE",
	مراکش: "MA",
	تونس: "TN",
	الجزایر: "DZ",
	عراق: "IQ",
	افغانستان: "AF",
	لبنان: "LB",
	اردن: "JO",
	سوریه: "SY",
	قطر: "QA",
	کویت: "KW",
	بحرین: "BH",
	عمان: "OM",
	یونان: "GR",
	رومانی: "RO",
	مجارستان: "HU",
	چک: "CZ",
	اسلواکی: "SK",
	کرواسی: "HR",
	صربستان: "RS",
	اوکراین: "UA",
	ایسلند: "IS",
};

/**
 * Convert a 2-letter ISO country code to a flag emoji.
 * Uses Unicode regional indicator symbols.
 */
function codeToFlagEmoji(code: string): string {
	const upper = code.toUpperCase();
	if (upper.length !== 2) return "";
	const codePoint1 = 0x1f1e6 + (upper.charCodeAt(0) - 65);
	const codePoint2 = 0x1f1e6 + (upper.charCodeAt(1) - 65);
	return String.fromCodePoint(codePoint1) + String.fromCodePoint(codePoint2);
}

/**
 * Get flag emoji from a country name or code.
 * Accepts: ISO 3166-1 alpha-2 codes (e.g., "IR", "US"),
 * English names (e.g., "Iran", "United States"),
 * or Persian names (e.g., "ایران", "آمریکا").
 */
export function getCountryFlag(countryInput: string | null | undefined): string {
	if (!countryInput) return "";
	const trimmed = countryInput.trim();
	if (!trimmed) return "";

	// If it's already a 2-letter code
	if (/^[A-Z]{2}$/i.test(trimmed)) {
		return codeToFlagEmoji(trimmed);
	}

	// Try to look up by name
	const lower = trimmed.toLowerCase();
	const code = COUNTRY_NAME_TO_CODE[lower];
	if (code) {
		return codeToFlagEmoji(code);
	}

	// Try partial match
	for (const [name, c] of Object.entries(COUNTRY_NAME_TO_CODE)) {
		if (lower.includes(name) || name.includes(lower)) {
			return codeToFlagEmoji(c);
		}
	}

	return "";
}

/**
 * Get both flag emoji and formatted country display text.
 */
export function getCountryDisplay(country: string | null | undefined): {
	flag: string;
	name: string;
} {
	if (!country) return { flag: "", name: "" };
	return {
		flag: getCountryFlag(country),
		name: country,
	};
}
