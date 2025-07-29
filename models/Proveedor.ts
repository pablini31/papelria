import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

export interface ProveedorAttributes {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export class Proveedor extends Model<ProveedorAttributes> implements ProveedorAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public telefono!: string;
  public direccion!: string;
}

Proveedor.init(
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
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'proveedores',
    timestamps: false // Desactivar timestamps ya que la tabla no tiene created_at y updated_at
  }
);

export default Proveedor; 