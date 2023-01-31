
'use strict';

(function () {

  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var HOUSE_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var HOUSE_TYPE_PRICES = ['0', '1000', '5000', '10000'];
  var APARTMENT_CAPACITY_VALUES = ['1', '2', '3', '0'];
  var ROOM_NUMBERS = ['1', '2', '3', '100'];

  var form = document.querySelector('.notice__form');
  var fieldSet = form.querySelectorAll('fieldset');

  // зададим начальные координаты пина пользователю
  var pinButton = window.pin.getMapPinButton();
  var addressField = document.querySelector('#address');
  addressField.value = 'x: ' + pinButton.offsetLeft + ', y: ' + pinButton.offsetTop;

  // синхронизация полей времени заезда и выезда
  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');
  window.synchronizeFields(timeInSelect, timeOutSelect, CHECKIN_TIMES, CHECKOUT_TIMES, window.util.syncValues);
  window.synchronizeFields(timeOutSelect, timeInSelect, CHECKIN_TIMES, CHECKOUT_TIMES, window.util.syncValues);

  // синхронизация типа жилья и минимальной цены
  var apartmentType = document.querySelector('#type');
  var pricePerNight = document.querySelector('#price');

  // односторонняя синхронизация значения первого поля с минимальным значением второго
  window.synchronizeFields(apartmentType, pricePerNight, HOUSE_TYPES, HOUSE_TYPE_PRICES, window.util.syncValueWithMin);

  // синхронизация поля кол-во Кол-во комнат с Количество мест
  var apartmentRoomsNumber = document.querySelector('#room_number');
  var apartmentCapacity = document.querySelector('#capacity');
  window.synchronizeFields(apartmentRoomsNumber, apartmentCapacity, ROOM_NUMBERS, APARTMENT_CAPACITY_VALUES, window.util.syncValues);

  // добавляем обработчик на отправку формы
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(form), function () {
      form.reset();
    }, window.util.onError);
  });

  window.form = {
    /**
     * Делает поля активными в зависимости от переданного флага
     * @param {Boolean} deactivated флаг неактивности
     */
    setFieldSetInaccessibility: function (deactivated) {
      fieldSet.forEach(function (fieldElement) {
        fieldElement.disabled = deactivated;
      });
    }
  };
})();
