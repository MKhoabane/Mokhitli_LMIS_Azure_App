INSERT INTO organization_catalog (organization_name, organization_type) VALUES
  ('Mokhitli Logistics Partners', 'employer'),
  ('Blue Crane Logistics', 'prospect'),
  ('Gauteng Warehousing Group', 'prospect')
ON CONFLICT (organization_name) DO NOTHING;

INSERT INTO employer_profile (organisation, active_placements, mentors) VALUES
  ('Mokhitli Logistics Partners', 26, 11)
ON CONFLICT (organisation) DO NOTHING;

INSERT INTO employer_placement (sort_order, learner, site, mentor, status) VALUES
  (1, 'Thabo Mbeki', 'Centurion DC', 'Nomsa Dlamini', 'On track'),
  (2, 'Lerato Khumalo', 'Midrand Hub', 'Sipho Nkosi', 'Needs visit')
ON CONFLICT (sort_order) DO NOTHING;

INSERT INTO employer_compliance (requirement, completion, sort_order) VALUES
  ('Mentor check-ins', 88, 1),
  ('Logbook submissions', 91, 2),
  ('Safety inductions', 100, 3)
ON CONFLICT (requirement) DO NOTHING;

INSERT INTO employer_action (sort_order, action_text) VALUES
  (1, 'Confirm July workplace rotation plan'),
  (2, 'Upload signed mentor feedback forms')
ON CONFLICT (sort_order) DO NOTHING;
