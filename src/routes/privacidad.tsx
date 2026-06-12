import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — PULSE AI" },
      {
        name: "description",
        content:
          "Política de Privacidad de PULSE AI conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013. Conoce cómo recopilamos, usamos y protegemos tus datos personales.",
      },
    ],
  }),
  component: PrivacidadPage,
});

const sections = [
  { id: "responsable", label: "Responsable del tratamiento" },
  { id: "datos", label: "Datos que recopilamos" },
  { id: "finalidades", label: "Finalidades del tratamiento" },
  { id: "derechos", label: "Derechos del titular" },
  { id: "cookies", label: "Política de cookies" },
  { id: "transferencias", label: "Transferencias internacionales" },
  { id: "seguridad", label: "Medidas de seguridad" },
  { id: "contacto", label: "Contacto y reclamaciones" },
];

function PrivacidadPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Tratamiento de datos personales conforme a la Ley 1581 de 2012"
      sections={sections}
    >
      <div className="space-y-10 text-sm leading-relaxed text-foreground">

        <section id="responsable" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            1. Responsable del Tratamiento de Datos
          </h2>
          <p className="text-muted-foreground mb-3">
            De conformidad con la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas reglamentarias, el Responsable del Tratamiento de los datos personales recopilados a través de la plataforma PULSE AI es:
          </p>
          <div className="bg-surface/50 border border-border rounded-xl p-4 mb-3 space-y-1.5">
            <p className="text-muted-foreground"><strong className="text-foreground">Razón social:</strong> PULSE AI S.A.S.</p>
            <p className="text-muted-foreground"><strong className="text-foreground">NIT:</strong> 901.234.567-8</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Domicilio:</strong> Carrera 7 # 71-21 Piso 16, Bogotá D.C., Colombia</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Correo electrónico:</strong> privacidad@pulseai.co</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Sitio web:</strong> pulseai.co</p>
          </div>
          <p className="text-muted-foreground">
            Esta política aplica a todos los titulares de datos personales cuyos datos sean objeto de tratamiento por parte de PULSE AI S.A.S., incluyendo compradores, vendedores, visitantes del sitio web y cualquier persona que interactúe con la plataforma. El Oficial de Protección de Datos (DPO) de PULSE AI puede ser contactado en privacidad@pulseai.co.
          </p>
        </section>

        <section id="datos" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            2. Datos Personales que Recopilamos
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI recopila únicamente los datos personales necesarios para la prestación de sus servicios, siguiendo el principio de minimización de datos establecido en la Ley 1581 de 2012. Los datos recopilados se clasifican en las siguientes categorías:
          </p>
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1.5">Datos de identificación</p>
              <p className="text-muted-foreground">Nombre completo, número de documento de identidad (cédula de ciudadanía, NIT, pasaporte), fecha de nacimiento, fotografía de perfil.</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1.5">Datos de contacto</p>
              <p className="text-muted-foreground">Dirección de correo electrónico, número de teléfono, ciudad y país de residencia.</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1.5">Datos financieros y transaccionales</p>
              <p className="text-muted-foreground">Historial de compras y pagos, métodos de pago utilizados (datos tokenizados por Mercado Pago), información fiscal (RUT para vendedores).</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1.5">Datos de uso y comportamiento digital</p>
              <p className="text-muted-foreground">Dirección IP, tipo de dispositivo y navegador, páginas visitadas, tiempo de sesión, clics e interacciones, productos visualizados y descargados.</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-3">
            PULSE AI no recopila datos sensibles en los términos del artículo 5 de la Ley 1581 de 2012 (datos de salud, orientación sexual, origen racial o étnico, afiliación política o sindical, creencias religiosas) salvo que el Usuario los proporcione voluntariamente en un contexto que lo requiera, en cuyo caso se solicitará autorización expresa y específica.
          </p>
        </section>

        <section id="finalidades" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            3. Finalidades del Tratamiento
          </h2>
          <p className="text-muted-foreground mb-3">
            Los datos personales recopilados por PULSE AI serán tratados exclusivamente para las siguientes finalidades, de conformidad con la autorización otorgada por el titular:
          </p>
          <ol className="space-y-3 list-none">
            {[
              { n: "1", t: "Prestación del servicio", d: "Creación y gestión de cuentas de usuario, procesamiento de compras, entrega de productos digitales y acceso a la biblioteca personal." },
              { n: "2", t: "Facturación y cumplimiento tributario", d: "Emisión de facturas electrónicas conforme a la normativa de la DIAN, cumplimiento de obligaciones tributarias nacionales." },
              { n: "3", t: "Atención al cliente y soporte técnico", d: "Gestión de solicitudes, reclamaciones, garantías y devoluciones. Comunicaciones operativas relacionadas con las transacciones." },
              { n: "4", t: "Seguridad y prevención del fraude", d: "Verificación de identidad, detección de transacciones sospechosas, protección contra accesos no autorizados y actividades ilegales." },
              { n: "5", t: "Personalización y recomendaciones", d: "Mejora de la experiencia del usuario mediante análisis de comportamiento y preferencias para mostrar productos relevantes." },
              { n: "6", t: "Comunicaciones comerciales", d: "Envío de boletines informativos, ofertas especiales y novedades del marketplace, únicamente cuando el Usuario haya otorgado autorización expresa para ello." },
              { n: "7", t: "Análisis estadístico y mejora del servicio", d: "Análisis agregado y anonimizado del uso de la plataforma para identificar tendencias, optimizar funcionalidades y mejorar la experiencia de usuario." },
              { n: "8", t: "Cumplimiento legal", d: "Atención de requerimientos de autoridades judiciales o administrativas competentes, conforme a las obligaciones legales aplicables." },
            ].map(f => (
              <li key={f.n} className="flex gap-3">
                <span className="size-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{f.n}</span>
                <div>
                  <span className="font-semibold text-foreground">{f.t}: </span>
                  <span className="text-muted-foreground">{f.d}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="derechos" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            4. Derechos del Titular
          </h2>
          <p className="text-muted-foreground mb-3">
            De conformidad con el artículo 8 de la Ley 1581 de 2012, el titular de los datos personales tiene los siguientes derechos, que podrá ejercer en cualquier momento de forma gratuita:
          </p>
          <div className="grid gap-2">
            {[
              { r: "Derecho de acceso", d: "Conocer, actualizar y rectificar sus datos personales en cualquier momento." },
              { r: "Derecho de rectificación", d: "Solicitar la corrección de datos inexactos, incompletos o desactualizados." },
              { r: "Derecho de supresión", d: "Solicitar la eliminación de sus datos cuando no sean necesarios para la finalidad que justificó su recopilación, o cuando haya revocado la autorización." },
              { r: "Derecho de revocación", d: "Revocar la autorización de tratamiento en cualquier momento, sin efecto retroactivo." },
              { r: "Derecho a presentar queja", d: "Presentar reclamación ante la Superintendencia de Industria y Comercio (SIC) cuando considere que se han vulnerado sus derechos." },
            ].map(r => (
              <div key={r.r} className="border border-border rounded-lg p-3">
                <p className="font-semibold text-foreground text-sm mb-1">{r.r}</p>
                <p className="text-muted-foreground text-sm">{r.d}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3">
            Para ejercer cualquiera de estos derechos, el titular deberá enviar su solicitud al correo privacidad@pulseai.co, indicando su nombre completo, número de documento de identidad y la descripción clara del derecho que desea ejercer. PULSE AI responderá dentro de los quince (15) días hábiles siguientes a la recepción de la solicitud.
          </p>
        </section>

        <section id="cookies" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            5. Política de Cookies
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI utiliza cookies y tecnologías similares (píxeles de seguimiento, almacenamiento local) para mejorar la experiencia de navegación y el rendimiento de la plataforma. Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del Usuario al visitar el sitio web.
          </p>
          <p className="text-muted-foreground mb-3">
            Utilizamos los siguientes tipos de cookies: <strong className="text-foreground">Cookies esenciales</strong> (necesarias para el funcionamiento básico de la plataforma, como la gestión de sesiones y el carrito de compras); <strong className="text-foreground">Cookies analíticas</strong> (para medir el tráfico y el comportamiento de navegación a través de herramientas como Google Analytics, en su versión con anonimización de IP activada); <strong className="text-foreground">Cookies de personalización</strong> (para recordar las preferencias del Usuario, como el idioma y el tema visual); y <strong className="text-foreground">Cookies de marketing</strong> (utilizadas únicamente con consentimiento explícito del Usuario para mostrar publicidad relevante).
          </p>
          <p className="text-muted-foreground">
            El Usuario puede configurar su navegador para rechazar o eliminar las cookies en cualquier momento. Sin embargo, la desactivación de cookies esenciales puede afectar el funcionamiento correcto de la plataforma. Para gestionar sus preferencias de cookies, el Usuario puede acceder al panel de configuración disponible en el pie de página de la plataforma.
          </p>
        </section>

        <section id="transferencias" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            6. Transferencias Internacionales de Datos
          </h2>
          <p className="text-muted-foreground mb-3">
            Para la prestación de sus servicios, PULSE AI puede transferir datos personales a proveedores de servicios tecnológicos ubicados fuera de Colombia, incluyendo servicios de infraestructura en la nube (AWS, Google Cloud), herramientas de análisis y procesamiento de pagos. Todas las transferencias internacionales se realizan con las garantías adecuadas exigidas por el artículo 26 de la Ley 1581 de 2012, incluyendo la suscripción de cláusulas contractuales tipo o la verificación de estándares equivalentes de protección.
          </p>
          <p className="text-muted-foreground mb-3">
            Los principales proveedores a los que se transfieren datos son: Mercado Pago (procesamiento de pagos, con sede en Argentina y operaciones en Colombia), Google LLC (servicios de autenticación e infraestructura, USA, acogido al EU-US Data Privacy Framework), y proveedores de hosting bajo los estándares SOC 2 Type II.
          </p>
          <p className="text-muted-foreground">
            En ningún caso PULSE AI venderá, arrendará ni cederá datos personales a terceros con fines comerciales propios sin el consentimiento expreso del titular.
          </p>
        </section>

        <section id="seguridad" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            7. Medidas de Seguridad
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI implementa medidas técnicas, administrativas y físicas apropiadas para proteger los datos personales contra pérdida, acceso no autorizado, divulgación, alteración o destrucción, conforme a los estándares de la industria y los requisitos de la Circular SIC 002 de 2015. Entre las medidas implementadas se encuentran: cifrado SSL/TLS 256-bit para todas las comunicaciones; almacenamiento seguro de contraseñas mediante algoritmos de hash con sal (bcrypt); autenticación de dos factores disponible para todas las cuentas; monitoreo continuo de actividades sospechosas; y acceso restringido a datos personales únicamente al personal autorizado bajo acuerdos de confidencialidad.
          </p>
          <p className="text-muted-foreground">
            En caso de una brecha de seguridad que afecte los datos personales, PULSE AI notificará a los titulares afectados y a la Superintendencia de Industria y Comercio (SIC) dentro de los cinco (5) días hábiles siguientes a la detección del incidente, conforme a la Circular SIC 002 de 2015, incluyendo la naturaleza del incidente, los datos afectados y las medidas adoptadas para remediar la situación.
          </p>
        </section>

        <section id="contacto" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            8. Contacto y Reclamaciones
          </h2>
          <p className="text-muted-foreground mb-3">
            Para cualquier consulta, solicitud o reclamación relacionada con el tratamiento de sus datos personales, puede contactar al Oficial de Protección de Datos de PULSE AI a través de los siguientes canales:
          </p>
          <div className="bg-surface/50 border border-border rounded-xl p-4 space-y-2">
            <p className="text-muted-foreground"><strong className="text-foreground">Correo electrónico:</strong> privacidad@pulseai.co</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Dirección postal:</strong> Carrera 7 # 71-21 Piso 16, Bogotá D.C., Colombia</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Horario de atención:</strong> Lunes a viernes, 8:00 a.m. – 6:00 p.m. (hora Colombia)</p>
          </div>
          <p className="text-muted-foreground mt-3">
            Si considera que sus derechos no han sido atendidos adecuadamente por PULSE AI, puede presentar una queja ante la <strong className="text-foreground">Superintendencia de Industria y Comercio (SIC)</strong> a través de su sitio web: www.sic.gov.co, en la Delegatura para la Protección de Datos Personales. La SIC es la autoridad de control en materia de protección de datos personales en Colombia.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
