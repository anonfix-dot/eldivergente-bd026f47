import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "El email debe tener menos de 255 caracteres" }),
});

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    try {
      emailSchema.parse({ email });
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

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.trim().toLowerCase(),
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Ya estás suscrito",
          description: "Este email ya está registrado en nuestro newsletter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo completar la suscripción. Intenta de nuevo.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "¡Suscripción exitosa!",
      description: "Recibirás nuestros artículos directamente en tu email.",
    });
    setEmail("");
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-primary/20">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/20 glow-box-blue">
            <Mail className="text-primary" size={32} />
          </div>
        </div>
        
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 glow-blue">
          Suscríbete al Newsletter
        </h2>
        <p className="text-muted-foreground mb-8">
          Recibe los últimos análisis y artículos directamente en tu correo. Sin spam, solo contenido de calidad.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-background/50 border-primary/30 focus:border-primary"
          />
          <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Suscribiendo..." : "Suscribirse"}
          </Button>
        </form>
      </div>
    </section>
  );
};
