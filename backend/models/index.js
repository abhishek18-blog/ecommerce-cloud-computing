import sequelize from '../config/db.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

export { sequelize, Product, Order, OrderItem };
