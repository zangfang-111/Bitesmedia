import request from 'axios'
import cookie from 'react-cookies'
import { BASE_URL } from '../constants/urls'
import handleError from '../utils/handle-error'

class API {
  headers() {
    return {
      "X-XSRF-TOKEN": cookie.load(window.apos.csrfCookieName)
    }
  }

  makeRequest(options = {}) {
    options.headers = Object.assign(options.headers || {}, this.headers())

    let url = options.url || BASE_URL
    if (options.path) {
      url = url + options.path
    }
    delete options.url

    return request({
      method: options.method || 'get',
      url: url,
      ...options
    }).then(function (response) {
      return response
    }).catch((error) => {
      handleError(error)
      throw error
    })
  }
}

export default API
