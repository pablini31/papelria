import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

export interface CustomerAttributes {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: Date;
  segmento: string;
  descuento: number;
  notas?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Customer extends Model<CustomerAttributes> implements CustomerAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public telefono!: string;
  public direccion!: string;
  public fecha_nacimiento!: Date;
  public segmento!: string;
  public descuento!: number;
  public notas!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Customer.init(
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    segmento: {
      type: DataTypes.ENUM('vip', 'frecuente', 'estudiante', 'empresa', 'ocasional'),
      allowNull: false,
      defaultValue: 'ocasional',
    },
    descuento: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'clientes',
    timestamps: true,
    underscored: true,
  }
);

export default Customer; 