// test.js - Debug registration

import dotenv from 'dotenv';
import pool from './db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const SALT_ROUNDS = 12;

async function testRegister() {
  try {
    console.log('\n=== TESTING REGISTRATION ===\n');
    
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'password123';
    
    console.log('1. Input values:');
    console.log('   username:', username);
    console.log('   email:', email);
    console.log('   password:', password);
    
    console.log('\n2. Hashing password...');
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('   hash:', hash.substring(0, 20) + '...');
    
    console.log('\n3. Attempting insert into database...');
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    console.log('   Insert successful!');
    console.log('   Result:', result);
    
    console.log('\n4. Verifying insert by selecting from database...');
    const [rows] = await pool.execute(
      'SELECT id, username, email FROM users WHERE username = ?',
      [username]
    );
    console.log('   Found user:', rows[0]);
    
    console.log('\n✅ Registration test PASSED\n');
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Registration test FAILED\n');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err);
    process.exit(1);
  }
}

testRegister();
