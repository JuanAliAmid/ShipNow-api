import mocksService from "../service/mocks.service.js";
import { successResponse } from "../utils/apiResponse.js";


const users = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const users = await mocksService.users(qty);
        successResponse(res, { statusCode: 201, message: 'Usuarios generados', payload: users })
    } catch (error) {
        next(error);
    }
};

const orders = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const orders = await mocksService.orders(qty);
        successResponse(res, { statusCode: 201, message: 'Órdenes generadas', payload: orders })
    } catch (error) {
        next(error);
    };
};

const drivers = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const drivers = await mocksService.drivers(qty);
        successResponse(res, { statusCode: 201, message: 'Drivers generados', payload: drivers })
    } catch (error) {
        next(error);
    };
};

const deliveries = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const deliveries = await mocksService.deliveries(qty);
        successResponse(res, { statusCode: 201, message: 'Deliverys generados', payload: deliveries })
    } catch (error) {
        next(error);
    };
};

const saveMocks = async (req, res, next) => {
    const { qty, type } = req.query;
    try {
        const save = await mocksService.saveMocks(type, qty)
        successResponse(res, { statusCode: 201, message: 'Datos guardados', payload: { insertados: save.length, coleccion: type } })
    } catch (error) {
        next(error);
    };
};

export default {
    users,
    orders,
    drivers,
    deliveries,
    saveMocks
}