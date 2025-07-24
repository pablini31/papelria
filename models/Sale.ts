import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

export interface SaleAttributes {
  id?: number;
  numero_recibo: string;
  cliente_id?: number;
  nombre_cliente?: string;
  subtotal: number;
  impuesto: number;
  descuento: number;
  total: number;
  metodo_pago: string;
  estado: string;
  notas?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Sale extends Model<SaleAttributes> implements SaleAttributes {
  public id!: number;
  public numero_recibo!: string;
  public cliente_id!: number;
  public nombre_cliente!: string;
  public subtotal!: number;
  public impuesto!: number;
  public descuento!: number;
  public total!: number;
  public metodo_pago!: string;
  public estado!: string;
  public notas!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero_recibo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nombre_cliente: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    impuesto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'paypal'),
      allowNull: false,
      defaultValue: 'efectivo',
    },
    estado: {
      type: DataTypes.ENUM('completado', 'pendiente', 'cancelado'),
      allowNull: false,
      defaultValue: 'completado',
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ventas',
    timestamps: true,
    underscored: true,
  }
);

export default Sale; 