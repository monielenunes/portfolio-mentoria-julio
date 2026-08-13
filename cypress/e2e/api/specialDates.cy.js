describe('Datas especiais', () => {
  let token;
  const headers = () => ({ Authorization: `Bearer ${token}` });
  const createEmployee = () => cy.fixture('validEmployee').then((employee) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...employee, email: `data-${Date.now()}@empresa.test` } }));
  const createDate = (employeeId) => cy.fixture('validSpecialDate').then((date) => cy.request({ method: 'POST', url: '/api/special-dates', headers: headers(), body: { ...date, employeeId } }));
  beforeEach(() => { cy.resetData(); cy.loginAsAdmin().then((value) => { token = value; }); });

  it('CT-API-026 - cria data especial com colaborador existente', () => createEmployee().then(({ body }) => createDate(body.id).then((response) => { expect(response.status).to.equal(201); expect(response.body).to.include({ employeeId: body.id, type: 'BIRTHDAY' }); })));
  it('CT-API-027 - rejeita colaborador inexistente e tipo inválido', () => {
    cy.fixture('validSpecialDate').then((date) => {
      cy.request({ method: 'POST', url: '/api/special-dates', headers: headers(), body: { ...date, employeeId: '9999' }, failOnStatusCode: false }).its('status').should('equal', 404);
      cy.request({ method: 'POST', url: '/api/special-dates', headers: headers(), body: { ...date, employeeId: '9999', type: 'INVALID' }, failOnStatusCode: false }).its('status').should('equal', 400);
    });
  });
  it('CT-API-028 - lista próximas datas com colaborador e dias restantes', () => createEmployee().then(({ body }) => createDate(body.id)).then(() => cy.request({ url: '/api/special-dates/upcoming', headers: headers() }).then((response) => { expect(response.status).to.equal(200); expect(response.body[0]).to.include.keys('id', 'employeeId', 'employee', 'type', 'date', 'daysRemaining'); expect(response.body[0].employee.name).to.equal('Maria Silva'); })));
  it('CT-API-029 - atualiza e remove data especial como admin', () => createEmployee().then(({ body }) => createDate(body.id)).then(({ body }) => { cy.request({ method: 'PATCH', url: `/api/special-dates/${body.id}`, headers: headers(), body: { type: 'OTHER' } }).its('body.type').should('equal', 'OTHER'); cy.request({ method: 'DELETE', url: `/api/special-dates/${body.id}`, headers: headers() }).its('status').should('equal', 204); }));
  it('CT-API-050 - rejeita data especial sem campo obrigatório', () => cy.request({ method: 'POST', url: '/api/special-dates', headers: headers(), body: { type: 'BIRTHDAY' }, failOnStatusCode: false }).its('status').should('equal', 400));
  it('CT-API-051 - rejeita data especial calendariamente inválida', () => createEmployee().then(({ body }) => cy.request({ method: 'POST', url: '/api/special-dates', headers: headers(), body: { employeeId: body.id, type: 'BIRTHDAY', date: '2026-13-01' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-052 - bloqueia usuário comum e permite admin criar data especial', () => {
    const user = { name: 'Usuário', email: `dates-user-${Date.now()}@test.local`, password: 'Senha123!' };
    cy.request('POST', '/api/auth/register', user);
    cy.loginAsUser(user).then((userToken) => cy.fixture('validSpecialDate').then((date) => cy.request({ method: 'POST', url: '/api/special-dates', headers: { Authorization: `Bearer ${userToken}` }, body: { ...date, employeeId: '1' }, failOnStatusCode: false }).its('status').should('equal', 403)));
    createEmployee().then(({ body }) => createDate(body.id).its('status').should('equal', 201));
  });
  it('CT-API-053 - substitui data especial com PUT completo', () => createEmployee().then(({ body }) => createDate(body.id)).then(({ body }) => cy.request({ method: 'PUT', url: `/api/special-dates/${body.id}`, headers: headers(), body: { employeeId: body.employeeId, type: 'OTHER', date: '2026-10-10' } }).its('body.type').should('equal', 'OTHER')));
  it('CT-API-054 - retorna 404 para data especial inexistente', () => cy.request({ url: '/api/special-dates/999', headers: headers(), failOnStatusCode: false }).its('status').should('equal', 404));
});
