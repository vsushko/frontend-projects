
'use strict';

(function () {

  var MAX_PINS_AMOUNT_TO_SHOW = 5;
  var MAP_PIN_INDENT_X = 20;
  var MAP_PIN_INDENT_Y = 44;

  /**
   * Возвращает склонированную ноду кнопки с меткой
   * @param {Object} advertisement объявление
   * @return {Object} нода
   */
  var renderAdvertisementPin = function (advertisement) {
    var buttonElement = window.pin.getMapPinButton().cloneNode(true);

    buttonElement.setAttribute('style', 'left: ' + (advertisement.location.x + window.pin.pinIndentX) + 'px; top: '
      + (advertisement.location.y + window.pin.pinIndentY) + 'px;');

    var buttonImgElement = buttonElement.querySelector('img');
    buttonImgElement.setAttribute('src', advertisement.author.avatar);
    buttonImgElement.setAttribute('alt', advertisement.offer.title);

    // добавим данные о объявлении в ноду пина
    buttonElement.data = advertisement;
    // установим кликабельный курсор
    buttonElement.style.cursor = 'pointer';

    return buttonElement;
  };

  window.pin = {
    pinIndentX: MAP_PIN_INDENT_X,
    pinIndentY: MAP_PIN_INDENT_Y,
    /**
     * Возвращает элемент с пинами
     * @return {Object} mapPins
     */
    getMapPinsButton: function () {
      return document.querySelector('.map__pins');
    },
    /**
     * Возвращает элемент пина
     * @return {Object} mapPin
     */
    getMapPinButton: function () {
      return document.querySelector('.map__pin');
    },
    /**
     * Генерирует пины по переданному списку объявлений
     * @param {Array} advertisements объявления
     * @return {Object} buttonsFragment
     */
    generateAdvertisementPins: function (advertisements) {
      var buttonsFragment = document.createDocumentFragment();

      for (var i = 0; i < advertisements.length; i++) {
        var generatedAdvertisement = renderAdvertisementPin(advertisements[i]);
        // показываем не больше доступного числа пинов
        if (i >= MAX_PINS_AMOUNT_TO_SHOW) {
          generatedAdvertisement.classList.add('hidden');
        }
        buttonsFragment.appendChild(generatedAdvertisement);
      }
      return buttonsFragment;
    }
  };
})();
