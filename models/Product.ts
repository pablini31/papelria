import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

export interface ProductAttributes {
  id?: number;
  nombre: string;
  codigo_barras?: string;
  categoria: string;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  proveedor_id?: number;
  descripcion?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public nombre!: string;
  public codigo_barras!: string;
  public categoria!: string;
  public precio_compra!: number;
  public precio_venta!: number;
  public stock_actual!: number;
  public stock_minimo!: number;
  public proveedor_id!: number;
  public descripcion!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    codigo_barras: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      defaultValue: null,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    precio_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedores',
        key: 'id'
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'productos',
    timestamps: true,
    underscored: true,
  }
);

export default Product; 