type PaymentPayload = {
	planId: string;
	price: number;
	currency: string;
	couponCode?: string;
	userId?: string;
};

export const zarinpalCheckout = async (payload: PaymentPayload) => {
	console.info("[Zarinpal] Initiating checkout", payload);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		authority: "TEST_AUTHORITY_CODE",
		paymentUrl: "https://sandbox.zarinpal.com/pg/StartPay/TEST_AUTHORITY_CODE",
	};
};

type EmailPayload = {
	to: string;
	subject: string;
	html: string;
};

export const sendTransactionalEmail = async (payload: EmailPayload) => {
	console.info("[SendGrid] Email queued", payload.to);
	return { status: "queued" };
};

export const trackAnalytics = (
	event: string,
	metadata?: Record<string, unknown>,
) => {
	console.debug("[Analytics]", event, metadata);
};

export const reportCrash = (
	error: Error,
	context?: Record<string, unknown>,
) => {
	console.error("[Sentry]", error.message, context);
};

type SmsPayload = {
	phone: string;
	message: string;
};

export const sendOtp = async (payload: SmsPayload) => {
	console.info("[Kavenegar] OTP sent", payload.phone);
	return { status: "sent" };
};
