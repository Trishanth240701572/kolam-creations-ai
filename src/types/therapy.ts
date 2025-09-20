export type Condition = "Autism" | "Alzheimer";
export type UserRole = "Patient" | "Clinician";

export interface Clinician {
  id: string;
  name: string;
  email: string;
  specialty: string;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: Condition;
  assignedClinicianId: string;
}

export interface Metrics {
  date: string;
  tasksCompleted: number;
  avgStrokeAccuracy: number;
  avgStrokePrecision: number;
  avgPathRecallScore?: number;
}

export interface DesignPrinciples {
  symmetry: "none" | "rotational" | "bilateral";
  gridType: "square" | "triangular";
  gridSize: "3x3" | "4x4" | "5x5";
  constraints?: string[];
  notes?: string;
}

export interface KolamDesign {
  id: string;
  svgPath: string;
  previewUrl?: string;
  principles: DesignPrinciples;
}

export interface Task {
  id: string;
  patientId: string;
  date: string;
  kolamId: string;
  mode: "GuidedTraining" | "RecallSequence";
  status: "pending" | "completed" | "skipped";
  result?: {
    strokeAccuracy: number;
    strokePrecision: number;
    pathRecallScore?: number;
    timeTakenSec: number;
    notes?: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}