const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const { getRecent } = require('./routes/programmeRoutes');
const { registerModuleRoutes } = require('./modules/registerModuleRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const hasFrontendBuild = fs.existsSync(path.join(frontendDistPath, 'index.html'));
const appEnvironment = process.env.APP_ENV || process.env.NODE_ENV || 'development';
const releaseVersion = process.env.RELEASE_VERSION || 'development';

app.use(cors());
app.use(express.json());

// --- Sample Data for Dashboard ---
const SAMPLE_LEARNERS = [
  { id: 1, name: "Thabo Mbeki", email: "thabo@example.co.za", status: "Active", course: "Logistics Management" },
  { id: 2, name: "Sarah Jenkins", email: "sarah.j@example.com", status: "Completed", course: "Supply Chain Essentials" }
];

const SAMPLE_COURSES = [
  { id: 1, code: "LOG101", title: "Logistics Management", saqaId: "115826", enrollment: 45, passRate: "88%" },
  { id: 2, code: "SCM202", title: "Supply Chain Essentials", saqaId: "101234", enrollment: 32, passRate: "92%" }
];

app.use('/api/uploads', uploadRoutes);
const registeredModules = registerModuleRoutes(app);

app.get('/api/dashboard', (req, res) => {
  // Simple dashboard data endpoint
  res.json({
    learners: SAMPLE_LEARNERS,
    courses: SAMPLE_COURSES,
    recentSubmissions: getRecent(),
    infrastructure: { aws: "Healthy", gcp: "Healthy", azure: "Healthy" },
    modules: registeredModules
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: appEnvironment,
    releaseVersion,
    uptimeSeconds: Math.round(process.uptime())
  });
});

app.get('/api', (req, res) => {
  res.send('QCTO LMIS Enterprise API running with integrated features');
});

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('QCTO LMIS Enterprise API running with integrated features');
  });
}

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
