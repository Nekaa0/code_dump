/// <reference types= 'cypress' />

import landingPage from "../../support/pageObjects/landingPage";
import signUpPage from "../../support/pageObjects/signUpPage";
import loginPage from "../../support/pageObjects/loginPage";
import homePage from "../../support/pageObjects/homePage";
import ticketPage from "../../support/pageObjects/ticketPage";
import checkOutPage from "../../support/pageObjects/checkOutPage";
import eventPage from "../../support/pageObjects/eventPage";

//Here I imported Chancejs it is a random data generator which i used to populate fields in forms
import Chance from 'Chance';
const chance = new Chance();

describe('TixAfrica Regression test suite', () => {

    //here i stored all page objects classes into variables to call in this file 
    const landPage = new landingPage();
    const sUpPage = new signUpPage();
    const logPage = new loginPage();
    const homPage = new homePage();
    const ticket = new ticketPage();
    const checkOut = new checkOutPage();
    const evntPage = new eventPage();

    //Here I stored Chancejs methods in variables 
    const firstName = chance.first();
    const lastName = chance.last();
    const fullName = firstName + lastName;
    const tix = "TixAfrica";
    const eventNo = chance.integer({ min: 0, max: 20 })
    const eventNo2 = chance.integer({ min: 0, max: 20})
    const eventNo3 = chance.integer({ min: 0, max: 20})
    const eventName = `${tix}${eventNo}`;
    const eventName2 = `${tix}${eventNo2}`;
    const eventName3 = `${tix}${eventNo3}`;
    const eventDesc = chance.sentence();
    const eventAddress = chance.address();
    const discountName = chance.word({length: 10});
    const discountName2 = chance.word({length: 10});
    

    //In times where there are multiple test cases this before each method saves time and increases neatness of test cases by setting up methods/pre condition's for every test case 
    beforeEach(function(){
        
        cy.fixture('tixAfricaData').then(function(data) {
            this.taData = data
        })
        //this method call the url which has been set in cypress.json
        cy.visit("https://tix-staging.netlify.app/")
        cy.wait(6000)
        //the viewport keeps the dimensions constant no matter the window size
        //cy.viewport('macbook-13')
    });

    it('Ensure an existing user can sign in', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
//logPage.assertLogin()
        cy.wait(5000)
    });

    it('Ensure that a new user can sign up ', function(){
        //good to go
        landPage.getSignUpBtn().click();
        sUpPage.getPersonalAccount().click();
        sUpPage.getContinueBtn().click();
        sUpPage.assertSignUpPage(); 
        sUpPage.getDropDown().click()
        sUpPage.selectNigeria().click()
        sUpPage.getFirstNameField().type(firstName)
        sUpPage.getLastNameField().type(lastName)
        sUpPage.getEmailField().type(fullName+'@yopmail.com')
        sUpPage.getPasswordField().type(this.taData.password)
        sUpPage.getConfirmPasswordField().type(this.taData.password)
        sUpPage.getContinueBtn().click()
        cy.wait(5000)
        sUpPage.assertConfirmEmailPage()
        sUpPage.getBackToLoginBtn().click()
    });

    it.skip('Ensure users can request password reset for their registered accounts', function(){
        cy.signIn(this.taData.email, this.taData.password)
        logPage.getForgotPassword().click()
        logPage.getFPEmail().type(this.taData.email2)
        logPage.requestPasswordResetBtn().click()
        logPage.assertPasswordResetNotification()
    });

    it('Ensure user can create a Single live event', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getSelectEventBtn().click()
        evntPage.assertCreatorEventsPage()
        homPage.selectLiveEvent().click()
        sUpPage.getContinueBtn().click()
        cy.liveEventDetails(eventName2, eventDesc, eventAddress)
        homPage.pickEventKind().click()
        homPage.getStartDateField('single').click()
        cy.pickDate('2023', 'Aug', '9')
        sUpPage.getContinueBtn().click()
        homPage.selectEventPageTheme().click()
        homPage.selectFile().selectFile('../TIXAFRICA/cypress/fixtures/cypresstest.png',{force : true})
        cy.wait(5000)
        homPage.saveAndContinue().click()
        homPage.createTicket().click()
        ticket.pickPaidTicket()
        cy.fillPaidTicketDetails(eventName, '8', eventDesc)
        homPage.getSaveBtn().click()
        homPage.getSaveAndContinueBtn2()
        sUpPage.getBtn('Publish')
        evntPage.listPublicly()
        cy.wait(5000)
    });

    it('Ensure user can create a Reoccurring live event', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getSelectEventBtn().click()
        evntPage.assertCreatorEventsPage()
        homPage.selectLiveEvent().click()
        sUpPage.getContinueBtn().click()
        cy.liveEventDetails(eventName3, eventDesc, eventAddress)
        homPage.pickEventKind().click()
        homPage.getReoccurringBtn().click()
        homPage.getStartDateField().click()
        cy.pickDate('2023', 'Aug', '9')
        homPage.selectEventFrequency()
        homPage.getStartTime().click()
        homPage.pickStartTime().click()
        homPage.pickNumberOfOccurrences().click()
        homPage.getNumberOfOccurrences().type('19')
        sUpPage.getContinueBtn().click()
        homPage.selectEventPageTheme().click()
        homPage.selectFile().selectFile('../eventauto/cypress/fixtures/cypresstest.png',{force : true})
        homPage.saveAndContinue().click()
        homPage.createTicket().click()
        ticket.pickInviteOnlyTIcket()
        cy.fillInviteOnlyTicketDetails(eventName3, eventDesc)
        homPage.getSaveBtn().click()
        homPage.getSaveAndContinueBtn2()
        cy.wait(5000)
        sUpPage.getBtn('Publish')

    });

    it.only('Ensure user can create a single Online event', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getSelectEventBtn().click()
        evntPage.assertCreatorEventsPage()
        homPage.getSelectEventBtn().click()
       // cy.get('.event-type > :nth-child(2) > button').click() 
        sUpPage.getContinueBtn().click()
        cy.onlineEventDetails(eventName, eventDesc)
        homPage.pickEventKind().click()
        homPage.getStartDateField('single').click()
        cy.pickDate('2023', 'Aug', '9')
        sUpPage.getContinueBtn().click()
        homPage.selectEventPageTheme().click()
        homPage.selectFile().selectFile('../TIXAFRICA/cypress/fixtures/cypresstest.png',{force : true})
        cy.wait(5000)
        homPage.saveAndContinue().click()
        homPage.createTicket().click()
        cy.fillTicketDetails(eventName, '8', eventDesc)
        homPage.getSaveBtn().click() 
        homPage.getSaveAndContinueBtn2()
        cy.get('button').contains('Publish').click()
        cy.wait(5000)
    });

    it('Ensure user can create a reoccurring Online event', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getSelectEventBtn().click()
        evntPage.assertCreatorEventsPage()
        cy.get('.event-type > :nth-child(2) > button').click()
        sUpPage.getContinueBtn().click()
        cy.onlineEventDetails(eventName, eventDesc)
        homPage.pickEventKind().click()
        homPage.getReoccurringBtn().click()
        homPage.getStartDateField().click()
        cy.pickDate('2023', 'Aug', '9')
        homPage.selectEventFrequency()
        homPage.getStartTime().click()
        homPage.pickStartTime().click()
        homPage.pickNumberOfOccurrences().click()
        homPage.getNumberOfOccurrences().type('19')
        sUpPage.getContinueBtn().click()
        homPage.selectEventPageTheme().click()
        homPage.selectFile().selectFile('../TIXAFRICA/cypress/fixtures/cypresstest.png',{force : true})
        cy.wait(3000)
        homPage.saveAndContinue().click()
        homPage.createTicket().click()
        cy.fillTicketDetails(eventName, '8', eventDesc)
        homPage.getSaveBtn().click()
        homPage.getSaveAndContinueBtn2() 
        cy.get('button').contains('Publish').click()
        cy.wait(5000)
    });

    it('Ensure users can duplicate their ticket', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        homPage.getEvent(eventName).click()
        cy.wait(3000)
        ticket.getTicketOptions().click()
        ticket.pickTicketOption('Duplicate').click()
        ticket.getDuplicateButton().click()
    });
    
    it('Ensure that user can send invite only tickets', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getEvent(eventName3).click()
        ticket.getTicketOptions().click()
        ticket.pickTicketOption('Invite').click()
        cy.wait(5000)
        ticket.inviteAttendeeEmail().type(this.taData.email2)
        ticket.inviteAttendeeEmailSubject().type(eventDesc)
        ticket.inviteAttendeeEmailMessage().type(eventDesc)
        ticket.sendInviteAttendeeEmail().click()
        ticket.assertInviteSent()
    });

    it('Ensure that at check out, user can add other recipients ', function(){
        landPage.openDiscoverPage()
        cy.wait(10000)
        cy.get('.discovery--page--content--view-all > button').click()
        cy.wait(5000)
        landPage.pickTestEventTicket()
        checkOut.confirmAgeBtn().click()
        sUpPage.getBtn('Register')
        checkOut.confirmAgeBtn().click()
        checkOut.pickNoOfTickets('2')
        cy.wait(2000)
        sUpPage.getBtn('Continue')
        checkOut.firstNameOfTicketBuyer().type(firstName)
        checkOut.lastNameOfTicketBuyer().type(lastName)
        checkOut.emailOfTicketBuyer().type(fullName+'@yopmail.com')
        checkOut.phoneNumberOfTicketBuyer().type('08024237849')     
        checkOut.viewAttendees()   
        checkOut.firstNameOfAttendee().type(firstName)
        checkOut.lastNameOfAttendee().type(lastName)
        checkOut.emailOfAttendee().type(fullName+'@yopmail.com')
        checkOut.copyAttendeeDetails()
        sUpPage.getBtn('Order tickets')
        checkOut.confirmAttendees()
        checkOut.assertTicketSaleSuccess()
    });

    it('Ensure user can add link for online event ', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        //comment
        logPage.assertLogin()
        evntPage.pickEvent(eventName)    
        evntPage.eventOptions('Event Page')
        evntPage.dropdownOptions('Online Events')
        evntPage.generateZoomLinkBtn()
        sUpPage.getBtn('Generate')
        evntPage.assertGenerateButtonIsDisabled()
        evntPage.backToHomeBtn()
    });

    it('Ensure that only Tix pro user can create a recurring event', function(){
        cy.signIn(this.taData.freeUserEmail, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getSelectEventBtn().click()
        evntPage.assertCreatorEventsPage()
        homPage.selectLiveEvent().click()
        sUpPage.getContinueBtn().click()
        cy.liveEventDetails(eventName, eventDesc, eventAddress)
        homPage.pickEventKind().click()
        homPage.getReoccurringBtn().click()
        cy.get('.el-dialog__title').contains('Upgrade to add recurring events')
        sUpPage.getBtn('Get tix pro').should('be.visible')
    });

    it('Ensure that a Tix free user can only create one discount code per event', function(){
        cy.signIn(this.taData.freeUserEmail, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getSelectEventBtn().click()
        evntPage.assertCreatorEventsPage()
        homPage.selectLiveEvent().click()
        sUpPage.getContinueBtn().click()
        cy.liveEventDetails(eventName2, eventDesc, eventAddress)
        homPage.pickEventKind().click()
        homPage.getStartDateField('single').click()
        cy.pickDate('2023', 'Aug', '23')
        sUpPage.getContinueBtn().click()
        homPage.selectEventPageThemeRegular()
        homPage.selectFile().selectFile('../TIXAFRICA/cypress/fixtures/cypresstest.png',{force : true})
        cy.wait(5000)
        homPage.saveAndContinue().click()
        homPage.createTicket().click()
        ticket.pickPaidTicket()
        cy.fillPaidTicketDetails(eventName, '8', eventDesc)
        homPage.getSaveBtn().click()
        homPage.getSaveAndContinueBtn2()
        sUpPage.getBtn('Publish')
        evntPage.backToHomeBtn()
        evntPage.pickEvent(eventName2)
        evntPage.eventOptions('Tickets')
        evntPage.dropdownOptions('Discounts')
        ticket.createDiscountBtn()
        ticket.discountCodeBtn()
        sUpPage.getBtn('Continue')
        ticket.fillDiscountCodeField(discountName)
        ticket.fillDiscountPercentage('20')
        ticket.getDatepickerField()
        cy.pickDate('2023', 'Jan', '7')
        ticket.getPickStartTimeField()
        homPage.pickStartTime().click()
        cy.wait(2000)
        sUpPage.getBtn('Save')
        ticket.createDiscountBtn2()
        ticket.assertProUserModeRequired()
        ticket.closeUpgradePopUpRegular()
        ticket.getDropDown()
        evntPage.dropdownOptions('Delete')
        sUpPage.getBtn('yes, delete')
        ticket.assertDiscountDeletion()
    });

    it('Ensure that a Tix pro user can create as many discount codes as they require', function(){
        cy.signIn(this.taData.email, this.taData.password);
        logPage.getLoginbtn().click();
        cy.wait(3000)
        logPage.assertLogin()
        homPage.getEvent(eventName2).click()
        evntPage.eventOptions('Tickets')
        evntPage.dropdownOptions('Discounts')
        ticket.createDiscountBtn()
        ticket.discountCodeBtn()
        sUpPage.getBtn('Continue')
        ticket.fillDiscountCodeField(discountName)
        ticket.fillDiscountPercentage('20')
        ticket.getDatepickerField()
        cy.pickDate('2023', 'Jan', '7')
        ticket.getPickStartTimeField()
        homPage.pickStartTime().click()
        cy.wait(2000)
        sUpPage.getBtn('Save')
        ticket.createDiscountBtn2()
        ticket.discountCodeBtn()
        sUpPage.getBtn('Continue')
        ticket.fillDiscountCodeField(discountName2)
        ticket.fillDiscountPercentage('20')
        ticket.getDatepickerField()
        cy.pickDate('2023', 'Jan', '7')
        ticket.getPickStartTimeField()
        homPage.pickStartTime().click()
        cy.wait(2000)
        sUpPage.getBtn('Save')
        cy.wait(2000)
        ticket.getDropDownPro()
        evntPage.dropdownOptions('Delete')
        sUpPage.getBtn('yes, delete')
        ticket.assertDiscountDeletion()
        cy.wait(2000)
        ticket.getDropDown()
        evntPage.dropdownOptions('Delete')
        sUpPage.getBtn('yes, delete')
        ticket.assertDiscountDeletion()
    });

});