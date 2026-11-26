# ShipNow API

ShipNow API es una aplicación backend construida con Node.js, Express y MongoDB para gestionar la logística de envíos. Permite registrar usuarios con distintos roles (`admin`, `customer`, `store` y `driver`), crear pedidos y asignarlos a entregas, y hacer el seguimiento (tracking) de todo el recorrido mediante los estados del pedido y de la entrega.

## Tecnologías

**Backend**
- Node.js y Express: servidor y API REST.
- MongoDB: base de datos y modelado de entidades.
- dotenv: carga de variables de entorno, centralizadas en `src/config/index.js`.

**Archivos**
- Multer: carga de documentos de usuarios y comprobantes de pedidos (límite de 5 MB y validación de tipo).
- file-type: verificación del tipo real del archivo según su contenido.

**Logging**
- Winston y winston-daily-rotate-file: logger centralizado con niveles (`fatal`, `error`, `warning`, `info`, `http`, `debug`) y rotación diaria de archivos.

**Documentación**
- swagger-jsdoc y swagger-ui-express: documentación interactiva en `/api/docs`, definida en `src/docs/*.yaml`.

**Testing**
- Mocha, Chai y Supertest: tests funcionales de los endpoints.
- cross-env: define `NODE_ENV=test` de forma compatible con cualquier sistema operativo.

**Desarrollo y despliegue**
- nodemon: recarga automática en desarrollo (`npm run dev`).
- Docker y Docker Compose: imagen multi-stage y orquestación de la API junto con MongoDB.

## Funcionamiento base de la API

En su estado actual, la API permite trabajar con cuatro entidades principales:

* Usuarios
* Comercios
* Productos
* Pedidos

La idea del proyecto es simular una API simple de logística/envíos.

Un usuario puede representar a un cliente.
Un comercio representa el lugar desde donde sale el pedido.
Un producto representa un artículo que un comercio puede vender, con stock y precio propios.
Un pedido representa una solicitud de envío asociada a un usuario y a un comercio, que contiene uno o más productos.

### Flujo principal

El flujo básico de la API es:

1. Crear un usuario.
2. Crear un comercio.
3. Crear productos.
4. Crear un pedido usando el ID del usuario, el ID del comercio y los productos (con su cantidad).
5. Consultar los pedidos.
6. Actualizar el estado de un pedido.

Al crear un pedido, la API busca cada producto solicitado, descuenta su stock (`quantity`) y, si llega a 0, actualiza su `status` a `out of stock`. El pedido guarda una copia de `name` y `price` de cada producto al momento de la compra, además de la referencia al producto original.

## Instalación y ejecución local

1. Cloná el repositorio y entrá a la carpeta del proyecto.

2. Instalá las dependencias:
```bash
   npm install
```
3. Creá un archivo `.env` en la raíz, copiando `.env.example`, y completá tus valores:
```bash
   cp .env.example .env
```
   Variables requeridas: `PORT` y `MONGODB_URI` solo se exigen fuera de test. Para correr `npm test` alcanza con `MONGODB_URI_TEST`.

4. Iniciá el servidor:
```bash
   npm start
```
   Si falta alguna variable obligatoria en `.env`, la app va a lanzar un error descriptivo y no va a arrancar.

## Arquitectura por capas

El proyecto separa responsabilidades en tres capas:

- **Repository**: es el único lugar que conoce Mongoose. Se encarga solo de leer y guardar datos, y encapsula detalles de acceso (por ejemplo, excluye el campo `password` de las respuestas de usuario, y filtra por defecto las tiendas activas en `getStores`).
- **Service**: contiene la lógica de negocio (validaciones de datos obligatorios, cálculo del total de un pedido, verificación de que existan el usuario y la tienda antes de crear una orden). Llama al Repository, pero nunca a Mongoose directamente.
- **Controller**: es la única puerta de entrada HTTP. Recibe `req`/`res`, llama al Service, y devuelve la respuesta con el status code correspondiente.

