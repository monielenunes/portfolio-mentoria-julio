describe('Colaboradores', () => {
  let adminToken;
  const headers = () => ({ Authorization: `Bearer ${adminToken}` });
  const createEmployee = (suffix = Date.now()) => cy.fixture('validEmployee').then((employee) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...employee, email: `maria-${suffix}@empresa.test` } }));

  beforeEach(() => { cy.resetData(); cy.loginAsAdmin().then((token) => { adminToken = token; }); });

  it('CT-API-013 - lista colaboradores autenticado', () => cy.request({ url: '/api/employees', headers: headers() }).then((response) => { expect(response.status).to.equal(200); expect(response.body).to.deep.equal([]); }));
  it('CT-API-014 - bloqueia consulta sem token', () => cy.request({ url: '/api/employees', failOnStatusCode: false }).its('status').should('equal', 401));
  it('CT-API-015 - cria colaborador como admin', () => createEmployee().then((response) => { expect(response.status).to.equal(201); expect(response.body).to.have.property('id'); }));
  it('CT-API-016 - bloqueia criação para usuário comum', () => {
    const user = { name: 'Usuário', email: `user-${Date.now()}@test.local`, password: 'Senha123!' };
    cy.request('POST', '/api/auth/register', user); cy.loginAsUser(user).then((token) => cy.fixture('validEmployee').then((body) => cy.request({ method: 'POST', url: '/api/employees', headers: { Authorization: `Bearer ${token}` }, body, failOnStatusCode: false }).its('status').should('equal', 403)));
  });
  it('CT-API-017 - rejeita payload incompleto', () => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { name: 'Maria' }, failOnStatusCode: false }).its('status').should('equal', 400));
  it('CT-API-018 - rejeita email duplicado', () => createEmployee('duplicado').then(() => cy.fixture('validEmployee').then((body) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...body, email: 'maria-duplicado@empresa.test' }, failOnStatusCode: false }).its('status').should('equal', 409))));
  it('CT-API-019 - rejeita data de nascimento futura', () => cy.fixture('validEmployee').then((body) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...body, birthDate: '2999-01-01' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-020 - retorna 404 para colaborador inexistente', () => cy.request({ url: '/api/employees/9999', headers: headers(), failOnStatusCode: false }).its('status').should('equal', 404));
  it('CT-API-021 - busca colaborador por id', () => createEmployee().then(({ body }) => cy.request({ url: `/api/employees/${body.id}`, headers: headers() }).its('body.id').should('equal', body.id)));
  it('CT-API-022 - substitui colaborador com PUT completo', () => createEmployee().then(({ body }) => cy.fixture('validEmployee').then((employee) => cy.request({ method: 'PUT', url: `/api/employees/${body.id}`, headers: headers(), body: { ...employee, name: 'Ana', email: 'ana@empresa.test' } }).its('body.name').should('equal', 'Ana'))));
  it('CT-API-023 - rejeita PUT incompleto', () => createEmployee().then(({ body }) => cy.request({ method: 'PUT', url: `/api/employees/${body.id}`, headers: headers(), body: { name: 'Ana' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-024 - atualiza parcialmente com PATCH', () => createEmployee().then(({ body }) => cy.request({ method: 'PATCH', url: `/api/employees/${body.id}`, headers: headers(), body: { name: 'Ana' } }).its('body.name').should('equal', 'Ana')));
  it('CT-API-025 - rejeita PATCH sem campos válidos e remove com DELETE', () => createEmployee().then(({ body }) => { cy.request({ method: 'PATCH', url: `/api/employees/${body.id}`, headers: headers(), body: { invalid: true }, failOnStatusCode: false }).its('status').should('equal', 400); cy.request({ method: 'DELETE', url: `/api/employees/${body.id}`, headers: headers() }).its('status').should('equal', 204); }));
  it('CT-API-047 - rejeita email de colaborador inválido', () => cy.fixture('validEmployee').then((body) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...body, email: 'invalido' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-048 - rejeita endereço incompleto', () => cy.fixture('validEmployee').then((body) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...body, address: { street: 'Rua A', city: 'São Paulo' } }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-049 - rejeita data de nascimento calendariamente inválida', () => cy.fixture('validEmployee').then((body) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...body, birthDate: '2026-02-30' }, failOnStatusCode: false }).its('status').should('equal', 400)));
});
