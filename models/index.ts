import sequelize from '../lib/database';
import Product from './Product';
import Customer from './Customer';
import Sale from './Sale';
import SaleItem from './SaleItem';

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

// Exportar modelos
export {
  sequelize,
  Product,
  Customer,
  Sale,
  SaleItem
};

export default {
  sequelize,
  Product,
  Customer,
  Sale,
  SaleItem
}; 