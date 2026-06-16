import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/mock-data";
import {
  BookOpen, Video, HelpCircle, FileText, CheckSquare,
  ChevronDown, ChevronRight, Plus, GraduationCap, Users, Star
} from "lucide-react";

export const Route = createFileRoute("/dashboard/courses")({
  head: () => ({ meta: [{ title: "Cursos — PULSE AI Dashboard" }] }),
  component: Courses,
});

const lessonIcon = {
  video: Video,
  quiz: HelpCircle,
  assignment: CheckSquare,
  text: FileText,
} as const;

function Courses() {
  const [selectedId, setSelectedId] = useState(courses[0]?.id ?? "");
  const [expandedModules, setExpandedModules] = useState<string[]>(
    courses[0]?.modules[0]?.id ? [courses[0].modules[0].id] : [],
  );
  const course = courses.find((c) => c.id === selectedId);

  const toggleModule = (id: string) =>
    setExpandedModules((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  if (courses.length === 0 || !course) {
    return (
      <DashboardLayout
        title="Constructor de Cursos"
        breadcrumb={["Dashboard", "Cursos"]}
        actions={
          <Button variant="contrast" size="sm" onClick={() => toast.success("Nuevo curso creado")}>
            <Plus className="size-4" /> Nuevo curso
          </Button>
        }
      >
        <div className="rounded-xl bg-surface border border-border p-12 text-center">
          <GraduationCap className="size-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aún no tienes cursos</h3>
          <p className="text-sm text-muted-foreground mb-4">Crea tu primer curso con módulos, lecciones y certificados automáticos.</p>
          <Button variant="contrast" onClick={() => toast.success("Nuevo curso creado")}>
            <Plus className="size-4" /> Crear mi primer curso
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Constructor de Cursos"
      breadcrumb={["Dashboard", "Cursos"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.success("Nuevo curso creado")}>
          <Plus className="size-4" /> Nuevo curso
        </Button>
      }
    >
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Course list sidebar */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Mis Cursos</div>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full p-4 rounded-xl border text-left transition-colors ${
                c.id === selectedId ? "bg-primary/10 border-primary/30" : "bg-surface border-border hover:border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-sm font-medium line-clamp-2">{c.title}</div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono shrink-0 ${c.status === "live" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="size-3" /> {c.students}</span>
                <span className="flex items-center gap-1"><Star className="size-3 fill-current text-primary" /> {c.rating}</span>
                <span>{c.completionRate}% completado</span>
              </div>
            </button>
          ))}
        </div>

        {/* Course detail */}
        <div className="space-y-4">
          {/* Course header */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-xl">{course.title}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${course.status === "live" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {course.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{course.subtitle}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Configuración abierta")}>
                Configurar
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Estudiantes", value: course.students.toLocaleString() },
                { icon: GraduationCap, label: "Completaron", value: `${course.completionRate}%` },
                { icon: Star, label: "Valoración", value: `${course.rating}/5.0` },
                { icon: BookOpen, label: "Módulos", value: course.modules.length.toString() },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-black/20 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <s.icon className="size-3.5 text-primary" />
                    <div className="text-[10px] font-mono text-muted-foreground">{s.label.toUpperCase()}</div>
                  </div>
                  <div className="text-xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum builder */}
          <div className="rounded-xl bg-surface border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Currículo del Curso</h3>
              <Button variant="outline" size="sm" onClick={() => toast.success("Módulo agregado")}>
                <Plus className="size-3.5" /> Módulo
              </Button>
            </div>
            <div className="divide-y divide-border">
              {course.modules.map((mod) => {
                const expanded = expandedModules.includes(mod.id);
                const totalDuration = mod.lessons.filter(l => l.kind === "video").length;
                return (
                  <div key={mod.id}>
                    {/* Module header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-black/10 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        {expanded ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                        <div>
                          <div className="text-sm font-semibold">{mod.title}</div>
                          <div className="text-[10px] text-muted-foreground">{mod.lessons.length} lecciones · {totalDuration} videos</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 text-[10px]"
                        onClick={(e) => { e.stopPropagation(); toast.success("Lección agregada"); }}>
                        + Lección
                      </Button>
                    </button>

                    {/* Lessons */}
                    {expanded && (
                      <div className="bg-black/10 divide-y divide-border/50">
                        {mod.lessons.map((lesson) => {
                          const Icon = lessonIcon[lesson.kind];
                          return (
                            <div key={lesson.id} className="flex items-center gap-4 px-8 py-3 hover:bg-black/10 transition-colors cursor-pointer group">
                              <div className={`size-6 rounded flex items-center justify-center shrink-0 ${lesson.published ? "bg-primary/10 border border-primary/20" : "bg-secondary border border-border"}`}>
                                <Icon className={`size-3 ${lesson.published ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm ${!lesson.published ? "text-muted-foreground" : ""}`}>{lesson.title}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-muted-foreground">{lesson.duration}</span>
                                {!lesson.published && (
                                  <span className="px-2 py-0.5 rounded bg-secondary text-[9px] font-mono text-muted-foreground">DRAFT</span>
                                )}
                                <Button variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 text-[10px]"
                                  onClick={() => toast.success("Editando lección")}>
                                  Editar
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate settings */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Certificados Automáticos</h3>
              </div>
              <Button variant="contrast" size="sm" onClick={() => toast.success("Certificado configurado")}>
                Configurar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Los estudiantes reciben un certificado firmado digitalmente al completar el 100% del curso.
            </p>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-border">
              <div className="size-12 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                <GraduationCap className="size-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Certificado de Finalización</div>
                <div className="text-[10px] text-muted-foreground">PDF firmado · Verificable en línea · ID único</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
