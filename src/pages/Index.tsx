import { Link } from "react-router-dom";
import { Eye, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center particles-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 text-center z-10 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 inline-block">
              <Eye className="text-primary animate-float" size={80} />
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 glow-blue">
              AGENDA<span className="text-secondary glow-violet">33</span>
            </h1>
            
            <p className="text-xl md:text-3xl mb-4 text-foreground/90 font-heading">
              Donde las teorías se transforman en conocimiento
            </p>
            
            <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
              Explora los hilos ocultos que mueven el mundo. Análisis independiente de conspiraciones, 
              geopolítica global y las verdades que otros prefieren ignorar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/articles">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <BookOpen className="mr-2" size={20} />
                  Leer Artículos
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="neon" size="lg" className="w-full sm:w-auto">
                  Sobre el Autor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 glow-blue">
            ¿Qué encontrarás aquí?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-card/50 border border-primary/20 glow-box-blue">
              <TrendingUp className="text-primary mx-auto mb-4" size={48} />
              <h3 className="font-heading text-xl font-bold mb-3 text-primary">Geopolítica Global</h3>
              <p className="text-muted-foreground">
                Análisis profundo de las dinámicas de poder mundial y las fuerzas que moldean nuestro presente.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card/50 border border-secondary/20 glow-box-violet">
              <Eye className="text-secondary mx-auto mb-4" size={48} />
              <h3 className="font-heading text-xl font-bold mb-3 text-secondary">Sociedades Secretas</h3>
              <p className="text-muted-foreground">
                Investigación sobre organizaciones y redes de influencia que operan en las sombras del poder.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card/50 border border-primary/20 glow-box-blue">
              <BookOpen className="text-primary mx-auto mb-4" size={48} />
              <h3 className="font-heading text-xl font-bold mb-3 text-primary">Economía Oculta</h3>
              <p className="text-muted-foreground">
                Desentrañando los mecanismos financieros y económicos que controlan nuestras sociedades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 glow-violet">
            Últimos Artículos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/articles">
              <Button variant="outline" size="lg">
                Ver Todos los Artículos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
