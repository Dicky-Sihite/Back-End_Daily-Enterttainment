const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} = require('../services/authService');
const {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  createSuccessResponse,
  createErrorResponse,
} = require('../utils/constants');

// REGISTER CONTROLLER
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser(username, email, password);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(user, SUCCESS_MESSAGES.USER_CREATED)
    );
  } catch (error) {
    console.error('Register error:', error);

    if (error.status && error.message) {
      return res.status(error.status).json(createErrorResponse(error.message));
    }

    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(ERROR_MESSAGES.SERVER_ERROR)
    );
  }
}

// LOGIN CONTROLLER
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        SUCCESS_MESSAGES.LOGIN_SUCCESS
      )
    );
  } catch (error) {
    console.error('Login error:', error);

    if (error.status && error.message) {
      return res.status(error.status).json(createErrorResponse(error.message));
    }

    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(ERROR_MESSAGES.SERVER_ERROR)
    );
  }
}

// REFRESH TOKEN CONTROLLER
async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;

    const result = await refreshAccessToken(token);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(
        { accessToken: result.accessToken },
        SUCCESS_MESSAGES.TOKEN_REFRESHED
      )
    );
  } catch (error) {
    console.error('Refresh token error:', error);

    if (error.status && error.message) {
      return res.status(error.status).json(createErrorResponse(error.message));
    }

    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(ERROR_MESSAGES.SERVER_ERROR)
    );
  }
}

// LOGOUT CONTROLLER
async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;

    await logoutUser(token);

    res.clearCookie('refreshToken');

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.LOGOUT_SUCCESS)
    );
  } catch (error) {
    console.error('Logout error:', error);

    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(ERROR_MESSAGES.SERVER_ERROR)
    );
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};