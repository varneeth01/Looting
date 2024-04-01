const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const sendEmail = require('./Helpers/sendEmail');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ fullName, email, password: hashedPassword, phoneNumber });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate a reset password token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set the reset password token and expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send the reset password email
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Reset Password',
      message: `Please click the following link to reset your password: ${resetUrl}`
    });

    res.status(200).json({ message: 'Reset password link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset password link', error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    // Find the user by the reset password token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset password token' });
    }

    // Update the user's password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ googleId });
    if (!user) {
      // Create a new user
      user = new User({ googleId, email, fullName: name });
      await user.save();
    }

    res.status(200).json({ message: 'Google login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error with Google login', error });
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    const { facebookId, email, name } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ facebookId });
    if (!user) {
      // Create a new user
      user = new User({ facebookId, email, fullName: name });
      await user.save();
    }

    res.status(200).json({ message: 'Facebook login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error with Facebook login', error });
  }
};
