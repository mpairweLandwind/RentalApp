import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.mjs';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.post('/signout', signOut)

export default router;