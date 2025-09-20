import { AuthUser, Task, KolamDesign, DesignPrinciples } from "@/types/therapy";
import { mockClinicians, mockPatients, mockKolamDesigns, mockTasks, generateMockMetrics } from "./mockData";

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async login(email: string, password: string): Promise<AuthUser> {
    await delay();
    
    const clinician = mockClinicians.find(c => c.email === email);
    if (clinician && password === "demo123") {
      return {
        id: clinician.id,
        email: clinician.email,
        role: "Clinician",
        name: clinician.name
      };
    }
    
    const patient = mockPatients.find(p => p.id === email);
    if (patient && password === "demo123") {
      return {
        id: patient.id,
        email: patient.id,
        role: "Patient", 
        name: patient.name
      };
    }
    
    throw new Error("Invalid credentials");
  },

  async getClinicianProfile(id: string) {
    await delay();
    return mockClinicians.find(c => c.id === id);
  },

  async getClinicianPatients(clinicianId: string) {
    await delay();
    return mockPatients.filter(p => p.assignedClinicianId === clinicianId);
  },

  async getPatientMetrics(patientId: string, range: string = "7d") {
    await delay();
    const days = parseInt(range.replace('d', ''));
    return generateMockMetrics(patientId, days);
  },

  async getPatientTasks(patientId: string, date: string) {
    await delay();
    return mockTasks.filter(t => t.patientId === patientId && t.date === date);
  },

  async getPatient(patientId: string) {
    await delay();
    return mockPatients.find(p => p.id === patientId);
  },

  async getTask(taskId: string) {
    await delay();
    return mockTasks.find(t => t.id === taskId);
  },

  async getKolamDesign(kolamId: string) {
    await delay(); 
    return mockKolamDesigns.find(k => k.id === kolamId);
  },

  async generateKolams(patientId: string, principles: DesignPrinciples): Promise<KolamDesign[]> {
    await delay(1500);
    
    // Generate 5 mock designs
    const designs: KolamDesign[] = [];
    for (let i = 0; i < 5; i++) {
      designs.push({
        id: `K${Date.now()}_${i}`,
        svgPath: mockKolamDesigns[i % mockKolamDesigns.length].svgPath,
        principles: { ...principles }
      });
    }
    
    // Create tasks for next day
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const patient = mockPatients.find(p => p.id === patientId);
    const mode = patient?.condition === "Autism" ? "GuidedTraining" : "RecallSequence";
    
    designs.forEach((design, index) => {
      mockTasks.push({
        id: `T${Date.now()}_${index}`,
        patientId,
        date: tomorrow,
        kolamId: design.id,
        mode,
        status: "pending"
      });
    });
    
    return designs;
  },

  async submitTask(taskId: string, attemptData: any) {
    await delay();
    
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Task not found");
    
    const patient = mockPatients.find(p => p.id === task.patientId);
    
    // Mock computation with slight improvement trend
    const baseAccuracy = patient?.condition === "Autism" ? 70 : 60;
    const basePrecision = patient?.condition === "Autism" ? 65 : 58;
    
    const result = {
      strokeAccuracy: Math.min(95, baseAccuracy + Math.random() * 25),
      strokePrecision: Math.min(92, basePrecision + Math.random() * 27),
      pathRecallScore: patient?.condition === "Alzheimer" ? 50 + Math.random() * 40 : undefined,
      timeTakenSec: 120 + Math.random() * 180,
      notes: attemptData.notes
    };
    
    // Update task
    task.status = "completed";
    task.result = result;
    
    return result;
  }
};