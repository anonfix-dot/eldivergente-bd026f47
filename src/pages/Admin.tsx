import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { LogOut, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
  is_approved: boolean | null;
}

export default function Admin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user is admin
    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin role:", error);
    }

    if (!roleData) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadComments();
  };

  const loadComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios",
        variant: "destructive",
      });
      console.error(error);
    } else {
      setComments(data || []);
    }
    setIsLoading(false);
  };

  const handleApprove = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .update({ is_approved: true })
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el comentario",
        variant: "destructive",
      });
      console.error(error);
    } else {
      toast({
        title: "Comentario aprobado",
        description: "El comentario ahora es visible públicamente",
      });
      loadComments();
    }
  };

  const handleReject = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .update({ is_approved: false })
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar el comentario",
        variant: "destructive",
      });
      console.error(error);
    } else {
      toast({
        title: "Comentario rechazado",
        description: "El comentario ya no es visible públicamente",
      });
      loadComments();
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      });
      console.error(error);
    } else {
      toast({
        title: "Comentario eliminado",
        description: "El comentario ha sido eliminado permanentemente",
      });
      loadComments();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  const pendingComments = comments.filter((c) => !c.is_approved);
  const approvedComments = comments.filter((c) => c.is_approved);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-heading text-2xl font-bold">Panel de Administración</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Pending Comments */}
          <section>
            <h2 className="font-heading text-xl font-bold mb-4">
              Comentarios Pendientes ({pendingComments.length})
            </h2>
            {pendingComments.length === 0 ? (
              <p className="text-muted-foreground">No hay comentarios pendientes</p>
            ) : (
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">{comment.author_name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(comment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Artículo ID: {comment.article_id}
                    </p>
                    <p className="whitespace-pre-wrap">{comment.comment_text}</p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Approved Comments */}
          <section>
            <h2 className="font-heading text-xl font-bold mb-4">
              Comentarios Aprobados ({approvedComments.length})
            </h2>
            {approvedComments.length === 0 ? (
              <p className="text-muted-foreground">No hay comentarios aprobados</p>
            ) : (
              <div className="space-y-4">
                {approvedComments.map((comment) => (
                  <Card key={comment.id} className="p-4 bg-muted/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">{comment.author_name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(comment.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Artículo ID: {comment.article_id}
                    </p>
                    <p className="whitespace-pre-wrap">{comment.comment_text}</p>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
