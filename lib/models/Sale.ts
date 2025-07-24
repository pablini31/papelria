import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Customer from './Customer';

export interface SaleAttributes {
  id: string;
  customerId?: string;
  total: number;
  discount: number;
  finalTotal: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'transfer';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaleCreationAttributes extends Omit<SaleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Sale extends Model<SaleAttributes, SaleCreationAttributes> implements SaleAttributes {
  public id!: string;
  public customerId!: string;
  public total!: number;
  public discount!: number;
  public finalTotal!: number;
  public status!: 'pending' | 'completed' | 'cancelled';
  public paymentMethod!: 'cash' | 'card' | 'transfer';
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    finalTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'transfer'),
      allowNull: false,
      defaultValue: 'cash',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'sales',
    modelName: 'Sale',
  }
);

// Relación con Customer
Sale.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Sale, { foreignKey: 'customerId', as: 'sales' });

export default Sale; 