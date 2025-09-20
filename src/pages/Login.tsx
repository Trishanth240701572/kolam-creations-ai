import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi } from "@/services/mockApi";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await mockApi.login(email, password);
      login(user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`
      });

      // Navigate based on role
      if (user.role === "Clinician") {
        navigate("/clinician/home");
      } else {
        navigate("/patient/home");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-therapeutic/10 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kolam Therapy
          </CardTitle>
          <CardDescription>
            Sign in to access your therapy platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="clinician" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Clinician
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient" className="space-y-4">
              <div className="space-y-2 p-3 bg-therapeutic/5 rounded-lg">
                <p className="text-sm font-medium">Demo Patient Accounts:</p>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => handleQuickLogin("A001", "demo123")}
                    className="block text-left hover:text-primary transition-colors"
                  >
                    • A001 (Ananya S, Autism) - demo123
                  </button>
                  <button
                    onClick={() => handleQuickLogin("Z014", "demo123")}
                    className="block text-left hover:text-primary transition-colors"
                  >
                    • Z014 (Sridhar K, Alzheimer's) - demo123
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clinician" className="space-y-4">
              <div className="space-y-2 p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Demo Clinician Accounts:</p>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => handleQuickLogin("dr_meera@rec.health", "demo123")}
                    className="block text-left hover:text-primary transition-colors"
                  >
                    • dr_meera@rec.health (Dr. Meera Raman) - demo123
                  </button>
                  <button
                    onClick={() => handleQuickLogin("dr_ashok@rec.health", "demo123")}
                    className="block text-left hover:text-primary transition-colors"
                  >
                    • dr_ashok@rec.health (Dr. Ashok Iyer) - demo123
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Patient ID</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === "patient" ? "Enter Patient ID (e.g., A001)" : "Enter email"}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;