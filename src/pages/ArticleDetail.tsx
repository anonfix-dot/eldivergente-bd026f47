import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2, Twitter, Facebook } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Artículo no encontrado</h1>
          <Link to="/articles">
            <Button variant="outline">Volver a Artículos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 2);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Article Header */}
      <article className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/articles">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2" size={16} />
              Volver a Artículos
            </Button>
          </Link>

          <div className="mb-6">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/50">
              {article.category}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 glow-blue">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
          </div>

          <div className="relative mb-12 rounded-lg overflow-hidden border border-primary/20 glow-box-blue">
            <img src={article.image} alt={article.title} className="w-full h-auto" />
          </div>

          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ children }) => (
                  <h2 className="font-heading text-3xl font-bold mt-12 mb-6 text-primary glow-blue">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-heading text-2xl font-bold mt-8 mb-4 text-secondary glow-violet">{children}</h3>
                ),
                p: ({ children }) => <p className="text-foreground/90 mb-6 leading-relaxed">{children}</p>,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Share Buttons */}
          <div className="border-t border-primary/20 pt-8 mb-12">
            <h3 className="font-heading text-xl font-bold mb-4">Compartir este artículo</h3>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Twitter size={16} className="mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Facebook size={16} className="mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm">
                <Share2 size={16} className="mr-2" />
                Copiar enlace
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-primary/20 pt-12">
              <h3 className="font-heading text-2xl font-bold mb-8 glow-violet">Artículos Relacionados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} {...relatedArticle} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
