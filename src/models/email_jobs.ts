import { Model, DataTypes, Sequelize } from 'sequelize';
import { EmailJobsAttributes, EmailJobsCreationAttributes } from '../types';

class EmailJobs extends Model<EmailJobsAttributes, EmailJobsCreationAttributes> implements EmailJobsAttributes {
  public id!: number;
  public queue_name!: string | null;
  public job_id!: string | null;
  public to_address!: string;
  public subject!: string;
  public body!: string;
  public status!: string;
  public attempts!: number;
  public max_attempts!: number;
  public result!: string | null;
  public error!: string | null;

  static associate(models: any) {
    // define association here
  }
}

export default (sequelize: Sequelize) => {
  EmailJobs.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    queue_name: {
      type: DataTypes.STRING
    },
    job_id:{
      type: DataTypes.STRING,
    },
    to_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending',
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'EmailJobs',
    tableName: 'EmailJobs',
    timestamps: false,
  });
  return EmailJobs;
};

