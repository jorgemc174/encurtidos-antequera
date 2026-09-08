# Acceder solo con contraseña

La pantalla `/admin` ya no pide correo. La contraseña se comprueba con Supabase
Auth, y se conserva la sesión real que protege las cartas y el asistente.
La contraseña no está incluida en el código público ni se compara en el navegador.

## Activación en el proyecto existente

1. En Supabase, la cuenta creada para administrar la web debe tener la contraseña
   que quieres usar. Si tiene otra, restablécela mediante el correo de recuperación
   de Supabase Auth. No cambies la contraseña de tu cuenta del panel de Supabase:
   es la cuenta de **Authentication → Users** de este proyecto.
2. En **Edge Functions → Deploy a new function → Via Editor**, crea **`admin-login`**.
   Pega todo el contenido de [`admin-login.ts`](../supabase/deploy/admin-login.ts)
   en `index.ts` y publica la función.
3. Desactiva **Verify JWT with legacy secret** para esta función: se utiliza antes
   de tener sesión y la contraseña se valida contra Supabase Auth dentro de ella.
4. Publica la actualización de la web y entra en `/admin`.

No necesitas otra clave de OpenAI ni volver a ejecutar la instalación SQL.
Si solo hay una cuenta en `admin_users`, se selecciona automáticamente.
Si hay varias, añade el secreto **`ADMIN_LOGIN_USER_ID`** en Edge Functions con
el UUID de la cuenta elegida; debe pertenecer a `admin_users`.

Todos los que usen esa contraseña compartirán esa cuenta y su historial de cambios.
La función no cambia contraseñas, no crea cuentas ni concede permisos nuevos.

Verificación local: `npm run test:login`, `npm run lint`, `npm run build`.
Para regenerar el archivo único del panel: `npm run build:login`.
