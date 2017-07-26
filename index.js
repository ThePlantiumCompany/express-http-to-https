function searchIgnore (value, ignores) {
  return ignores.some(function (search) {
    return search.test(value);
  });
}

function redirectToHTTPS (ignoreHosts, ignoreRoutes) {
  ignoreHosts = ignoreHosts || [];
  ignoreRoutes = ignoreRoutes || [];
  return function middlewareRedirectToHTTPS (req, res, next) {
    var isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
      parseInt(req.get('x-forwarded-port'), 10) !== 443;

    if (isNotSecure && !searchIgnore(req.get('host'), ignoreHosts) &&
      !searchIgnore(req.path, ignoreRoutes)) {
      return res.redirect('https://' + req.get('host') + req.url);
    }

    next();
  }
}

module.exports = redirectToHTTPS;
