class checkOutPage{
    confirmAgeBtn(){
        return cy.get('.age__buttons > :nth-child(1)')
    }
    pickNoOfTickets(noOfT){
        return cy.get('.ticket__select--input').select(noOfT)
    }
    firstNameOfTicketBuyer(){
        return cy.get(':nth-child(1) > :nth-child(1) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    lastNameOfTicketBuyer(){
        return cy.get(':nth-child(2) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    emailOfTicketBuyer(){
        return cy.get(':nth-child(2) > :nth-child(1) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    phoneNumberOfTicketBuyer(){
        return cy.get('.el-col-16 > .el-input > .el-input__inner')
    }
    viewAttendees(){
        return cy.get('.order-recipients__dropdown > svg').click()
    }
    firstNameOfAttendee(){
        return cy.get(':nth-child(1) > .el-form > [style="margin-left: -25px; margin-right: -25px;"] > :nth-child(1) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    lastNameOfAttendee(){
        return cy.get(':nth-child(1) > .el-form > [style="margin-left: -25px; margin-right: -25px;"] > :nth-child(2) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    emailOfAttendee(){
        return cy.get(':nth-child(1) > .el-form > :nth-child(2) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    copyAttendeeDetails(){
        return cy.get('.el-checkbox__inner').click()
    }
    assertTicketSaleSuccess(){
        return cy.get('.receipts__summary').contains('Success!').should('be.visible')
    }
    confirmAttendees(){
        return cy.get('.default').click()
    }
}
export default checkOutPage