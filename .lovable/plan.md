# Dejar PULSE AI listo para vender de verdad

Hoy el pago con Mercado Pago ya funciona, pero el catálogo, la biblioteca y "Mis compras" muestran datos de demostración guardados en el navegador, y **el pago no entrega nada**: cuando alguien paga, no queda registro ni se le da acceso al producto. Este plan cierra ese círculo para que un comprador pueda: ver productos reales → pagar → recibir acceso automáticamente → descargar desde su biblioteca.

## Qué se va a construir

### 1. Tabla de órdenes (lo que falta para operar)
Nueva tabla `orders` que registra cada compra:
- comprador (id y email), producto, monto, moneda, cuotas
- estado: `pending` → `paid` / `failed`
- referencia del pago de Mercado Pago para verificación

Reglas de acceso: cada comprador ve solo sus propias órdenes; el sistema de pagos (servidor) puede crear y confirmar órdenes. Los vendedores ven las órdenes de sus productos.

### 2. El pago entrega el producto (fulfillment)
- Al iniciar el checkout se crea una orden `pending` y su id viaja como referencia a Mercado Pago.
- El weblook de Mercado Pago, al confirmar el pago como aprobado, marca la orden como `paid`. Ese registro es lo que habilita la biblioteca y "Mis compras".
- Se mantiene la verificación server-side actual (nunca se confía en el cliente).

### 3. Catálogo real (eliminar productos demo)
- El Marketplace pasará a mostrar **solo productos reales** publicados desde el panel (tabla `products`, estado `live`).
- Se eliminan los listados de demostración y las "semillas" de ejemplo guardadas en el navegador.
- Si no hay productos aún, se muestra un estado vacío elegante invitando a publicar.

### 4. Biblioteca y "Mis compras" reales
- Ambas pantallas leerán las órdenes pagadas del usuario autenticado en lugar de datos de ejemplo.
- El comprador verá sus productos comprados, con sus archivos para descargar y su clave de licencia cuando aplique.
- Estados vacíos claros cuando aún no hay compras.

### 5. Coherencia y experiencia del comprador
- Página de producto / checkout cargan el producto real por id (precio, nombre, archivos correctos).
- `pago-exitoso` confirma contra la orden real y enlaza directo a la biblioteca.
- Mensajes, monedas (COP) y textos consistentes en español en todo el flujo de compra.

## Detalles técnicos

- **Migración** `orders`: `id`, `buyer_id` (uuid, auth.users), `buyer_email`, `product_id` (fk products), `product_name`, `amount` (numeric), `currency` ('COP'), `installments`, `status` ('pending'|'paid'|'failed'), `mp_payment_id`, `mp_preference_id`, `external_reference`, timestamps + trigger updated_at. GRANT a `authenticated`/`service_role`. RLS: SELECT propio (`buyer_id = auth.uid()`) + SELECT del dueño del producto vía join a `products.owner_id`; INSERT/UPDATE solo service_role (vía webhook/checkout server).
- **`api.mp-checkout.ts`**: antes de crear la preferencia, insertar orden `pending` con `supabaseAdmin` y usar su `id` como `external_reference`; guardar `mp_preference_id`.
- **`api.public.mp-webhook.ts`**: al aprobarse, `update orders set status='paid', mp_payment_id=...` por `external_reference`.
- **`src/lib/db.ts`**: hooks `useMarketplaceProducts()` (products live, público vía server fn), `useMyOrders()` (órdenes pagadas del usuario).
- **`marketplace.tsx`, `checkout.tsx`, `library.tsx`, `mis-compras.tsx`, `pago-exitoso.tsx`**: consumir DB en vez de mock/localStorage.
- **`mock-data.ts` / `products-store.tsx`**: quitar listados y semillas demo (mantener solo tipos/labels que se sigan usando).

## Fuera de alcance (se puede hacer después)
LMS/cursos, CRM, afiliados, suscripciones recurrentes, multi-tenant white-label y módulos de IA — el panel ya los muestra como demo y no son necesarios para empezar a vender. Lo dejo listo para abordarlos en una siguiente iteración si quieres.