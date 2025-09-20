import { Clinician, Patient, KolamDesign, Task, Metrics } from "@/types/therapy";

export const mockClinicians: Clinician[] = [
  {
    id: "C100",
    name: "Dr. Meera Raman",
    email: "dr_meera@rec.health",
    specialty: "Neurology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "C101",
    name: "Dr. Ashok Iyer",
    email: "dr_ashok@rec.health",
    specialty: "Cognitive Therapy",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
  }
];

export const mockPatients: Patient[] = [
  {
    id: "A001",
    name: "Ananya S",
    age: 10,
    condition: "Autism",
    assignedClinicianId: "C100"
  },
  {
    id: "Z014",
    name: "Sridhar K",
    age: 67,
    condition: "Alzheimer",
    assignedClinicianId: "C100"
  }
];

export const mockKolamDesigns: KolamDesign[] = [
  {
    id: "K001",
    svgPath: "M50,20 L80,50 L50,80 L20,50 Z M35,35 L65,35 L65,65 L35,65 Z",
    principles: {
      symmetry: "rotational",
      gridType: "square",
      gridSize: "3x3",
      constraints: ["single-stroke"]
    }
  },
  {
    id: "K002", 
    svgPath: "M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30 Z",
    principles: {
      symmetry: "bilateral",
      gridType: "square",
      gridSize: "4x4",
      constraints: ["start-top-left"]
    }
  },
  {
    id: "K003",
    svgPath: "M50,10 L90,50 L70,90 L30,90 L10,50 Z M40,30 L60,30 L70,50 L60,70 L40,70 L30,50 Z",
    principles: {
      symmetry: "rotational", 
      gridType: "triangular",
      gridSize: "3x3"
    }
  },
  {
    id: "K004",
    svgPath: "M20,20 L80,20 L80,80 L20,80 Z M35,35 L65,35 M35,50 L65,50 M35,65 L65,65",
    principles: {
      symmetry: "bilateral",
      gridType: "square", 
      gridSize: "4x4",
      constraints: ["avoid-crossings"]
    }
  },
  {
    id: "K005",
    svgPath: "M50,15 L75,40 L50,65 L25,40 Z M50,25 L65,40 L50,55 L35,40 Z",
    principles: {
      symmetry: "rotational",
      gridType: "square",
      gridSize: "5x5"
    }
  }
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockTasks: Task[] = [
  {
    id: "T001",
    patientId: "A001",
    date: today,
    kolamId: "K001",
    mode: "GuidedTraining",
    status: "pending"
  },
  {
    id: "T002", 
    patientId: "A001",
    date: today,
    kolamId: "K002",
    mode: "GuidedTraining", 
    status: "pending"
  },
  {
    id: "T003",
    patientId: "A001",
    date: yesterday,
    kolamId: "K003",
    mode: "GuidedTraining",
    status: "completed",
    result: {
      strokeAccuracy: 72,
      strokePrecision: 68,
      timeTakenSec: 185
    }
  },
  {
    id: "T004",
    patientId: "Z014", 
    date: today,
    kolamId: "K004",
    mode: "RecallSequence",
    status: "pending"
  },
  {
    id: "T005",
    patientId: "Z014",
    date: today, 
    kolamId: "K005",
    mode: "RecallSequence",
    status: "pending"
  }
];

export const generateMockMetrics = (patientId: string, days: number = 7): Metrics[] => {
  const metrics: Metrics[] = [];
  const patient = mockPatients.find(p => p.id === patientId);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    
    if (patient?.condition === "Autism") {
      metrics.push({
        date,
        tasksCompleted: Math.floor(Math.random() * 3) + 1,
        avgStrokeAccuracy: 62 + Math.random() * 12, // 62-74%
        avgStrokePrecision: 58 + Math.random() * 12  // 58-70%
      });
    } else {
      metrics.push({
        date,
        tasksCompleted: Math.floor(Math.random() * 3) + 1,
        avgStrokeAccuracy: 55 + Math.random() * 11, // 55-66%
        avgStrokePrecision: 52 + Math.random() * 10, // 52-62%
        avgPathRecallScore: 45 + Math.random() * 15  // 45-60%
      });
    }
  }
  
  return metrics;
};