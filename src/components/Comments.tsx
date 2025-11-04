import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface CommentsProps {
  articleId: string;
}

const commentSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(1, { message: "El nombre es obligatorio" })
    .max(100, { message: "El nombre debe tener menos de 100 caracteres" }),
  commentText: z
    .string()
    .trim()
    .min(1, { message: "El comentario no puede estar vacío" })
    .max(1000, { message: "El comentario debe tener menos de 1000 caracteres" }),
});

export const Comments = ({ articleId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading comments:", error);
      return;
    }

    setComments(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot detection: if honeypot field is filled, it's a bot
    if (honeypot) {
      console.log("Bot detected via honeypot");
      // Silently fail for bots
      toast({
        title: "Comentario enviado",
        description: "Tu comentario será revisado antes de publicarse.",
      });
      setAuthorName("");
      setCommentText("");
      setHoneypot("");
      return;
    }
    
    // Validar datos
    try {
      commentSchema.parse({
        authorName,
        commentText,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      author_name: authorName.trim(),
      comment_text: commentText.trim(),
      honeypot: honeypot || null,
      is_approved: false, // Comments require approval
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario. Intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comentario enviado",
      description: "Tu comentario será revisado antes de publicarse.",
    });

    // Limpiar formulario y recargar comentarios
    setAuthorName("");
    setCommentText("");
    setHoneypot("");
    loadComments();
  };

  return (
    <div className="py-8">
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
        Comentarios ({comments.length})
      </h2>

      {/* Formulario de nuevo comentario */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-card border border-border rounded-lg">
        <h3 className="font-heading text-xl font-bold mb-4">Deja tu comentario</h3>
        
        <div className="mb-4">
          <Label htmlFor="authorName">Nombre *</Label>
          <Input
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={100}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="commentText">Comentario *</Label>
          <Textarea
            id="commentText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            rows={4}
            maxLength={1000}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            {commentText.length}/1000 caracteres
          </p>
        </div>

        {/* Honeypot field - hidden from users, catches bots */}
        <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Publicar comentario"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Los comentarios son moderados antes de publicarse.
        </p>
      </form>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay comentarios todavía. ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{comment.author_name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{comment.comment_text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
