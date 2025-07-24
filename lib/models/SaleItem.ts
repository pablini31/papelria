import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Sale from './Sale';
import Product from './Product';

export interface SaleItemAttributes {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaleItemCreationAttributes extends Omit<SaleItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SaleItem extends Model<SaleItemAttributes, SaleItemCreationAttributes> implements SaleItemAttributes {
  public id!: string;
  public saleId!: string;
  public productId!: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SaleItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    saleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sales',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'sale_items',
    modelName: 'SaleItem',
  }
);

// Relaciones
SaleItem.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' });
SaleItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Sale.hasMany(SaleItem, { foreignKey: 'saleId', as: 'items' });
Product.hasMany(SaleItem, { foreignKey: 'productId', as: 'saleItems' });

export default SaleItem; 