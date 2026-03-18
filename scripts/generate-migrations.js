const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const configFile = require('../src/config/config.json');

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

// Initialize Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

async function generateMigrations() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Get existing tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('SequelizeMeta')
    `);
    
    const existingTables = tables.map(t => t.table_name);
    console.log(`📋 Existing tables: ${existingTables.join(', ') || 'none'}`);
    
    // Check user model for new columns
    const userModelPath = path.join(process.cwd(), 'src/models/user.model.ts');
    if (fs.existsSync(userModelPath)) {
      const userModelContent = fs.readFileSync(userModelPath, 'utf8');
      
      // Extract all column definitions from the model
      const columnRegex = /(\w+):\s*\{[^}]*type:\s*DataTypes\.(\w+)[^}]*\}/g;
      const modelColumns = [];
      let match;
      
      while ((match = columnRegex.exec(userModelContent)) !== null) {
        const columnName = match[1];
        const dataType = match[2];
        // Skip id column
        if (columnName === 'id') continue;
        
        // Extract allowNull
        const allowNullMatch = userModelContent.substring(match.index).match(/allowNull:\s*(true|false)/);
        const allowNull = allowNullMatch ? allowNullMatch[1] === 'true' : true;
        
        modelColumns.push({ name: columnName, type: dataType, allowNull });
      }
      
      // Check if user table exists
      if (existingTables.includes('user')) {
        const [columns] = await sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'user' 
          AND table_schema = 'public'
        `);
        const dbColumnNames = columns.map(c => c.column_name);
        
        // Find columns in model that don't exist in DB
        const newColumns = modelColumns.filter(col => !dbColumnNames.includes(col.name));
        
        if (newColumns.length > 0) {
          console.log(`\n➕ New columns detected in user table: ${newColumns.map(c => c.name).join(', ')}`);
          
          // Generate migration for each new column or batch them
          const migrationName = newColumns.length === 1 
            ? `add-${newColumns[0].name}-to-user`
            : `add-${newColumns.map(c => c.name).join('-and-')}-to-user`;
          
          try {
            execSync(`npx sequelize-cli migration:generate --name ${migrationName}`, { 
              stdio: 'pipe' 
            });
            
            // Find and update the migration file
            const migrationsDir = path.join(process.cwd(), 'src/migrations');
            const files = fs.readdirSync(migrationsDir);
            const newMigration = files
              .filter(f => f.includes(migrationName.split('-').slice(0, 3).join('-')))
              .sort()
              .pop();
            
            if (newMigration) {
              const migrationPath = path.join(migrationsDir, newMigration);
              
              // Map DataTypes to Sequelize types
              const typeMap = {
                'STRING': 'Sequelize.STRING',
                'INTEGER': 'Sequelize.INTEGER',
                'TEXT': 'Sequelize.TEXT',
                'BOOLEAN': 'Sequelize.BOOLEAN',
                'DATE': 'Sequelize.DATE',
                'DECIMAL': 'Sequelize.DECIMAL',
                'FLOAT': 'Sequelize.FLOAT',
                'BIGINT': 'Sequelize.BIGINT'
              };
              
              // Generate migration content
              const addColumns = newColumns.map(col => {
                const sequelizeType = typeMap[col.type] || 'Sequelize.STRING';
                return `    await queryInterface.addColumn('user', '${col.name}', {
      type: ${sequelizeType},
      allowNull: ${col.allowNull}
    });`;
              }).join('\n');
              
              const removeColumns = newColumns.map(col => 
                `    await queryInterface.removeColumn('user', '${col.name}');`
              ).join('\n');
              
              const content = `'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
${addColumns}
  },

  async down (queryInterface, Sequelize) {
${removeColumns}
  }
};`;
              
              fs.writeFileSync(migrationPath, content);
              console.log(`✅ Migration created: ${newMigration}`);
            }
          } catch (error) {
            console.log('Migration file may already exist or error occurred');
          }
        } else {
          console.log('✓ User table is up to date');
        }
      } else {
        console.log('⚠️  User table does not exist. Run initial migration first.');
      }
    }
    
    console.log('\n✅ Migration generation complete!');
    console.log('📝 Run: npm run migrate:push');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

generateMigrations();

