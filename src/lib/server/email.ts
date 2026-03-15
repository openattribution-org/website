/**
 * Transactional email via Resend.
 */

import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { resolveTheme, type ThemeConfig } from '$lib/theme/tokens.js';

function getResend(): Resend {
	const key = env.RESEND_API_KEY;
	if (!key) throw new Error('RESEND_API_KEY must be set');
	return new Resend(key);
}

function getThemeId(): string {
	return env.PUBLIC_THEME ?? 'oa';
}

export async function sendMagicLinkEmail(email: string, magicLinkUrl: string): Promise<void> {
	const resend = getResend();
	const theme = resolveTheme(getThemeId());

	await resend.emails.send({
		from: `${theme.name} <auth@openattribution.org>`,
		to: email,
		subject: `Sign in to ${theme.name}`,
		html: buildMagicLinkHtml(magicLinkUrl, theme)
	});
}

function buildMagicLinkHtml(url: string, theme: ThemeConfig): string {
	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;border:1px solid #f3e8e7;overflow:hidden;">
        <tr><td style="padding:40px 40px 0;">
          <p style="margin:0 0 24px;font-size:14px;color:#6b7280;font-weight:300;">
            ${theme.name}
          </p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:500;color:#111827;">
            Sign in
          </h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#4b5563;font-weight:300;">
            Click the button below to sign in. This link expires in 15 minutes.
          </p>
        </td></tr>
        <tr><td style="padding:0 40px;">
          <a href="${url}" style="display:inline-block;padding:14px 32px;background-color:#dc3b35;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:500;">
            Sign in
          </a>
        </td></tr>
        <tr><td style="padding:24px 40px 0;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;font-weight:300;word-break:break-all;">
            Or copy this link: ${url}
          </p>
        </td></tr>
        <tr><td style="padding:32px 40px 40px;">
          <p style="margin:0;font-size:12px;color:#9ca3af;font-weight:300;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:11px;color:#9ca3af;font-weight:300;">
        ${theme.name} &middot; ${theme.supportEmail}
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}
