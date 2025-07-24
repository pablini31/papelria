import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

export interface SaleItemAttributes {
  id?: number;
  venta_id: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
  created_at?: Date;
  updated_at?: Date;
}

export class SaleItem extends Model<SaleItemAttributes> implements SaleItemAttributes {
  public id!: number;
  public venta_id!: number;
  public producto_id!: number;
  public nombre_producto!: string;
  public cantidad!: number;
  public precio_unitario!: number;
  public precio_total!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SaleItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    venta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_producto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    precio_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    tableName: 'items_venta',
    timestamps: true,
    underscored: true,
  }
);

export default SaleItem; 