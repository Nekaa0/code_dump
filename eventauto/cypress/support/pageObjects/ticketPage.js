class ticketPage{
    getTicketOptions(){
        return cy.get('tr > :nth-child(5) > .el-dropdown > .el-dropdown-selfdefine')
    }
    pickTicketOption(option){
        return cy.get('a[draggable=false]').contains(option)
    }
    getDuplicateButton(){
        return cy.get('.duplicate__cta > :nth-child(2)')
    }
    inviteAttendeeEmail(){
        return cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    inviteAttendeeEmailSubject(){
        return cy.get(':nth-child(1) > :nth-child(2) > :nth-child(2) > .el-form-item > .el-form-item__content > .el-input > .el-input__inner')
    }
    inviteAttendeeEmailMessage(){
        return cy.get('.el-form > :nth-child(1) > :nth-child(3) > .el-form-item__content > #message-trix > .trix-content').clear()
    }
    sendInviteAttendeeEmail(){
        return cy.get('.el-form > :nth-child(1) > .buttons > [native-type="submit"]')
    }
    assertInviteSent(){
        return cy.get('.el-message__content').should('be.visible').contains('Invitation email was sent to the invitee')
    }
    createDiscountBtn(){
        return cy.get('.no-discount > .u-button').click()
    }
    discountCodeBtn(){
        return cy.get('.event-type > :nth-child(1) > button').click()
    }
    fillDiscountCodeField(discountName){
        return cy.get('.el-form > :nth-child(2) > .el-form-item__content > .el-input > .el-input__inner').type(discountName)
    }
    fillDiscountPercentage(percentage){
        return cy.get('.discount__value > .el-form-item__content > .el-input > .el-input__inner').type(percentage)
    }
    getDatepickerField(){
        return cy.get('.first--child > .el-form-item__content > .wrap > .el-row > :nth-child(1) > .el-date-editor > .el-input__inner').click()
    }
    getPickStartTimeField(){
        return cy.get('.first--child > .el-form-item__content > .wrap > .el-row > :nth-child(2) > .el-date-editor > .el-input__inner').click()
    }
    createDiscountBtn2(){
        return cy.get('.create--discount > div > .u-button').click()
    }
    assertProUserModeRequired(){
        return cy.get('.el-dialog__title').contains('Upgrade to add extra discount codes').should('be.visible')
    }
    closeUpgradePopUp(){
        return cy.get('[style="z-index: 2001;"] > .el-dialog > .el-dialog__header > .el-dialog__headerbtn > .el-dialog__close').click()
    }
    closeUpgradePopUpRegular(){
        return cy.get('[style="z-index: 2001;"] > .el-dialog > .el-dialog__header > .el-dialog__headerbtn > .el-dialog__close').click()
    }
    getDropDown(){
        return cy.get('.inactive > :nth-child(5) > .el-dropdown > .el-dropdown-selfdefine').click()
    }
    getDropDownPro(){
        return cy.get('.bordered > :nth-child(1) > :nth-child(5) > .el-dropdown > .el-dropdown-selfdefine').click()
    }
    assertDiscountDeletion(){
        return cy.get('.el-message__content').should('be.visible')
    }
    pickPaidTicket(){
        return cy.get('[value="Paid"]').click()
    }
    pickInviteOnlyTIcket(){
        return cy.get('[value="Invite only"]').click()
    }
}
export default ticketPage