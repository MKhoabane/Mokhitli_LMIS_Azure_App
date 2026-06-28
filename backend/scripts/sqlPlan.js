const path = require('path');

const dbRoot = path.resolve(__dirname, '..', '..', 'db');
const domainsRoot = path.join(dbRoot, 'domains');

const orderedDomainNames = [
  'users-rbac',
  'authentication',
  'programmes',
  'qualifications',
  'certificates',
  'learners',
  'lms',
  'assessments',
  'audit',
  'workplace-learning',
  'notifications',
  'reporting',
  'finance',
  'crm',
  'ai'
];

function buildDomainPaths(sectionName) {
  return orderedDomainNames.map((domainName) =>
    path.join(domainsRoot, domainName, sectionName)
  );
}

module.exports = {
  dbRoot,
  orderedDomainNames,
  migrationDirectories: buildDomainPaths('tables'),
  seedDirectories: buildDomainPaths('seeds')
};
