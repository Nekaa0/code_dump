class eventPage{
    pickEvent(event){
        return cy.get('.event-preview__info').contains(event).click()
    }
    eventOptions(options){
        return cy.get('.tab__header.el-dropdown-selfdefine').contains(options).click()
    }
    dropdownOptions(ddOptions){
        return cy.get('.el-dropdown-menu__item').contains(ddOptions).click()
    }
    assertCreatorEventsPage(){
        return cy.get('.el-dialog__title').contains('New Event').should('be.visible')
    }
    generateZoomLinkBtn(){
        return cy.get('.online--form__options > :nth-child(3)').click()
    }
    assertGenerateButtonIsDisabled(){
        return cy.get('button[native-type="submit"]').should('be.disabled')
    }
    backToHomeBtn(){
        return cy.get('.router-link-active > img').click()
    }
    listPublicly(){
        return cy.get('.el-switch__core').click()
    }
} 
export default eventPage