Esta separación evita mezclar reglas de negocio con acceso a datos, y permite cambiar la base de datos o la lógica interna sin tocar las otras capas.

### Entidades principales

### User

Representa a un usuario dentro del sistema.

Campos principales:

```json
{
  "firstName": "Martina",
  "lastName": "Gómez",
  "email": "martina@test.com",
  "password": "123456",
  "role": "customer"
}
```

Roles disponibles:

```txt
admin
customer
store
driver
```

En esta versión base, el usuario se usa principalmente como cliente del pedido.

---

### Store

Representa un comercio.

Campos principales:

```json
{
  "name": "Kiosco Centro",
  "address": "Av. Siempre Viva 742",
  "owner": "ID_DEL_USUARIO"
}
```

El campo `owner` guarda el ID de un usuario asociado al comercio.

---

### Product

Representa un producto disponible para la venta.

Campos principales:

```json
{
  "name": "Caja mediana",
  "price": 1500,
  "quantity": 20,
  "status": "available"
}
```

Estados posibles del producto:

```txt
available
out of stock
```

El stock (`quantity`) se descuenta automáticamente cuando el producto se incluye en un pedido. Al llegar a 0, el `status` pasa a `out of stock` y el producto deja de aparecer en el listado general (`GET /api/products`), que por defecto solo devuelve productos disponibles.

---

### Order

Representa un pedido o envío.

Campos principales:

```json
{
  "customer": "ID_DEL_USUARIO",
  "store": "ID_DEL_COMERCIO",
  "deliveryAddress": "Av. Siempre Viva 742",
  "items": [
    {
      "product": "ID_DEL_PRODUCTO",
      "quantity": 2
    }
  ]
}
```

El body de creación solo necesita el `id` del producto y la cantidad pedida. Internamente, la API busca cada producto, descuenta su stock, y guarda en el pedido una copia con `name`, `price` y la referencia (`product`) en el momento de la compra.

Cuando se crea un pedido, la API calcula el total automáticamente recorriendo los items.

Ejemplo:

```txt
2 unidades x $1500 = $3000
```

El pedido se crea inicialmente con estado:

```txt
created
```

Estados posibles del pedido:

```txt
created
assigned
picked_up
in_transit
delivered
cancelled
```

### Endpoints disponibles

### Health check

Verifica que la API está funcionando y que la conexión a la base de datos está activa.

```http
GET /health
```

Con la base conectada (`200`):

```json
{
  "status": "success",
  "message": "API funcionando",
  "payload": {
    "environment": "production",
    "uptime": 125,
    "timestamp": "2026-11-19T16:33:38.000Z",
    "database": "connected"
  }
}
```

Si la base no está disponible responde `503` con el error `DATABASE_UNAVAILABLE`:

```json
{
  "status": "error",
  "error": "DATABASE_UNAVAILABLE",
  "message": "Base de datos no disponible"
}
```

- `environment`: valor de `NODE_ENV`.
- `uptime`: segundos desde que arrancó el proceso.
- `timestamp`: fecha y hora de la respuesta (ISO 8601).

No expone variables de entorno, URIs ni datos de la base.

## Users

### Obtener usuarios

```http
GET /api/users
```

### Obtener usuario por ID

```http
GET /api/users/:uid
```

### Crear usuario

```http
POST /api/users
```

Body de ejemplo:

```json
{
  "firstName": "Martina",
  "lastName": "Gómez",
  "email": "martina@test.com",
  "password": "123456",
  "role": "customer"
}
```

### Cargar documento de usuario

```http
POST /api/users/:uid/documents
Content-Type: multipart/form-data
```

Campos del form-data:

- `document` (file): el archivo.
- `documentType` (text): `document` o `license`.

