import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/cumplimiento")({
  head: () => ({
    meta: [
      { title: "Marco de Cumplimiento Legal — PULSE AI" },
      {
        name: "description",
        content:
          "Marco de Cumplimiento Legal de PULSE AI: Ley 527/1999, Ley 1480/2011, Ley 1581/2012, Ley 1273/2009. Regulado por la SIC y la Superintendencia Financiera de Colombia.",
      },
    ],
  }),
  component: CumplimientoPage,
});

const sections = [
  { id: "marco", label: "Marco regulatorio" },
  { id: "comercio", label: "Comercio electrónico" },
  { id: "consumidor", label: "Estatuto del consumidor" },
  { id: "datos", label: "Protección de datos" },
  { id: "informatica", label: "Delitos informáticos" },
  { id: "tributario", label: "Cumplimiento tributario" },
  { id: "pago", label: "Pagos electrónicos" },
  { id: "canal", label: "Canal de denuncias" },
];

function CumplimientoPage() {
  return (
    <LegalLayout
      title="Marco de Cumplimiento Legal"
      subtitle="Cumplimiento normativo integral de PULSE AI ante las leyes colombianas vigentes"
      sections={sections}
    >
      <div className="space-y-10 text-sm leading-relaxed text-foreground">

        <div className="bg-surface/50 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Compromiso de cumplimiento:</strong> PULSE AI S.A.S. opera bajo un riguroso marco de cumplimiento legal que abarca la normativa colombiana en materia de comercio electrónico, protección del consumidor, datos personales, delitos informáticos, obligaciones tributarias y regulación financiera. Este documento describe los estándares que seguimos y cómo los implementamos.
          </p>
        </div>

        <section id="marco" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            1. Marco Regulatorio Aplicable
          </h2>
          <p className="text-muted-foreground mb-4">
            PULSE AI S.A.S. es una empresa colombiana que opera una plataforma de comercio electrónico especializada en productos digitales. Como tal, está sujeta al siguiente marco regulatorio principal:
          </p>
          <div className="space-y-2">
            {[
              { ley: "Ley 527 de 1999", desc: "Marco general del comercio electrónico, firmas digitales y mensajes de datos en Colombia." },
              { ley: "Ley 1480 de 2011", desc: "Estatuto del Consumidor — protección del consumidor en transacciones de bienes y servicios." },
              { ley: "Ley 1581 de 2012", desc: "Protección de datos personales (Habeas Data) y Decreto Reglamentario 1074 de 2015." },
              { ley: "Ley 1273 de 2009", desc: "Protección de la información y los datos — delitos informáticos." },
              { ley: "Ley 1819 de 2016 / E.T.", desc: "Estatuto Tributario y normativa de facturación electrónica de la DIAN." },
              { ley: "Ley 1328 de 2009", desc: "Régimen de protección al consumidor financiero." },
              { ley: "Ley 23 de 1982 / Decisión 351 CAN", desc: "Propiedad intelectual, derechos de autor y derechos conexos." },
              { ley: "Ley 1915 de 2018", desc: "Reforma de la Ley de Derechos de Autor — responsabilidad de plataformas digitales." },
            ].map(n => (
              <div key={n.ley} className="flex gap-3 items-start border border-border rounded-lg p-3">
                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono whitespace-nowrap shrink-0 mt-0.5">{n.ley}</span>
                <p className="text-muted-foreground text-sm">{n.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3">
            Adicionalmente, PULSE AI cumple con las circulares y resoluciones emitidas por la <strong className="text-foreground">Superintendencia de Industria y Comercio (SIC)</strong>, la <strong className="text-foreground">Superintendencia Financiera de Colombia</strong> y la <strong className="text-foreground">DIAN</strong> en sus respectivos ámbitos de competencia.
          </p>
        </section>

        <section id="comercio" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            2. Cumplimiento Ley 527 de 1999 — Comercio Electrónico
          </h2>
          <p className="text-muted-foreground mb-3">
            La Ley 527 de 1999 establece el marco legal para el comercio electrónico en Colombia, reconociendo la validez jurídica de los mensajes de datos y las firmas electrónicas. PULSE AI cumple con esta ley mediante las siguientes medidas:
          </p>
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">Equivalencia funcional de los mensajes de datos</p>
              <p className="text-muted-foreground">Todos los contratos celebrados en la plataforma (términos aceptados durante el registro, confirmaciones de compra) tienen la misma validez jurídica que los contratos escritos en papel, conforme al artículo 6 de la Ley 527/1999. PULSE AI conserva registros inmutables de todas las aceptaciones electrónicas.</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">Información precontractual obligatoria</p>
              <p className="text-muted-foreground">Conforme al artículo 23 de la Ley 527/1999, PULSE AI pone a disposición del consumidor, antes de perfeccionarse la transacción: la descripción completa del producto, el precio total incluyendo impuestos, las condiciones de entrega, la política de devoluciones y los datos de contacto del vendedor y de PULSE AI.</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">Acuse de recibo y confirmación de pedidos</p>
              <p className="text-muted-foreground">PULSE AI envía confirmación automática por correo electrónico de todas las transacciones realizadas, incluyendo el número de pedido, el resumen de la compra y las instrucciones de acceso al producto, cumpliendo así con el deber de confirmación establecido en el artículo 24 de la Ley 527/1999.</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">Tiempo y lugar de formación del contrato</p>
              <p className="text-muted-foreground">El contrato de compraventa se entiende perfeccionado en el momento en que el sistema de PULSE AI recibe la confirmación del pago por parte de Mercado Pago, considerando como lugar de celebración la ciudad de Bogotá D.C., Colombia, sede principal de PULSE AI S.A.S.</p>
            </div>
          </div>
        </section>

        <section id="consumidor" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            3. Cumplimiento Ley 1480 de 2011 — Estatuto del Consumidor
          </h2>
          <p className="text-muted-foreground mb-3">
            El Estatuto del Consumidor colombiano establece un conjunto de derechos irrenunciables para los consumidores que PULSE AI respeta y garantiza en todas sus operaciones:
          </p>
          <div className="space-y-3">
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-semibold text-foreground mb-1">Derecho a recibir productos conformes (Art. 7-11)</p>
              <p className="text-muted-foreground">PULSE AI garantiza que los productos digitales entregados corresponden a la descripción publicada. En caso de inconformidad, el consumidor tiene derecho a la reparación, reposición o devolución del dinero conforme a nuestra política de garantías de 30 días.</p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-semibold text-foreground mb-1">Derecho a la información clara y suficiente (Art. 23)</p>
              <p className="text-muted-foreground">Cada producto en PULSE AI incluye: descripción detallada, especificaciones técnicas, requisitos del sistema, vista previa de contenidos, precio total, condiciones de la licencia y calificaciones verificadas de otros compradores.</p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-semibold text-foreground mb-1">Protección contra prácticas restrictivas y abusivas (Art. 37-43)</p>
              <p className="text-muted-foreground">PULSE AI prohíbe expresamente a los vendedores de su plataforma el uso de cláusulas abusivas, publicidad engañosa, precios discriminatorios sin justificación o cualquier práctica contraria a la libre competencia y a los derechos del consumidor.</p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-semibold text-foreground mb-1">Sistema efectivo de atención al consumidor (Art. 50)</p>
              <p className="text-muted-foreground">PULSE AI dispone de un sistema de atención al consumidor accesible mediante correo electrónico (soporte@pulseai.co) con tiempos de respuesta máximos de tres (3) días hábiles para cualquier PQR (petición, queja o reclamo). El historial de atención está disponible en el panel de usuario.</p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-semibold text-foreground mb-1">Retracto en ventas a distancia (Art. 47)</p>
              <p className="text-muted-foreground">Para productos digitales cuya descarga o acceso no haya comenzado, PULSE AI reconoce el derecho de retracto dentro de los cinco (5) días hábiles siguientes a la compra, con reembolso íntegro del precio pagado. Una vez iniciada la descarga o el acceso al producto, opera la garantía de 30 días por conformidad del producto.</p>
            </div>
          </div>
        </section>

        <section id="datos" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            4. Cumplimiento Ley 1581 de 2012 — Protección de Datos Personales
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI ha implementado un programa integral de protección de datos personales que abarca todos los aspectos exigidos por la Ley 1581 de 2012 y sus decretos reglamentarios. Para el detalle completo del tratamiento de datos personales, consulte nuestra <strong className="text-foreground">Política de Tratamiento de Datos Personales (Habeas Data)</strong> disponible en pulseai.co/habeas-data.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { t: "Autorización expresa", d: "Recopilamos autorización libre, previa, expresa e informada antes de iniciar cualquier tratamiento de datos personales." },
              { t: "Aviso de privacidad", d: "Informamos al titular sobre el responsable, las finalidades y sus derechos antes de recopilar sus datos." },
              { t: "Registro ante la SIC", d: "Las bases de datos de PULSE AI están inscritas en el Registro Nacional de Bases de Datos (RNBD) de la SIC." },
              { t: "DPO designado", d: "Contamos con un Oficial de Protección de Datos (DPO) responsable del cumplimiento: habeasdata@pulseai.co." },
              { t: "Gestión de derechos", d: "Proceso definido para atender consultas (10 días) y reclamos (15 días) de los titulares conforme a los Arts. 14-16." },
              { t: "Contratos con encargados", d: "Todos los proveedores que acceden a datos personales suscriben contratos de encargado de tratamiento." },
            ].map(m => (
              <div key={m.t} className="border border-border rounded-lg p-3">
                <p className="font-semibold text-foreground text-sm mb-1">{m.t}</p>
                <p className="text-muted-foreground text-xs">{m.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="informatica" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            5. Cumplimiento Ley 1273 de 2009 — Delitos Informáticos
          </h2>
          <p className="text-muted-foreground mb-3">
            La Ley 1273 de 2009 "Por medio de la cual se modifica el Código Penal, se crea un nuevo bien jurídico tutelado denominado 'de la protección de la información y de los datos'" establece un conjunto de delitos informáticos que PULSE AI está comprometido a prevenir tanto en su operación interna como en el uso de su plataforma por terceros.
          </p>
          <p className="text-muted-foreground mb-3">
            PULSE AI implementa controles técnicos y procedimentales para prevenir el acceso abusivo a sistemas informáticos (Art. 269A), la interceptación ilegal de datos (Art. 269C), el daño informático (Art. 269D), el uso de software malicioso (Art. 269E), y el hurto por medios informáticos (Art. 269I). Cualquier usuario que intente explotar vulnerabilidades de la plataforma, realizar ataques de fuerza bruta, inyecciones SQL u otras técnicas de intrusión será bloqueado de inmediato y reportado a las autoridades competentes.
          </p>
          <p className="text-muted-foreground">
            PULSE AI colabora activamente con la Policía Nacional (DIJIN — Centro Cibernético Policial) y la Fiscalía General de la Nación en la investigación de delitos informáticos que involucren su plataforma. Las denuncias pueden realizarse directamente ante el CCIT (Centro Cibernético Policial) en: caivirtual.policia.gov.co.
          </p>
        </section>

        <section id="tributario" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            6. Cumplimiento Tributario y Facturación Electrónica
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI S.A.S. está inscrita en el Registro Único Tributario (RUT) de la DIAN bajo el NIT 901.234.567-8 y cumple con todas las obligaciones tributarias derivadas de su actividad económica. Como gran contribuyente y responsable del IVA, PULSE AI factura electrónicamente el 100% de sus transacciones conforme a la Resolución DIAN 000042 de 2020 y sus modificaciones.
          </p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start border border-border rounded-lg p-3">
              <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-muted-foreground"><strong className="text-foreground">Facturación electrónica:</strong> Cada transacción genera una factura electrónica con CUFE (Código Único de Factura Electrónica) enviada al correo del comprador y disponible en su panel de usuario.</p>
            </div>
            <div className="flex gap-3 items-start border border-border rounded-lg p-3">
              <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-muted-foreground"><strong className="text-foreground">Retención en la fuente:</strong> PULSE AI aplica retención en la fuente sobre los pagos a vendedores conforme a las tarifas del Estatuto Tributario y expide certificados de retención disponibles en el panel de vendedor.</p>
            </div>
            <div className="flex gap-3 items-start border border-border rounded-lg p-3">
              <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-muted-foreground"><strong className="text-foreground">IVA en servicios digitales:</strong> Los servicios digitales prestados por PULSE AI están sujetos al IVA del 19% conforme al artículo 437-2 del Estatuto Tributario para prestadores domiciliados en Colombia.</p>
            </div>
            <div className="flex gap-3 items-start border border-border rounded-lg p-3">
              <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-muted-foreground"><strong className="text-foreground">Información exógena:</strong> PULSE AI reporta a la DIAN la información exógena requerida por las resoluciones anuales de información en medios magnéticos, incluyendo transacciones con compradores y vendedores.</p>
            </div>
          </div>
        </section>

        <section id="pago" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            7. Regulación de Pagos Electrónicos
          </h2>
          <p className="text-muted-foreground mb-3">
            El procesamiento de pagos en PULSE AI es realizado exclusivamente por <strong className="text-foreground">Mercado Pago Colombia S.A.S.</strong>, entidad debidamente habilitada como operador de pagos por la Superintendencia Financiera de Colombia bajo la Ley 1328 de 2009 y el Decreto 1692 de 2020 (que regula las entidades de pago de bajo valor). Esto garantiza que todos los pagos en la plataforma cumplen con los más altos estándares de seguridad financiera.
          </p>
          <p className="text-muted-foreground mb-3">
            PULSE AI no almacena en sus sistemas datos de tarjetas de crédito o débito; toda la información de pago es manejada directamente por Mercado Pago, que opera bajo estándares PCI DSS (Payment Card Industry Data Security Standard) nivel 1, el más alto de la industria. Las transacciones en PULSE AI están protegidas por los sistemas antifraude de Mercado Pago, que incluyen verificación 3D Secure y análisis de riesgo en tiempo real.
          </p>
          <p className="text-muted-foreground">
            En caso de disputas de pago (chargebacks), PULSE AI coopera plenamente con Mercado Pago y las entidades financieras para la resolución del caso, aportando la evidencia de entrega digital y los registros de acceso del usuario al producto. Los chargebacks presentados de forma fraudulenta serán objeto de bloqueo de cuenta y reporte a las autoridades.
          </p>
        </section>

        <section id="canal" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            8. Canal de Denuncias y Contacto Regulatorio
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI pone a disposición de usuarios, vendedores, autoridades regulatorias e interesados en general los siguientes canales de comunicación para asuntos de cumplimiento legal:
          </p>
          <div className="grid gap-3">
            {[
              { canal: "Cumplimiento general", email: "cumplimiento@pulseai.co", desc: "Denuncias sobre incumplimientos normativos, conductas anticompetitivas, infracciones a los derechos de los consumidores." },
              { canal: "Protección de datos (Habeas Data)", email: "habeasdata@pulseai.co", desc: "Ejercicio de derechos ARCO, denuncias de vulneración de datos personales, consultas sobre la Ley 1581/2012." },
              { canal: "Propiedad intelectual", email: "legal@pulseai.co", desc: "Notificaciones de infracción de derechos de autor, reclamaciones DMCA/Ley 1915, solicitudes de retirada de contenido." },
              { canal: "Autoridades judiciales y administrativas", email: "cumplimiento@pulseai.co", desc: "Requerimientos judiciales, órdenes administrativas de la SIC, DIAN, Superintendencia Financiera o cualquier autoridad competente." },
            ].map(c => (
              <div key={c.canal} className="border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <p className="font-semibold text-foreground">{c.canal}</p>
                  <a href={`mailto:${c.email}`} className="text-primary text-sm hover:underline font-mono">{c.email}</a>
                </div>
                <p className="text-muted-foreground text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-border rounded-xl p-4">
            <p className="font-semibold text-foreground mb-3">Entidades regulatorias de referencia</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-muted-foreground"><strong className="text-foreground">SIC</strong> (Superintendencia de Industria y Comercio): Carrera 13 # 27-00, Bogotá D.C. | www.sic.gov.co | Tel: 01 8000 910165</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-muted-foreground"><strong className="text-foreground">DIAN</strong> (Dirección de Impuestos y Aduanas Nacionales): www.dian.gov.co | Línea: 01 8000 952525</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-muted-foreground"><strong className="text-foreground">Superintendencia Financiera</strong>: Carrera 7 # 4-49, Bogotá D.C. | www.superfinanciera.gov.co | Tel: 01 8000 120100</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-muted-foreground"><strong className="text-foreground">Centro Cibernético Policial (DIJIN)</strong>: caivirtual.policia.gov.co | Línea: 088</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
