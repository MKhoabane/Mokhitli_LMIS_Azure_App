const learners = [
  {
    id: 1,
    name: 'Thabo Mbeki',
    email: 'thabo@example.co.za',
    status: 'Active',
    course: 'Logistics Management',
    attendance: 96,
    progress: 74,
    nextAssessment: 'Integrated summative assessment',
    mentor: 'Nomsa Dlamini'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    status: 'Completed',
    course: 'Supply Chain Essentials',
    attendance: 99,
    progress: 100,
    nextAssessment: 'Completed',
    mentor: 'Kagiso Mthembu'
  },
  {
    id: 3,
    name: 'Lerato Khumalo',
    email: 'lerato@example.co.za',
    status: 'In Workplace',
    course: 'Warehouse Operations',
    attendance: 92,
    progress: 81,
    nextAssessment: 'Practical observation',
    mentor: 'Zanele Sithole'
  }
];

const authUsers = [
  {
    id: 101,
    name: 'Amina Naidoo',
    email: 'admin@mokhitli.com',
    role: 'admin',
    defaultPortal: 'admin'
  },
  {
    id: 102,
    name: 'Thabo Mbeki',
    email: 'learner@mokhitli.com',
    role: 'learner',
    defaultPortal: 'learner'
  },
  {
    id: 103,
    name: 'Nomsa Dlamini',
    email: 'facilitator@mokhitli.com',
    role: 'facilitator',
    defaultPortal: 'facilitator'
  },
  {
    id: 104,
    name: 'Kagiso Mthembu',
    email: 'assessor@mokhitli.com',
    role: 'assessor',
    defaultPortal: 'assessor'
  },
  {
    id: 105,
    name: 'Zanele Sithole',
    email: 'moderator@mokhitli.com',
    role: 'moderator',
    defaultPortal: 'moderator'
  },
  {
    id: 106,
    name: 'Mokhitli Logistics Partners',
    email: 'employer@mokhitli.com',
    role: 'employer',
    defaultPortal: 'employer'
  },
  {
    id: 107,
    name: 'Grace Mbeki',
    email: 'parent@mokhitli.com',
    role: 'parent',
    defaultPortal: 'parent'
  }
];

const users = [
  {
    id: 'USR-001',
    name: 'Amina Naidoo',
    email: 'admin@mokhitli.com',
    role: 'admin',
    status: 'Active'
  },
  {
    id: 'USR-002',
    name: 'Nomsa Dlamini',
    email: 'facilitator@mokhitli.com',
    role: 'facilitator',
    status: 'Active'
  },
  {
    id: 'USR-003',
    name: 'Kagiso Mthembu',
    email: 'assessor@mokhitli.com',
    role: 'assessor',
    status: 'Active'
  },
  {
    id: 'USR-004',
    name: 'Zanele Sithole',
    email: 'moderator@mokhitli.com',
    role: 'moderator',
    status: 'Active'
  }
];

const roles = [
  {
    name: 'admin',
    users: 5,
    permissions: ['manage_users', 'view_finance', 'configure_rbac', 'view_reports']
  },
  {
    name: 'facilitator',
    users: 12,
    permissions: ['view_lms', 'manage_cohorts', 'submit_evidence']
  },
  {
    name: 'assessor',
    users: 7,
    permissions: ['review_assessments', 'capture_outcomes', 'request_moderation']
  },
  {
    name: 'employer',
    users: 18,
    permissions: ['view_workplace_learning', 'upload_feedback', 'track_placements']
  }
];

const qualifications = [
  {
    code: 'QCTO-LOG-01',
    title: 'Occupational Certificate: Logistics Management',
    nqfLevel: 5,
    credits: 240,
    status: 'Active'
  },
  {
    code: 'QCTO-WRH-02',
    title: 'Occupational Certificate: Warehouse Operations',
    nqfLevel: 4,
    credits: 180,
    status: 'Active'
  },
  {
    code: 'QCTO-SCM-03',
    title: 'Supply Chain Practitioner',
    nqfLevel: 5,
    credits: 210,
    status: 'Review'
  }
];

const issuedCertificates = [
  {
    certificateNo: 'CERT-2026-001',
    learner: 'Sarah Jenkins',
    qualification: 'Supply Chain Essentials',
    issuedDate: '2026-06-02',
    status: 'Issued'
  },
  {
    certificateNo: 'CERT-2026-002',
    learner: 'Thabo Mbeki',
    qualification: 'First Aid Readiness',
    issuedDate: '2026-06-18',
    status: 'Issued'
  }
];

const reportingSummary = {
  completionRate: 88,
  placementRate: 79,
  certificationRate: 84,
  monthlyTrend: [
    { month: 'Apr', learners: 98, certificates: 24 },
    { month: 'May', learners: 110, certificates: 29 },
    { month: 'Jun', learners: 121, certificates: 33 }
  ]
};

const financeOverview = {
  invoiced: 1480000,
  collected: 1195000,
  outstanding: 285000,
  bursaries: 740000,
  recentTransactions: [
    { reference: 'INV-240601', customer: 'SETA Grant', amount: 320000, status: 'Paid' },
    { reference: 'INV-240619', customer: 'Mokhitli Logistics Partners', amount: 185000, status: 'Pending' }
  ]
};

const crmPipeline = {
  leads: 34,
  activeEmployers: 12,
  conversionRate: 41,
  opportunities: [
    { account: 'Blue Crane Logistics', stage: 'Proposal', value: 260000 },
    { account: 'Gauteng Warehousing Group', stage: 'Negotiation', value: 410000 }
  ]
};

