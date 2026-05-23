-- Backfill missing website donation metadata for older rows.
-- Safe to run more than once.

with extracted as (
  select
    id,
    nullif(split_part(split_part(coalesce(custom_id, ''), 'fund:', 2), '|', 1), '') as custom_fund_type,
    nullif(split_part(split_part(coalesce(custom_id, ''), 'centerId:', 2), '|', 1), '') as custom_center_id,
    nullif(split_part(split_part(coalesce(custom_id, ''), 'name:', 2), '|', 1), '') as custom_donor_name,
    nullif(split_part(split_part(coalesce(custom_id, ''), 'center:', 2), '|', 1), '') as custom_center_name,
    nullif(split_part(split_part(coalesce(custom_id, ''), 'type:', 2), '|', 1), '') as custom_donation_type,
    nullif(capture_payload #>> '{purchase_units,0,items,0,name}', '') as capture_item_name,
    nullif(order_payload #>> '{purchase_units,0,items,0,name}', '') as order_item_name,
    nullif(capture_payload #>> '{purchase_units,0,description}', '') as capture_description,
    nullif(order_payload #>> '{purchase_units,0,description}', '') as order_description,
    nullif(capture_payload #>> '{purchase_units,0,items,0,description}', '') as capture_item_description,
    nullif(order_payload #>> '{purchase_units,0,items,0,description}', '') as order_item_description,
    nullif(capture_payload #>> '{payer,email_address}', '') as capture_payer_email
  from public.website_donations
)
update public.website_donations as wd
set
  fund_type = coalesce(wd.fund_type, extracted.custom_fund_type, 'donation'),
  center_id = coalesce(
    nullif(wd.center_id, ''),
    extracted.custom_center_id
  ),
  center_name = coalesce(
    nullif(wd.center_name, ''),
    extracted.custom_center_name,
    case
      when extracted.capture_description is not null and extracted.capture_description like '% | %'
        then split_part(extracted.capture_description, ' | ', 2)
      when extracted.order_description is not null and extracted.order_description like '% | %'
        then split_part(extracted.order_description, ' | ', 2)
      else null
    end
  ),
  donation_type = coalesce(
    nullif(wd.donation_type, ''),
    extracted.capture_item_name,
    extracted.order_item_name,
    extracted.custom_donation_type
  ),
  donor_name = coalesce(
    nullif(wd.donor_name, ''),
    case
      when extracted.capture_item_description ~ '^Donor:\s*'
        then nullif(regexp_replace(extracted.capture_item_description, '^Donor:\s*(.+?)(?:\s*\([^)]+\))?$', '\1'), '')
      when extracted.order_item_description ~ '^Donor:\s*'
        then nullif(regexp_replace(extracted.order_item_description, '^Donor:\s*(.+?)(?:\s*\([^)]+\))?$', '\1'), '')
      else extracted.custom_donor_name
    end
  ),
  donor_email = coalesce(
    nullif(wd.donor_email, ''),
    case
      when extracted.capture_item_description ~ '\([^)@]+@[^)]+\)$'
        then nullif(regexp_replace(extracted.capture_item_description, '^.*\(([^)]+)\)$', '\1'), '')
      when extracted.order_item_description ~ '\([^)@]+@[^)]+\)$'
        then nullif(regexp_replace(extracted.order_item_description, '^.*\(([^)]+)\)$', '\1'), '')
      else extracted.capture_payer_email
    end
  )
from extracted
where wd.id = extracted.id
  and (
    wd.center_id is null
    or wd.center_name is null
    or wd.donation_type is null
    or wd.donor_name is null
    or wd.donor_email is null
  );
