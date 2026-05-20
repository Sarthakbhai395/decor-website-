/**
 * Environment variable validator — runs once at startup.
 * Gives clear, actionable errors instead of cryptic runtime crashes.
 */

export const validateEnv = (): void => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ── Required vars ──────────────────────────────────────────────────────────
  const required: Record<string, string> = {
    MONGODB_URI:           'Your MongoDB Atlas connection string',
    JWT_SECRET:            'JWT signing secret (min 32 chars)',
    JWT_REFRESH_SECRET:    'JWT refresh signing secret (different from JWT_SECRET)',
    CLOUDINARY_CLOUD_NAME: 'Cloudinary cloud name',
    CLOUDINARY_API_KEY:    'Cloudinary API key',
    CLOUDINARY_API_SECRET: 'Cloudinary API secret',
    COOKIE_SECRET:         'Cookie signing secret',
  };

  for (const [key, desc] of Object.entries(required)) {
    const val = process.env[key];
    if (!val || val.trim() === '') {
      errors.push(`  ✗ ${key} is missing — ${desc}`);
    }
  }

  // ── MongoDB URI placeholder check ──────────────────────────────────────────
  const mongoUri = process.env.MONGODB_URI ?? '';
  if (mongoUri.includes('<db_password>')) {
    errors.push(
      '\n  ✗ MONGODB_URI has a placeholder password.\n' +
      '    ─────────────────────────────────────────────────────────\n' +
      '    HOW TO FIX:\n' +
      '    1. Go to: https://cloud.mongodb.com\n' +
      '    2. Click "Database Access" → find user "sb1258954_db_user"\n' +
      '    3. Click Edit → copy or reset the password\n' +
      '    4. Open: e:\\HouseOfJashn\\luxe-celebrations\\backend\\.env\n' +
      '    5. Replace <db_password> with your actual password\n' +
      '       Example: ...sb1258954_db_user:MyPass123@cluster0...\n' +
      '    6. If password has @ # % + chars, encode it first:\n' +
      '       node -e "console.log(encodeURIComponent(\'yourPass\'))"\n' +
      '    ─────────────────────────────────────────────────────────'
    );
  }

  // ── JWT expiry format check ────────────────────────────────────────────────
  const jwtExpiry = process.env.JWT_EXPIRES_IN ?? '';
  if (jwtExpiry && /\d+[A-Z]/.test(jwtExpiry)) {
    errors.push(
      `  ✗ JWT_EXPIRES_IN="${jwtExpiry}" — use lowercase: "15m", "1h", "30d"`
    );
  }

  // ── Optional warnings ──────────────────────────────────────────────────────
  const smtpUser = process.env.SMTP_USER ?? '';
  const smtpPass = process.env.SMTP_PASS ?? '';
  if (!smtpUser || smtpUser.includes('your_email')) {
    warnings.push('  ⚠ SMTP_USER not set — email features will not work');
  }
  if (!smtpPass || smtpPass.includes('your_')) {
    warnings.push('  ⚠ SMTP_PASS not set — email features will not work');
  }

  // ── Output ─────────────────────────────────────────────────────────────────
  if (warnings.length > 0) {
    console.warn('\n⚠️  Warnings:\n' + warnings.join('\n') + '\n');
  }

  if (errors.length > 0) {
    console.error('\n❌ Cannot start — fix these .env issues:\n' + errors.join('\n'));
    console.error('\n→ File: e:\\HouseOfJashn\\luxe-celebrations\\backend\\.env\n');
    process.exit(1);
  }
};
