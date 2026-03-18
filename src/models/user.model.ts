import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types";

class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public organization_id!: string;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
      },
      password:{
        type:DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      organization_id:{
        type:DataTypes.STRING
      }
    },
    {
      sequelize,
      tableName: "user",
      modelName: "User",
      timestamps: false,
    }
  );
  return UserModel;
};
