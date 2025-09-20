import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Brain, Target, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi } from "@/services/mockApi";
import { Task, Patient, KolamDesign, Metrics } from "@/types/therapy";

const PatientHome = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [kolamDesigns, setKolamDesigns] = useState<{ [key: string]: KolamDesign }>({});
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [patientData, tasksData, metricsData] = await Promise.all([
          mockApi.getPatient(user.id),
          mockApi.getPatientTasks(user.id, today),
          mockApi.getPatientMetrics(user.id, "7d")
        ]);

        setPatient(patientData || null);
        setTodayTasks(tasksData);
        setMetrics(metricsData);

        // Load kolam designs for tasks
        const designs: { [key: string]: KolamDesign } = {};
        for (const task of tasksData) {
          const design = await mockApi.getKolamDesign(task.kolamId);
          if (design) {
            designs[task.kolamId] = design;
          }
        }
        setKolamDesigns(designs);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, today]);

  const getTaskIcon = (mode: string) => {
    return mode === "GuidedTraining" ? Target : Brain;
  };

  const getTaskDescription = (mode: string) => {
    return mode === "GuidedTraining" 
      ? "Follow the guided path to improve motor skills"
      : "Study the pattern, then reproduce from memory";
  };

  const completedTasks = todayTasks.filter(t => t.status === "completed").length;
  const totalTasks = todayTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const latestMetrics = metrics[metrics.length - 1];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your tasks...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Failed to load patient data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-therapeutic/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {patient.name}!</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-therapeutic">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span>{completedTasks}/{totalTasks}</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {latestMetrics && (
            <>
              <Card className="shadow-therapeutic">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-therapeutic" />
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(latestMetrics.avgStrokeAccuracy)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Latest session</p>
                </CardContent>
              </Card>

              <Card className="shadow-therapeutic">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    {patient.condition === "Alzheimer" ? "Recall" : "Precision"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patient.condition === "Alzheimer" 
                      ? `${Math.round(latestMetrics.avgPathRecallScore || 0)}%`
                      : `${Math.round(latestMetrics.avgStrokePrecision)}%`
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Latest session</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Today's Tasks */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-therapeutic" />
              Today's Tasks
            </CardTitle>
            <CardDescription>
              {patient.condition} therapy exercises designed for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks assigned for today.</p>
                <p className="text-sm">Check back tomorrow for new exercises!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayTasks.map((task) => {
                  const design = kolamDesigns[task.kolamId];
                  const TaskIcon = getTaskIcon(task.mode);
                  
                  return (
                    <Card key={task.id} className="group hover:shadow-kolam transition-kolam">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <TaskIcon className="h-5 w-5 text-therapeutic" />
                            {task.mode === "GuidedTraining" ? "Guided Training" : "Recall Exercise"}
                          </CardTitle>
                          <Badge 
                            variant={task.status === "completed" ? "default" : "outline"}
                            className={task.status === "completed" ? "bg-therapeutic text-therapeutic-foreground" : ""}
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {design && (
                          <div className="bg-card rounded-lg p-4 border">
                            <svg viewBox="0 0 100 100" className="w-full h-24">
                              <path
                                d={design.svgPath}
                                fill="none"
                                stroke="hsl(var(--therapeutic))"
                                strokeWidth="2"
                                className="group-hover:stroke-primary transition-colors"
                              />
                            </svg>
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground">
                          {getTaskDescription(task.mode)}
                        </p>

                        {task.result && (
                          <div className="text-xs space-y-1 p-2 bg-therapeutic/5 rounded">
                            <div>Accuracy: {Math.round(task.result.strokeAccuracy)}%</div>
                            <div>Precision: {Math.round(task.result.strokePrecision)}%</div>
                            {task.result.pathRecallScore && (
                              <div>Recall: {Math.round(task.result.pathRecallScore)}%</div>
                            )}
                          </div>
                        )}

                        <Link to={`/patient/task/${task.id}`}>
                          <Button 
                            variant={task.status === "completed" ? "outline" : "default"} 
                            className="w-full"
                            disabled={task.status === "completed"}
                          >
                            {task.status === "completed" ? (
                              "View Results"
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Start Exercise
                              </>
                            )}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>View your therapy journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">7-Day Performance</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Average Accuracy</span>
                    <span>{Math.round(metrics.reduce((acc, m) => acc + m.avgStrokeAccuracy, 0) / metrics.length)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Tasks Completed</span>
                    <span>{metrics.reduce((acc, m) => acc + m.tasksCompleted, 0)}</span>
                  </div>
                  {patient.condition === "Alzheimer" && (
                    <div className="flex justify-between text-xs">
                      <span>Average Recall</span>
                      <span>{Math.round(metrics.reduce((acc, m) => acc + (m.avgPathRecallScore || 0), 0) / metrics.length)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientHome;