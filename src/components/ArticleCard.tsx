import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

export const ArticleCard = ({ id, title, excerpt, image, category, date }: ArticleCardProps) => {
  return (
    <Card className="bg-card border border-primary/20 overflow-hidden group hover:border-primary/50 transition-all duration-300 glow-box-blue h-full flex flex-col">
      <div className="relative overflow-hidden h-72">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow pb-3">
        <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
        <Link to={`/article/${id}`}>
          <Button variant="ghost" size="sm" className="group/btn">
            Leer más
            <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
