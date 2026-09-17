import { Router, Request, Response } from 'express';
import { checkDbConnection } from '../db/connection.js';
import * as authCtrl from '../controllers/authController.js';
import * as dashboardCtrl from '../controllers/dashboardController.js';
import * as productsCtrl from '../controllers/productsController.js';
import * as missionsCtrl from '../controllers/missionsController.js';
import * as contactsCtrl from '../controllers/contactsController.js';
import * as buildLogsCtrl from '../controllers/buildLogsController.js';
import * as chaptersCtrl from '../controllers/chaptersController.js';
import * as teamCtrl from '../controllers/teamController.js';
import * as mediaCtrl from '../controllers/mediaController.js';
import * as settingsCtrl from '../controllers/settingsController.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', async (_req: Request, res: Response) => {
  const dbHealth = await checkDbConnection();
  res.json({
    status: dbHealth.connected ? 'healthy' : 'degraded',
    service: 'HDZ Operations Backend API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      provider: 'Supabase PostgreSQL',
      connected: dbHealth.connected,
      latencyMs: dbHealth.latencyMs,
      error: dbHealth.error,
    },
  });
});

// Authentication
apiRouter.post('/auth/signup', authCtrl.signup);
apiRouter.post('/auth/login', authCtrl.login);
apiRouter.get('/auth/users', authCtrl.getUsers);
apiRouter.get('/auth/logins', authCtrl.getUserLogins);

// Dashboard
apiRouter.get('/dashboard/stats', dashboardCtrl.getDashboardStats);
apiRouter.get('/dashboard/activities', dashboardCtrl.getRecentActivities);

// Products
apiRouter.get('/products', productsCtrl.getProducts);
apiRouter.get('/products/:id', productsCtrl.getProductById);
apiRouter.post('/products', productsCtrl.createProduct);
apiRouter.put('/products/:id', productsCtrl.updateProduct);
apiRouter.delete('/products/:id', productsCtrl.deleteProduct);

// Missions
apiRouter.get('/missions', missionsCtrl.getMissions);
apiRouter.get('/missions/:id', missionsCtrl.getMissionById);
apiRouter.post('/missions', missionsCtrl.createMission);
apiRouter.put('/missions/:id', missionsCtrl.updateMission);
apiRouter.delete('/missions/:id', missionsCtrl.deleteMission);

// Contacts (Public inquiry submission & Admin review)
apiRouter.post('/contacts', contactsCtrl.submitContact);
apiRouter.get('/contacts', contactsCtrl.getContacts);
apiRouter.patch('/contacts/:id/status', contactsCtrl.updateContactStatus);
apiRouter.delete('/contacts/:id', contactsCtrl.deleteContact);

// Build Logs
apiRouter.get('/build-logs', buildLogsCtrl.getBuildLogs);
apiRouter.post('/build-logs', buildLogsCtrl.createBuildLog);
apiRouter.delete('/build-logs/:id', buildLogsCtrl.deleteBuildLog);

// Chapters
apiRouter.get('/chapters', chaptersCtrl.getChapters);
apiRouter.post('/chapters', chaptersCtrl.createChapter);

// Team
apiRouter.get('/team', teamCtrl.getTeam);
apiRouter.post('/team', teamCtrl.createTeamMember);

// Media
apiRouter.get('/media', mediaCtrl.getMedia);
apiRouter.post('/media', mediaCtrl.createMedia);

// Settings
apiRouter.get('/settings', settingsCtrl.getSettings);
apiRouter.put('/settings/:key', settingsCtrl.updateSettings);
