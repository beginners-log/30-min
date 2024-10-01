describe.only('Verify configuration', () => {
  it('checks linter rules are applied', () => {
    let i
    cy.wait(400)
    console.log(Cypress.env())
  })

  it.only('1', () => {
    const user = Cypress.env().user_1

    if (typeof user.password !== 'string' || !'111') {
      throw new Error('Missing password value, set using CYPRESS_password=...')
    }

    expect(Cypress.config().baseUrl).to.include('/dev')
    expect(user.password).to.eq('111', { log: false })
  })

  it.only('2', () => {
    const user = Cypress.env().user_1

    expect(user.password === '111').to.be.true
  })
})
