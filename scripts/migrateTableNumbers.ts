import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function migrateTableNumbers() {
  const mongoUrl = process.env.DATABASE_URL;

  if (!mongoUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  console.log('Starting migration of tableNumber from Int to String...');

  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('dineinorders');

    // Find documents with numeric tableNumber
    const countBefore = await collection.countDocuments({
      tableNumber: { $type: 'number' }
    });

    console.log(`Found ${countBefore} orders with numeric tableNumber`);

    if (countBefore === 0) {
      console.log('✅ No migration needed - all tableNumbers are already strings');
      return;
    }

    // Update all numeric tableNumbers to strings using aggregation pipeline
    const result = await collection.updateMany(
      { tableNumber: { $type: 'number' } },
      [
        {
          $set: {
            tableNumber: { $toString: '$tableNumber' }
          }
        }
      ]
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`   - Matched: ${result.matchedCount} documents`);
    console.log(`   - Modified: ${result.modifiedCount} documents`);

    // Verify the migration
    const countAfter = await collection.countDocuments({
      tableNumber: { $type: 'number' }
    });

    console.log(`   - Remaining numeric tableNumbers: ${countAfter}`);

    if (countAfter === 0) {
      console.log('✅ All tableNumbers successfully converted to strings!');
    } else {
      console.warn('⚠️  Some tableNumbers are still numeric. Please check manually.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateTableNumbers()
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
