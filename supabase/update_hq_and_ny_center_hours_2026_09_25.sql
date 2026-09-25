update public.organization_centers
set schedule = 'Tuesdays, Wednesdays, Fridays & Saturdays: 9:30 AM–11:00 AM and 5:30 PM–6:30 PM. 1st & 3rd Sundays: 10:00 AM–1:00 PM. Outside these hours, visits are available by appointment.'
where id in ('national-headquarters', 'new-york-johrei-center');
