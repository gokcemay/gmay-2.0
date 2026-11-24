/** Match only the agenda host's document root; leave all other routes alone. */
export function isAgendaHome(request: Request): boolean {
  const url = new URL(request.url);
  return url.hostname === 'ajanda.gmay.me' && url.pathname === '/' &&
    (request.method === 'GET' || request.method === 'HEAD');
}