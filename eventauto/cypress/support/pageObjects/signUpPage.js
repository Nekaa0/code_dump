class signUpPage{
    getPersonalAccount(){
       return cy.get(':nth-child(1) > .sign-up__radio-btn > .checkmark')
   
    }
    getOrganizationAccount(){
        return cy.get(':nth-child(2) > .sign-up__radio-btn > .checkmark')
    }
    getContinueBtn(){
        return cy.get('button').contains('Continue')
    }
    getBtn(nameOfBtn){
        return cy.get('button').contains(nameOfBtn).click()
    }
    assertSignUpPage(){
        return cy.get('h1').contains('Tell us about yourself')
    }
    getDropDown(){
        return cy.get('.el-select__caret')
    }
    selectNigeria(){
        return cy.get('span').contains('Nigeria')
    }
    getFirstNameField(){
        return cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
    }
    getLastNameField(){
        return cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__inner')
    }
    getEmailField(){
        return cy.get(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
    }
    getPasswordField(){
        return cy.get(':nth-child(4) > .el-form-item__content > .el-input > .el-input__inner')
    }
    getConfirmPasswordField(){
        return cy.get(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
    }
    assertConfirmEmailPage(){
        return cy.get('.confirm-email').contains('Confirm your e-mail').should('be.visible')
    }
    getBackToLoginBtn(){
        return cy.get('.u-button')
    }
}
export default signUpPage