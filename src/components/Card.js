export default class Card {
  constructor(
    data,
    templateSelector,
    { handleCardClick, handleDeleteClick, handleLikeClick },
    userId,
  ) {
    this._id = data._id;
    this._name = data.name;
    this._link = data.link;
    this._isLiked = data.isLiked;
    this._ownerId = data.owner;
    this._userId = userId;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  getId() {
    return this._id;
  }

  isLiked() {
    return this._isLiked;
  }

  setLikeStatus(isLiked) {
    this._isLiked = isLiked;
    this._likeButton.classList.toggle("card__like-button_is-active", isLiked);
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }

  _handleImageClick() {
    this._handleCardClick({ name: this._name, link: this._link });
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () =>
      this._handleLikeClick(this),
    );
    this._deleteButton.addEventListener("click", () =>
      this._handleDeleteClick(this),
    );
    this._cardImage.addEventListener("click", () => this._handleImageClick());
  }

  generateCard() {
    this._element = this._getTemplate();
    this._cardImage = this._element.querySelector(".card__image");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._element.querySelector(".card__title").textContent = this._name;
    this.setLikeStatus(this._isLiked);

    this._setEventListeners();

    if (this._ownerId !== this._userId) {
      this._deleteButton.remove();
    }

    return this._element;
  }
}
