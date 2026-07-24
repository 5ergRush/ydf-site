-- The current sb_secret API key authenticates database requests as
-- service_role. BYPASSRLS skips row policies but does not grant PostgreSQL
-- table privileges, so the server-only client still needs explicit grants.

grant usage on schema public to service_role;

grant select, insert, update, delete on table
  public.profiles,
  public.products,
  public.product_prices,
  public.purchases,
  public.audit_log
to service_role;
