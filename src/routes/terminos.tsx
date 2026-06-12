import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — PULSE AI" },
      {
        name: "description",
        content:
          "Términos y Condiciones del Servicio de PULSE AI, el marketplace de productos digitales premium de Latinoamérica. Ley 527/1999 y Ley 1480/2011.",
      },
    ],
  }),
  component: TerminosPage,
});

const sections = [
  { id: "objeto", label: "Objeto y alcance" },
  { id: "usuarios", label: "Registro y cuentas" },
  { id: "compras", label: "Compras y pagos" },
  { id: "propiedad", label: "Propiedad intelectual" },
  { id: "garantias", label: "Garantías y devoluciones" },
  { id: "prohibiciones", label: "Usos prohibidos" },
  { id: "responsabilidad", label: "Limitación de responsabilidad" },
  { id: "ley", label: "Ley aplicable y jurisdicción" },
];

function TerminosPage() {
  return (
    <LegalLayout
      title="Términos y Condiciones del Servicio"
      subtitle="Condiciones legales que rigen el uso de la plataforma PULSE AI"
      sections={sections}
    >
      <div className="space-y-10 text-sm leading-relaxed text-foreground">

        <section id="objeto" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            1. Objeto y Alcance del Servicio
          </h2>
          <p className="text-muted-foreground mb-3">
            Los presentes Términos y Condiciones (en adelante, "los Términos") regulan la relación jurídica entre PULSE AI S.A.S., sociedad por acciones simplificada con NIT 901.234.567-8, domiciliada en la ciudad de Bogotá D.C., Colombia (en adelante, "PULSE AI" o "la Plataforma"), y toda persona natural o jurídica que acceda, navegue, se registre o realice transacciones a través del sitio web y la plataforma digital disponible en <strong>pulseai.co</strong> (en adelante, "el Usuario").
          </p>
          <p className="text-muted-foreground mb-3">
            PULSE AI opera como un marketplace digital especializado en la comercialización de productos digitales premium, incluyendo software, kits de desarrollo (SDK), cursos en línea, plantillas, libros electrónicos (eBooks), activos digitales y demás contenidos de naturaleza inmaterial. La plataforma actúa como intermediario tecnológico entre vendedores verificados y compradores, facilitando la transacción, la entrega digital y la gestión de licencias de uso.
          </p>
          <p className="text-muted-foreground mb-3">
            La aceptación de estos Términos constituye un acuerdo legalmente vinculante conforme a lo establecido en la Ley 527 de 1999 sobre comercio electrónico en Colombia. Al acceder a la plataforma, el Usuario declara haber leído, comprendido y aceptado en su totalidad las presentes condiciones, así como nuestra Política de Privacidad y la Política de Tratamiento de Datos Personales (Habeas Data).
          </p>
          <p className="text-muted-foreground">
            PULSE AI se reserva el derecho de modificar estos Términos en cualquier momento, notificando al Usuario mediante comunicación electrónica o aviso visible en la plataforma con al menos quince (15) días de antelación. El uso continuado de la plataforma tras la entrada en vigencia de las modificaciones implicará la aceptación tácita de las nuevas condiciones.
          </p>
        </section>

        <section id="usuarios" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            2. Registro y Cuentas de Usuario
          </h2>
          <p className="text-muted-foreground mb-3">
            Para acceder a las funcionalidades de compra, descarga y gestión de productos, el Usuario deberá crear una cuenta en la plataforma mediante el suministro de información personal veraz, completa y actualizada. El proceso de registro puede realizarse directamente con correo electrónico y contraseña, o mediante autenticación a través de proveedores de identidad externos como Google. PULSE AI no almacena contraseñas de terceros proveedores de identidad.
          </p>
          <p className="text-muted-foreground mb-3">
            El Usuario es el único responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas desde su cuenta. En caso de uso no autorizado o sospecha de vulneración de seguridad, el Usuario deberá notificar inmediatamente a PULSE AI a través del correo soporte@pulseai.co. PULSE AI no será responsable por pérdidas derivadas del acceso no autorizado a la cuenta cuando el Usuario haya contribuido a dicha situación por negligencia en el resguardo de sus credenciales.
          </p>
          <p className="text-muted-foreground mb-3">
            Para registrarse como vendedor en la plataforma, el Usuario deberá completar un proceso de verificación adicional que incluye la presentación de documento de identidad, información tributaria (RUT en el caso de personas colombianas), datos bancarios para el pago de comisiones y declaración de cumplimiento de las políticas de contenido de PULSE AI. PULSE AI se reserva el derecho de rechazar o cancelar cualquier cuenta que incumpla sus políticas.
          </p>
          <p className="text-muted-foreground">
            Las cuentas de menores de 18 años requerirán autorización expresa del padre, madre o tutor legal, quien asumirá plena responsabilidad sobre las transacciones realizadas. PULSE AI podrá verificar la edad del usuario en cualquier momento y cancelar cuentas que no cumplan este requisito.
          </p>
        </section>

        <section id="compras" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            3. Proceso de Compra y Pagos
          </h2>
          <p className="text-muted-foreground mb-3">
            Todos los pagos en la plataforma PULSE AI son procesados exclusivamente por <strong>Mercado Pago Colombia S.A.S.</strong>, operador de pago certificado y regulado por la Superintendencia Financiera de Colombia. PULSE AI acepta pagos mediante tarjeta de crédito y débito (Visa, Mastercard, American Express), Nequi, PSE (Pago Seguro en Línea), y otros métodos de pago habilitados por Mercado Pago. Los precios se expresan en pesos colombianos (COP) salvo indicación expresa en contrario.
          </p>
          <p className="text-muted-foreground mb-3">
            Una vez confirmado el pago por Mercado Pago, PULSE AI habilitará de forma inmediata y automática el acceso al producto digital adquirido en la biblioteca personal del Usuario ("Mis Compras"). El Usuario recibirá una notificación por correo electrónico con el resumen de la compra, el número de pedido y las instrucciones de descarga o acceso. PULSE AI emitirá la correspondiente factura electrónica conforme a la normativa de la DIAN.
          </p>
          <p className="text-muted-foreground mb-3">
            Los precios publicados en la plataforma incluyen el Impuesto al Valor Agregado (IVA) cuando aplique, conforme a la legislación tributaria colombiana vigente. Para compradores ubicados fuera de Colombia, PULSE AI no asume responsabilidad por impuestos, aranceles o gravámenes adicionales que puedan aplicar en el país de destino.
          </p>
          <p className="text-muted-foreground">
            En caso de error técnico durante el proceso de pago que resulte en un cobro duplicado o incorrecto, el Usuario deberá reportarlo dentro de las 48 horas siguientes al correo pagos@pulseai.co, adjuntando el comprobante de transacción. PULSE AI gestionará el reembolso correspondiente dentro de los cinco (5) días hábiles siguientes a la verificación del error.
          </p>
        </section>

        <section id="propiedad" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            4. Propiedad Intelectual y Licencias
          </h2>
          <p className="text-muted-foreground mb-3">
            Todos los productos comercializados en PULSE AI están protegidos por las normas colombianas e internacionales de propiedad intelectual, en particular la Ley 23 de 1982 sobre derechos de autor, la Decisión Andina 351 de la Comunidad Andina de Naciones, y los Tratados de la OMPI (Organización Mundial de la Propiedad Intelectual) ratificados por Colombia. La compra de un producto digital otorga al Usuario una licencia de uso personal, no exclusiva, intransferible y limitada al uso descrito en la ficha del producto.
          </p>
          <p className="text-muted-foreground mb-3">
            Salvo que la licencia específica del producto indique lo contrario, el Usuario NO está autorizado para: revender, sublicenciar, redistribuir, arrendar o transferir el producto a terceros; descompilar, realizar ingeniería inversa o extraer el código fuente de software licenciado; eliminar o alterar marcas de agua, metadatos o avisos de derechos de autor; publicar el producto en repositorios públicos, plataformas de intercambio o sitios de acceso libre.
          </p>
          <p className="text-muted-foreground mb-3">
            Los vendedores de la plataforma garantizan y declaran ser titulares de los derechos de propiedad intelectual sobre los productos que publican, o contar con las autorizaciones necesarias para su comercialización. Cualquier reclamación por infracción de derechos de autor deberá ser notificada a legal@pulseai.co con la documentación acreditativa correspondiente, y PULSE AI procederá conforme al procedimiento de retirada establecido en la Ley 1915 de 2018.
          </p>
          <p className="text-muted-foreground">
            La marca "PULSE AI", el logotipo, el diseño de la plataforma y todo el contenido generado por PULSE AI son propiedad exclusiva de PULSE AI S.A.S. Queda prohibida su reproducción, uso comercial o modificación sin autorización escrita previa.
          </p>
        </section>

        <section id="garantias" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            5. Garantías y Política de Devolución
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI ofrece una garantía de satisfacción de <strong>30 días calendario</strong> contados desde la fecha de compra, en cumplimiento del Estatuto del Consumidor (Ley 1480 de 2011). Si el producto digital presenta defectos funcionales, no corresponde a la descripción publicada, o no puede ser accedido por razones imputables a la plataforma, el Usuario tiene derecho a solicitar el reembolso total del precio pagado, el reemplazo del producto, o una compensación equivalente.
          </p>
          <p className="text-muted-foreground mb-3">
            Las solicitudes de devolución deberán enviarse a soporte@pulseai.co dentro del plazo de garantía, indicando el número de pedido, la descripción del defecto o inconformidad, y las evidencias que soporten la reclamación (capturas de pantalla, mensajes de error, etc.). PULSE AI evaluará la solicitud dentro de los tres (3) días hábiles siguientes y comunicará la resolución al Usuario.
          </p>
          <p className="text-muted-foreground mb-3">
            La garantía no aplica en los siguientes casos: (i) el Usuario descargó o accedió exitosamente al producto y no presenta defecto funcional; (ii) el problema es causado por incompatibilidades del sistema del Usuario ajenas al producto; (iii) el Usuario violó los términos de la licencia; (iv) el producto fue adquirido durante una promoción o descuento especial que excluya expresamente la garantía.
          </p>
          <p className="text-muted-foreground">
            Los reembolsos aprobados se procesarán a través de Mercado Pago en un plazo de cinco (5) a diez (10) días hábiles, dependiendo de la entidad financiera del Usuario. PULSE AI notificará al Usuario por correo electrónico cuando el reembolso haya sido procesado.
          </p>
        </section>

        <section id="prohibiciones" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            6. Usos Prohibidos
          </h2>
          <p className="text-muted-foreground mb-3">
            Queda estrictamente prohibido utilizar la plataforma PULSE AI para publicar, comercializar o distribuir productos que: contengan malware, virus, ransomware, spyware o cualquier código malicioso; violen derechos de propiedad intelectual de terceros; promuevan actividades ilegales, discriminación, violencia, pornografía infantil o terrorismo; sean fraudulentos, engañosos o induzcan a error al consumidor; incumplan la Ley 1273 de 2009 sobre delitos informáticos en Colombia.
          </p>
          <p className="text-muted-foreground mb-3">
            También se prohíbe: utilizar bots, scripts automatizados o herramientas de scraping para extraer información de la plataforma; realizar ataques de denegación de servicio (DDoS) o intentos de acceso no autorizado a los sistemas de PULSE AI; crear múltiples cuentas para evadir restricciones o sanciones; realizar transacciones fraudulentas o disputas de pago sin fundamento (chargebacks abusivos); suplantar la identidad de PULSE AI o de otros usuarios.
          </p>
          <p className="text-muted-foreground">
            El incumplimiento de estas prohibiciones facultará a PULSE AI para suspender o cancelar la cuenta del Usuario de forma inmediata y sin previo aviso, retener los fondos pendientes de pago, reportar las actividades ilícitas a las autoridades competentes colombianas (Fiscalía General de la Nación, Policía Nacional — DIJIN), y ejercer las acciones legales pertinentes para la reparación de los daños causados.
          </p>
        </section>

        <section id="responsabilidad" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            7. Limitación de Responsabilidad
          </h2>
          <p className="text-muted-foreground mb-3">
            PULSE AI actúa como intermediario tecnológico y no es fabricante ni autor de los productos digitales comercializados por terceros vendedores en su plataforma. En consecuencia, PULSE AI no garantiza la idoneidad, exactitud, completitud o actualidad de los contenidos de dichos productos más allá de lo verificado en el proceso de revisión editorial, cuya responsabilidad final recae en el vendedor.
          </p>
          <p className="text-muted-foreground mb-3">
            En ningún caso PULSE AI será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso de los productos adquiridos, incluyendo pérdida de beneficios, pérdida de datos o interrupción del negocio, salvo en los casos expresamente contemplados en la Ley 1480 de 2011 como responsabilidad inderogable del proveedor. La responsabilidad máxima de PULSE AI respecto de cualquier reclamación se limitará al valor pagado por el producto objeto de la reclamación.
          </p>
          <p className="text-muted-foreground">
            La plataforma se provee "tal cual" (as-is), sin garantías de disponibilidad ininterrumpida. PULSE AI realizará sus mejores esfuerzos para mantener una disponibilidad del 99,5% mensual, pero no asume responsabilidad por interrupciones causadas por mantenimientos programados, fuerza mayor, fallas en proveedores de infraestructura cloud o ataques cibernéticos.
          </p>
        </section>

        <section id="ley" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
            8. Ley Aplicable y Jurisdicción
          </h2>
          <p className="text-muted-foreground mb-3">
            Los presentes Términos y Condiciones se rigen en su totalidad por las leyes de la República de Colombia, en particular la Ley 527 de 1999 (Comercio Electrónico), la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 1581 de 2012 (Protección de Datos Personales), la Ley 23 de 1982 (Derechos de Autor) y demás normas concordantes vigentes.
          </p>
          <p className="text-muted-foreground mb-3">
            Para la resolución de cualquier controversia derivada de la interpretación, ejecución o incumplimiento de estos Términos, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a la competencia de los Tribunales ordinarios de la ciudad de <strong>Bogotá D.C., Colombia</strong>. No obstante, el Usuario podrá acudir ante la Superintendencia de Industria y Comercio (SIC) para la resolución de conflictos de consumo conforme al procedimiento establecido en la Ley 1480 de 2011.
          </p>
          <p className="text-muted-foreground">
            Para cualquier consulta, reclamación o comunicación relacionada con estos Términos, el Usuario podrá contactar a PULSE AI S.A.S. en la dirección: Carrera 7 # 71-21 Piso 16, Bogotá D.C., Colombia; correo electrónico: legal@pulseai.co; línea de atención: soporte@pulseai.co.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
