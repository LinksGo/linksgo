const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runMigrations() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log('Running migrations...');

  for (const file of migrationFiles) {
    try {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      const { error } = await supabase.rpc('run_migration', {
        sql_content: sql
      });

      if (error) {
        console.error(`Error running migration ${file}:`, error);
        throw error;
      }

      console.log(`Successfully ran migration: ${file}`);
    } catch (error) {
      console.error(`Failed to run migration ${file}:`, error);
      process.exit(1);
    }
  }

  console.log('All migrations completed successfully!');
}

runMigrations().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
