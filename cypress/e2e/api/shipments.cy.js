describe('Envios', () => {
  let token;
  const headers = () => ({ Authorization: `Bearer ${token}` });
  const setupRelations = () => cy.fixture('validEmployee')
    .then((employee) => cy.request({ method: 'POST', url: '/api/employees', headers: headers(), body: { ...employee, email: `envio-${Date.now()}@empresa.test` } }))
    .then(({ body: employee }) => cy.fixture('validGift')
      .then((gift) => cy.request({ method: 'POST', url: '/api/gifts', headers: headers(), body: gift }))
      .then(({ body: gift }) => cy.fixture('validSpecialDate')
        .then((date) => cy.request({ method: 'POST', url: '/api/special-dates', headers: headers(), body: { ...date, employeeId: employee.id } }))
        .then(({ body: specialDate }) => ({ employee, gift, specialDate }))));
  const createShipment = () => setupRelations().then(({ employee, gift, specialDate }) => cy.fixture('validShipment').then((shipment) => cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: { ...shipment, employeeId: employee.id, giftId: gift.id, specialDateId: specialDate.id } })));
  beforeEach(() => { cy.resetData(); cy.loginAsAdmin().then((value) => { token = value; }); });

  it('CT-API-034 - lista envios autenticado', () => cy.request({ url: '/api/shipments', headers: headers() }).its('body').should('deep.equal', []));
  it('CT-API-035 - bloqueia consulta sem token', () => cy.request({ url: '/api/shipments', failOnStatusCode: false }).its('status').should('equal', 401));
  it('CT-API-036 - cria envio com status PENDING', () => createShipment().then((response) => { expect(response.status).to.equal(201); expect(response.body.status).to.equal('PENDING'); }));
  it('CT-API-037 - rejeita envio incompleto ou mensagem vazia', () => cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: {}, failOnStatusCode: false }).its('status').should('equal', 400));
  it('CT-API-038 - rejeita relacionamento inexistente', () => cy.fixture('validShipment').then((shipment) => cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: { ...shipment, employeeId: '999', giftId: '999', specialDateId: '999' }, failOnStatusCode: false }).its('status').should('equal', 404)));
  it('CT-API-039 - permite transição PENDING para ORDERED', () => createShipment().then(({ body }) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'ORDERED' } }).its('body.status').should('equal', 'ORDERED')));
  it('CT-API-040 - permite sequência até DELIVERED', () => createShipment().then(({ body }) => { ['ORDERED', 'SHIPPED', 'DELIVERED'].forEach((status) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status } }).its('body.status').should('equal', status)); }));
  it('CT-API-041 - permite cancelamento antes da entrega', () => createShipment().then(({ body }) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'CANCELLED' } }).its('body.status').should('equal', 'CANCELLED')));
  it('CT-API-042 - rejeita status inválido', () => createShipment().then(({ body }) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'UNKNOWN' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-043 - rejeita transição a partir de DELIVERED', () => createShipment().then(({ body }) => { ['ORDERED', 'SHIPPED', 'DELIVERED'].forEach((status) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status } })); cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'SHIPPED' }, failOnStatusCode: false }).its('status').should('equal', 400); }));
  it('CT-API-044 - retorna 404 para envio inexistente', () => cy.request({ method: 'PATCH', url: '/api/shipments/999/status', headers: headers(), body: { status: 'ORDERED' }, failOnStatusCode: false }).its('status').should('equal', 404));
  it('CT-API-059 - rejeita mensagem vazia', () => setupRelations().then(({ employee, gift, specialDate }) => cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: { employeeId: employee.id, giftId: gift.id, specialDateId: specialDate.id, message: '   ' }, failOnStatusCode: false }).its('status').should('equal', 400)));
  it('CT-API-060 - rejeita cada relacionamento inexistente', () => {
    cy.fixture('validShipment').then((shipment) => {
      cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: { ...shipment, employeeId: '999', giftId: '1', specialDateId: '1' }, failOnStatusCode: false }).its('status').should('equal', 404);
      cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: { ...shipment, employeeId: '1', giftId: '999', specialDateId: '1' }, failOnStatusCode: false }).its('status').should('equal', 404);
      cy.request({ method: 'POST', url: '/api/shipments', headers: headers(), body: { ...shipment, employeeId: '1', giftId: '1', specialDateId: '999' }, failOnStatusCode: false }).its('status').should('equal', 404);
    });
  });
  it('CT-API-061 - bloqueia usuário comum e permite admin criar envio', () => {
    const user = { name: 'Usuário', email: `shipments-user-${Date.now()}@test.local`, password: 'Senha123!' };
    cy.request('POST', '/api/auth/register', user);
    cy.loginAsUser(user).then((userToken) => cy.request({ method: 'POST', url: '/api/shipments', headers: { Authorization: `Bearer ${userToken}` }, body: {}, failOnStatusCode: false }).its('status').should('equal', 403));
    createShipment().its('status').should('equal', 201);
  });
  it('CT-API-062 - consulta envio por id', () => createShipment().then(({ body }) => cy.request({ url: `/api/shipments/${body.id}`, headers: headers() }).its('body.id').should('equal', body.id)));
  it('CT-API-063 - permite cancelamento a partir de ORDERED e SHIPPED', () => {
    createShipment().then(({ body }) => { cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'ORDERED' } }); cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'CANCELLED' } }).its('body.status').should('equal', 'CANCELLED'); });
    createShipment().then(({ body }) => { cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'ORDERED' } }); cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'SHIPPED' } }); cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'CANCELLED' } }).its('body.status').should('equal', 'CANCELLED'); });
  });
  it('CT-API-064 - bloqueia todas as saídas de DELIVERED', () => createShipment().then(({ body }) => {
    ['ORDERED', 'SHIPPED', 'DELIVERED'].forEach((status) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status } }));
    ['CANCELLED', 'PENDING', 'ORDERED', 'SHIPPED'].forEach((status) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status }, failOnStatusCode: false }).its('status').should('equal', 400));
  }));
  it('CT-API-065 - bloqueia todas as saídas de CANCELLED', () => createShipment().then(({ body }) => {
    cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status: 'CANCELLED' } });
    ['PENDING', 'ORDERED', 'SHIPPED', 'DELIVERED'].forEach((status) => cy.request({ method: 'PATCH', url: `/api/shipments/${body.id}/status`, headers: headers(), body: { status }, failOnStatusCode: false }).its('status').should('equal', 400));
  }));
  it('CT-API-066 - retorna 404 ao consultar envio inexistente', () => cy.request({ url: '/api/shipments/999', headers: headers(), failOnStatusCode: false }).its('status').should('equal', 404));
});