const aiInsights = {
  recommendations: [
    'Flag LOG-2026-B for learner support intervention.',
    'Increase workplace visits for Midrand Hub placements.',
    'Schedule moderation follow-up for incomplete evidence packs.'
  ],
  riskIndicators: [
    { label: 'Assessment backlog risk', score: 63 },
    { label: 'Workplace placement risk', score: 48 },
    { label: 'Certification delay risk', score: 35 }
  ]
};

const learnerPortal = {
  learner: {
    id: 'LRN-1001',
    name: 'Thabo Mbeki',
    programme: 'Occupational Certificate: Logistics Management',
    nqfLevel: 5,
    facilitator: 'Nomsa Dlamini'
  },
  progress: [
    { title: 'Knowledge modules', completion: 82 },
    { title: 'Practical modules', completion: 68 },
    { title: 'Workplace modules', completion: 74 }
  ],
  upcomingAssessments: [
    { title: 'Warehouse simulation', dueDate: '2026-07-02', type: 'Practical' },
    { title: 'Integrated summative assessment', dueDate: '2026-07-10', type: 'Summative' }
  ],
  certificates: [
    { title: 'First Aid Readiness', status: 'Issued' },
    { title: 'Workplace Safety Orientation', status: 'Eligible' }
  ]
};

const facilitatorPortal = {
  facilitator: {
    name: 'Nomsa Dlamini',
    activeCohorts: 4,
    assignedLearners: 118
  },
  sessions: [
    { cohort: 'LOG-2026-A', module: 'Inventory Planning', date: '2026-06-29', attendance: 29 },
    { cohort: 'LOG-2026-B', module: 'Transport Operations', date: '2026-06-30', attendance: 31 }
  ],
  cohorts: [
    { name: 'LOG-2026-A', completion: 71, atRisk: 3 },
    { name: 'LOG-2026-B', completion: 65, atRisk: 5 },
    { name: 'WRH-2026-A', completion: 78, atRisk: 2 }
  ],
  actions: [
    'Approve learner catch-up plans',
    'Upload moderated evidence pack',
    'Confirm workplace visit schedule'
  ]
};

const assessorPortal = {
  assessor: {
    name: 'Kagiso Mthembu',
    openAssessments: 18,
    dueThisWeek: 7
  },
  queue: [
    { learner: 'Thabo Mbeki', assessment: 'Integrated summative assessment', dueDate: '2026-07-01', status: 'Ready for marking' },
    { learner: 'Lerato Khumalo', assessment: 'Practical observation', dueDate: '2026-07-03', status: 'Evidence submitted' }
  ],
  outcomes: [
    { programme: 'Logistics Management', competent: 42, reAssessments: 6 },
    { programme: 'Warehouse Operations', competent: 27, reAssessments: 4 }
  ],
  flags: [
    '2 evidence packs require workplace verification',
    '1 assessor decision awaiting moderator confirmation'
  ]
};

const moderatorPortal = {
  moderator: {
    name: 'Zanele Sithole',
    moderationBatches: 6,
    complianceScore: 97
  },
  moderationQueue: [
    { batch: 'MOD-2406-01', programme: 'Logistics Management', sampleSize: 12, status: 'In review' },
    { batch: 'MOD-2406-02', programme: 'Warehouse Operations', sampleSize: 8, status: 'Awaiting evidence' }
  ],
  findings: [
    { category: 'Assessment decisions', total: 2, severity: 'Medium' },
    { category: 'Evidence completeness', total: 1, severity: 'High' },
    { category: 'Assessor feedback', total: 4, severity: 'Low' }
  ],
  actions: [
    'Sign off batch MOD-2406-01',
    'Escalate incomplete workplace evidence',
    'Review assessor calibration trend'
  ]
};

const employerPortal = {
  employer: {
    organisation: 'Mokhitli Logistics Partners',
    activePlacements: 26,
    mentors: 11
  },
  placements: [
    { learner: 'Thabo Mbeki', site: 'Centurion DC', mentor: 'Nomsa Dlamini', status: 'On track' },
    { learner: 'Lerato Khumalo', site: 'Midrand Hub', mentor: 'Sipho Nkosi', status: 'Needs visit' }
  ],
  compliance: [
    { requirement: 'Mentor check-ins', completion: 88 },
    { requirement: 'Logbook submissions', completion: 91 },
    { requirement: 'Safety inductions', completion: 100 }
  ],
  actions: [
    'Confirm July workplace rotation plan',
    'Upload signed mentor feedback forms'
  ]
};

const parentPortal = {
  learner: {
    name: 'Thabo Mbeki',
    programme: 'Logistics Management',
    attendance: 96,
    progress: 74
  },
  alerts: [
    { message: 'Integrated summative assessment scheduled for 10 Jul 2026', level: 'info' },
    { message: 'Workplace mentor feedback uploaded successfully', level: 'success' }
  ],
  milestones: [
    { title: 'Knowledge modules completed', status: 'Completed' },
    { title: 'Workplace evidence portfolio', status: 'In progress' },
    { title: 'Certification review', status: 'Pending' }
  ]
};

module.exports = {
  authUsers,
  users,
  roles,
  qualifications,
  issuedCertificates,
  reportingSummary,
  financeOverview,
  crmPipeline,
  aiInsights,
  learners,
  learnerPortal,
  facilitatorPortal,
  assessorPortal,
  moderatorPortal,
  employerPortal,
  parentPortal
};