Cada carga **agrega** un documento al array `documents` del usuario; los anteriores se conservan. Ver [Carga de archivos](#carga-de-archivos-multer).

### Actualizar usuario

```http
PUT /api/users/:uid
```

### Eliminar usuario

```http
DELETE /api/users/:uid
```

---

## Stores

### Obtener comercios

```http
GET /api/stores
```

### Obtener comercio por ID

```http
GET /api/stores/:sid
```

### Crear comercio

```http
POST /api/stores
```

Body de ejemplo:

```json
{
  "name": "Kiosco Centro",
  "address": "Av. Siempre Viva 742",
  "owner": "ID_DEL_USUARIO"
}
```

### Actualizar comercio

```http
PUT /api/stores/:sid
```

### Eliminar comercio

```http
DELETE /api/stores/:sid
```

---

## Products

### Obtener productos disponibles

```http
GET /api/products
```

Devuelve solo los productos con `status: "available"`.

### Obtener producto por ID

```http
GET /api/products/:id
```

### Crear producto

```http
POST /api/products
```

Body de ejemplo:

```json
{
  "name": "Caja mediana",
  "price": 1500,
  "quantity": 20
}
```

### Actualizar campos del producto

```http
PUT /api/products/:id
```

Acepta cualquier combinación de campos del producto (`name`, `price`, `quantity`, `status`); solo actualiza las claves que vengan en el body.

Body de ejemplo (cambiar precio y stock):

```json
{
  "price": 1800,
  "quantity": 15
}
```

Body de ejemplo (cambiar solo el estado):

```json
{
  "status": "out of stock"
}
```

### Eliminar producto

```http
DELETE /api/products/:id
```

## Orders

### Obtener pedidos

```http
GET /api/orders
```

### Obtener pedido por ID

```http
GET /api/orders/:oid
```

### Crear pedido

```http
POST /api/orders
```

Body de ejemplo:

```json
{
  "customer": "ID_DEL_USUARIO",
  "store": "ID_DEL_COMERCIO",
  "deliveryAddress": "Av. Siempre Viva 742",
  "items": [
    {
      "product": "ID_DEL_PRODUCTO_1",
      "quantity": 2
    },
    {
      "product": "ID_DEL_PRODUCTO_2",
      "quantity": 1
    }
  ]
}
```

Respuesta esperada:

```json
{
  "status": "success",
  "payload": {
    "_id": "ID_DEL_PEDIDO",
    "customer": "ID_DEL_USUARIO",
    "store": "ID_DEL_COMERCIO",
    "items": [
      {
        "product": "ID_DEL_PRODUCTO_1",
        "name": "Caja mediana",
        "price": 1500,
        "quantity": 2
      },
      {
        "product": "ID_DEL_PRODUCTO_2",
        "name": "Sobre chico",
        "price": 800,
        "quantity": 1
      }
    ],
    "deliveryAddress": "Av. Siempre Viva 742",
    "total": 3800,
    "status": "created"
  }
}
```

### Cargar comprobante del pedido

```http
POST /api/orders/:oid/receipt
Content-Type: multipart/form-data
```

Campo del form-data: `receipt` (file). Cada pedido tiene **un solo comprobante**: si ya tenía uno, se reemplaza y se borra el archivo anterior. Ver [Carga de archivos](#carga-de-archivos-multer).

### Actualizar estado del pedido

```http
PUT /api/orders/:oid/status
```

Body de ejemplo:

```json
{
  "status": "in_transit"
}
```

### Eliminar pedido

```http
DELETE /api/orders/:oid
```

## Mocking y carga de datos de prueba

* **GET** (genera sin guardar): `/api/mocks/users`, `/api/mocks/drivers`, `/api/mocks/orders`, `/api/mocks/deliveries` — todos aceptan `?qty=N`.
* **POST** (genera e inserta en MongoDB): `/api/mocks/seed?type=<storeOwner|stores|users|drivers|orders|deliveries>&qty=N`

**Orden recomendado para sembrar datos de prueba desde una base vacía**, porque `orders` necesita `customer`, `store` y `product` reales, y `deliveries` necesita `order` y `driver` reales:

1. `POST /api/mocks/seed?type=storeOwner&qty=N` — usuarios con rol `store` (dueños de comercio).
2. `POST /api/mocks/seed?type=stores&qty=N` — comercios reales, usando los owners del paso anterior.
3. `POST /api/mocks/seed?type=users&qty=N` y `type=drivers&qty=N` — clientes y repartidores.
4. Cargar al menos un `Product` real vía `POST /api/products` (el mocking no genera productos).
5. `POST /api/mocks/seed?type=orders&qty=N` — ahora encuentra `customer`, `store` y `product` reales.
6. `POST /api/mocks/seed?type=deliveries&qty=N` — asocia `order` y `driver` reales.

Módulo bajo `/api/mocks`, respeta la arquitectura por capas del resto del proyecto.
El seed inserta con `insertMany` en una sola operación. Si falla, responde `SAVE_MOCKS_FAILED`.

Ejemplo:

```http
GET /api/mocks/users?qty=2
```
```json
{
  "status": "success",
  "payload": [
    { "firstName": "Ana", "lastName": "Pérez", "email": "ana.perez@test.com", "role": "customer" }
  ]
}
```

```http
POST /api/mocks/seed?type=users&qty=10
```
```json
{
  "status": "success",
  "payload": { "insertados": 10, "coleccion": "users" }
}
```

Roles, estados y prioridades usados en los mocks salen siempre de las constantes centralizadas (`USER_ROLES`, `ORDER_STATUS`, `ORDER_PRORITY`, `DELIVERY_STATUS`).

## Formato general de respuestas

Las respuestas exitosas siguen una estructura simple:

```json
{
  "status": "success",
  "message": "",
  "payload": {}
}
```

## Manejo de errores

Todos los errores de la API se manejan de forma centralizada:

- **Services**: detectan el error y lo lanzan con `throw createError(ERROR_CODES.X)`.
- **Controllers**: no arman respuestas de error, solo hacen `next(error)`.
- **Middleware global** (`middlewares/errorHandler.js`): es el único lugar que responde errores al cliente.

Los errores del dominio son instancias de `AppError` (`errors/appError.js`), y sus códigos, status y mensajes están en `errors/error.codes.js` y `errors/error.dictionary.js`.

### Estructura de la respuesta de error

```json
{
  "status": "error",
  "error": "PRODUCT_NOT_FOUND",
  "message": "Producto no encontrado"
}
```

- `status`: siempre `"error"`.
- `error`: código del error (clave del diccionario).
- `message`: mensaje legible para el cliente.

Los errores inesperados responden `INTERNAL_SERVER_ERROR` con un mensaje genérico; el detalle real solo se registra en la consola del servidor y en la carpeta /logs.

### Cómo probar los casos inválidos

| Caso | Request | Error esperado |
|---|---|---|
| Cantidad de mocks no numérica | `POST /api/mocks/seed?type=users&qty=abc` | `INVALID_QUANTITY` |
| Cantidad cero o negativa | `POST /api/mocks/seed?type=users&qty=-5` | `INVALID_QUANTITY` |
| Cantidad decimal | `POST /api/mocks/seed?type=users&qty=2.5` | `INVALID_QUANTITY` |
| Cantidad en notación científica | `POST /api/mocks/seed?type=users&qty=1e1` | `INVALID_QUANTITY` |
| Cantidad sobre el máximo (50) | `POST /api/mocks/seed?type=users&qty=51` | `INVALID_QUANTITY` |
| Sin cantidad | `POST /api/mocks/seed?type=users` | `INVALID_QUANTITY` |
| Tipo de mock inexistente | `POST /api/mocks/seed?type=xyz&qty=3` | `TYPE_NOT_FOUND` |
| Falla al guardar en MongoDB | `POST /api/mocks/seed?type=drivers&qty=3` poner una `MONGODB_URI` inválida o apagar `Mongo` y hacer el `POST` | `SAVE_MOCKS_FAILED` (500) |
| Orden con stock insuficiente | `POST /api/orders` con `quantity` mayor al stock | `PRODUCT_NOT_AVAILABLE` |
| Producto inexistente en una orden | `POST /api/orders` con un ObjectId válido que no existe | `PRODUCT_NOT_FOUND` |
| Cantidad inválida en un item | `POST /api/orders` con `quantity` de `-5`, `0`, `2.5` o `"abc"` | `INVALID_QUANTITY` |
| Items vacío o que no es array | `POST /api/orders` con `"items": []` | `INVALID_DATA` |
| Estado de pedido inválido | `PUT /api/orders/:oid/status` con `{"status": "hola"}` | `INVALID_ORDER_STATUS` |
| Id con formato inválido | `GET /api/products/abc` | `INVALID_DATA` |
| JSON mal formado | `POST /api/orders` con body `{ "customer": }` | `INVALID_DATA` |

Caso válido de referencia: `POST /api/mocks/seed?type=users&qty=3` responde `201` con `insertados: 3`.

Si Mongo no está disponible al iniciar el servidor, la API no levanta y se cierra con un mensaje en consola.

## Carga de archivos (Multer)

La API permite subir documentos de usuario y comprobantes de pedido con [Multer](https://github.com/expressjs/multer) (`middlewares/upload.middleware.js`).

### Endpoints

| Endpoint | Campo del archivo | Otros campos | Comportamiento |
|---|---|---|---|
| `POST /api/users/:uid/documents` | `document` | `documentType` (`document` o `license`) | Agrega el documento al array `documents` del usuario |
| `POST /api/orders/:oid/receipt` | `receipt` | — | Guarda el comprobante; si había uno, lo reemplaza y borra el anterior |

### Reglas

- Formatos permitidos: PDF, JPEG, PNG y WEBP.
- Tamaño máximo: 5 MB por archivo.
- Se valida el tipo dos veces: por el `mimetype` que declara el cliente (`fileFilter` de Multer) y por el contenido real del archivo (`file-type`), para que no se pueda subir otro formato cambiando la extensión.

### Dónde se guardan

- Los archivos se guardan en disco, en `uploads/documents` y `uploads/receipts`. Las carpetas se crean solas al primer uso.
- El nombre en disco es único (`<timestamp>-<número aleatorio><extensión>`), para que dos archivos con el mismo nombre no se pisen.
- En la base solo se guardan los metadatos: `originalName`, `fileName`, `path`, `mimeType`, `size`, `uploadedAt` (y `documentType` en los documentos de usuario).
- `uploads/` está en `.gitignore`.

### Errores

| Código | Status | Cuándo |
|---|---|---|
| `INVALID_FILE_TYPE` | 400 | El archivo no es PDF, JPEG, PNG o WEBP |
| `INVALID_DOCUMENT_TYPE` | 400 | `documentType` falta o no es `document` / `license` |
| `LIMIT_FILE_SIZE` | 400 | El archivo supera los 5 MB |
| `LIMIT_UNEXPECTED_FILE` | 400 | El campo del archivo tiene otro nombre (no es `document` / `receipt`) |
| `NOT_RECEIVED_FILE` | 400 | No se envió ningún archivo |
| `USER_NOT_FOUND` / `ORDER_NOT_FOUND` | 404 | El id no existe |
| `SAVE_FILE_FAILED` | 500 | Falló el guardado de los metadatos en la base |

Si la operación falla después de que Multer guardó el archivo, el archivo se borra del disco para no dejar basura. Los errores de Multer se traducen en `errorHandler.js` al mismo formato de error del resto de la API.

### Cómo probarlo

Con Postman o Swagger (`/api/docs`), enviar el body como `form-data` (no JSON):

- Usuario: `document` (tipo File) + `documentType` (tipo Text).
- Pedido: `receipt` (tipo File).

Casos inválidos para probar: un `.txt` (`INVALID_FILE_TYPE`), un archivo de más de 5 MB (`LIMIT_FILE_SIZE`), otro nombre de campo (`LIMIT_UNEXPECTED_FILE`), sin archivo (`NOT_RECEIVED_FILE`) y `documentType` inválido.

## Logger

### Herramientas

- Winston
- winston-daily-rotate-file

### Niveles

- `fatal: 0` → para ocasiones críticas como por ejemplo: `Falla de conexión a mongoDB`.
- `error: 1` → para errores que no controlamos como por ejemplo: `un error con status 500`.
- `warning: 2` → para errores controlados como por ejemplo: `Cantidad inválida` o un `Not found`.
- `info: 3` → para los casos de éxito como por ejemplo: `Servidor escuchando en el puerto...`.
- `http: 4` → registra cada petición que recibe el servidor (método, URL, status y tiempo de respuesta) mediante el middleware `requestLogger`. Solo se escribe con `LOG_LEVEL=http` o `debug`; con el nivel por defecto de producción (`info`) no se muestra.
- `debug: 5` → para tener un registro del recorrido de nuestro código, solo está activo en desarrollo.

### Dónde se guardan los logs

Se guardan en la carpeta `logs/` de la raíz, con rotación diaria y 14 días de retención:

- `error-YYYY-MM-DD.log`: solo los niveles `error` y `fatal`.
- `combined-YYYY-MM-DD.log`: toda la actividad desde el nivel mínimo del entorno (`debug` en desarrollo, `info` en producción).

Cada día se crea un archivo nuevo y pasados 14 días se borran solos.

### Archivos ignorados en Git

Se ignoran `logs/*.log` (los registros de errores y fatales) y `logs/*.json` (control de rotación) porque cambian todo el tiempo, pueden tener información sensible y cada entorno tiene sus propios archivos.

### Cómo probar el logger

- URL → http://localhost:<PORT>/loggerTest/

En ambos entornos, `error-*.log` contendrá solo los errores y fatales del día, y `combined-*.log` toda la actividad desde el nivel mínimo del entorno.

### Comportamiento según el entorno

`NODE_ENV` decide el nivel mínimo: `debug` en desarrollo, `info` en producción.

- En desarrollo, los logs se muestran en la terminal (los 6 niveles) y también se guardan en archivos.
- En producción y en test, no hay salida por consola: los logs se guardan solo en archivos.

### Tracking de envíos

En ShipNow, un pedido (`Order`) representa un envío. El seguimiento (tracking) se resuelve con el campo `status`:

- Consultar el estado actual: `GET /api/orders/:oid` y `GET /api/deliveries/:did`.
- Actualizar el estado: `PUT /api/orders/:oid/status` y `PUT /api/deliveries/:did/status`.

Estados de un pedido: `created`, `picked_up`, `assigned`, `in_transit`, `delivered`, `cancelled`.
Estados de una entrega: `assigned`, `in_transit`, `delivered`, `cancelled`.

## Documentación (Swagger)

La documentación interactiva está disponible en `http://localhost:<PORT>/api/docs` con el servidor levantado.

### Módulos documentados

- **Users**: `/api/users` (incluye `POST /{uid}/documents`, `multipart/form-data`)
- **Orders**: `/api/orders` (incluye `POST /{oid}/receipt`, `multipart/form-data`)
- **Deliveries**: `/api/deliveries`
- **Stores**: `/api/stores`
- **Products**: `/api/products` y `/api/products/{id}` (`GET`, `POST`, `PUT` y `DELETE`)
- **Mocks**: `/api/mocks`
- **Logger**: `/loggerTest`
- **Health**: `/health` (respuestas 200 y 503)

### Aclaraciones para probar los endpoints

- Los mocks reciben `type` y `qty` por **query**, no por body. `qty` es un entero entre 1 y 50.
- `POST /api/mocks/seed` necesita datos previos según el tipo: pedidos requieren usuarios, tiendas y productos; deliveries requieren pedidos y drivers.
- `/loggerTest` es una herramienta de validación de logs, no una funcionalidad de negocio.
- Las respuestas de error tienen el formato `{ status: "error", error: "CODIGO", message: "..." }`.

## Testing

### Herramientas

- **Mocha**: organiza y ejecuta los tests.
- **Chai**: aserciones (`expect`).
- **Supertest**: peticiones HTTP a la app de Express sin levantar un puerto.
- **cross-env**: define `NODE_ENV=test` al ejecutar `npm test`.

### Cómo ejecutar los tests

```bash
npm test
```
La app (`app.js`) está separada del arranque del servidor, así que los tests la importan directamente.

### Módulos cubiertos

- **Health**: Estado de la API.
- **Users**: Crear, listar, obtener por id, actualizar y eliminar, con errores (campos faltantes, usuario inexistente, id con formato inválido y email duplicado en post y put).
- **Deliveries**: Listar, obtener por id y actualizar estado por id, con errores (delivery inexistente, valor de status inválido).
- **Orders**: Crear, listar, obtener por id, actualizar estado y eliminar, con errores (datos incompletos, items vacíos, cantidad inválida en un item, recurso inexistente, estado inválido, stock insuficiente, formato de id inválido en get, put de estado y delete).
- **Mocks**: GET de usuarios, orders, deliveries y drivers mock y POST `/seed` (comprueba que se guardó en la base), con errores por cantidad inválida en el GET de users, orders, deliveries y drivers y en el seed (`INVALID_QUANTITY`), tipo inexistente (`TYPE_NOT_FOUND`) y datos previos faltantes en el seed (`USER_NOT_FOUND`, `STORE_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `ORDER_NOT_FOUND`, `DRIVERS_NOT_FOUND`), más el GET de orders sin productos cargados (`NO_SAVED_PRODUCTS`).
- **Carga de archivos**: documentos de usuario y comprobantes de pedido. Cada test arma un PNG de 1x1 píxel en memoria (`Buffer` desde base64), así que no hacen falta archivos en el repo, y un `afterEach` borra el archivo subido. Cubren la carga exitosa y los errores (sin archivo, `documentType` inválido o vacío).
- **Logger**: `GET /loggerTest`, con error 404 (`ROUTE_NOT_FOUND`) al usar un método no soportado.
- **Swagger**: `GET /api/docs/`. No tiene caso de error porque es documentación estática, sin errores de negocio.
- **Stores**: Crear, listar, actualizar, obtener por id, eliminar por id, con errores 400 por id con formato inválido, 400 por falta de datos obligatorios y 404 por tienda inexistente.
- **Products**: Crear, listar, obtener por id, actualizar, eliminar por id, con errores 400 por falta de campos obligatorios, 400 por valor de precio inválido y 404 por producto no encontrado. Default de limit en 10, limit válido, página 2 y tope de 50".
- **Rutas inexistentes**: 404 con el formato de error definido.
- **Health**: 503, base desconectada.

Cada test valida el status HTTP y la estructura del body (en los errores, `status`, `error` y `message`).

### Base de datos de testing

Sí, se requiere una base separada (`ShipNow-api-test`). Antes de cada test, los hooks (`tests/setup.js`) limpian las colecciones, y antes de hacerlo verifican que `NODE_ENV` sea `test` y que la base conectada sea la de testing, para no borrar datos de desarrollo.

`npm test` necesita una MongoDB accesible. Si no tenés una instalada, podés levantar una con Docker:

```bash
docker run -d --name mongo-test -p 27017:27017 mongo:7
```

y definir en `.env`: `MONGODB_URI_TEST=mongodb://localhost:27017/ShipNow-api-test`

### Variables de entorno

- `MONGODB_URI_TEST`: URI de la base de testing. Tiene que terminar en `ShipNow-api-test` (por ejemplo `mongodb://localhost:27017/ShipNow-api-test`); si no, los tests se cortan antes de borrar datos reales. Es la única variable obligatoria para correr `npm test`.
- `NODE_ENV`: no hace falta definirla, porque `npm test` la fuerza a `test` con `cross-env`.
- `PORT` y `MONGODB_URI`: no se usan en test. Solo se exigen para levantar el servidor con `npm start` o `npm run dev`.

## Producción y Docker 

### Paginación

Los listados `GET /api/users`, `/api/orders`, `/api/deliveries`, `/api/products` y `/api/stores` no devuelven la colección completa. Aceptan:

- `page`: número de página. Si es inválido, se usa `1`.
- `limit`: resultados por página. Si es inválido, se usa `10`. Si es mayor a `50`, se recorta a `50`.

Ejemplo: `GET /api/orders?page=2&limit=20`

### Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | Sí (fuera de test) | Puerto de la API. En Docker se usa `8080`. |
| `MONGODB_URI` | Sí (fuera de test) | URI de la base de datos. |
| `NODE_ENV` | Sí (fuera de test) | `development`, `test` o `production`. |
| `MONGODB_URI_TEST` | Solo en test | URI de la base de testing. |
| `LOG_LEVEL` | No | Nivel mínimo de logs. Por defecto: `info` en producción y `debug` en el resto. |
| `BASE_URL` | No | URL base que usa Swagger. Por defecto: `http://localhost:<PORT>`. |

La API valida las variables obligatorias al iniciar: si falta alguna, no arranca y muestra un error indicando cuál. No se usa JWT ni servicios externos, por eso no hay variables para eso. `.env.example` tiene los nombres de todas las variables, sin valores.

### Cómo correr la API y los tests

- Local: ver [Instalación y ejecución local](#instalación-y-ejecución-local) (`npm start`).
- Tests: `npm test` (ver sección Testing).
- Swagger: `http://localhost:<PORT>/api/docs`.

### Endpoints internos en producción

Con `NODE_ENV=production` quedan **restringidos** (responden con el error `ENDPOINT_NOT_AVAILABLE`):

- `/loggerTest`
- `/api/mocks/*` (incluido `POST /api/mocks/seed`)
- `/api/docs` (Swagger)

Criterio: son herramientas de desarrollo. Los mocks escriben datos falsos en la base, el logger de prueba genera errores artificiales y Swagger expone la estructura completa de la API. `GET /health` queda abierto y solo devuelve estado, entorno, uptime y timestamp.

### Docker

#### Requisitos
- Docker y Docker Compose instalados.

#### Construir y levantar
Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto construye la imagen de la API (Dockerfile multi-stage) y levanta dos servicios:
- **api**: la API de ShipNow, disponible en `http://localhost:8080`.
- **mongo**: una base MongoDB propia del compose, con healthcheck. La API espera a que esté "healthy" antes de iniciar.

No hace falta MongoDB Atlas ni tener Mongo instalada: las variables de entorno necesarias (`PORT`, `MONGODB_URI`, `NODE_ENV`) ya están definidas en el `docker-compose.yml`.

#### Segundo plano
```bash
docker compose up -d --build
```

#### Detener
```bash
docker compose down
```

### Archivos que no deben subirse al repositorio ni a la imagen

`node_modules`, `.env` (y `.env.*`), `.git`, `logs`, `uploads`, `coverage` y `tests`. Están en `.gitignore` y en `.dockerignore` (la imagen no incluye `.env`: las variables se pasan al ejecutar el contenedor).

### Logs y uploads

- Logs: se pierden al borrar el contenedor.
- Uploads: los archivos van a `uploads/` con límite de 5 MB y solo tipos permitidos. Persisten en el volumen `uploads-data`, así que sobreviven a reinicios y a `docker compose down`.
- Para borrar los datos de Mongo, los uploads y los logs: `docker compose down -v`.

Actualmente el proyecto tiene:

```txt
app.js
server.js
models
routes
mocks
controllers
services
repositories
config/db.js
middleware global de errores
config/logger.js (Winston)
Swagger
tests automatizados
carga de archivos con Multer
Docker
```



