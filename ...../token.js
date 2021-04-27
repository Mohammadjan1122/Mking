const qs = require('querystring');
const axios = require('axios-proxy-fix');
const uuid = require('uuid/v4');
const utils = require('./utils');

async function getToken(email, password) {
  const sim = utils.randBetween(2e4, 4e4);
  let deviceID = uuid();
  let adID = uuid();
  let formData = {
    adid: adID,
    format: 'json',
    device_id: deviceID,
    email: email,
    password: password,
    cpl: 'true',
    family_device_id: deviceID,
    credentials_type: 'device_based_login_password',
    generate_session_cookies: '1',
    error_detail_type: 'button_with_disabled',
    source: 'device_based_login',
    machine_id: utils.randString(24),
    meta_inf_fbmeta: '',
    advertiser_id: adID,
    currently_logged_in_userid: '0',
    locale: 'en_US',
    client_country_code: 'US',
    method: 'auth.login',
    fb_api_req_friendly_name: 'headersConfigurationParamsV2',
    fb_api_caller_class: 'com.facebook.fos.headersv2.fb4aorca.HeadersV2ConfigFetchRequestHandler',
    api_key: '3e7c78e35a76a9299309885393b02d97'
  };
  formData.sig = getSig(utils.sortObj(formData));
  let conf = {
    url: 'https://b-api.facebook.com/method/auth.login',
    method: 'post',
    data: formData,
    transformRequest: [
      function(data, headers) {
        return qs.stringify(data);
      }
    ],
    headers: {
      'x-fb-connection-bandwidth': utils.randBetween(2e7, 3e7),
      'x-fb-sim-hni': sim,
      'x-fb-net-hni': sim,
      'x-fb-connection-quality': 'EXCELLENT',
      'x-fb-connection-type': 'unknown',
      'user-agent':
        'Dalvik/2.1.0 (Linux; U; Android 5.1.1; SM-N950N Build/NMF26X) [FBAN/FB4A;FBAV/251.0.0.31.111;FBPN/com.facebook.katana;FBLC/en_US;FBBV/188828013;FBCR/Advance Info Service;FBMF/samsung;FBDV/SM-N950N;FBSV/5.1.1;FBCA/x86;armeabi-v7a;FBDM{density=2.0,width=900,height=1600};FB_FW;FBRV/0;]',
      'content-type': 'application/x-www-form-urlencoded',
      'x-fb-http-engine': 'Liger'
    }
  };
  const resp = await axios(conf);
  return resp.data;
}

function getSig(formData) {
  let sig = '';
  Object.keys(formData).forEach(function(key) {
    sig += `${key}=${formData[key]}`;
  });
  sig = utils.md5(sig + 'c1e620fa708a1d5696fb991c1bde5662');
  return sig;
}

module.exports = getToken;
