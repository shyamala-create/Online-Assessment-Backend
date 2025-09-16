// routes/incidentRoutes.ts
import express from "express";
import { createIncident, getIncidentsBySession } from "../controllers/incidentController";

const incidentRouter = express.Router();
incidentRouter.post("/", createIncident);
incidentRouter.get("/:sessionId", getIncidentsBySession);

export default incidentRouter;
