import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Users, Brain, TrendingUp, Sparkles, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi } from "@/services/mockApi";
import { Clinician, Patient } from "@/types/therapy";

const ClinicianHome = () => {
  const { user } = useAuth();
  const [clinician, setClinician] = useState<Clinician | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [clinicianData, patientsData] = await Promise.all([
          mockApi.getClinicianProfile(user.id),
          mockApi.getClinicianPatients(user.id)
        ]);
        
        setClinician(clinicianData || null);
        setPatients(patientsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const mockChartData = [
    { name: "Mon", accuracy: 65, precision: 62 },
    { name: "Tue", accuracy: 68, precision: 65 },
    { name: "Wed", accuracy: 71, precision: 68 },
    { name: "Thu", accuracy: 73, precision: 70 },
    { name: "Fri", accuracy: 75, precision: 72 },
    { name: "Sat", accuracy: 78, precision: 75 },
    { name: "Sun", accuracy: 80, precision: 77 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!clinician) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Failed to load clinician data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clinician Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {clinician.name}</p>
          </div>
          <Link to="/clinician/generator">
            <Button className="w-full md:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              Open Generator
            </Button>
          </Link>
        </div>

        {/* Profile and Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={clinician.avatarUrl} alt={clinician.name} />
                  <AvatarFallback>{clinician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{clinician.name}</div>
                  <div className="text-sm text-muted-foreground">{clinician.specialty}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Email:</span> {clinician.email}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Patients:</span> {patients.length}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Active Today:</span> {patients.length}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-therapeutic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-therapeutic" />
                  Total Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">Active in therapy</p>
              </CardContent>
            </Card>

            <Card className="shadow-therapeutic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  Avg Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>

            <Card className="shadow-therapeutic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chart and Patients Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Average accuracy and precision trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--therapeutic))" strokeWidth={2} />
                    <Line type="monotone" dataKey="precision" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
              <CardDescription>Current patient assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{patient.id} • Age {patient.age}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.condition === "Autism" ? "default" : "secondary"}>
                          {patient.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-therapeutic border-therapeutic">
                          2 tasks pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/clinician/patient/${patient.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClinicianHome;