import type {} from 'cypress';

const TEST_URL = 'http://localhost:4000';
const SELECTORS = {
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  INGREDIENT: (id: string) => `[data-id="${id}"]`,
  INGREDIENT_TYPE: (type: string) => `[data-cy="ingredient-type-${type}"]`,
  CONSTRUCTOR: {
    BUN: (index: number) => `[data-cy="constructor-bun-${index}"]`,
    ITEM: '[data-cy="constructor-item"]',
    INGREDIENTS: '[data-cy="constructor-ingredients"]'
  },
  ORDER_BUTTON: '[data-cy="order-button"]'
};

const FIXTURES = {
  INGREDIENTS: 'ingredients.json',
  USER: 'user.json',
  ORDER: 'order.json'
};

const setupTestEnvironment = () => {
  window.localStorage.setItem('refreshToken', JSON.stringify('test-refresh-token'));
  cy.setCookie('accessToken', 'test-access-token');
  
  cy.intercept('GET', 'api/ingredients', { fixture: FIXTURES.INGREDIENTS });
  cy.intercept('GET', 'api/auth/user', { fixture: FIXTURES.USER });
  cy.intercept('POST', 'api/orders', { fixture: FIXTURES.ORDER });

  cy.visit(TEST_URL);
  cy.viewport(1366, 768);
};

const cleanupTestEnvironment = () => {
  cy.clearLocalStorage();
  cy.clearCookies();
};

describe('Конструктор бургеров', () => {
  beforeEach(setupTestEnvironment);
  afterEach(cleanupTestEnvironment);

  describe('Добавление ингредиентов', () => {
    it('должно добавлять булки и начинки в конструктор', () => {
      cy.get(SELECTORS.INGREDIENT_TYPE('bun')).contains('Добавить').click();
      cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).should('be.visible');
      cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).should('be.visible');

      cy.get(SELECTORS.INGREDIENT_TYPE('main')).contains('Добавить').click();
      cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('be.visible');

      cy.get(SELECTORS.INGREDIENT_TYPE('sauce')).contains('Добавить').click();
      cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('have.length', 2);
    });
  });

  describe('Модальные окна', () => {
    Cypress._.times(15, (index) => {
      const ingredientId = `ingredient-id-${index + 1}`;
    
      describe(`Тестирование ингредиента ${ingredientId}`, () => {
        it('должно открывать и закрывать модальное окно', () => {
          cy.get(SELECTORS.INGREDIENT(ingredientId)).click();
          cy.get(SELECTORS.MODAL).should('be.visible');
          cy.get(SELECTORS.MODAL_CLOSE).click();
          cy.get(SELECTORS.MODAL).should('not.exist');
        });

        it('должно закрывать по клику на крестик', () => {
          cy.get(SELECTORS.INGREDIENT(ingredientId)).click();
          cy.get(SELECTORS.MODAL_CLOSE).click();
          cy.get(SELECTORS.MODAL).should('not.exist');
        });

        it('должно закрывать по клику на оверлей', () => {
          cy.get(SELECTORS.INGREDIENT(ingredientId)).click();
          cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
          cy.get(SELECTORS.MODAL).should('not.exist');
        });
      });
    });
  });

  describe('Оформление заказа', () => {
    it('должно корректно оформлять заказ', () => {
      cy.get(SELECTORS.INGREDIENT_TYPE('bun')).contains('Добавить').click();
      cy.get(SELECTORS.INGREDIENT_TYPE('main')).contains('Добавить').click();
      cy.get(SELECTORS.INGREDIENT_TYPE('sauce')).contains('Добавить').click();

      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.get(SELECTORS.MODAL).contains('79203').should('exist');

      cy.get(SELECTORS.MODAL_CLOSE).click();
      cy.get(SELECTORS.MODAL).should('not.exist');

      cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).contains('Выберите булки').should('exist');
      cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).contains('Выберите булки').should('exist');
      cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).contains('Выберите начинку').should('exist');
    });
  });
});