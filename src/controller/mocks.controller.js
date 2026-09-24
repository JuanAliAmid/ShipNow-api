import mocksService from "../service/mocks.service.js";


const users = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const users = await mocksService.users(qty);
        res.json({ status: 'success', payload: users });
    } catch (error) {
        next(error);
    }
};

const orders = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const orders = await mocksService.orders(qty);
        res.json({ status: 'success', payload: orders });
    } catch (error) {
        next(error);
    };
};

const drivers = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const drivers = await mocksService.drivers(qty);
        res.json({ status: 'success', payload: drivers });
    } catch (error) {
        next(error);
    };
};

const deliveries = async (req, res, next) => {
    const { qty } = req.query;
    try {
        const deliveries = await mocksService.deliveries(qty);
        res.json({ status: 'success', payload: deliveries });
    } catch (error) {
        next(error);
    };
};

const saveMocks = async (req, res, next) => {
    const { qty, type } = req.query;
    try {
        const save = await mocksService.saveMocks(type, qty)
        res.json({ status: 'success', payload: { insertados: save.length, coleccion: type } });
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