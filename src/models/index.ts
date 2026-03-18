import { Sequelize } from 'sequelize';
import process from 'process';
import configFile from '../config/config.json';
import EmailJobsModel from './email_jobs';
import UserModel from './user.model';

const env = process.env.NODE_ENV || 'development';
const config = (configFile as any)[env];

const db: any = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const emailJobsModel = EmailJobsModel(sequelize);
db[emailJobsModel.name] = emailJobsModel;

const userModelInstance = UserModel(sequelize);
db[userModelInstance.name] = userModelInstance;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

