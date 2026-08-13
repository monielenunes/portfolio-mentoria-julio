describe('Autenticação', () => {
  beforeEach(() => cy.resetData());

  it('CT-API-005 - cadastra usuário sem expor senha e ignora role admin', () => {
    cy.fixture('validUser').then((user) => {
      cy.request('POST', '/api/auth/register', { ...user, email: `maria-${Date.now()}@example.test`, role: 'admin' })
        .then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body).to.include({ name: user.name, role: 'user' });
          expect(response.body).not.to.have.property('password');
          expect(response.body.favorites).to.deep.equal([]);
        });
    });
  });

  it('CT-API-006 - rejeita cadastro com campo obrigatório ausente', () => {
    cy.request({ method: 'POST', url: '/api/auth/register', body: { name: 'Maria', email: 'maria@test.local' }, failOnStatusCode: false }).its('status').should('equal', 400);
  });

  it('CT-API-007 - rejeita cadastro com email inválido', () => {
    cy.request({ method: 'POST', url: '/api/auth/register', body: { name: 'Maria', email: 'invalido', password: 'Senha123!' }, failOnStatusCode: false }).its('status').should('equal', 400);
  });

  it('CT-API-008 - rejeita email já cadastrado', () => {
    cy.fixture('validUser').then((user) => {
      const payload = { ...user, email: `duplicado-${Date.now()}@test.local` };
      cy.request('POST', '/api/auth/register', payload);
      cy.request({ method: 'POST', url: '/api/auth/register', body: payload, failOnStatusCode: false }).its('status').should('equal', 409);
    });
  });

  it('CT-API-009 - autentica e retorna JWT com as claims exigidas', () => {
    cy.request('POST', '/api/auth/login', { email: 'admin@mimorh.local', password: 'Admin123!' }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
      const payload = JSON.parse(atob(response.body.token.split('.')[1]));
      expect(payload).to.include({ name: 'Administrador MimoRH', email: 'admin@mimorh.local', role: 'admin', sub: '1' });
    });
  });

  it('CT-API-010 - rejeita login sem campos obrigatórios', () => cy.request({ method: 'POST', url: '/api/auth/login', body: { email: 'admin@mimorh.local' }, failOnStatusCode: false }).its('status').should('equal', 400));
  it('CT-API-011 - rejeita credenciais inválidas', () => cy.request({ method: 'POST', url: '/api/auth/login', body: { email: 'admin@mimorh.local', password: 'invalida' }, failOnStatusCode: false }).its('status').should('equal', 401));
  it('CT-API-012 - bloqueia rota protegida sem token ou com token inválido', () => {
    cy.request({ url: '/api/employees', failOnStatusCode: false }).its('status').should('equal', 401);
    cy.request({ url: '/api/employees', headers: { Authorization: 'Bearer invalido' }, failOnStatusCode: false }).its('status').should('equal', 401);
  });

  it('CT-API-046 - bloqueia token JWT expirado', () => {
    cy.task('createExpiredToken').then((token) => cy.request({
      url: '/api/employees',
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).its('status').should('equal', 401));
  });
});
