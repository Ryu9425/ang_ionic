describe('list: spec', () => {
  beforeEach(() => {
    cy.visit('components/list/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
