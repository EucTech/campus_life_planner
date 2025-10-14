import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Mail, Calendar, Search, BarChart3, Settings, FileText, CheckCircle } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Calendar,
      title: "Task Management",
      description: "Organize assignments, projects, and study sessions with ease",
    },
    {
      icon: Search,
      title: "Regex Search",
      description: "Powerful pattern-based search with case-insensitive options",
    },
    {
      icon: BarChart3,
      title: "Statistics Dashboard",
      description: "Track your productivity with detailed analytics and trends",
    },
    {
      icon: FileText,
      title: "Import/Export",
      description: "Backup and restore your data with JSON import/export",
    },
    {
      icon: CheckCircle,
      title: "Form Validation",
      description: "Advanced regex validation ensures data quality",
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "Configure duration targets and preferences to your needs",
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold">About Campus Life Planner</h1>
        <p className="text-muted-foreground mt-2">
          A modern, accessible task management application built for students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purpose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Campus Life Planner is a comprehensive academic task management system designed to help
            students organize their coursework, track deadlines, and improve productivity. Built
            with accessibility in mind, it features semantic HTML, ARIA live regions, keyboard
            navigation, and responsive design.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The application demonstrates advanced web development concepts including regex
            validation, pattern-based search, localStorage persistence, and data visualization—all
            implemented with vanilla JavaScript and modern CSS.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technical Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Semantic HTML5</Badge>
            <Badge variant="secondary">Responsive Design</Badge>
            <Badge variant="secondary">WCAG AA Compliant</Badge>
            <Badge variant="secondary">Regex Validation</Badge>
            <Badge variant="secondary">localStorage API</Badge>
            <Badge variant="secondary">ES6 Modules</Badge>
            <Badge variant="secondary">Flexbox Layout</Badge>
            <Badge variant="secondary">ARIA Live Regions</Badge>
            <Badge variant="secondary">Keyboard Navigation</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Questions or feedback? Reach out through the following channels:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-github"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:contact@campusplanner.dev" data-testid="link-email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
