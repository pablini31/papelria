import sequelize from '../lib/database';
import Product from './Product';
import Customer from './Customer';
import Sale from './Sale';
import SaleItem from './SaleItem';
import Proveedor from './Proveedor';
import User from './User';

// Definir relaciones entre modelos
Sale.hasMany(SaleItem, {
  foreignKey: 'saleId',
  as: 'items'
});

SaleItem.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale'
});

Sale.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer'
});

Customer.hasMany(Sale, {
  foreignKey: 'customerId',
  as: 'sales'
});

SaleItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

Product.hasMany(SaleItem, {
  foreignKey: 'productId',
  as: 'saleItems'
});

// Relación entre Producto y Proveedor
Product.belongsTo(Proveedor, {
  foreignKey: 'proveedor_id',
  as: 'proveedor'
});

Proveedor.hasMany(Product, {
  foreignKey: 'proveedor_id',
  as: 'productos'
});

// Exportar modelos
export {
  sequelize,
  Product,
  Customer,
  Sale,
  SaleItem,
  Proveedor,
  User
};

export default {
  sequelize,
  Product,
  Customer,
  Sale,
  SaleItem,
  Proveedor,
  User
}; 