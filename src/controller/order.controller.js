import { orderService } from '../service/order.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getOrders = async (_req, res, next) => {
  try {
    const orders = await orderService.getOrders();
    successResponse(res, { message: 'Lista de ordenes', payload: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.oid);
    successResponse(res, { message: 'Orden encontrada por id', payload: order });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    successResponse(res, { statusCode: 201, message: 'Orden generada', payload: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.oid, req.body.status);
    successResponse(res, { message: 'Estado de orden actualizado', payload: order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await orderService.deleteOrder(req.params.oid);
    successResponse(res, { message: 'Orden eliminada', payload: order });
  } catch (error) {
    next(error);
  }
};