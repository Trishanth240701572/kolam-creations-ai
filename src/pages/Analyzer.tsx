import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Palette, Grid3X3, Eye, Download, RotateCcw, Zap } from "lucide-react";

const Analyzer = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const kolamTypes = [
    { id: "padi", label: "Padi Kolam", description: "Traditional grid-based patterns" },
    { id: "pulli", label: "Pulli Kolam", description: "Dot-connected designs" },
    { id: "sikku", label: "Sikku Kolam", description: "Continuous line patterns" },
    { id: "freeform", label: "Freeform", description: "Creative interpretations" }
  ];

  const analysisFeatures = [
    { icon: Grid3X3, title: "Symmetry Analysis", value: "85% Bilateral" },
    { icon: Eye, title: "Dot Extraction", value: "247 Points" },
    { icon: RotateCcw, title: "Eulerian Path", value: "Valid" },
    { icon: Zap, title: "Complexity Score", value: "7.2/10" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Simulate analysis
        setTimeout(() => {
          setAnalysisResults({
            symmetry: "85% Bilateral",
            dots: 247,
            path: "Valid Eulerian",
            complexity: 7.2
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kolam Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload or draw Kolam patterns to get detailed analysis of their mathematical and cultural properties.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-kolam">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Kolam
              </CardTitle>
              <CardDescription>
                Choose your preferred input method and Kolam type for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-kolam hover:border-primary/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded Kolam"
                      className="max-w-full h-48 object-contain mx-auto rounded-lg shadow-elegant"
                    />
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Upload Kolam Image</p>
                        <p className="text-sm text-muted-foreground">
                          Or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Drawing Option */}
              <div className="text-center">
                <Button variant="outline" className="w-full">
                  <Palette className="mr-2 h-4 w-4" />
                  Draw on Grid
                </Button>
              </div>

              {/* Kolam Type Selection */}
              <div className="space-y-3">
                <h3 className="font-medium">Select Kolam Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {kolamTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start text-left"
                    >
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="shadow-therapeutic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Mathematical and cultural insights from your Kolam pattern.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedImage && analysisResults ? (
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="geometry">Geometry</TabsTrigger>
                    <TabsTrigger value="cultural">Cultural</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {analysisFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <div
                            key={feature.title}
                            className="p-4 bg-secondary/30 rounded-lg animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <Icon className="h-6 w-6 text-primary mb-2" />
                            <p className="font-medium text-sm">{feature.title}</p>
                            <p className="text-lg font-bold text-primary">{feature.value}</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <Button variant="hero" className="w-full">
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Variations
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Export Analysis
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="geometry" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Symmetry Type</span>
                        <Badge variant="secondary">Bilateral</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Rotation Order</span>
                        <Badge variant="secondary">4-fold</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Fractal Dimension</span>
                        <Badge variant="secondary">1.34</Badge>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cultural" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Pattern Meaning</h4>
                        <p className="text-sm text-muted-foreground">
                          This Kolam represents prosperity and welcoming energy, traditionally drawn at dawn to invite positive forces.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Regional Style</h4>
                        <Badge variant="outline">Tamil Nadu Traditional</Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a Kolam image to see detailed analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connected Modules */}
        {uploadedImage && (
          <Card className="mt-8 shadow-elegant">
            <CardHeader>
              <CardTitle>Connected Modules</CardTitle>
              <CardDescription>
                Explore your analyzed Kolam in different contexts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="therapeutic" className="h-20 flex flex-col">
                  <span className="font-medium">Therapy Tasks</span>
                  <span className="text-xs opacity-80">Generate therapeutic exercises</span>
                </Button>
                <Button variant="cultural" className="h-20 flex flex-col">
                  <span className="font-medium">Teaching Puzzles</span>
                  <span className="text-xs opacity-80">Create educational content</span>
                </Button>
                <Button variant="kolam" className="h-20 flex flex-col">
                  <span className="font-medium">Extract Designs</span>
                  <span className="text-xs opacity-80">Generate pattern variations</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analyzer;