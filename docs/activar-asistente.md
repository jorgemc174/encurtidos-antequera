# Activar el asistente de los dueños

**Actualización del acceso:** para entrar sin escribir correo, completa también
[la guía de acceso solo con contraseña](activar-acceso-simple.md). La cuenta
de administrador sigue existiendo en Supabase, aunque el formulario solo pida contraseña.

El código está preparado. Guardar `OPENAI_API_KEY` no instala por sí solo la
función, las tablas ni el nuevo acceso. Esta guía completa esos pasos.

Proyecto existente: `gmzbcvhoslquumxkojso`. No crees otro proyecto.

## 1. Instalar la configuración de datos

En Supabase, entra en **SQL Editor → New query**. Copia todo el contenido de
[`202609090001_admin_assistant.sql`](../supabase/migrations/202609090001_admin_assistant.sql)
y pulsa **Run** una sola vez.

Este archivo conserva las cartas, textos y fotos. Añade permisos de
administrador, propuestas, historial y control de cambios simultáneos.
Retira la escritura anónima: desde este paso el editor de la versión antigua
no podrá guardar. Completa los pasos siguientes y publica la nueva web para
restablecer la edición. Los clientes pueden seguir consultando la carta.

## 2. Crear el acceso para los dueños

En **Authentication → Users → Add user**, crea una cuenta con correo y
contraseña. Si usas la creación directa con contraseña, confirma el correo
desde el panel. Esta cuenta es para entrar en la web del bar; no es necesario
dar a los dueños acceso al panel de Supabase.

En SQL Editor, abre otra consulta y pega
[`setup-admin.sql`](../supabase/setup-admin.sql). Sustituye
`CAMBIA_ESTO_POR_TU_CORREO` por el correo de la cuenta creada y ejecuta.
Repite con cada dueño que deba tener acceso. La cuenta sin este paso no puede
administrar, aunque consiga iniciar sesión.

La contraseña antigua incluida en el código deja de utilizarse. Las nuevas
contraseñas se introducen solo en Supabase y en el formulario de acceso.

## 3. Publicar la función de IA

En **Edge Functions → Deploy a new function → Via Editor**:

1. Usa el nombre exacto **`admin-assistant`**.
2. En `index.ts`, reemplaza el ejemplo por todo el contenido de
   [`supabase/deploy/admin-assistant.ts`](../supabase/deploy/admin-assistant.ts).
   Este archivo ya contiene toda la función y no necesita otros archivos.
3. Publica con **Deploy function**.
4. En la configuración de la función, desactiva **Verify JWT with legacy secret**
   si aparece. La función verifica por su cuenta cada token con Supabase Auth y
   exige pertenecer a `admin_users`; no permite peticiones anónimas. Esto evita
   que la comprobación antigua rechace tokens con claves de firma nuevas.

En **Edge Functions → Secrets** debe existir `OPENAI_API_KEY`, que ya has
configurado. No copies la clave al código ni a una variable `VITE_*`.
`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` los proporciona el entorno de Edge
Functions; no se ponen en la web pública.

El modelo predeterminado es `gpt-4.1-mini`. Opcionalmente se puede configurar
`OPENAI_MODEL` con otro modelo compatible con Responses y Structured Outputs.
La cuenta de API de OpenAI necesita facturación/saldo y acceso al modelo.

## 4. Publicar la web

Publica el commit nuevo mediante el despliegue habitual del proyecto en Vercel.
Si Vercel despliega al actualizar la rama `main`, será necesario subir el
commit al repositorio remoto. El commit local por sí solo no publica nada.

No hace falta guardar la clave de OpenAI en Vercel: las llamadas a la IA se
ejecutan en Supabase. Después, entra en **`/admin`** con la cuenta del paso 2.

## 5. Primera comprobación

1. Entra como administrador y comprueba que aparecen «Pedir cambios» e «Historial».
2. Pide un cambio de prueba real que quieras hacer, indicando producto, precio y puesto.
3. Comprueba el antes/después y los puestos. Antes de confirmar la carta no debe cambiar.
4. Marca «He revisado…» y pulsa «Confirmar y publicar».
5. Abre la carta en otra ventana y comprueba el precio.
6. En Historial, revisa «Deshacer estos cambios» y confírmalo si quieres revertir la prueba.

No pruebes usando la clave secreta desde el navegador ni usando la clave
`service_role` en el tester como sustituto de la sesión: el asistente exige un
usuario real autorizado.

## Qué incluye esta primera versión

- Precios de un puesto o varios, nombres, descripciones, textos y horarios existentes.
- Propuesta antes de publicar; preguntas cuando falta información.
- Traducción propuesta de los textos cuando existe el campo inglés.
- Historial privado de las últimas 30 propuestas por administrador.
- Confirmación y deshacer atómicos; el servidor rechaza documentos modificados
  desde que se preparó la propuesta. También detecta reordenaciones de productos.
- Las propuestas caducan a los 30 minutos.
- Máximo de 100 campos por propuesta, 20 solicitudes por hora y administrador,
  y 100 solicitudes al día en total (incluye intentos fallidos).

Fotos, altas/bajas y ordenación continúan disponibles en los editores manuales.
No se automatizan todavía notas manuscritas, tareas de programación ni cambios
de diseño. El asistente explica estas limitaciones sin inventar que los ha hecho.

El historial del asistente conserva el contenido de los documentos que modifica.
No es una copia de seguridad completa de las fotos ni de todas las ediciones
manuales anteriores. Si alguien ha editado después un documento, «Deshacer»
rechaza la operación para no sobrescribir su trabajo.

## Para mantenimiento

Con Node.js 22 actualizado:

```sh
npm ci
npm test
npm run lint
npm run build
npm run build:assistant
npm run check:assistant
```

`build:assistant` regenera el archivo único para el panel a partir de
`supabase/functions/admin-assistant/`. `check:assistant` realiza únicamente
lecturas públicas y comprueba si se ha instalado la función; no comprueba el
saldo ni la validez de la clave privada. Las pruebas automatizadas usan una
base de datos local en memoria y simulan las respuestas de OpenAI.

Referencias de la integración: [secretos de Supabase](https://supabase.com/docs/guides/functions/secrets),
[publicar funciones desde el panel](https://supabase.com/docs/guides/functions/quickstart-dashboard),
[respuestas estructuradas de OpenAI](https://developers.openai.com/api/docs/guides/structured-outputs).g
