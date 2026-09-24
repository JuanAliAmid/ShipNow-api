## Funcionamiento base de la API

ShipNow API es una aplicación backend construida con Node.js, Express y MongoDB.

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
   Variables requeridas: `PORT`, `MONGODB_URI`, `NODE_ENV`.
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

Permite verificar que la API está funcionando.

```http
GET /health
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "API funcionando correctamente"
}
```

---

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

---

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
  "payload": {}
}
```

Las respuestas de error se manejan de forma centralizada mediante un middleware (`errorHandler`) registrado al final de `app.js`. Los controllers no responden el error directamente: lo delegan con `next(error)`.

```json
{
  "status": "error",
  "message": "Usuario no encontrado"
}
```

El middleware determina el `statusCode` según el tipo de error: usa `error.statusCode` si el error lo trae seteado (como los que lanzan los services), devuelve `400` si es un `CastError` de Mongoose (ej. un `id` con formato inválido), `409` si es un error de clave duplicada (`code: 11000`, ej. email repetido), y `500` como fallback para cualquier otro caso no contemplado.

## Estado actual del proyecto

Esta versión de ShipNow ya cuenta con las 4 entidades principales y un sistema de mocking funcional para poblar la base con datos de prueba, aunque todavía no representa una API completamente profesional.

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
```

Todavía no incorpora:

```txt
logger profesional
Swagger
tests automatizados
Multer
Docker
```

Durante el curso, la API será mejorada progresivamente para separar responsabilidades, mejorar la mantenibilidad y acercarse a una estructura más profesional.
