import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Users, 
  Activity, 
  Target, 
  TrendingUp, 
  Calendar,
  User,
  Building2,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const Therapy = () => {
  const [activeTab, setActiveTab] = useState("autism");
  const [isTaskActive, setIsTaskActive] = useState(false);

  const autismTasks = [
    {
      id: 1,
      title: "Guided Tracing",
      description: "Follow the Kolam pattern with finger movements",
      difficulty: "Easy",
      progress: 75,
      status: "In Progress"
    },
    {
      id: 2,
      title: "Sensory Control",
      description: "Touch-based pattern recognition with haptic feedback",
      difficulty: "Medium",
      progress: 45,
      status: "Active"
    },
    {
      id: 3,
      title: "Motor Training",
      description: "Fine motor skill development through pattern drawing",
      difficulty: "Hard",
      progress: 20,
      status: "Not Started"
    }
  ];

  const alzheimersTasks = [
    {
      id: 1,
      title: "Recall Sequences",
      description: "Remember and recreate Kolam patterns",
      difficulty: "Easy",
      progress: 60,
      status: "Active"
    },
    {
      id: 2,
      title: "Path Planning",
      description: "Plan the drawing sequence for complex patterns",
      difficulty: "Medium",
      progress: 30,
      status: "In Progress"
    },
    {
      id: 3,
      title: "Routine Tasks",
      description: "Daily cognitive exercises with familiar patterns",
      difficulty: "Variable",
      progress: 85,
      status: "Completed"
    }
  ];

  const patientStats = [
    { label: "Sessions Completed", value: "24", trend: "+12%" },
    { label: "Average Score", value: "78%", trend: "+5%" },
    { label: "Streak Days", value: "7", trend: "+2" }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "secondary";
      case "Active": return "default";
      case "In Progress": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-therapeutic-soft/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-therapeutic to-accent bg-clip-text text-transparent">
            Therapy & Learning Interface
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized therapeutic modules using Kolam patterns for autism and Alzheimer's care.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="autism" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Autism Module
            </TabsTrigger>
            <TabsTrigger value="alzheimers" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Alzheimer's Module
            </TabsTrigger>
          </TabsList>

          {/* Autism Module */}
          <TabsContent value="autism" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Type Selection */}
              <Card className="shadow-therapeutic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="therapeutic" className="w-full h-16 flex flex-col">
                    <User className="h-6 w-6 mb-1" />
                    <span className="font-medium">Patient</span>
                    <span className="text-xs opacity-80">Interactive tasks & progress</span>
                  </Button>
                  <Button variant="outline" className="w-full h-16 flex flex-col">
                    <Building2 className="h-6 w-6 mb-1" />
                    <span className="font-medium">Clinic</span>
                    <span className="text-xs opacity-80">Patient management & assignments</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Task Board */}
              <Card className="lg:col-span-2 shadow-kolam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Task Board
                  </CardTitle>
                  <CardDescription>
                    Guided activities for sensory and motor development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {autismTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="p-4 border border-border rounded-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getDifficultyColor(task.difficulty)}`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {task.difficulty}
                            </span>
                            <Badge variant={getStatusColor(task.status)} className="text-xs">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant={task.status === "Active" ? "therapeutic" : "outline"}
                          size="sm"
                          onClick={() => setIsTaskActive(!isTaskActive)}
                        >
                          {isTaskActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Stats Visualization */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Progress Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {patientStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="text-center p-4 bg-therapeutic-soft rounded-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-2xl font-bold text-therapeutic mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {stat.label}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        {stat.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alzheimer's Module */}
          <TabsContent value="alzheimers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Categories */}
              <Card className="shadow-therapeutic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Memory Tasks
                  </CardTitle>
                  <CardDescription>
                    Cognitive exercises using interactive Kolam sequences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alzheimersTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="p-4 border border-border rounded-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                          <Badge variant={getStatusColor(task.status)} className="text-xs">
                            {task.status}
                          </Badge>
                        </div>
                        <Button variant="therapeutic" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress Dashboard */}
              <Card className="shadow-kolam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Progress Dashboard
                  </CardTitle>
                  <CardDescription>
                    Track memory recall with generated Kolams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Recall Score</span>
                      <span className="font-bold text-therapeutic">82%</span>
                    </div>
                    <Progress value={82} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pattern Recognition</span>
                      <span className="font-bold text-therapeutic">75%</span>
                    </div>
                    <Progress value={75} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sequential Memory</span>
                      <span className="font-bold text-therapeutic">68%</span>
                    </div>
                    <Progress value={68} className="h-3" />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="therapeutic" className="w-full">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Generate New Sequence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Adaptive Engine */}
        <Card className="mt-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Adaptive Engine
            </CardTitle>
            <CardDescription>
              Real-time difficulty adjustment and feedback system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Current Settings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Difficulty Level</span>
                    <Badge variant="secondary">Adaptive</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Feedback Type</span>
                    <Badge variant="secondary">Visual + Haptic</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Session Duration</span>
                    <Badge variant="secondary">15 minutes</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium text-therapeutic">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Engagement Level</span>
                    <span className="font-medium text-therapeutic">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Improvement Trend</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Therapy;