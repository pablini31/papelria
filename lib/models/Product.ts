import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface ProductAttributes {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  supplier?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public barcode!: string;
  public category!: string;
  public subcategory!: string;
  public purchasePrice!: number;
  public salePrice!: number;
  public stock!: number;
  public minStock!: number;
  public supplier!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
  }
);

export default Product; 