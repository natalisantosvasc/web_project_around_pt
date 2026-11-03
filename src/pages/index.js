import Api from "../components/Api.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// --- API ---
const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "d3d8edc8-a5a9-4f93-8510-6b1d1614fcdc",
    "Content-Type": "application/json",
  },
});

// --- Seletores ---
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const avatarButton = document.querySelector(".profile__avatar-button");
const editForm = document.querySelector("#edit-profile-form");
const newCardForm = document.querySelector("#new-card-form");
const avatarForm = document.querySelector("#avatar-form");
const nameInput = editForm.querySelector(".popup__input_type_name");
const descriptionInput = editForm.querySelector(
  ".popup__input_type_description",
);

// --- Validação ---
const editFormValidator = new FormValidator(validationConfig, editForm);
const newCardFormValidator = new FormValidator(validationConfig, newCardForm);
const avatarFormValidator = new FormValidator(validationConfig, avatarForm);

editFormValidator.enableValidation();
newCardFormValidator.enableValidation();
avatarFormValidator.enableValidation();

// --- Perfil ---
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  aboutSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

// Mostra "Salvando..." enquanto a requisição acontece e fecha o pop-up no sucesso
function handleSubmit(request, popup, loadingText) {
  popup.renderLoading(true, loadingText);
  request()
    .then(() => popup.close())
    .catch((err) => console.error(err))
    .finally(() => popup.renderLoading(false));
}

// --- Popups ---
const imagePopup = new PopupWithImage("#image-popup");
imagePopup.setEventListeners();

const confirmPopup = new PopupWithConfirmation("#confirm-popup");
confirmPopup.setEventListeners();

// --- Cartões ---
function handleDeleteClick(card) {
  confirmPopup.setSubmitAction(() => {
    handleSubmit(
      () => api.deleteCard(card.getId()).then(() => card.removeCard()),
      confirmPopup,
    );
  });
  confirmPopup.open();
}

function handleLikeClick(card) {
  api
    .changeLikeStatus(card.getId(), card.isLiked())
    .then((cardData) => card.setLikeStatus(cardData.isLiked))
    .catch((err) => console.error(err));
}

function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    {
      handleCardClick: (cardData) => imagePopup.open(cardData),
      handleDeleteClick,
      handleLikeClick,
    },
    userInfo.getUserId(),
  );
  return card.generateCard();
}

const cardSection = new Section({ renderer: createCard }, ".cards__list");

// Os cartões só são renderizados depois de recebermos o id do usuário
api
  .getAppInfo()
  .then(([userData, cards]) => {
    userInfo.setUserInfo(userData);
    cardSection.renderItems(cards);
  })
  .catch((err) => console.error(err));

// --- Popup de editar perfil ---
const editPopup = new PopupWithForm("#edit-popup", (formData) => {
  handleSubmit(
    () =>
      api
        .setUserInfo(formData)
        .then((userData) => userInfo.setUserInfo(userData)),
    editPopup,
  );
});
editPopup.setEventListeners();

editButton.addEventListener("click", () => {
  const { name, about } = userInfo.getUserInfo();
  nameInput.value = name;
  descriptionInput.value = about;
  editFormValidator.resetValidation();
  editPopup.open();
});

// --- Popup de novo cartão ---
const newCardPopup = new PopupWithForm("#new-card-popup", (formData) => {
  handleSubmit(
    () =>
      api
        .addCard(formData)
        .then((cardData) => cardSection.addItem(createCard(cardData))),
    newCardPopup,
  );
});
newCardPopup.setEventListeners();

addButton.addEventListener("click", () => {
  newCardFormValidator.resetValidation();
  newCardPopup.open();
});

// --- Popup de alterar foto do perfil ---
const avatarPopup = new PopupWithForm("#avatar-popup", (formData) => {
  handleSubmit(
    () =>
      api
        .setUserAvatar(formData.avatar)
        .then((userData) => userInfo.setUserInfo(userData)),
    avatarPopup,
  );
});
avatarPopup.setEventListeners();

avatarButton.addEventListener("click", () => {
  avatarFormValidator.resetValidation();
  avatarPopup.open();
});
