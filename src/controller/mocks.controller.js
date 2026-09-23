import mocksService from "../service/mocks.service";

const users = async (req, res) => {
    const { qty } = req.query;
    try {
        const users = await mocksService.users(qty);
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
};

const orders = async (req, res) => {
    const { qty } = req.query;
    try {
        const orders = await mocksService.orders(qty);
        res.json({ status: 'success', payload: orders });
    } catch (error) {
        res.status(error.statusCode).json({ status: 'error', message: error.message });
    };
};

const drivers = async (req, res) => {
    const { qty } = req.query;
    try {
        const drivers = await mocksService.drivers(qty);
        res.json({ status: 'success', payload: drivers });
    } catch (error) {
        res.status(error.statusCode).json({ status: 'error', message: error.message });
    };
};

const deliveries = async (req, res) => {
    const { qty } = req.query;
    try {
        const deliveries = await mocksService.deliveries(qty);
        res.json({ status: 'success', payload: deliveries });
    } catch (error) {
        res.status(error.statusCode).json({ status: 'error', message: error.message });
    };
};

const saveMocks = async (req, res) => {
    const { qty, type } = req.query;
    try {
        const save = await mocksService.saveMocks(type, qty)
        res.json({ status: 'success', payload: { insertados: save.length, coleccion: type } });
    } catch (error) {
        res.status(error.statusCode).json({ status: 'error', message: error.message });
    };
};

export default {
    users,
    orders,
    drivers,
    deliveries,
    saveMocks
}