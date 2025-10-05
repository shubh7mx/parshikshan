import Link from 'next/link';
import { GraduationCap, Target, Users, Award, Lightbulb, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Transforming internship management to bridge the gap between education and industry."
  },
  {
    icon: Shield,
    title: "Compliance First",
    description: "Built with NEP 2020 guidelines at the core, ensuring educational standards."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Leveraging technology to create seamless experiences for all stakeholders."
  },
  {
    icon: Heart,
    title: "Student-Centric",
    description: "Every feature designed to enhance student learning and career development."
  }
];

const stats = [
  { number: "4+", label: "Years of Development" },
  { number: "100+", label: "Educational Institutions" },
  { number: "10K+", label: "Students Served" },
  { number: "500+", label: "Industry Partners" }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Prashiskshan</span>
          </Link>
          
          <nav className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-primary">Prashiskshan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              We are revolutionizing internship management in India by creating a comprehensive, 
              NEP 2020-compliant platform that connects students, educational institutions, 
              and industry partners in meaningful ways.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To create a seamless, technology-driven ecosystem that enhances the quality 
                  of internship experiences while ensuring compliance with educational standards 
                  and fostering meaningful industry-academia collaboration.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe that internships are crucial bridge between theoretical learning 
                  and practical application. Our platform ensures that every internship is 
                  meaningful, tracked, and contributes to both student growth and industry needs.
                </p>
              </div>
              
              <div className="relative">
                <div className="bg-primary/10 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>NEP 2020 Compliant Framework</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Real-time Progress Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Industry-Academia Integration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Automated Credit Management</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide our development and shape our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Prashiskshan Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Prashiskshan?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built specifically for the Indian education ecosystem with a deep understanding of local needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Fragmented internship management processes</li>
                  <li>• Lack of real-time progress tracking</li>
                  <li>• Manual reporting and credit allocation</li>
                  <li>• Limited industry-academia collaboration</li>
                  <li>• Non-compliance with NEP 2020 guidelines</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Unified platform for all stakeholders</li>
                  <li>• Real-time monitoring and analytics</li>
                  <li>• Automated reporting and PDF generation</li>
                  <li>• Seamless industry partner integration</li>
                  <li>• Full NEP 2020 compliance built-in</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              A passionate team of educators, technologists, and industry experts working 
              together to transform internship management in India.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Education Experts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Former faculty and academic administrators who understand the complexities of educational institutions.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Technology Innovators</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Experienced developers and architects building scalable, secure, and user-friendly solutions.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Industry Veterans</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Professionals with deep industry experience who bridge the gap between education and practice.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Future of Internship Management
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Whether you're a student, faculty member, or industry partner, 
              Prashiskshan has something for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/50 border-t">
        <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Prashiskshan. Built for NEP 2020 compliance and educational excellence.</p>
        </div>
      </footer>
    </div>
  );
}