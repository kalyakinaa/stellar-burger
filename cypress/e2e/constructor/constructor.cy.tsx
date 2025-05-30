import type {} from 'cypress';

const TEST_URL = 'http://localhost:4000';
const SELECTORS = {
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  MODAL_CONTENT: {
    TITLE: '[data-cy="modal-title"]',
    CALORIES: '[data-cy="ingredient-calories"]',
    PROTEINS: '[data-cy="ingredient-proteins"]',
    FAT: '[data-cy="ingredient-fat"]',
    CARBS: '[data-cy="ingredient-carbs"]',
    IMAGE: '[data-cy="ingredient-image"]',
  },
  INGREDIENT: (id: string) => `[data-id="ingredient-id-${id}"]`,
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
      cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).should('contain', 'Выберите булки');
      cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).should('contain', 'Выберите булки');
      cy.get(SELECTORS.INGREDIENT_TYPE('bun')).contains('Добавить').click();
      cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).should('not.contain', 'Выберите булки').and('be.visible');
      cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).should('not.contain', 'Выберите булки').and('be.visible');

      cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).should('contain', 'Выберите начинку');
      cy.get(SELECTORS.INGREDIENT_TYPE('main')).contains('Добавить').click();
      cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('be.visible');
      cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).should('not.contain', 'Выберите начинку');

      cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('have.length', 1);
      cy.get(SELECTORS.INGREDIENT_TYPE('sauce')).contains('Добавить').click();
      cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('have.length', 2);
    });

    it('должно отображать корректные данные добавленных в конструктор ингредиентов', () => {
      cy.fixture(FIXTURES.INGREDIENTS).then((ingredients) => {
        const bun = ingredients.data.find((item: any) => item._id === '1');
        const main = ingredients.data.find((item: any) => item._id === '4');
        const sauce = ingredients.data.find((item: any) => item._id === '13');

        cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).should('contain', 'Выберите булки');
        cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).should('contain', 'Выберите булки');
        cy.get(SELECTORS.INGREDIENT(bun._id)).contains('Добавить').click();
        cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).should('contain', bun.name).and('be.visible');
        cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).should('contain', bun.name).and('be.visible');

        cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('not.exist');
        cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).should('contain', 'Выберите начинку');
        cy.get(SELECTORS.INGREDIENT(main._id)).contains('Добавить').click();
        cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('be.visible');
        cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).should('contain', main.name);

        cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('have.length', 1);
        cy.get(SELECTORS.INGREDIENT(sauce._id)).contains('Добавить').click();
        cy.get(SELECTORS.CONSTRUCTOR.ITEM).should('have.length', 2);
        cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).should('contain', sauce.name);
      });
    });
  });

  describe('Модальные окна', () => {
  const TEST_INGREDIENT_ID = '1';

    it('должно открывать модальное окно с корректными деталями ингредиента', () => {
      cy.get(SELECTORS.MODAL).should('not.exist');
      cy.get(SELECTORS.INGREDIENT(TEST_INGREDIENT_ID)).click();
      cy.get(SELECTORS.MODAL).should('be.visible');

      cy.fixture(FIXTURES.INGREDIENTS).then((ingredients) => {
        const ingredient = ingredients.data.find((item: any) => item._id === TEST_INGREDIENT_ID);
      
        cy.get(SELECTORS.MODAL_CONTENT.TITLE).should('contain', ingredient.name);
        cy.get(SELECTORS.MODAL_CONTENT.IMAGE).should('have.attr', 'src', ingredient.image_large);
        cy.get(SELECTORS.MODAL_CONTENT.CALORIES).should('contain', ingredient.calories);
        cy.get(SELECTORS.MODAL_CONTENT.PROTEINS).should('contain', ingredient.proteins);
        cy.get(SELECTORS.MODAL_CONTENT.FAT).should('contain', ingredient.fat);
        cy.get(SELECTORS.MODAL_CONTENT.CARBS).should('contain', ingredient.carbohydrates);
      });
    });

    it('должно закрывать модальное окно по клику на крестик', () => {
      cy.get(SELECTORS.MODAL).should('not.exist');
      cy.get(SELECTORS.INGREDIENT(TEST_INGREDIENT_ID)).click();
      cy.get(SELECTORS.MODAL_CLOSE).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрывать модальное окно по клику на оверлей', () => {
      cy.get(SELECTORS.MODAL).should('not.exist');
      cy.get(SELECTORS.INGREDIENT(TEST_INGREDIENT_ID)).click();
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
      cy.get(SELECTORS.MODAL).should('not.exist');
    });
  });

  describe('Оформление заказа', () => {
    it('должно корректно оформлять заказ', () => {
      cy.get(SELECTORS.CONSTRUCTOR.BUN(1)).contains('Выберите булки').should('exist');
      cy.get(SELECTORS.CONSTRUCTOR.BUN(2)).contains('Выберите булки').should('exist');
      cy.get(SELECTORS.CONSTRUCTOR.INGREDIENTS).contains('Выберите начинку').should('exist');

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