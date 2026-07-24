# Supabase and Authentication Setup

This guide assumes no Supabase project exists yet. Do not enable public
registration until every launch-checklist item is complete.

## 1. Create the Supabase Project

1. Create a free account at Supabase and create a new project.
2. Use a dedicated organization for Yerevan Dance Festival.
3. Choose a region appropriate for the festival's visitors and data obligations.
4. Generate a strong database password and store it in a password manager.
5. Open the project's **Connect** dialog and copy the Project URL. It has the
   form `https://YOUR_PROJECT_REF.supabase.co`.
6. In **Project Settings > API Keys > Publishable and secret API keys**, copy:
   - Publishable key (`sb_publishable_...`)
   - The default Secret key (`sb_secret_...`)
7. Copy `.env.example` to `.env.local` and replace the placeholders.
8. Keep the local site URL set to:

   ```text
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Vercel has a separate production environment variable using
   `https://yerevandancefestival.com`. Do not put the production URL in the
   local file while testing signup, confirmation, recovery, or OAuth redirects.

Do not use the keys under **Legacy anon, service_role API keys** for this new
project. Supabase plans to deprecate them by the end of 2026.

Never paste the Secret key into a public issue, chat, screenshot, browser code,
or any variable beginning with `NEXT_PUBLIC_`. It bypasses RLS and belongs only
in `.env.local` and Vercel's encrypted server environment.

## 2. Create the Database Schema

For the first setup, open Supabase **SQL Editor**, create a new query, and run
the migrations in timestamp order:

`supabase/migrations/202607230001_accounts_and_purchases.sql`

`supabase/migrations/202607240001_service_role_table_grants.sql`

Review and run each migration once. They create the profile, catalog, price,
purchase, and audit tables, profile trigger, enums, indexes, grants, and RLS
policies. The second migration gives the server-only `service_role` explicit
table privileges; its RLS bypass does not imply PostgreSQL table privileges.

For later development, install the Supabase CLI, link the local repository to
the project, and apply committed migrations through the CLI instead of making
untracked Dashboard edits.

## 3. Configure Auth URLs and the Email Provider

In **Authentication > URL Configuration**:

- Site URL: `https://yerevandancefestival.com`
- Add redirect URLs:
  - `http://localhost:3000/**`
  - `https://yerevandancefestival.com/**`
  - `https://www.yerevandancefestival.com/**`
  - the specific Vercel preview pattern used by this project

Do not add a broad wildcard that can match an attacker-controlled domain.

During localhost testing, confirm that `.env.local` contains
`NEXT_PUBLIC_SITE_URL=http://localhost:3000` and restart `npm run dev` after
changing it. The application passes this value as `emailRedirectTo`; Supabase's
Site URL remains the production fallback.

Then open **Authentication > Sign In / Providers**. Under **User Signups**:

- turn **Allow new users to sign up** on
- keep **Allow anonymous sign-ins** off

On the same page, select the **Email** provider to open its provider-specific
settings:

- turn **Enable Email provider** on
- turn **Confirm email** on
- set **Minimum password length** to `8`
- set **Password requirements** to **No required characters**

The application enforces the agreed two-class rule for regular accounts and the
stronger role-specific rules. Supabase's global character presets do not match
that flexible policy, so do not select the all-four-classes option globally.
Save the provider settings.

**Authentication > Emails** under **Notifications** is a different page. It
contains authentication email templates and SMTP settings; it does not enable
email/password sign-in. New Free-plan projects using Supabase's default SMTP
cannot customize templates. Complete the custom Resend SMTP setup in step 6,
then return to **Authentication > Emails > Templates** to install the
PKCE-compatible links.

## 4. Create the First Admin

1. Finish SMTP and Turnstile setup first.
2. Register Arman's normal account through `/register`, using a password that
   already satisfies the 12-character admin policy.
3. Confirm the email.
4. In the SQL Editor, find the exact ID:

```sql
select id, email from auth.users where email = 'REPLACE_WITH_ADMIN_EMAIL';
```

5. Copy that UUID into this one-time command:

```sql
update public.profiles
set role = 'admin',
    password_reset_required = false
where id = 'REPLACE_WITH_EXACT_AUTH_USER_UUID';
```

Do not hardcode the admin email or UUID in the repository. Subsequent role
management happens through `/admin`.

## 5. Configure Cloudflare Turnstile

1. In the Cloudflare dashboard, open **Turnstile**, select **Add widget**, name
   it `YDF authentication`, and use **Managed** mode.
2. Under **Hostname Management**, add:
   - `localhost` without `http://` or a port
   - `yerevandancefestival.com` without `https://`

   Adding the root domain also authorizes `www.yerevandancefestival.com`.
   Add an exact Vercel preview hostname only when a preview deployment needs to
   test authentication; do not enter URL schemes, ports, paths, or wildcards.
