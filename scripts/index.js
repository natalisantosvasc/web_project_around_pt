import { openModal, closeModal } from "./utils.js";
import Card from "./Card.js";
import FormValidator from "./FormValidator.js";

const initialCards = [
  {
    name: "Vale de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Montanhas Carecas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Parque Nacional Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

// --- Configuração da validação ---
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// --- Seletores ---
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const editPopup = document.querySelector("#edit-popup");
const newCardPopup = document.querySelector("#new-card-popup");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = document.querySelector(".popup__input_type_name");
const descriptionInput = document.querySelector(
  ".popup__input_type_description",
);
const editForm = document.querySelector("#edit-profile-form");

const newCardForm = document.querySelector("#new-card-form");
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const cardLinkInput = document.querySelector(".popup__input_type_url");

const cardsList = document.querySelector(".cards__list");

const editFormValidator = new FormValidator(validationConfig, editForm);
const newCardFormValidator = new FormValidator(validationConfig, newCardForm);

editFormValidator.setEventListeners();
newCardFormValidator.setEventListeners();

// --- Editar perfil ---
editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  editFormValidator.resetValidation();
  openModal(editPopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(editPopup);
}
editForm.addEventListener("submit", handleProfileFormSubmit);

// --- Cartões ---

function renderCard(name, link, container) {
  const cardElement = new Card({ name, link }, "#card-template").generateCard();
  container.prepend(cardElement);
}

initialCards.forEach((card) => {
  renderCard(card.name, card.link, cardsList);
});

// --- Novo cartão ---
addButton.addEventListener("click", () => {
  newCardForm.reset();
  newCardFormValidator.resetValidation();
  openModal(newCardPopup);
});

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard(cardNameInput.value, cardLinkInput.value, cardsList);
  newCardForm.reset();
  closeModal(newCardPopup);
}
newCardForm.addEventListener("submit", handleCardFormSubmit);
