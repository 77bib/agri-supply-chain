require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NODE_ENV'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***SET***' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allGood = false;
  }
});

console.log('\n📋 Environment Summary:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
console.log(`   JWT: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);

if (allGood) {
  console.log('\n🎉 All environment variables are properly configured!');
} else {
  console.log('\n⚠️  Some environment variables are missing!');
  console.log('\n📝 Create a .env.local file with:');
  console.log(`
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=bifa-agri-supply-chain-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN=7d
NODE_ENV=development
  `);
} 