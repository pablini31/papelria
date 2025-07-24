import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface CustomerAttributes {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isFrequent: boolean;
  discount: number;
  totalPurchases: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastPurchase?: Date;
}

export interface CustomerCreationAttributes extends Omit<CustomerAttributes, 'id' | 'createdAt' | 'updatedAt' | 'totalPurchases'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public isFrequent!: boolean;
  public discount!: number;
  public totalPurchases!: number;
  public lastPurchase!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isFrequent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalPurchases: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastPurchase: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    modelName: 'Customer',
  }
);

export default Customer; 