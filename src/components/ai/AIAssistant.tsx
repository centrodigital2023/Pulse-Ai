import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ChevronDown } from "lucide-react";
import { useAllListings } from "@/lib/products-store";
import type { MarketplaceListing as ML } from "@/lib/mock-data";

type Message = { role: "user" | "ai"; text: string; products?: string[] };

const QUICK = [
  "¿Qué me recomiendas para aprender IA?",
  "Cursos bajo $100",
  "Lo más vendido del mes",
  "Software para desarrolladores",
  "Templates de UI premium",
];

function buildReply(q: string, listings: ML[]): Message {
  const lq = q.toLowerCase();

  if (/ia|intelig|machine|ml|deep|python|data science/.test(lq)) {
    const hits = listings.filter(l => l.tags.some(t => /ai|ml|python|data/i.test(t)));
    if (hits.length === 0) return { role: "ai", text: "Aún no hay productos de IA disponibles, ¡pero pronto habrá! Vuelve a revisar más tarde." };
    return {
      role: "ai",
      text: `Detecté interés en IA y Machine Learning. Tenemos ${hits.length} productos perfectos para ti:`,
      products: hits.slice(0, 3).map(p => `${p.name} — $${p.price}`),
    };
  }
  if (/\$?100|barat|econ|precio bajo/.test(lq)) {
    const hits = listings.filter(l => l.price <= 100);
    if (hits.length === 0) return { role: "ai", text: "Por ahora no hay productos bajo $100, pero el catálogo está creciendo. ¡Revisa pronto!" };
    return {
      role: "ai",
      text: `${hits.length} productos excelentes por menos de $100, todos con garantía 30 días:`,
      products: hits.slice(0, 3).map(p => `${p.name} — $${p.price}`),
    };
  }
  if (/vend|popular|top|mejor/.test(lq)) {
    const hits = [...listings].sort((a, b) => b.sales - a.sales).slice(0, 3);
    if (hits.length === 0) return { role: "ai", text: "El marketplace está recién lanzado. ¡Sé de los primeros en descubrir los productos!" };
    return {
      role: "ai",
      text: "Los productos más vendidos de PULSE AI este mes:",
      products: hits.map(p => `${p.name} (${p.sales.toLocaleString()} ventas)`),
    };
  }
  if (/software|sdk|api|app/.test(lq)) {
    const hits = listings.filter(l => l.category === "software");
    if (hits.length === 0) return { role: "ai", text: "Próximamente habrá herramientas de software disponibles. ¡Vuelve pronto!" };
    return {
      role: "ai",
      text: "Las herramientas de software más potentes para desarrolladores:",
      products: hits.slice(0, 3).map(p => `${p.name} — ⭐ ${p.rating}`),
    };
  }
  if (/template|ui|ux|diseño|plantilla/.test(lq)) {
    const hits = listings.filter(l => l.category === "resources" || l.tags.some(t => /ui|ux|template/i.test(t)));
    if (hits.length === 0) return { role: "ai", text: "Próximamente habrá templates y recursos de diseño. ¡Vuelve pronto!" };
    return {
      role: "ai",
      text: "Los mejores templates y recursos de diseño UI/UX:",
      products: hits.slice(0, 3).map(p => `${p.name} — $${p.price}`),
    };
  }
  if (/curso|aprend|educaci/.test(lq)) {
    const hits = listings.filter(l => l.category === "education");
    if (hits.length === 0) return { role: "ai", text: "Pronto habrá cursos disponibles. ¡Regresa en los próximos días!" };
    return {
      role: "ai",
      text: "Selección de cursos con las mejores reseñas de nuestra comunidad:",
      products: hits.slice(0, 3).map(p => `${p.name} — ⭐ ${p.rating}`),
    };
  }
  const hits = [...listings].sort((a, b) => b.rating - a.rating).slice(0, 3);
  if (hits.length === 0) return { role: "ai", text: "El catálogo está creciendo. ¡Vuelve pronto para ver los primeros productos del marketplace!" };
  return {
    role: "ai",
    text: "Basado en tu búsqueda, aquí los productos mejor valorados por la comunidad:",
    products: hits.map(p => `${p.name} — ⭐ ${p.rating}`),
  };
}

export function AIAssistant() {
  const listings = useAllListings();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    { role: "ai", text: "¡Hola! Soy el asistente de PULSE AI. Puedo ayudarte a encontrar el producto digital perfecto para ti. ¿Qué estás buscando?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs(prev => [...prev, buildReply(text, listings)]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-2xl bg-primary shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Asistente IA"
      >
        {open ? <X className="size-6 text-primary-foreground" /> : <Bot className="size-6 text-primary-foreground" />}
        {!open && (
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "520px" }}>
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Bot className="size-5 text-primary" />
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                Asistente IA
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-muted-foreground">Impulsado por PULSE AI · Responde al instante</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground">
              <ChevronDown className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "300px" }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-black/20 border border-border text-foreground rounded-bl-sm"
                }`}>
                  <p>{m.text}</p>
                  {m.products && (
                    <ul className="mt-2 space-y-1">
                      {m.products.map((p, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-[11px] opacity-90">
                          <Sparkles className="size-3 shrink-0 mt-0.5 text-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-black/20 border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {msgs.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Escribe tu consulta..."
              className="flex-1 bg-black/20 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="size-9 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="size-3.5 text-primary-foreground" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
