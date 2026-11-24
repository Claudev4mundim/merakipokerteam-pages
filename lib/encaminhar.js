/* Encaminha um caminho do domínio principal para outro projeto da Cloudflare Pages.
 *
 * encaminhar('/quiz', 'https://meraki-poker-quiz.pages.dev') faz:
 *   /quiz                 → 308 para /quiz/ (mantém ?utm_... e os outros parâmetros)
 *   /quiz/<resto>?<query> → busca https://meraki-poker-quiz.pages.dev/<resto>?<query> e devolve a resposta
 *                            como veio (status, cabeçalhos e corpo), com o mesmo método e corpo (POST do formulário)
 * Um redirecionamento do projeto de origem para ele mesmo volta com o prefixo (Location /privacidade/ vira
 * /quiz/privacidade/). As páginas usam endereços relativos, então funcionam nos dois lugares.
 */
export function encaminhar(prefixo, origem) {
  const base = new URL(origem);
  return async ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname === prefixo) {
      return new Response(null, { status: 308, headers: { Location: prefixo + '/' + url.search } });
    }
    const destino = new URL(url.pathname.slice(prefixo.length) + url.search, base);
    const cabecalhos = new Headers(request.headers);
    cabecalhos.delete('host');
    const resposta = await fetch(destino, {
      method: request.method,
      headers: cabecalhos,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual'
    });
    const saida = new Response(resposta.body, resposta);
    const local = resposta.headers.get('Location');
    if (local) {
      const alvo = new URL(local, destino);
      if (alvo.origin === base.origin) saida.headers.set('Location', prefixo + alvo.pathname + alvo.search + alvo.hash);
    }
    return saida;
  };
}
