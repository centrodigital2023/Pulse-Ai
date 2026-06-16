import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { GraduationCap, Video, HelpCircle, FileText, Plus, Users, Star, BookOpen } from "lucide-react";

export const Route = createFileRoute("/dashboard/courses")({
  head: () => ({ meta: [{ title: "Cursos — PULSE AI Dashboard" }] }),
  component: Courses,
});

const courseFeatures = [
  { icon: Video, label: "Video lecciones", desc: "Sube videos en HD con streaming optimizado y progreso automático." },
  { icon: HelpCircle, label: "Quizzes interactivos", desc: "Evalúa el aprendizaje con preguntas de opción múltiple y verdadero/falso." },
  { icon: FileText, label: "Material descargable", desc: "Adjunta PDFs, plantillas y recursos a cada lección." },
  { icon: BookOpen, label: "Módulos organizados", desc: "Estructura tu contenido en módulos y secciones con orden arrastrable." },
  { icon: Users, label: "Gestión de estudiantes", desc: "Ve el progreso de cada estudiante, envía mensajes y entrega certificados." },
  { icon: Star, label: "Certificados automáticos", desc: "El sistema genera y envía certificados PDF al completar el curso." },
];

function Courses() {
  return (
    <DashboardLayout
      title="Constructor de Cursos"
      breadcrumb={["Dashboard", "Cursos"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.success("Nuevo curso creado — agrega módulos y lecciones")}>
          <Plus className="size-4" /> Nuevo curso
        </Button>
      }
    >
      <div className="space-y-6">

        {/* Empty state hero */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-10 flex flex-col items-center text-center gap-4">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <GraduationCap className="size-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">Aún no tienes cursos</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Crea tu primer curso online con video, quizzes, certificados y gestión de estudiantes — todo incluido en tu plan PULSE AI.
            </p>
          </div>
          <Button variant="contrast" onClick={() => toast.success("¡Curso creado! Agrega el primer módulo.")}>
            <Plus className="size-4" /> Crear mi primer curso
          </Button>
        </div>

        {/* Feature grid */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Todo lo que incluye el constructor de cursos</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseFeatures.map(f => (
              <div key={f.label} className="rounded-xl bg-surface border border-border p-5 hover:border-primary/30 transition-colors">
                <f.icon className="size-5 text-primary mb-3" />
                <div className="text-sm font-semibold mb-1">{f.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How to create */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Pasos para publicar tu curso</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { n: "1", title: "Nombre y portada", desc: "Define el título, descripción y sube la imagen de portada." },
              { n: "2", title: "Agrega módulos", desc: "Organiza el contenido en secciones temáticas." },
              { n: "3", title: "Sube las lecciones", desc: "Video, texto o quiz — mezcla el formato que prefieras." },
              { n: "4", title: "Publica y vende", desc: "Activa el curso como producto y empieza a recibir estudiantes." },
            ].map(s => (
              <div key={s.n} className="flex gap-3">
                <div className="size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                  {s.n}
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">{s.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
