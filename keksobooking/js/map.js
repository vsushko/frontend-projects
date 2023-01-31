
'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var INITIAL_PINS_COUNT = 1;

  var PIN_COORD_X_MIN_VALUE = 40;
  var PIN_COORD_X_MAX_VALUE = 1160;
  var PIN_COORD_Y_MIN_VALUE = 100;
  var PIN_COORD_Y_MAX_VALUE = 500;

  // изначально все поля формы недоступны
  window.form.setFieldSetInaccessibility(true);

  var mapPinButton = document.querySelector('.map__pin--main');

  mapPinButton.addEventListener('mouseup', function () {
    // открываем карту
    document.querySelector('.map').classList.remove('map--faded');

    // элемент куда будем вставлять объявления
    var mapPinsContainer = window.pin.getMapPinsButton();

    var generatedPinsCount = mapPinsContainer.querySelectorAll('.map__pin').length;

    if (generatedPinsCount <= INITIAL_PINS_COUNT) {
      // сгенерируем пины на основе существующего
      var pinButtonsFragment = window.pin.generateAdvertisementPins(window.data.advertisements);

      // вставляем сгенерированные
      mapPinsContainer.appendChild(pinButtonsFragment);

      // делаем форму активной
      document.querySelector('.notice__form').classList.remove('notice__form--disabled');

      // сделаем поля формы активными
      window.form.setFieldSetInaccessibility(false);

      mapPinsContainer.addEventListener('click', function (evt) {
        window.card.showCard(window.data.advertisements, mapPinsContainer, evt);
      });

      mapPinsContainer.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.card.showCard(window.data.advertisements, mapPinsContainer, evt);
        }
      });
    }
  });

  // добавим обработку события перетаскивания
  mapPinButton.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
     * При каждом движении мыши обновляем смещение относительно первоначальной точки
     * чтобы диалог смещался на необходимую величину
     * @param {Event} moveEvt событие
     */
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoordYValue = mapPinButton.offsetTop - shift.y;
      var newCoordXValue = mapPinButton.offsetLeft - shift.x;

      if (newCoordXValue >= PIN_COORD_X_MIN_VALUE && newCoordXValue <= PIN_COORD_X_MAX_VALUE
            && newCoordYValue >= PIN_COORD_Y_MIN_VALUE && newCoordYValue <= PIN_COORD_Y_MAX_VALUE) {
        mapPinButton.style.top = newCoordYValue + 'px';
        mapPinButton.style.left = newCoordXValue + 'px';

        var addressField = document.querySelector('#address');
        addressField.value = 'x: ' + parseInt(mapPinButton.style.left + window.pin.pinIndentX, 10)
          + ', y: ' + parseInt(mapPinButton.style.top + window.pin.pinIndentY, 10);
      }
    };

    /**
     * Обрабатывает опускание кнопки мыши
     * @param {Event} upEvt
     */
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();

