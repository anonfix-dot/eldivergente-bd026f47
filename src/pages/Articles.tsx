import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { Newsletter } from "@/components/Newsletter";
import { articles, categories } from "@/data/articles";
import { Button } from "@/components/ui/button";

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredArticles =
    selectedCategory === "Todos"
      ? articles.slice(0, 12)
      : articles.filter((article) => article.category === selectedCategory).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 glow-blue">
            Artículos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Análisis profundo y revelador sobre geopolítica, sociedades secretas, economía oculta y más.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 border-y border-primary/20">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No hay artículos en esta categoría todavía.
              </p>
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Articles;
