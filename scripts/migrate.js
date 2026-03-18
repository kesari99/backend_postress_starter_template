const { execSync } = require('child_process');

console.log('🚀 Running migrations...\n');

try {
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
  console.log('\n✅ Migrations completed successfully!');
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}

