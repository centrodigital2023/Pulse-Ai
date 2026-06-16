import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Bot, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/ai")({
  head: () => ({ meta: [{ title: "AI Assistant — PULSE AI Dashboard" }] }),
  component: AiAssistant,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content: "¡Hola! Soy el AI Assistant de PULSE AI. Estoy entrenado sobre todos tus productos, clientes, métricas y patrones de comportamiento. ¿En qué puedo ayudarte hoy?\n\nPuedes preguntarme sobre:\n• Análisis de ingresos y tendencias\n• Oportunidades de upsell o cross-sell\n• Clientes en riesgo de abandono\n• Recomendaciones de automatización\n• Optimización de precios",
  },
];

const quickPrompts = [
  "¿Cuáles son mis productos con mayor crecimiento este mes?",
  "¿Qué clientes están en riesgo de abandono?",
  "Sugiere una campaña de email para aumentar conversiones",
  "Analiza el funnel de checkout y recomienda mejoras",
];

const mockResponses: Record<string, string> = {
  "¿Cuáles son mis productos con mayor crecimiento este mes?": "Basándome en tus datos de los últimos 30 días:\n\n1. **Complete AI Engineering Masterclass** — +42% en ventas (429 → 611 proyectadas)\n2. **Enterprise Design System** — +28% en nuevas suscripciones mensuales\n3. **Neural-Kit SDK** — Estable con +8% en activaciones de licencias enterprise\n\nEl masterclass de AI muestra el mayor momentum. Recomiendo aumentar el presupuesto de afiliados para ese producto en un 30%.",
  "¿Qué clientes están en riesgo de abandono?": "He detectado **23 clientes en riesgo alto** basándome en:\n• Sin login en los últimos 21 días\n• Descarga de archivos reducida >70%\n• Sin activación de licencia\n\n**Top 3 en riesgo:**\n1. Carlos Mendez — Sin activar licencia (7 días desde compra)\n2. Nina Petrova — No ha completado ningún módulo del curso\n3. 21 suscriptores adicionales con patrones similares\n\n¿Activo el flujo de recuperación automáticamente?",
};

function getResponse(msg: string): string {
  return mockResponses[msg] || "Estoy analizando tu consulta... En una implementación completa, accedería en tiempo real a todas tus métricas, patrones de comportamiento de usuarios, historial de ventas y datos de productos para darte una respuesta precisa y accionable. Esta es una demo del AI Assistant de PULSE AI.";
}


function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const resp: Message = { id: crypto.randomUUID(), role: "assistant", content: getResponse(text) };
      setMessages((prev) => [...prev, resp]);
      setLoading(false);
    }, 1200);
  };

  return (
    <DashboardLayout
      title="AI Assistant"
      breadcrumb={["Dashboard", "AI Assistant"]}
    >
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 h-full">
        {/* Chat panel */}
        <div className="flex flex-col rounded-xl bg-surface border border-border overflow-hidden" style={{ height: "calc(100vh - 10rem)" }}>
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3 shrink-0">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot className="size-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">PULSE AI Assistant</div>
              <div className="text-[10px] text-primary flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                Conectado a tus datos en tiempo real
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="size-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-black/20 border border-border rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="size-3.5 text-primary" />
                </div>
                <div className="bg-black/20 border border-border rounded-xl rounded-bl-none p-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="p-3 border-t border-border/50 flex flex-wrap gap-2 shrink-0">
            {quickPrompts.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[10px] px-2.5 py-1.5 rounded-full bg-black/20 border border-border hover:border-primary/30 hover:text-primary text-muted-foreground transition-colors"
              >
                {q.length > 40 ? q.slice(0, 38) + "…" : q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-3 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Pregúntame sobre tus métricas, clientes, o estrategia..."
              className="flex-1 bg-black/20 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <Button variant="contrast" size="sm" onClick={() => send(input)} disabled={!input.trim() || loading}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        {/* Insights panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Insights en Tiempo Real</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="size-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold">Insights se generan solos</div>
              <div className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                El motor de IA detectará oportunidades y alertas cuando tengas datos reales.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
