import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { User, Calendar, Target, Brain, TrendingUp, FileText } from "lucide-react";
import { mockApi } from "@/services/mockApi";
import { Patient, Metrics, Task, KolamDesign } from "@/types/therapy";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const [patientData, metricsData] = await Promise.all([
          mockApi.getPatient(id),
          mockApi.getPatientMetrics(id, "7d")
        ]);

        setPatient(patientData || null);
        setMetrics(metricsData);
        
        // Load saved notes from localStorage
        const savedNotes = localStorage.getItem(`patient_notes_${id}`);
        if (savedNotes) {
          setNotes(savedNotes);
        }
      } catch (error) {
        console.error("Failed to load patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const saveNotes = () => {
    if (id) {
      localStorage.setItem(`patient_notes_${id}`, notes);
    }
  };

  const latestMetrics = metrics[metrics.length - 1];
  const avgAccuracy = metrics.reduce((acc, m) => acc + m.avgStrokeAccuracy, 0) / metrics.length;
  const avgPrecision = metrics.reduce((acc, m) => acc + m.avgStrokePrecision, 0) / metrics.length;
  const avgRecall = patient?.condition === "Alzheimer" 
    ? metrics.reduce((acc, m) => acc + (m.avgPathRecallScore || 0), 0) / metrics.length 
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading patient details...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Patient Header */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-therapeutic/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{patient.name}</CardTitle>
                  <CardDescription className="text-lg">
                    Patient ID: {patient.id} • Age: {patient.age}
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={patient.condition === "Autism" ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {patient.condition}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-therapeutic">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-therapeutic" />
                    Avg Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(avgAccuracy)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {latestMetrics && Math.round(latestMetrics.avgStrokeAccuracy)}% latest
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-therapeutic">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent" />
                    Avg Precision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(avgPrecision)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {latestMetrics && Math.round(latestMetrics.avgStrokePrecision)}% latest
                  </p>
                </CardContent>
              </Card>

              {avgRecall !== undefined && (
                <Card className="shadow-therapeutic">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Avg Recall
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(avgRecall)}%</div>
                    <p className="text-xs text-muted-foreground">
                      {latestMetrics && Math.round(latestMetrics.avgPathRecallScore || 0)}% latest
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Progress Chart */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>7-Day Progress Chart</CardTitle>
                <CardDescription>Performance trends over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value, name) => [`${Math.round(Number(value))}%`, name]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgStrokeAccuracy" 
                        stroke="hsl(var(--therapeutic))" 
                        strokeWidth={2}
                        name="Accuracy"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgStrokePrecision" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Precision"
                      />
                      {patient.condition === "Alzheimer" && (
                        <Line 
                          type="monotone" 
                          dataKey="avgPathRecallScore" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          name="Recall"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Design Principles History */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Recent Design Principles</CardTitle>
                <CardDescription>Patterns used in therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">3x3 Grid</Badge>
                  <Badge variant="outline">Rotational</Badge>
                  <Badge variant="outline">Single-stroke</Badge>
                  <Badge variant="outline">4x4 Grid</Badge>
                  <Badge variant="outline">Bilateral</Badge>
                  <Badge variant="outline">Triangular</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Task History</CardTitle>
                <CardDescription>Complete list of assigned tasks and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be populated with actual task data */}
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Task history will be displayed here</p>
                    <p className="text-sm">View tasks grouped by date with results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Clinician Notes</CardTitle>
                <CardDescription>Add observations and treatment notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your notes about the patient's progress, behavior, or any observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button onClick={saveNotes} className="w-full">
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDetail;