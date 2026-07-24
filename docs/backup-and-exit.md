# Backup, Restore, and Exit Runbook

## Ownership and Privacy

Supabase is the operational host, not the public source of participant data.
Profiles, purchases, locked prices, payment methods, statuses, and audit history
remain behind RLS and server authorization. They must never be added to Git or
Google Sheets.

Deleting a Supabase project permanently removes its database, Auth data, and
Supabase-held backups. Create and verify an external backup before deletion or
migration.

## Schedule

- During development: monthly and before/after every migration
- Once registration opens: weekly
- Before and after sales or bulk status changes: immediate
- If real sales volume makes a week of loss unacceptable: automate daily
  encrypted backups or reconsider a paid backup plan

## Manual Backup

From PowerShell, use a database connection string copied from Supabase:

```powershell
.\scripts\backup-supabase.ps1 `
  -DatabaseUrl "postgresql://..." `
  -OutputDirectory "D:\YDF-Backups"
```

The script uses the Supabase CLI through `npx` and creates:

- roles
- public schema
- public data
- Auth schema
- Auth data
- a SHA-256 manifest

The database URL and Auth dump are highly sensitive. Do not store the command in
source files or screenshots. Clear terminal history if the shell records the
connection string.

## Encrypt Before Google Drive

The output is not safe to upload unencrypted. Use a maintained encryption tool,
for example 7-Zip AES-256 through its GUI:

1. Select the entire timestamped backup directory.
2. Create a `.7z` archive with AES-256 encryption and encrypted filenames.
3. Use a long unique passphrase stored in a password manager outside Google Drive.
4. Open/test the archive before uploading.
5. Upload only the encrypted archive to a restricted Drive folder.
6. Keep multiple dated versions; do not overwrite the only known-good backup.
7. Remove the unencrypted local dump after verifying the encrypted copy, using
   an appropriate recoverable process for the machine.

Google Drive is suitable as one off-site copy at this expected scale when the
archive is encrypted locally and access is restricted. A second copy on a
separate encrypted drive is preferable once purchases become financially
material.

## Restore Test

At least quarterly and after schema changes:

1. Create a disposable Supabase test project.
2. Restore the schema and public data using the current Supabase migration/
   restore guidance.
3. Restore Auth only into the disposable project and never expose it publicly.
4. Verify row counts and manifest hashes.
5. Test a disposable user, purchase snapshots, roles, RLS, and QR lookup.
6. Record the date, operator, source archive, result, and any manual fixes.
7. Delete the disposable project after the test.

A backup that has never been restored is not yet a verified backup.

## Exit to Another Provider

Before closing Supabase:

1. Freeze schema changes and record a migration cutoff.
2. Export roles, `public`, `auth`, and any newly used schemas.
3. Export Storage objects separately if Storage is introduced later; database
   backups contain only Storage metadata.
4. Restore into the target PostgreSQL provider.
5. Rebuild or migrate authentication deliberately; do not assume raw Auth data
   can be dropped into an unrelated identity provider.
6. Validate account counts, purchase amounts/currencies/statuses, audit records,
   and RLS-equivalent protections.
7. Switch Vercel only after acceptance testing.
8. Keep the encrypted final export for the required retention period.
9. Delete the Supabase project only after written confirmation that the target
   and backup are both verified.
