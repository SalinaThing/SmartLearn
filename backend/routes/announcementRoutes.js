import express from 'express';
import { createAnnouncement, deleteAnnouncement, getAnnouncementsByCourse } from '../controllers/announcementController.js';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.js';
import { updateAccessToken } from '../controllers/userController.js';

const announcementRouter = express.Router();

announcementRouter.post('/create-announcement', updateAccessToken, isAuthenticated, authorizeRoles("teacher"), createAnnouncement);
announcementRouter.get('/get-announcements/:courseId', getAnnouncementsByCourse);
announcementRouter.delete('/delete-announcement/:id', updateAccessToken, isAuthenticated, authorizeRoles("teacher"), deleteAnnouncement);

export default announcementRouter;
