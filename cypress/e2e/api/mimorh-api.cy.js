describe('Infraestrutura e documentação', () => {
  it('CT-API-001 - responde ao health check sem autenticação', () => cy.request('/api/health').then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ status: 'ok' });
  }));

  it('CT-API-045 - disponibiliza a especificação OpenAPI', () => cy.request('/api-docs.json').then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body.openapi).to.equal('3.0.3');
    expect(response.body.info.title).to.equal('MimoRH API');
  }));
});
