
'use strict';

(function () {

  var IMG_TAG_NAME = 'IMG';
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var CARD_PHOTO_SIZE = 45;
  var HOUSE_TYPES_MAP = {'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};

  // создадим DOM-элемент объявления на основе существующего
  var advertisementPopup = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

  /**
   * Обработчик закрытия попапа
   * @param {Event} escPressEvt событие
   */
  var onPopupEscPress = function (escPressEvt) {
    if (escPressEvt.keyCode === ESC_KEYCODE) {
      window.card.closePopup(false);
    }
  };

  /**
   * Устанавливает элементу указанное значение
   * @param {Object} element
   * @param {Object} elementValue
   */
  var setElementTextContent = function (element, elementValue) {
    advertisementPopup.querySelector(element).textContent = elementValue;
  };

  /**
   * Возвращает текущее объявление
   * @param {Object} loadedAdvertisements объявления загруженные с сервера
   * @param {Object} advertisementPinContainer пин
   * @param {Object} evtTarget событие на котором был клик/enter
   * @return {Object} currentAdvertisementPopup
   */
  var getCurrentAdvertisementPopup = function (loadedAdvertisements, advertisementPinContainer, evtTarget) {
    var currentAdvertisementPopup;

    // либо это клик мышкой по пину, либо нажали ENTER
    var pinImg = evtTarget.firstElementChild ? evtTarget.firstElementChild : evtTarget;

    if (pinImg && pinImg.nodeName === IMG_TAG_NAME) {
      var advertisement;

      // удалим map__pin--active у он был у кнопки
      window.util.removeContainerElementsClassesByName(advertisementPinContainer.children, 'map__pin--active');

      var parentNode = evtTarget.parentNode;
      // добавим класс map__pin--active к кнопке
      // обрабатываем только вариант нажатия на изображение
      if (parentNode.className !== 'map__pins') {
        parentNode.classList.add('map__pin--active');
      }

      // найдем объявление
      for (var i = 0; i < loadedAdvertisements.length; i++) {
        if (pinImg.alt.indexOf(loadedAdvertisements[i].offer.title) !== -1) {
          advertisement = loadedAdvertisements[i];
        }
      }

      if (advertisement) {
        // создадим попап на основе переданного объявления
        currentAdvertisementPopup = window.card.createAdvertisementPopup(advertisement);
        // достанем блок .map__filters-container перед которым будем вставлять объявление
        var mapFiltersContainer = document.querySelector('.map__filters-container');
        // вставим объявление
        mapFiltersContainer.parentNode.insertBefore(currentAdvertisementPopup, mapFiltersContainer);
      }
    }
    return currentAdvertisementPopup;
  };

  window.card = {
    houseTypeMap: HOUSE_TYPES_MAP,
    /**
     * Заполняет popup на основе данных переданного объявления
     * @param {Object} advertisement объявление
     * @return {Object} popup
     */
    createAdvertisementPopup: function (advertisement) {
      if (advertisement) {
        // заполним поля данными из объявления
        setElementTextContent('.popup__title', advertisement.offer.title);
        setElementTextContent('.popup__address small', advertisement.offer.address);
        setElementTextContent('.popup__price', advertisement.offer.price + '\u20bd/ночь');
        setElementTextContent('.popup__house_type', this.houseTypeMap[advertisement.offer.type]);
        setElementTextContent('.popup__rooms_guests', advertisement.offer.rooms + ' для ' + advertisement.offer.guests + ' гостей');
        setElementTextContent('.popup__checkin_checkout', 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout);

        var fearuresElementsList = advertisementPopup.querySelector('.popup__features');
        // удаляем предзаполненные фичи из шаблона
        window.util.removeFirstChilds(fearuresElementsList);

        // создаем те которые есть в объявлении
        advertisement.offer.features.forEach(function (feature) {
          var newFeatureElement = document.createElement('li');
          newFeatureElement.setAttribute('class', 'feature feature--' + feature);
          fearuresElementsList.appendChild(newFeatureElement);
        });

        setElementTextContent('.popup__description', advertisement.offer.description);
        advertisementPopup.querySelector('.popup__avatar').setAttribute('src', advertisement.author.avatar);

        var photosElementsList = advertisementPopup.querySelector('.popup__pictures');
        // удаляем предзаполненные фото из шаблона
        window.util.removeFirstChilds(photosElementsList);

        // добавляем фото
        for (var j = 0; j < advertisement.offer.photos.length; j++) {
          var newPhotoElement = document.createElement('li');
          var newPhotoImg = document.createElement('img');
          newPhotoImg.setAttribute('src', advertisement.offer.photos[j]);
          newPhotoImg.setAttribute('width', CARD_PHOTO_SIZE);
          newPhotoImg.setAttribute('height', CARD_PHOTO_SIZE);
          newPhotoImg.setAttribute('style', 'margin-right: 5px;');
          newPhotoElement.appendChild(newPhotoImg);
          photosElementsList.appendChild(newPhotoElement);
        }
      }

      return advertisementPopup;
    },
    /**
     * Показывает карточку выбранного жилья по нажатию на метку на карте
     * @param {Array} advertisements объявления
     * @param {Object} mapPinsContainer контейнер с кнопками
     * @param {Event} evt событие
     */
    showCard: function (advertisements, mapPinsContainer, evt) {
      var clickedPin = evt.target;
      var currentAdvertisementPopup;

      if (clickedPin) {
        currentAdvertisementPopup = getCurrentAdvertisementPopup(advertisements, mapPinsContainer, clickedPin);
      }

      document.addEventListener('keydown', onPopupEscPress);

      if (currentAdvertisementPopup) {
        var closePopupButton = document.querySelector('.popup__close');
        closePopupButton.addEventListener('click', function () {
          window.card.closePopup(currentAdvertisementPopup);
        });

        currentAdvertisementPopup.addEventListener('keydown', function (enterPressEvt) {
          if (enterPressEvt.keyCode === ENTER_KEYCODE) {
            window.card.closePopup(currentAdvertisementPopup);
          }
        });
      }
    },
    /**
     * Удаляет попап из DOM
     * @param {Object} toClosePopup попап для удаления
     */
    closePopup: function (toClosePopup) {
      if (toClosePopup) {
        // удаляем ноду, если клик
        toClosePopup.remove();
      } else {
        // обрабатываем esc
        var mapCard = document.querySelector('.map__card');
        if (mapCard) {
          mapCard.remove();
        }
      }
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };
})();
