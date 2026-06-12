import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/habeas-data")({
  head: () => ({
    meta: [
      { title: "Política de Tratamiento de Datos Personales (Habeas Data) — PULSE AI" },
      {
        name: "description",
        content:
          "Política de Tratamiento de Datos Personales de PULSE AI conforme al artículo 15 de la Constitución Política y la Ley 1581 de 2012 (Habeas Data). Ejerce tus derechos.",
      },
    ],
  }),
  component: HabeasDataPage,
});

const sections = [
  { id: "marco", label: "Marco legal" },
  { id: "responsable", label: "Identificación del responsable" },
  { id: "datos-tratados", label: "Datos objeto de tratamiento" },
  { id: "finalidades", label: "Finalidades del tratamiento" },
  { id: "derechos", label: "Derechos de los titulares" },
  { id: "procedimiento", label: "Procedimiento para ejercer derechos" },
  { id: "seguridad", label: "Medidas de seguridad" },
  { id: "vigencia", label: "Vigencia y modificaciones" },
];

function HabeasDataPage() {
  return (
    <LegalLayout
      title="Política de Tratamiento de Datos Personales"
      subtitle="Habeas Data — Ley 1581 de 2012 y Artículo 15 de la Constitución Política de Colombia"
      sections={sections}
    >
      <div className="space-y-10 text-sm leading-relaxed text-foreground">

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Nota importante:</strong> La presente Política de Tratamiento de Datos Personales es el documento principal que da cumplimiento al derecho fundamental al Habeas Data consagrado en el artículo 15 de la Constitución Política de Colombia y desarrollado por la Ley 1581 de 2012. Esta política debe ser leída en conjunto con nuestra Política de Privacidad.
          </p>
        </div>

        <section id="marco" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            1. Marco Legal
          </h2>
          <p className="text-muted-foreground mb-3">
            El derecho al Habeas Data está reconocido como un derecho fundamental en el <strong className="text-foreground">artículo 15 de la Constitución Política de Colombia</strong>, que garantiza a toda persona el derecho a conocer, actualizar y rectificar la información que exista sobre ella en bases de datos o archivos de entidades públicas y privadas. En desarrollo de este derecho constitucional, el Congreso de la República expidió la <strong className="text-foreground">Ley Estatutaria 1581 de 2012</strong>, "Por la cual se dictan disposiciones generales para la protección de datos personales".
          </p>
          <p className="text-muted-foreground mb-3">
            El marco regulatorio aplicable a la presente política comprende: la Ley 1581 de 2012 (norma principal); el Decreto Reglamentario 1377 de 2013, compilado en el Decreto Único Reglamentario 1074 de 2015 (Libro 2, Parte 2, Título 2, Capítulo 25); la Circular Externa 002 de 2015 de la Superintendencia de Industria y Comercio (SIC), sobre estándares de seguridad de la información; y la Resolución 76434 de 2012 de la SIC, sobre el Registro Nacional de Bases de Datos (RNBD).
          </p>
          <p className="text-muted-foreground">
            PULSE AI S.A.S. ha inscrito su(s) base(s) de datos ante el Registro Nacional de Bases de Datos (RNBD) administrado por la SIC, en cumplimiento del artículo 25 de la Ley 1581 de 2012. Cualquier ciudadano puede consultar dicho registro en el sitio web de la SIC: www.sic.gov.co.
          </p>
        </section>

        <section id="responsable" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            2. Identificación del Responsable del Tratamiento
          </h2>
          <p className="text-muted-foreground mb-3">
            De conformidad con el artículo 3, literal e) de la Ley 1581 de 2012, el Responsable del Tratamiento es la persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el tratamiento de los datos. En este caso:
          </p>
          <div className="bg-surface/50 border border-border rounded-xl p-4 mb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">Razón social</p>
                <p className="text-foreground font-medium">PULSE AI S.A.S.</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">NIT</p>
                <p className="text-foreground font-medium">901.234.567-8</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">Tipo societario</p>
                <p className="text-foreground font-medium">Sociedad por Acciones Simplificada</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">Domicilio</p>
                <p className="text-foreground font-medium">Bogotá D.C., Colombia</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">Dirección</p>
                <p className="text-foreground font-medium">Carrera 7 # 71-21 Piso 16, Bogotá D.C.</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">Correo Habeas Data</p>
                <p className="text-foreground font-medium">habeasdata@pulseai.co</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-wide mb-0.5">Actividad económica</p>
                <p className="text-foreground font-medium">Marketplace de productos digitales</p>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            El Oficial de Protección de Datos (DPO) de PULSE AI S.A.S. es el responsable de velar por el cumplimiento de las obligaciones derivadas de la Ley 1581 de 2012 y de atender las solicitudes, consultas y reclamaciones de los titulares. Puede ser contactado exclusivamente a través del correo habeasdata@pulseai.co.
          </p>
        </section>

        <section id="datos-tratados" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            3. Datos Personales Objeto de Tratamiento
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI trata las siguientes categorías de datos personales, de conformidad con los artículos 3 y 5 de la Ley 1581 de 2012:
          </p>
          <div className="space-y-3">
            {[
              {
                cat: "Datos de identificación",
                items: "Nombre completo, número y tipo de documento de identidad (C.C., NIT, pasaporte, cédula de extranjería), fecha y lugar de nacimiento, fotografía de perfil."
              },
              {
                cat: "Datos de contacto",
                items: "Dirección de correo electrónico, número de teléfono móvil y fijo, dirección de residencia o domicilio, ciudad, departamento y país."
              },
              {
                cat: "Datos financieros y tributarios",
                items: "Información del RUT (vendedores), datos de cuentas bancarias para transferencia de comisiones (vendedores), historial de transacciones y pagos realizados en la plataforma."
              },
              {
                cat: "Datos transaccionales",
                items: "Historial de compras, productos adquiridos, fechas y valores de las transacciones, número de pedido, estado de las entregas y descargas realizadas."
              },
              {
                cat: "Datos de comportamiento digital",
                items: "Dirección IP, tipo de dispositivo, sistema operativo, navegador web, páginas visitadas, tiempo de sesión, búsquedas realizadas en la plataforma, clics e interacciones, preferencias de contenido."
              },
            ].map(d => (
              <div key={d.cat} className="border border-border rounded-lg p-3">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1.5">{d.cat}</p>
                <p className="text-muted-foreground">{d.items}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3">
            PULSE AI <strong className="text-foreground">no trata datos sensibles</strong> en los términos del artículo 5 de la Ley 1581 de 2012 (datos de salud, vida sexual, orientación sexual, origen racial o étnico, convicciones políticas, filosóficas o religiosas, datos biométricos). En caso de que sea estrictamente necesario tratar datos de esta naturaleza, PULSE AI solicitará autorización expresa, clara e inequívoca del titular.
          </p>
        </section>

        <section id="finalidades" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            4. Finalidades Específicas del Tratamiento
          </h2>
          <p className="text-muted-foreground mb-3">
            De conformidad con el principio de finalidad establecido en el artículo 4 de la Ley 1581 de 2012, PULSE AI trata los datos personales únicamente para las siguientes finalidades determinadas, explícitas y legítimas:
          </p>
          <div className="space-y-3">
            {[
              { n: "F.1", t: "Gestión de la relación contractual", d: "Creación, administración y cierre de cuentas de usuario; verificación de identidad para el registro; gestión del proceso de compra-venta de productos digitales; entrega y habilitación de acceso a los productos adquiridos. Base legal: ejecución de contrato (Art. 6, lit. b, Ley 1581/2012)." },
              { n: "F.2", t: "Cumplimiento de obligaciones tributarias", d: "Emisión de facturas electrónicas conforme a la Resolución DIAN 000042 de 2020; reporte de información exógena a la DIAN; retención en la fuente para pagos a vendedores. Base legal: cumplimiento de obligación legal (Art. 6, lit. c, Ley 1581/2012)." },
              { n: "F.3", t: "Atención al cliente y gestión de reclamaciones", d: "Gestión de peticiones, quejas, reclamos y sugerencias (PQRS); tramitación de garantías y devoluciones; comunicaciones operativas relacionadas con transacciones. Base legal: ejecución de contrato / interés legítimo." },
              { n: "F.4", t: "Prevención del fraude y seguridad de la plataforma", d: "Detección y prevención de transacciones fraudulentas, suplantación de identidad y actividades ilícitas; monitoreo de accesos sospechosos; análisis de riesgos de seguridad. Base legal: interés legítimo (Art. 6, lit. f, Ley 1581/2012)." },
              { n: "F.5", t: "Personalización de la experiencia de usuario", d: "Análisis del comportamiento de navegación y preferencias para ofrecer recomendaciones de productos personalizadas; adaptación de la interfaz a las preferencias del usuario. Base legal: consentimiento (Art. 6, lit. a) / interés legítimo." },
              { n: "F.6", t: "Comunicaciones comerciales y de marketing", d: "Envío de boletines informativos, alertas de nuevos productos, descuentos y promociones especiales, exclusivamente a usuarios que hayan otorgado su consentimiento expreso. Base legal: consentimiento (Art. 6, lit. a, Ley 1581/2012)." },
              { n: "F.7", t: "Estadísticas e inteligencia del negocio", d: "Análisis estadístico anonimizado del uso de la plataforma; generación de informes de tendencias del mercado; mejora continua de productos y servicios. Los datos se anonimizarán cuando sea posible. Base legal: interés legítimo." },
              { n: "F.8", t: "Cumplimiento de requerimientos legales", d: "Atención de órdenes judiciales, requerimientos de la Fiscalía General, la Policía Nacional, la SIC, la DIAN o cualquier autoridad competente conforme a la ley colombiana. Base legal: cumplimiento de obligación legal (Art. 6, lit. c)." },
            ].map(f => (
              <div key={f.n} className="border border-border rounded-lg p-3">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono shrink-0">{f.n}</span>
                  <p className="font-semibold text-foreground text-sm">{f.t}</p>
                </div>
                <p className="text-muted-foreground pl-8">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="derechos" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            5. Derechos de los Titulares
          </h2>
          <p className="text-muted-foreground mb-3">
            Conforme al artículo 8 de la Ley 1581 de 2012, los titulares de datos personales tienen los siguientes derechos, que podrán ejercer de forma gratuita en cualquier momento:
          </p>
          <div className="space-y-2">
            {[
              { d: "Derecho a conocer", desc: "Conocer los datos personales que PULSE AI tiene sobre usted, su origen, las finalidades del tratamiento y las transferencias realizadas a terceros (Art. 8, lit. a y g)." },
              { d: "Derecho de actualización", desc: "Solicitar la actualización de sus datos personales cuando estén desactualizados o incompletos (Art. 8, lit. b)." },
              { d: "Derecho de rectificación", desc: "Exigir la corrección de datos inexactos o que induzcan a error (Art. 8, lit. b)." },
              { d: "Derecho de supresión o cancelación", desc: "Solicitar la eliminación de sus datos cuando no sean necesarios para las finalidades que justificaron su recopilación, cuando haya vencido el período de vigencia, o cuando se hayan usado en vulneración de los derechos reconocidos en la Ley 1581/2012 (Art. 8, lit. c). Este derecho no procede cuando el tratamiento es necesario para el cumplimiento de una obligación legal." },
              { d: "Derecho de revocación", desc: "Revocar la autorización de tratamiento otorgada en cualquier momento, sin efectos retroactivos, siempre que no exista una obligación legal o contractual que lo impida (Art. 8, lit. d)." },
              { d: "Derecho de acceso", desc: "Acceder gratuitamente a sus datos personales que hayan sido objeto de tratamiento (Art. 8, lit. e)." },
              { d: "Derecho a presentar queja ante la SIC", desc: "Presentar ante la Superintendencia de Industria y Comercio (SIC) quejas por infracciones a la Ley 1581 de 2012, una vez agotado el trámite de consulta o reclamo ante PULSE AI (Art. 8, lit. f)." },
            ].map(r => (
              <div key={r.d} className="flex gap-3 border border-border rounded-lg p-3">
                <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <span className="font-semibold text-foreground">{r.d}: </span>
                  <span className="text-muted-foreground">{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="procedimiento" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            6. Procedimiento para Ejercer los Derechos
          </h2>
          <p className="text-muted-foreground mb-3">
            Los titulares, sus causahabientes, representantes y apoderados, así como las personas autorizadas expresamente, podrán ejercer los derechos descritos en esta política siguiendo el procedimiento establecido en los artículos 14, 15 y 16 de la Ley 1581 de 2012:
          </p>

          <div className="space-y-4">
            <div className="border border-border rounded-xl p-4">
              <h3 className="font-bold text-foreground mb-2">Paso 1: Presentación de la solicitud</h3>
              <p className="text-muted-foreground mb-2">
                El titular deberá enviar su solicitud al canal oficial de Habeas Data:
              </p>
              <div className="bg-surface/50 rounded-lg p-3 border border-border">
                <p className="text-foreground font-mono text-sm">habeasdata@pulseai.co</p>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                La solicitud debe contener: nombre completo y documento de identidad del titular; descripción clara de los datos y el derecho que desea ejercer; documentos que soporten la solicitud (si aplica); dirección de correo electrónico para respuesta.
              </p>
            </div>

            <div className="border border-border rounded-xl p-4">
              <h3 className="font-bold text-foreground mb-2">Paso 2: Términos de respuesta</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-surface/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wide mb-1">Consultas (Art. 14)</p>
                  <p className="text-foreground font-bold text-lg">10</p>
                  <p className="text-muted-foreground text-xs">días hábiles prorrogables por 5 días más</p>
                </div>
                <div className="bg-surface/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wide mb-1">Reclamos (Art. 15)</p>
                  <p className="text-foreground font-bold text-lg">15</p>
                  <p className="text-muted-foreground text-xs">días hábiles prorrogables por 8 días más</p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-xl p-4">
              <h3 className="font-bold text-foreground mb-2">Paso 3: Segunda instancia ante la SIC</h3>
              <p className="text-muted-foreground text-sm">
                Si el titular considera que la respuesta de PULSE AI no satisface sus derechos, podrá acudir ante la <strong className="text-foreground">Superintendencia de Industria y Comercio (SIC)</strong>, Delegatura para la Protección de Datos Personales, ubicada en Carrera 13 # 27-00 Pisos 1 y 3, Bogotá D.C. Línea de atención gratuita: 01 8000 910165. Sitio web: www.sic.gov.co.
              </p>
            </div>
          </div>
        </section>

        <section id="seguridad" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            7. Medidas Técnicas y Organizativas de Seguridad
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI implementa las siguientes medidas de seguridad para garantizar la confidencialidad, integridad y disponibilidad de los datos personales, conforme a los estándares exigidos por la Circular SIC 002 de 2015:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { t: "Cifrado en tránsito", d: "Protocolo TLS 1.3 con cifrado AES-256 para todas las comunicaciones entre el usuario y la plataforma." },
              { t: "Cifrado en reposo", d: "Cifrado de bases de datos y archivos almacenados mediante AES-256. Contraseñas almacenadas con bcrypt + sal aleatoria." },
              { t: "Control de acceso", d: "Acceso a datos personales restringido por roles (RBAC). Principio de mínimo privilegio. MFA obligatorio para administradores." },
              { t: "Monitoreo continuo", d: "SIEM (Security Information and Event Management) para detección de anomalías. Alertas en tiempo real ante accesos sospechosos." },
              { t: "Copias de seguridad", d: "Backups automáticos diarios con retención de 90 días. Almacenamiento georeplicado en centros de datos separados." },
              { t: "Pruebas de seguridad", d: "Auditorías de seguridad trimestrales y pruebas de penetración (pentesting) anuales por proveedores independientes certificados." },
            ].map(m => (
              <div key={m.t} className="border border-border rounded-lg p-3">
                <p className="font-semibold text-foreground text-sm mb-1">{m.t}</p>
                <p className="text-muted-foreground text-xs">{m.d}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3">
            Todo el personal de PULSE AI con acceso a datos personales suscribe acuerdos de confidencialidad y recibe capacitación periódica en protección de datos. PULSE AI designa un Oficial de Protección de Datos (DPO) responsable de la supervisión del cumplimiento de esta política.
          </p>
        </section>

        <section id="vigencia" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            8. Vigencia y Modificaciones
          </h2>
          <p className="text-muted-foreground mb-3">
            La presente Política de Tratamiento de Datos Personales entra en vigencia a partir del <strong className="text-foreground">12 de junio de 2025</strong> y permanecerá vigente mientras PULSE AI S.A.S. desarrolle actividades de tratamiento de datos personales. Las bases de datos objeto de tratamiento tendrán una vigencia equivalente a la del vínculo contractual o la relación jurídica entre PULSE AI y el titular, y durante el plazo adicional de conservación exigido por las obligaciones tributarias, contables y legales aplicables (generalmente cinco años desde el cierre de la relación contractual).
          </p>
          <p className="text-muted-foreground mb-3">
            PULSE AI se reserva el derecho de modificar esta política en cualquier momento para adaptarla a cambios normativos, resoluciones de la SIC, nuevas funcionalidades de la plataforma o mejores prácticas del sector. Las modificaciones relevantes serán notificadas a los titulares mediante correo electrónico y/o aviso destacado en la plataforma con un mínimo de quince (15) días de anticipación. Las modificaciones que afecten derechos fundamentales de los titulares requerirán nueva autorización expresa.
          </p>
          <p className="text-muted-foreground">
            El titular que no esté de acuerdo con las modificaciones podrá revocar su autorización conforme al procedimiento descrito en la sección 6 de esta política. La versión vigente de esta política estará siempre disponible en <strong className="text-foreground">pulseai.co/habeas-data</strong>.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
