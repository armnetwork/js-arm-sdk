import axios from 'axios';
import Promise from 'bluebird';
import toml from 'toml';
import {Config} from "./config";

// STELLAR_TOML_MAX_SIZE is the maximum size of stellar.toml file
export const STELLAR_TOML_MAX_SIZE = 100 * 1024;

/**
 * StellarTomlResolver allows resolving `stellar.toml` files.
 */
export class StellarTomlResolver {
  /**
   * Returns a parsed `stellar.toml` file for a given domain.
   * Returns a `Promise` that resolves to the parsed stellar.toml object. If `stellar.toml` file does not exist for a given domain or is invalid Promise will reject.
   * ```js
   * ArmSdk.StellarTomlResolver.resolve('acme.com')
   *   .then(stellarToml => {
   *     // stellarToml in an object representing domain stellar.toml file.
   *   })
   *   .catch(error => {
   *     // stellar.toml does not exist or is invalid
   *   });
   * ```
   * @see <a href="https://www.stellar.org/developers/learn/concepts/stellar-toml.html" target="_blank">Stellar.toml doc</a>
   * @param {string} domain Domain to get stellar.toml file for
   * @param {object} [opts]
   * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
   * @returns {Promise}
   */
  static resolve(domain, opts = {}) {
    let allowHttp = Config.isAllowHttp();
    if (typeof opts.allowHttp !== 'undefined') {
        allowHttp = opts.allowHttp;
    }

    let protocol = 'https';
    if (allowHttp) {
        protocol = 'http';
    }
    return axios.get(`${protocol}://${domain}/.well-known/stellar.toml`, {maxContentLength: STELLAR_TOML_MAX_SIZE})
      .then(response => {
      	try {
            let tomlObject = toml.parse(response.data);
            return Promise.resolve(tomlObject);
        } catch (e) {
            return Promise.reject(new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`));
        }
      })
      .catch(err => {
        if (err.message.match(/^maxContentLength size/)) {
          throw new Error(`stellar.toml file exceeds allowed size of ${STELLAR_TOML_MAX_SIZE}`);
        } else {
          throw err;
        }
      });
  }
}
