class homePage {
    getSelectEventBtn(){
        return cy.get('.event-preview__create')
    }
    selectLiveEvent(){
        return cy.get('.event-type > :nth-child(1)')
    }
    getEventNameField(){
        return cy.get('[label-position="top"] > .el-form-item__content > .el-input > .el-input__inner')
    }
    getDescribeEventField(){
        return cy.get('.trix-content')
    }
    getEventAddressField(){
        return cy.get('.el-col-20 > .el-input > .el-input__inner')
    }
    getCustomURLField(){
        return cy.get(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
    }
    pickEventKind(){
        return cy.get('.event__form--section__interests > :nth-child(16)')
    }
    getStartDateField(sOrR){
        if (sOrR == 'single') {
            return cy.get(':nth-child(1) > .el-form-item__content > .wrap > .el-row > :nth-child(1) > .el-date-editor > .el-input__inner')
        } else {
            return cy.get(':nth-child(1) > :nth-child(1) > .el-form-item > .el-form-item__content > .el-date-editor > .el-input__inner')
        }   
    }
    pickdate(){
        return cy.get('.el-date-picker__header')
    }
    pickYear(year){
        return cy.get('td.available').contains(year)
    }
    pickMonth(month){
        return cy.get('a.cell').contains(month)
    }
    pickDay(day){
        return cy.get('td.available').contains(day)
    }
    selectEventPageTheme(){
        return cy.get(':nth-child(4) > .event-theme > .event-theme__info > .event-theme__buttons > button.u-button')
    }
    selectEventPageThemeRegular(){
        return cy.get('.event-appearance__themes > :nth-child(1) > .event-theme > .event-theme__info > .event-theme__buttons > button.u-button').click()
    }
    selectFile(){
        return cy.get('.el-upload__input')
    }
    saveAndContinue(){
        return cy.get('button').contains('Save and continue')
    }
    createTicket(){
        return cy.get('.no-tickets > .u-button')
    }
    getTicketNameField(){
       return cy.get('.el-form-item__content > .el-input > .el-input__inner')
    }
    getStockField(){
        return cy.get(':nth-child(3) > .el-form-item__content > .el-row > :nth-child(2) > .el-input-number > .el-input > .el-input__inner')
    }
    getTicketDescField(){
        return cy.get('.el-textarea__inner')
    }
    getSaveBtn(){
        return cy.get('button').contains('Save')
    }
    getReoccurringBtn(){
        return cy.get('.event__form--section__timing > :nth-child(2)')
    }
    selectEventFrequency(){
        return cy.get('select.input').select('Every week')
    }
    getStartTime(){
        return cy.get(':nth-child(2) > :nth-child(1) > .el-form-item > .el-form-item__content > .el-date-editor > .el-input__inner')
    }
    pickStartTime(){
        return cy.get('.time-select-item').contains('01:30')
    }
    pickNumberOfOccurrences(){
        return cy.get(':nth-child(4) > :nth-child(1) > .el-form-item > .el-form-item__content > .flex > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
    }
    getNumberOfOccurrences(){
        return cy.get('.input-number > .el-input__inner')
    }
    getEvent(eventName){
        return cy.get('div.event-group').contains(eventName)
    }
    getSaveAndContinueBtn2(){
        return cy.get('.buttons > .u-button').click()
    }
}
export default homePage