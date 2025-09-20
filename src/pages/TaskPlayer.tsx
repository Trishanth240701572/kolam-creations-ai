import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, CheckCircle, ArrowLeft, Target, Brain, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";
import { Task, KolamDesign, Patient } from "@/types/therapy";

const TaskPlayer = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [task, setTask] = useState<Task | null>(null);
  const [design, setDesign] = useState<KolamDesign | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Task state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [phase, setPhase] = useState<"preview" | "practice" | "completed">("preview");
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const loadTaskData = async () => {
      if (!taskId) return;

      try {
        const taskData = await mockApi.getTask(taskId);
        if (!taskData) throw new Error("Task not found");
        
        const [designData, patientData] = await Promise.all([
          mockApi.getKolamDesign(taskData.kolamId),
          mockApi.getPatient(taskData.patientId)
        ]);

        setTask(taskData);
        setDesign(designData || null);
        setPatient(patientData || null);
        
        // Set initial phase based on task mode
        if (taskData.mode === "RecallSequence") {
          setPhase("preview");
          setShowGuide(true);
          // Auto-hide guide after 10 seconds for recall sequence
          setTimeout(() => {
            setShowGuide(false);
            setPhase("practice");
          }, 10000);
        } else {
          setPhase("practice");
          setShowGuide(true);
        }
      } catch (error) {
        console.error("Failed to load task:", error);
        toast({
          title: "Error",
          description: "Failed to load task data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTaskData();
  }, [taskId, toast]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && phase === "practice") {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  const handleStart = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
    if (task?.mode === "GuidedTraining") {
      setShowGuide(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setTimeElapsed(0);
    if (task?.mode === "RecallSequence") {
      setPhase("preview");
      setShowGuide(true);
      setTimeout(() => {
        setShowGuide(false);
        setPhase("practice");
      }, 5000);
    }
  };

  const handleComplete = async () => {
    if (!task) return;

    setIsPlaying(false);
    setPhase("completed");

    try {
      const result = await mockApi.submitTask(task.id, {
        progress,
        timeElapsed,
        notes: "Task completed"
      });

      setTask(prev => prev ? { ...prev, status: "completed", result } : null);

      toast({
        title: "Task Completed!",
        description: "Your performance has been recorded."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit task results",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading task...</div>
      </div>
    );
  }

  if (!task || !design || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Task data not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-therapeutic/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {task.mode === "GuidedTraining" ? "Guided Training" : "Recall Exercise"}
            </h1>
            <p className="text-muted-foreground">{patient.name} • {patient.condition}</p>
          </div>
          <Badge variant={phase === "completed" ? "default" : "outline"}>
            {phase === "completed" ? "Completed" : phase === "preview" ? "Preview" : "Practice"}
          </Badge>
        </div>

        {/* Task Info */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {task.mode === "GuidedTraining" ? (
                <Target className="h-5 w-5 text-therapeutic" />
              ) : (
                <Brain className="h-5 w-5 text-accent" />
              )}
              {task.mode === "GuidedTraining" ? "Motor Skills Training" : "Memory Recall Exercise"}
            </CardTitle>
            <CardDescription>
              {task.mode === "GuidedTraining" 
                ? "Follow the guided path to improve your motor precision and stroke accuracy"
                : phase === "preview" 
                  ? "Study the pattern carefully - you'll need to reproduce it from memory"
                  : "Reproduce the pattern you saw during the preview phase"
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Task Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolam Display */}
          <div className="lg:col-span-2">
            <Card className="shadow-kolam">
              <CardContent className="p-8">
                <div className="aspect-square bg-card rounded-lg border-2 border-dashed border-border p-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main pattern */}
                    <path
                      d={design.svgPath}
                      fill="none"
                      stroke="hsl(var(--foreground))"
                      strokeWidth="2"
                      opacity={showGuide ? 1 : 0.3}
                      className="transition-opacity duration-500"
                    />
                    
                    {/* Guided path overlay */}
                    {showGuide && (
                      <path
                        d={design.svgPath}
                        fill="none"
                        stroke="hsl(var(--therapeutic))"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        opacity={0.8}
                        className="animate-pulse"
                      />
                    )}
                    
                    {/* Progress indicator */}
                    {isPlaying && task.mode === "GuidedTraining" && (
                      <circle
                        r="3"
                        fill="hsl(var(--primary))"
                        className="animate-pulse"
                      >
                        <animateMotion dur="10s" repeatCount="indefinite">
                          <mpath href={`#${design.id}-path`} />
                        </animateMotion>
                      </circle>
                    )}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Timer */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono">{formatTime(timeElapsed)}</div>
              </CardContent>
            </Card>

            {/* Progress */}
            {task.mode === "GuidedTraining" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Practice Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={progress} className="h-2" />
                  <Slider
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    max={100}
                    step={1}
                    disabled={!isPlaying}
                  />
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phase === "preview" ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Memorize this pattern
                    </p>
                    <div className="text-lg font-mono">
                      {Math.max(0, 10 - Math.floor(timeElapsed))}s
                    </div>
                  </div>
                ) : phase === "practice" ? (
                  <div className="space-y-2">
                    {!isPlaying ? (
                      <Button onClick={handleStart} className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Start Practice
                      </Button>
                    ) : (
                      <Button onClick={handlePause} variant="outline" className="w-full">
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    
                    <Button onClick={handleReset} variant="outline" className="w-full">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>

                    {task.mode === "RecallSequence" && (
                      <Button 
                        onClick={() => setShowGuide(!showGuide)} 
                        variant="ghost" 
                        className="w-full"
                      >
                        {showGuide ? "Hide" : "Show"} Hint
                      </Button>
                    )}

                    <Button 
                      onClick={handleComplete} 
                      className="w-full"
                      disabled={progress < 50 && task.mode === "GuidedTraining"}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Task
                    </Button>
                  </div>
                ) : (
                  // Completed phase
                  <div className="space-y-4">
                    {task.result && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Your Results:</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-mono">{Math.round(task.result.strokeAccuracy)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precision:</span>
                            <span className="font-mono">{Math.round(task.result.strokePrecision)}%</span>
                          </div>
                          {task.result.pathRecallScore && (
                            <div className="flex justify-between">
                              <span>Recall:</span>
                              <span className="font-mono">{Math.round(task.result.pathRecallScore)}%</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-mono">{formatTime(Math.round(task.result.timeTakenSec))}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => navigate(patient.id.startsWith('A') || patient.id.startsWith('Z') ? '/patient/home' : '/clinician/home')} 
                      className="w-full"
                    >
                      Back to Tasks
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPlayer;