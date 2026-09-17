import { orderService } from '../service/order.service.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();

    res.json({ status: 'success', payload: orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.oid);

    res.json({ status: 'success', payload: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);

    res.json({ status: 'success', payload: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.oid, req.body.status);

    res.json({ status: 'success', payload: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(req.params.oid);

    res.json({ status: 'success', payload: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};