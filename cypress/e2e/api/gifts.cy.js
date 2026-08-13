describe('Presentes', () => {
  let token;
  const headers = () => ({ Authorization: `Bearer ${token}` });
  const createGift = () => cy.fixture('validGift').then((gift) => cy.request({ method: 'POST', url: '/api/gifts', headers: headers(), body: gift }));
  beforeEach(() => { cy.resetData(); cy.loginAsAdmin().then((value) => { token = value; }); });

  it('CT-API-030 - cria e consulta presente autenticado', () => createGift().then(({ body }) => cy.request({ url: `/api/gifts/${body.id}`, headers: headers() }).then((response) => { expect(response.status).to.equal(200); expect(response.body.name).to.equal('Kit Café da Manhã'); })));
  it('CT-API-031 - rejeita presente sem campo obrigatório', () => cy.request({ method: 'POST', url: '/api/gifts', headers: headers(), body: { name: 'Kit' }, failOnStatusCode: false }).its('status').should('equal', 400));
  it('CT-API-032 - rejeita preço zero e negativo', () => cy.fixture('validGift').then((gift) => { cy.request({ method: 'POST', url: '/api/gifts', headers: headers(), body: { ...gift, price: 0 }, failOnStatusCode: false }).its('status').should('equal', 400); cy.request({ method: 'POST', url: '/api/gifts', headers: headers(), body: { ...gift, price: -1 }, failOnStatusCode: false }).its('status').should('equal', 400); }));
  it('CT-API-033 - atualiza parcialmente e exclui presente', () => createGift().then(({ body }) => { cy.request({ method: 'PATCH', url: `/api/gifts/${body.id}`, headers: headers(), body: { price: 200 } }).its('body.price').should('equal', 200); cy.request({ method: 'DELETE', url: `/api/gifts/${body.id}`, headers: headers() }).its('status').should('equal', 204); }));
  it('CT-API-055 - rejeita preço não numérico', () => cy.fixture('validGift').then((gift) => cy.request({ method: 'POST', url: '/api/gifts', headers: headers(), body: { ...gift, price: 'abc' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-056 - bloqueia usuário comum e permite admin criar presente', () => {
    const user = { name: 'Usuário', email: `gifts-user-${Date.now()}@test.local`, password: 'Senha123!' };
    cy.request('POST', '/api/auth/register', user);
    cy.loginAsUser(user).then((userToken) => cy.fixture('validGift').then((gift) => cy.request({ method: 'POST', url: '/api/gifts', headers: { Authorization: `Bearer ${userToken}` }, body: gift, failOnStatusCode: false }).its('status').should('equal', 403)));
    createGift().its('status').should('equal', 201);
  });
  it('CT-API-057 - substitui presente com PUT completo', () => createGift().then(({ body }) => cy.fixture('validGift').then((gift) => cy.request({ method: 'PUT', url: `/api/gifts/${body.id}`, headers: headers(), body: { ...gift, name: 'Novo kit', price: 200 } }).its('body.name').should('equal', 'Novo kit'))));
  it('CT-API-058 - retorna 404 para presente inexistente', () => cy.request({ url: '/api/gifts/999', headers: headers(), failOnStatusCode: false }).its('status').should('equal', 404));
});
