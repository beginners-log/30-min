describe('Verify configuration', () => {
  it('checks linter rules are applied', () => {
    let i
    cy.wait(400)
    console.log(Cypress.env())
  })

  it.only('checks the respective environment is applied', () => {
    const user = Cypress.env().user_1

    expect(Cypress.config().baseUrl).to.include('/dev')
    expect(user.password).to.eq('111')
  })
})
