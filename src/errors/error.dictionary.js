import ERROR_CODES from "./error.codes.js";

const errorsDictionary = {
    [ERROR_CODES.VALIDATION_ERROR]: {
        statusCode: 400,
        message: 'Los datos enviados son inválidos'
    },
    [ERROR_CODES.USER_NOT_FOUND]: {
        statusCode: 404,
        message: 'Usuario no encontrado'
    },
    [ERROR_CODES.ORDER_NOT_FOUND]: {
        statusCode: 404,
        message: 'Orden no encontrada'
    },
    [ERROR_CODES.DELIVERY_NOT_FOUND]: {
        statusCode: 404,
        message: 'Delivery no encontrado'
    },
    [ERROR_CODES.INVALID_ORDER_STATUS]: {
        statusCode: 400,
        message: 'El estado ingresado no es válido para un pedido'
    },
    [ERROR_CODES.INVALID_DATA]: {
        statusCode: 400,
        message: 'El formato de los datos ingresados es incorrecto'
    },
    [ERROR_CODES.INVALID_DELIVERY_STATUS]: {
        statusCode: 400,
        message: 'El estado ingresado no es válido para una entrega'
    },
    [ERROR_CODES.DRIVER_NOT_AVAILABLE]: {
        statusCode: 409,
        message: 'El repartidor no está disponible para la entrega'
    },
    [ERROR_CODES.DUPLICATE_EMAIL_ADDRESS]: {
        statusCode: 409,
        message: 'El email ingresado ya se encuentra registrado'
    },
    [ERROR_CODES.INVALID_MOCK_AMOUNT]: {
        statusCode: 400,
        message: 'La cantidad de registros a generar debe ser un número positivo'
    },
    [ERROR_CODES.ROUTE_NOT_FOUND]: {
        statusCode: 404,
        message: 'Ruta no encontrada'
    },
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
        statusCode: 500,
        message: 'Error interno del servidor'
    },
    [ERROR_CODES.REQUIRED_FIELDS]: {
        statusCode: 400,
        message: 'Faltan datos obligatorios'
    },
    [ERROR_CODES.STORE_NOT_FOUND]: {
        statusCode: 404,
        message: 'Tienda no encontrada'
    },
    [ERROR_CODES.PRODUCT_NOT_FOUND]: {
        statusCode: 404,
        message: 'Producto no encontrado'
    },
    [ERROR_CODES.PRODUCT_NOT_AVAILABLE]: {
        statusCode: 409,
        message: 'Producto no disponible'
    },
    [ERROR_CODES.NO_SAVED_PRODUCTS]: {
        statusCode: 400,
        message: 'No hay productos cargados para generar órdenes'
    },
    [ERROR_CODES.DRIVERS_NOT_FOUND]: {
        statusCode: 404,
        message: 'Drivers no encontrados'
    },
    [ERROR_CODES.TYPE_NOT_FOUND]: {
        statusCode: 404 ,
        message: 'Tipo no encontrado'
    }
};

export default errorsDictionary;