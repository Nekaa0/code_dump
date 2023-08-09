class loginPage{
    getEmail(){
        return cy.get('input[name=email]')
    }
    getFPEmail(){
        return cy.get('.el-input__inner')
    }
    getPasswordField(){
        return cy.get('input[type=password]')
    }
    assertEmailField(){
        return cy.get('i.el-input__icon.el-input__validateIcon.el-icon-circle-check') 
    }
    getLoginbtn(){
        return cy.get('button[type=submit]')
    }
    assertLogin(){
        return cy.get('.events--page__header--text').contains('Your events').should('be.visible')
    }
    getForgotPassword(){
        return cy.get('.login--form__links > a')
    }
    requestPasswordResetBtn(){
        return cy.get('.password--reset__button')
    }
    assertPasswordResetNotification(){
        return cy.get('.el-message__content').contains('Please check your email for further instructions.').should('be.visible')
    }
}
export default loginPage