import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";
import { Patient, KolamDesign, DesignPrinciples } from "@/types/therapy";

const Generator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [gridType, setGridType] = useState<"square" | "triangular">("square");
  const [gridSize, setGridSize] = useState<"3x3" | "4x4" | "5x5">("3x3");
  const [symmetry, setSymmetry] = useState<"none" | "rotational" | "bilateral">("none");
  const [constraints, setConstraints] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<KolamDesign[]>([]);

  const availableConstraints = [
    "single-stroke",
    "start-top-left", 
    "end-bottom-right",
    "avoid-crossings"
  ];

  useEffect(() => {
    const loadPatients = async () => {
      if (!user || user.role !== "Clinician") return;
      
      try {
        const patientsData = await mockApi.getClinicianPatients(user.id);
        setPatients(patientsData);
      } catch (error) {
        console.error("Failed to load patients:", error);
      }
    };

    loadPatients();
  }, [user]);

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  const toggleConstraint = (constraint: string) => {
    setConstraints(prev => 
      prev.includes(constraint)
        ? prev.filter(c => c !== constraint)
        : [...prev, constraint]
    );
  };

  const handleGenerate = async () => {
    if (!selectedPatient) {
      toast({
        title: "Patient required",
        description: "Please select a patient before generating designs.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const principles: DesignPrinciples = {
        symmetry,
        gridType,
        gridSize,
        constraints,
        notes
      };

      const designs = await mockApi.generateKolams(selectedPatient, principles);
      setGeneratedDesigns(designs);
      
      toast({
        title: "Designs Generated!",
        description: `5 designs assigned to ${selectedPatientData?.name} for tomorrow.`
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate designs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient("");
    setGridType("square");
    setGridSize("3x3");
    setSymmetry("none");
    setConstraints([]);
    setNotes("");
    setGeneratedDesigns([]);
  };

  if (user?.role !== "Clinician") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Access denied. Clinicians only.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Kolam Generator
          </h1>
          <p className="text-muted-foreground">
            Create personalized therapeutic Kolam designs for your patients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generator Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Design Parameters
              </CardTitle>
              <CardDescription>
                Configure the therapeutic Kolam patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient">Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id}) - {patient.condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPatientData && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {selectedPatientData.condition}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Age {selectedPatientData.age}
                    </span>
                  </div>
                )}
              </div>

              {/* Grid Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gridType">Grid Type</Label>
                  <Select value={gridType} onValueChange={(value: "square" | "triangular") => setGridType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="triangular">Triangular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gridSize">Grid Size</Label>
                  <Select value={gridSize} onValueChange={(value: "3x3" | "4x4" | "5x5") => setGridSize(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3x3">3×3</SelectItem>
                      <SelectItem value="4x4">4×4</SelectItem>
                      <SelectItem value="5x5">5×5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Symmetry */}
              <div className="space-y-2">
                <Label htmlFor="symmetry">Symmetry</Label>
                <Select value={symmetry} onValueChange={(value: "none" | "rotational" | "bilateral") => setSymmetry(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rotational">Rotational</SelectItem>
                    <SelectItem value="bilateral">Bilateral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Constraints */}
              <div className="space-y-3">
                <Label>Constraints</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableConstraints.map((constraint) => (
                    <div key={constraint} className="flex items-center space-x-2">
                      <Checkbox
                        id={constraint}
                        checked={constraints.includes(constraint)}
                        onCheckedChange={() => toggleConstraint(constraint)}
                      />
                      <Label htmlFor={constraint} className="text-sm">
                        {constraint.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any specific requirements or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !selectedPatient}
                  className="flex-1"
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate 5 Designs
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Designs */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-therapeutic" />
                Generated Designs
              </CardTitle>
              <CardDescription>
                {generatedDesigns.length > 0 
                  ? `${generatedDesigns.length} designs ready for assignment`
                  : "Designs will appear here after generation"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedDesigns.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Generate designs to see them here</p>
                  <p className="text-sm">Configure parameters and click Generate</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {generatedDesigns.map((design, index) => (
                      <Card key={design.id} className="border hover:shadow-kolam transition-kolam">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Design {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-card rounded-lg p-4 border mb-3">
                            <svg viewBox="0 0 100 100" className="w-full h-20">
                              <path
                                d={design.svgPath}
                                fill="none"
                                stroke="hsl(var(--therapeutic))"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {design.principles.gridSize}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {design.principles.gridType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {design.principles.symmetry}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-therapeutic">
                      <CheckCircle className="h-4 w-4" />
                      <span>Assigned to {selectedPatientData?.name} for tomorrow</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generator;