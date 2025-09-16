// controllers/incidentController.ts
import { Request, Response } from "express";
import Incident from "../models/incidentSchema";

export const createIncident = async (req: Request, res: Response) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json({ message: "Incident flagged", incident });
  } catch (err: any) {
    res.status(500).json({ message: "Error creating incident", error: err.message });
  }
};

export const getIncidentsBySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const incidents = await Incident.find({ sessionId });
    res.json(incidents);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching incidents", error: err.message });
  }
};
