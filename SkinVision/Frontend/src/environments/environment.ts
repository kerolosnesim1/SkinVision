/**
 * Base URL for the ASP.NET API (path must end with /api — same as Swagger base).
 *
 * Local dev: use HTTP on 5163 unless you have trusted the dev HTTPS cert.
 * Untrusted https://localhost:7163 often fails in the browser → status 0 / "Cannot reach the API".
 * To use HTTPS instead: run `dotnet dev-certs https --trust`, then set apiUrl to https://localhost:7163/api.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5163/api'
};