3. Create the widget. Cloudflare displays two different values:
   - copy **Site Key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.local`
     and the corresponding Vercel environment variable
   - copy **Secret Key** into Supabase **Authentication > Attack Protection >
     CAPTCHA protection**, after selecting Cloudflare Turnstile
4. Never put the Turnstile Secret Key in `.env.local`, GitHub, Vercel's
   `NEXT_PUBLIC_` variables, or chat. The site key is intentionally public; the
   secret key is not.
5. Restart `npm run dev` after changing `.env.local`. Next.js reads public
   environment values when the development server starts.

The Turnstile secret belongs in Supabase, not in this repository or the browser.
Test signup, login, and password reset after enabling it. Cloudflare error
`400020` means the value used in the browser is not a valid Site Key. Re-copy
the widget's Site Key rather than its Secret Key. A hostname authorization
problem produces a different error (`110200`).

## 6. Configure Resend SMTP

1. Create a free Resend account.
2. In Resend, open **Domains**, choose **Add Domain**, and enter
   `auth.yerevandancefestival.com` without `https://` and without an email
   address. This creates a dedicated sending subdomain; it is not an existing
   page or mailbox. Select **Ireland (`eu-west-1`)** as the closest available
   sending region.
3. Resend will display the required DKIM and SPF records. Keep that page open.
   Receiving and tracking are not needed for authentication email.
4. In Porkbun, open **Account > Domain Management**, find
   `yerevandancefestival.com`, select **DNS**, then **Add Record**. Add every
   record displayed by Resend:
   - use the exact record type, value, and MX priority supplied by Resend
   - leave TTL at Porkbun's default
   - Porkbun automatically appends `.yerevandancefestival.com` to **Host**
   - if Resend shows `resend._domainkey.auth.yerevandancefestival.com`, enter
     only `resend._domainkey.auth` as the Porkbun Host
   - if Resend shows `send.auth.yerevandancefestival.com`, enter only
     `send.auth` as the Porkbun Host
   - do not remove or edit the existing Vercel website records
5. Return to the Resend domain page and select **I've added the records** or
   **Restart verification**. Verification often finishes within 15 minutes,
   but DNS propagation can take longer.
6. After the domain is verified, create a sending-only Resend API key named
   `supabase-auth-smtp`. Resend shows the key only once; store it in the
   password manager and do not paste it into GitHub or chat.
7. Configure custom SMTP in **Supabase > Authentication > Emails > SMTP
   Settings**:
   - sender: `Yerevan Dance Festival`
   - from: `no-reply@auth.yerevandancefestival.com`
   - host: `smtp.resend.com`
   - port: `465`
   - username: `resend`
   - password: the `supabase-auth-smtp` Resend API key
8. Keep `info@yerevandancefestival.com` as the public support address and
   create that mailbox or forwarding destination before launch.

After custom SMTP is saved, return to **Authentication > Emails > Templates**.
For **Confirm signup**, use this PKCE-compatible link:

```text
{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/account
```

For **Reset password**, use:

```text
{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
```

Using `RedirectTo` allows the same templates to work with the allow-listed
localhost and production URLs. Test both flows before launch and disable click
tracking for authentication links.

Put a sending-only Resend API key in the server-only `RESEND_API_KEY`
environment variable as well. The admin promotion flow uses it to deliver the
generated privileged-account password-reset link. It must never use a
`NEXT_PUBLIC_` prefix.

Send verification and recovery tests to multiple providers, including Gmail,
and check spam placement.

## 7. Configure Google Login

1. Create a Google Cloud project and configure the Google Auth Platform.
2. Set the app name, support contact, and authorized domain.
3. Request only `openid`, email, and profile scopes.
4. Create a Web OAuth client.
5. Add the website origins, including local development.
6. Add the exact Supabase callback URL displayed on the Google provider page in
   Supabase.
7. Paste the Google Client ID and secret into the Supabase Google provider.
8. Test both a new Google user and an email that already has a password account.

Google users must still complete `/onboarding`. A Google-only session cannot
open `/admin`; privileged users must sign in with their password.

## 8. Configure Vercel

Add all `.env.example` variables to Vercel for Production and the intended
Preview/Development environments. Set:

```text
NEXT_PUBLIC_SITE_URL=https://yerevandancefestival.com
```

Redeploy after changing a `NEXT_PUBLIC_` value because Next.js embeds public
environment variables at build time.

## 9. Populate Products

Open `/admin/products`:

1. Create each real catalog product and its approved price.
2. Keep it active if it can be assigned.
3. Keep it unpublished until it is ready for `/pricing`.
4. Verify all four currency amounts before publishing.

Do not invent or copy unapproved prices. Once at least one active product is
published, the public pricing page uses Supabase. Until then it uses the current
Google Sheet/static fallback.

## 10. Launch Checklist

- Policies reviewed by the organizer or qualified counsel
- `info@...` is a working monitored mailbox
- Supabase migration applied once
- RLS checked with signed-out, user, volunteer, staff, and admin accounts
- Email verification and reset tested
- Google new-user and existing-user flows tested
- Turnstile tested in production
- QR tested on iPhone and Android over HTTPS
- Staff status transitions and audit records tested
- Admin email correction tested on a disposable account
- First encrypted backup created and restored into a test project
- Vercel production environment variables confirmed

## Useful Official References

- Supabase SSR Auth: https://supabase.com/docs/guides/auth/server-side
- Google login: https://supabase.com/docs/guides/auth/social-login/auth-google
- CAPTCHA: https://supabase.com/docs/guides/auth/auth-captcha
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Backups: https://supabase.com/docs/guides/platform/backups
