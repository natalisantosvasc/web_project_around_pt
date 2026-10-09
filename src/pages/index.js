import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";

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
const editForm = document.querySelector("#edit-profile-form");
const newCardForm = document.querySelector("#new-card-form");
const nameInput = editForm.querySelector(".popup__input_type_name");
const descriptionInput = editForm.querySelector(
  ".popup__input_type_description",
);

// --- Validação ---
const editFormValidator = new FormValidator(validationConfig, editForm);
const newCardFormValidator = new FormValidator(validationConfig, newCardForm);

editFormValidator.setEventListeners();
newCardFormValidator.setEventListeners();

// --- Perfil ---
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

// --- Popup da imagem ---
const imagePopup = new PopupWithImage("#image-popup");
imagePopup.setEventListeners();

// --- Cartões ---
function createCard(data) {
  const card = new Card(data, "#card-template", (cardData) =>
    imagePopup.open(cardData),
  );
  return card.generateCard();
}

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => cardSection.addItem(createCard(item)),
  },
  ".cards__list",
);

cardSection.renderItems();

// --- Popup de editar perfil ---
const editPopup = new PopupWithForm("#edit-popup", (formData) => {
  userInfo.setUserInfo({ name: formData.name, job: formData.description });
  editPopup.close();
});
editPopup.setEventListeners();

editButton.addEventListener("click", () => {
  const { name, job } = userInfo.getUserInfo();
  nameInput.value = name;
  descriptionInput.value = job;
  editFormValidator.resetValidation();
  editPopup.open();
});

// --- Popup de novo cartão ---
const newCardPopup = new PopupWithForm("#new-card-popup", (formData) => {
  cardSection.addItem(createCard(formData));
  newCardPopup.close();
});
newCardPopup.setEventListeners();

addButton.addEventListener("click", () => {
  newCardFormValidator.resetValidation();
  newCardPopup.open();
});
