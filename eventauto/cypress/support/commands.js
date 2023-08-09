// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import landingPage from "../support/pageObjects/landingPage";
import loginPage from "../support/pageObjects/loginPage";
import homePage from "../support/pageObjects/homePage";
const homPage = new homePage();
const landPage = new landingPage();
const logPage = new loginPage();
  
  Cypress.Commands.add('signIn', (email, password) => {
    landPage.getLoginBtn().click();
    logPage.getEmail().type(email);
    logPage.getPasswordField().type(password);
    logPage.assertEmailField().should('be.visible');
    logPage.assertEmailField().should('be.visible');
  });
  
  Cypress.Commands.add('pickDate', (year, month, day)=>{
      homPage.pickdate().click()
      homPage.pickYear(year).click()
      homPage.pickMonth(month).click()
      homPage.pickDay(day).click()
  });

  Cypress.Commands.add('liveEventDetails', (eventName, eventDesc, eventAddress)=>{
    homPage.getEventNameField().type(eventName)
    homPage.getDescribeEventField().type(eventDesc)
    homPage.getEventAddressField().type(eventAddress)
  });

  Cypress.Commands.add('fillPaidTicketDetails', (eventName, number, eventDesc)=>{
    homPage.getTicketNameField().type(eventName)
    homPage.getStockField().type(number)
    cy.get('.el-tooltip > .el-input > .el-input__inner').type('10000')
    homPage.getTicketDescField().type(eventDesc)
  });

  Cypress.Commands.add('fillTicketDetails', (eventName, number, eventDesc)=>{
    homPage.getTicketNameField().type(eventName)
    homPage.getStockField().type(number)
    homPage.getTicketDescField().type(eventDesc)
  });

  Cypress.Commands.add('fillInviteOnlyTicketDetails', (eventName, eventDesc)=>{
    homPage.getTicketNameField().type(eventName)
    homPage.getTicketDescField().type(eventDesc)
  });

  Cypress.Commands.add('onlineEventDetails', (eventName, eventDesc)=>{
    homPage.getEventNameField().type(eventName)
    homPage.getDescribeEventField().type(eventDesc)
  });
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
