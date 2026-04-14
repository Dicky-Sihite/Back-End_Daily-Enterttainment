// HTTP STATUS CODES
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// ERROR MESSAGES
const ERROR_MESSAGES = {
  // Validation
  DATA_NOT_COMPLETE: 'Data tidak lengkap',
  INVALID_EMAIL: 'Email tidak valid',
  PASSWORD_MIN_LENGTH: 'Password minimal 6 karakter',
  
  // Auth
  USER_NOT_FOUND: 'User tidak ditemukan',
  INVALID_PASSWORD: 'Password salah',
  EMAIL_USERNAME_EXISTS: 'Email atau username sudah digunakan',
  TOKEN_NOT_PROVIDED: 'Token tidak disediakan',
  INVALID_TOKEN: 'Token tidak valid',
  TOKEN_EXPIRED: 'Token sudah kadaluarsa',
  ACCESS_DENIED: 'Akses ditolak',
  
  // Server
  SERVER_ERROR: 'Terjadi kesalahan di server',
  TOKEN_REUSE_DETECTED: 'Penggunaan ulang token terdeteksi. Semua sesi telah di-logout.',
};

// SUCCESS MESSAGES
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User berhasil dibuat',
  LOGIN_SUCCESS: 'Login berhasil',
  LOGOUT_SUCCESS: 'Logout berhasil',
  TOKEN_REFRESHED: 'Token berhasil diperbarui',
  WELCOME_ADMIN: 'Selamat datang Admin',
  WELCOME_USER: 'Selamat datang User',
};

// RESPONSE HELPERS
const createSuccessResponse = (data = null, message = '') => ({
  success: true,
  message,
  data,
});

const createErrorResponse = (message = ERROR_MESSAGES.SERVER_ERROR) => ({
  success: false,
  message,
  data: null,
});

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  createSuccessResponse,
  createErrorResponse,
};
