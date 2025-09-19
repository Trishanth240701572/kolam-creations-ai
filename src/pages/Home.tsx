import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Sparkles, Heart, GraduationCap, BarChart3, Zap, Users, Brain } from "lucide-react";
import kolamHero from "@/assets/kolam-hero.jpg";

const Home = () => {
  const features = [
    {
      icon: Search,
      title: "Kolam Analyzer",
      description: "Upload or draw Kolam patterns and get detailed analysis of symmetry, geometry, and cultural significance.",
      link: "/analyzer",
      variant: "default" as const
    },
    {
      icon: Sparkles,
      title: "AI Generator",
      description: "Generate beautiful Kolam patterns with AI, customized for therapeutic and educational purposes.",
      link: "/generator",
      variant: "hero" as const
    },
    {
      icon: Heart,
      title: "Therapy Modules",
      description: "Specialized modules for autism and Alzheimer's therapy using interactive Kolam patterns.",
      link: "/therapy",
      variant: "therapeutic" as const
    },
    {
      icon: GraduationCap,
      title: "Education Hub",
      description: "Learn geometry, symmetry, and cultural heritage through interactive Kolam experiences.",
      link: "/education",
      variant: "cultural" as const
    }
  ];

  const stats = [
    { icon: Users, label: "Therapeutic Sessions", value: "1,200+" },
    { icon: Brain, label: "Learning Patterns", value: "500+" },
    { icon: Zap, label: "Generated Kolams", value: "10,000+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${kolamHero})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                Kolam AI
              </span>
              <br />
              <span className="text-white">Analyze, Generate & Learn</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Bridging traditional Indian art with modern AI technology for therapeutic, educational, and cultural exploration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Link to="/analyzer">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Try Analyzer
                </Button>
              </Link>
              <Link to="/generator">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Kolam
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the intersection of traditional art, artificial intelligence, and therapeutic applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="group hover:shadow-kolam transition-kolam animate-fade-in-up border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg w-fit">
                      <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-kolam" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4">
                      {feature.description}
                    </CardDescription>
                    <Link to={feature.link}>
                      <Button variant={feature.variant} className="w-full">
                        Explore
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="h-8 w-8 mx-auto mb-4 text-primary-foreground/80" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-therapeutic to-accent text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Kolam AI?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join us in bridging traditional art with modern technology for therapeutic and educational innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;