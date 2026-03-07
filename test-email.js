const nodemailer = require('nodemailer');

// Load environment variables manually
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) env[key.trim()] = values.join('=').trim();
});

console.log('Testing email configuration...');
console.log('Host:', env.EMAIL_HOST);
console.log('Port:', env.EMAIL_PORT);
console.log('User:', env.EMAIL_USER);
console.log('Pass:', env.EMAIL_PASS);
console.log('Pass length:', env.EMAIL_PASS?.length);
console.log('---');

// Try different configurations
const configs = [
  { name: 'Port 465 SSL', port: 465, secure: true },
  { name: 'Port 587 TLS', port: 587, secure: false },
  { name: 'Port 587 TLS (requireTLS)', port: 587, secure: false, requireTLS: true },
];

async function testConfig(config) {
  console.log(`\nTesting: ${config.name}`);
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
    debug: true,
  });

  try {
    await transporter.verify();
    console.log(`✅ ${config.name} - Connection successful!`);
    
    const info = await transporter.sendMail({
      from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_USER}>`,
      to: env.EMAIL_USER,
      subject: '✅ Test Email - EsellerStore',
      html: '<h1>Success!</h1><p>Email working with ' + config.name + '</p>'
    });
    
    console.log(`✅ Email sent with ${config.name}:`, info.messageId);
    return true;
  } catch (error) {
    console.log(`❌ ${config.name} failed:`, error.message);
    return false;
  }
}

async function testAll() {
  for (const config of configs) {
    const success = await testConfig(config);
    if (success) {
      console.log('\n🎉 Found working configuration!');
      break;
    }
  }
}

testAll();
