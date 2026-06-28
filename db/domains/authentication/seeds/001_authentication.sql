INSERT INTO auth_account (id, name, email, role, default_portal) VALUES
  (101, 'Amina Naidoo', 'admin@mokhitli.com', 'admin', 'admin'),
  (102, 'Thabo Mbeki', 'learner@mokhitli.com', 'learner', 'learner'),
  (103, 'Nomsa Dlamini', 'facilitator@mokhitli.com', 'facilitator', 'facilitator'),
  (104, 'Kagiso Mthembu', 'assessor@mokhitli.com', 'assessor', 'assessor'),
  (105, 'Zanele Sithole', 'moderator@mokhitli.com', 'moderator', 'moderator'),
  (106, 'Mokhitli Logistics Partners', 'employer@mokhitli.com', 'employer', 'employer'),
  (107, 'Grace Mbeki', 'parent@mokhitli.com', 'parent', 'parent')
ON CONFLICT (id) DO NOTHING;
