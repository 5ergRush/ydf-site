# Account, Purchases, and Team Dashboard

## Scope

The account system is separate from festival registration and sales.

Routes:

- `/register` - account creation
- `/login` - password or Google login
- `/forgot-password` and `/reset-password` - recovery
- `/onboarding` - required completion after Google login
- `/account` - the participant's profile, purchases, and QR
- `/admin` - one team dashboard for volunteers, staff, and admins
- `/admin/products` - admin-only product catalog
- `/q/[token]` - authorized QR lookup
- `/privacy` and `/terms` - account policies

Creating an account does not reserve a festival place or product.

## Roles

| Role        | Capabilities                                                                    |
| ----------- | ------------------------------------------------------------------------------- |
| `user`      | Own name, immutable email, purchases, and QR                                    |
| `volunteer` | Search and QR lookup; read profiles and purchases                               |
| `staff`     | Volunteer access plus name corrections and limited purchase status updates      |
| `admin`     | Full profile, role, account, email, QR, purchase, catalog, and audit management |

All public registrations receive `user`. Privileged roles are granted manually.
The UI is not the security boundary: protected pages and every Server Action
re-check the verified Supabase user and database role.

## Purchase Model

Catalog products have:

- a stable UUID and slug
- name and category (`pass`, `masterclass`, `competition`, or `other`)
- optional description
- `active` for assignment/sales availability
- `published` for public pricing visibility
- one active price per currency

Supported currencies are `AMD`, `EUR`, `RUB`, and `AED`. Money is stored as an
integer smallest unit. AMD is stored as whole dram; the other currencies use
their minor unit.

Each purchase stores immutable snapshots of the product name, category, amount,
and currency. A later catalog price change never changes an earlier purchase.

Payment methods:

- `card` starts `active`
- `cash` starts `pending`

Statuses:

- `pending` - cash remains due
- `active` - paid or confirmed
- `cancelled` - participant-initiated cancellation
- `suspended` - organizer-initiated stop

Staff may change `pending` to `active`, and may suspend an `active` or `pending`
purchase with a reason. Admins can make corrections across statuses. Every
sensitive change is written to `audit_log`; purchases are not silently deleted.

## QR Security

The QR contains a URL with a random 192-bit lookup token. It contains no name,
email, database user ID, purchase information, or payment information.

The lookup route requires an active volunteer, staff, or admin account with a
password-authenticated session. Admins can rotate the token, invalidating all
older QR copies. The QR is a lookup shortcut, not proof of identity or payment.

## Authentication Rules

- verified email is required
- Google login must complete the same name, age, and policy onboarding
- account holders must confirm they are at least 16
- Terms acceptance and Privacy acknowledgement are versioned and timestamped
- regular password: at least 8 characters and two of letters, numbers, symbols
- volunteer/staff: at least 8 characters with uppercase, lowercase, number, symbol
- admin: at least 12 characters with uppercase, lowercase, number, symbol

Supabase's project-wide minimum is set to 8. Role-specific rules are enforced
by application forms. Promotion to a privileged role requires a password reset
by default. An admin may explicitly skip it, with a required audited reason.

Google sessions can access `/account`. Privileged `/admin` access requires a
session whose Supabase JWT authentication method includes `password`.

## Data Access

Supabase PostgreSQL is the source of truth for accounts, products, prices,
purchases, statuses, and audit records. Google Sheets remains a lightweight CMS
for public editorial content. The existing Google Sheet pricing reader is a
temporary fallback until published Supabase products have been populated.

All public tables have Row Level Security. Anonymous visitors can read only
published catalog products and their active prices. Users can read only their
own profile and purchases. Team reads are role-gated. Browser clients have no
direct write policy; mutations use server-side, role-checked actions.

The `SUPABASE_SECRET_KEY` (`sb_secret_...`) is server-only, bypasses RLS, and
must never be exposed as a `NEXT_PUBLIC_` value. Do not use the legacy
`service_role` key for a new project.

## Legal Draft Status

The policies name:

> Yerevan Dance Festival, organized by Arman Mkhitaryan, Armenia

Contact is currently `info@yerevandancefestival.com`. The policy pages are
clearly marked as drafts for organizer/legal review before public registration
opens.
