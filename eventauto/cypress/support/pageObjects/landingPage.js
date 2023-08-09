class landingPage{
    getLoginBtn(){
        return cy.get('.login-button')
    }
    getSignUpBtn(){
        return cy.get('li.signup-list.u-button.u-button--medium')
    }
    openDiscoverPage(){
        return cy.get('.nav-web-list > :nth-child(2) > a').click()
    }
    pickTestEventTicket(){
        return cy.get('.event-tile[href="/buy/travis-owens"]').invoke('removeAttr', 'target').click()
    }
}
export default landingPage