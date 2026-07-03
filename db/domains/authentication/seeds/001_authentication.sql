INSERT INTO auth_account (id, name, email, role, default_portal, password_hash) VALUES
  (101, 'Amina Naidoo', 'admin@mokhitli.com', 'admin', 'admin', '$2b$10$DALWfMzpvHOnvX4R/98XjOPt.s27a9vcw5.RrkDq6lRXCSmNZ/bs.'),
  (102, 'Thabo Mbeki', 'learner@mokhitli.com', 'learner', 'learner', '$2b$10$UOvYJyxayce2rMp4VUZKMOOmreSB.2gyrVb/eSC5p7ffluBDgg9Aq'),
  (103, 'Nomsa Dlamini', 'facilitator@mokhitli.com', 'facilitator', 'facilitator', '$2b$10$6MKKb3urvwGgNSNqcRlUneFRqjQQt3bjrXgXsa8iSJ1IeZTg0peoO'),
  (104, 'Kagiso Mthembu', 'assessor@mokhitli.com', 'assessor', 'assessor', '$2b$10$Gtvg43dfw8pi4DWsDHEf7.k.F9nIVwcKEZUPK0xUocnWfjJLVYwTm'),
  (105, 'Zanele Sithole', 'moderator@mokhitli.com', 'moderator', 'moderator', '$2b$10$D2B5iw30XVTEWgjgUX14n.VhLcX07tvvPW6CVPiuDIyn3yYIfkfRe'),
  (106, 'Mokhitli Logistics Partners', 'employer@mokhitli.com', 'employer', 'employer', '$2b$10$gCT9eoEvBL3htyQS3oouJ.dsYf0gL8twbw.Dmi7vhx5PaHBut2c86'),
  (107, 'Grace Mbeki', 'parent@mokhitli.com', 'parent', 'parent', '$2b$10$ib9Byva9sFplOuLfmPMmaeMpQy0npZkSzAkspetQSmGEc3.AI0xMa')
ON CONFLICT (id) DO NOTHING;
