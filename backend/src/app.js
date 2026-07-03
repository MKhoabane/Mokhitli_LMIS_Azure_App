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
const isProduction = appEnvironment === 'production';
const configuredOrigins = [
  process.env.APP_BASE_URL,
  ...(process.env.CORS_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
].filter((value, index, values) => values.indexOf(value) === index);

app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === 'false' ? false : isProduction);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    uptimeSeconds: Math.round(process.uptime()),
    frontendBuild: hasFrontendBuild
  });
});

app.get('/api', (req, res) => {
  res.send('QCTO LMIS Enterprise API running with integrated features');
});

if (hasFrontendBuild) {
  app.use(
    express.static(frontendDistPath, {
      maxAge: isProduction ? '1d' : 0,
      setHeaders(res, servedPath) {
        if (servedPath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    })
  );

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
