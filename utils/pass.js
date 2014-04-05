
/**
 * Cryptography utilities.
 * Authors: GP.
 * Version: 1.0
 * Release Date: XX-XXX-2014
 */

/**
 * Module dependencies.
 */

var crypto = require('crypto'),
    cryptr = require('cryptr'),
    config = require('../config/config');

/**
 * Hashes a salt with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} salt to hash.
 * @param {String} optional salt.
 * @param {Function} callback.
 * @api public
 */

var hash = function (pwd, salt, fn) {
  // byte length.
  var len = 128;
  // iterations. can take ~300 ms for 12000 iterations.
  var iterations = 12000;
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, fn);
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash);
      });
    });
  }
};

/**
 * Encrypts a string using ridiculously simple encryption.
 * WARNING: DO NOT use this to encrypt passwords!
 *
 * @param {String} string to encrypt.
 * @param {Function} callback.
 * @api public
 */

var encrypt = function (input, fn) {
    try{
      var cryptr_object = new cryptr(config.MASTER_SALT);
      fn(null, cryptr_object.encrypt(input));
    } catch (err) {
      fn(err, null)
    }
};

/**
 * Decrypts a cipher using the same ridiculously simple encryption that was used to encrypt it.
 *
 * @param {String} string to decrypt.
 * @param {Function} callback.
 * @api public
 */

var decrypt = function (input, fn) {
  try{
    var cryptr_object = new cryptr(config.MASTER_SALT);
    fn(null, cryptr_object.decrypt(input));
  } catch (err) {
    fn(err, null);
  }
};

/**
 * Module exports.
 */

module.exports = {
  hash: hash,
  encrypt: encrypt,
  decrypt: decrypt
}