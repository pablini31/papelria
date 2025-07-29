import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

export interface UserAttributes {
  id?: number;
  nombre: string;
  username: string;
  password: string;
  rol: 'admin' | 'cajero' | 'inventario';
  creado_en?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public nombre!: string;
  public username!: string;
  public password!: string;
  public rol!: 'admin' | 'cajero' | 'inventario';
  public readonly creado_en!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'cajero', 'inventario'),
      allowNull: false,
      defaultValue: 'cajero',
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
    underscored: false,
  }
);

export default User;