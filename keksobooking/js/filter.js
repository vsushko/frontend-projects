
'use strict';

(function () {

  var MAX_PINS_AMOUNT_TO_SHOW = 5;
  var SELECTOR_ANY_VALUE = 'any';
  var HIDDEN_CLASS_NAME = 'hidden';
  var PRICE_MIM_VALUE = 10000;
  var PRICE_MAX_VALUE = 50000;

  // элемент с фильтрами
  var mapFilters = document.querySelector('.map__filters');
  // пины
  var mapPins = window.pin.getMapPinsButton();
  // элементы для фильтрации
  var housingTypeSelect = document.querySelector('#housing-type');
  var housingPriceSelect = document.querySelector('#housing-price');
  var housingRoomsSelect = document.querySelector('#housing-rooms');
  var housingGuestsSelect = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');
  // чекбоксы
  var featuresCheckboxes = housingFeatures.querySelectorAll('input[type=checkbox]');

  // добавим обработчик который будет отлавливать изменения на панели фильтров
  mapFilters.addEventListener('change', function () {
    // пины для фильтрации
    var filteringPins = Array.from(mapPins.children);
    // отфильтруем пины чтобы остались только загруженные
    var usersPins = filteringPins.filter(window.util.isElementDataExist);
    // отфильтруем пины
    window.debounce(filterPins(usersPins));
    // закрываем popup
    window.card.closePopup();
  });

  /**
   * Возвращает результат необходимости фильтрации значения поля селектора
   * @param {Object} currentSelectorValue выбранное значение селектора
   * @param {Object} currentObjectValue текущее значение объекта
   * @return {Object} результат сравнения
   */
  var checkSelectorValueForFiltering = function (currentSelectorValue, currentObjectValue) {
    return (parseInt(currentSelectorValue, 10) !== currentObjectValue && !(currentSelectorValue === SELECTOR_ANY_VALUE));
  };

  /**
   * Возвращает результат необходимости фильтрации текста поля селектора
   * @param {Object} currentSelector текущий селектор
   * @param {Object} currentObjectValue текущее значение объекта
   * @return {Object} результат сравнения
   */
  var checkSelectorTextForFiltering = function (currentSelector, currentObjectValue) {
    return (currentSelector.text !== currentObjectValue && !(currentSelector.value === SELECTOR_ANY_VALUE));
  };

  /**
   * Возвращает результат необходимости фильтрации значения поля селектора цены
   * @param {Object} currentSelectorValue1 выбранное значение селектора
   * @param {Object} currentObjectValue текущее значение объекта
   * @return {Object} результат сравнения
   */
  var checkPriceSelectorValuesForFiltering = function (currentSelectorValue1, currentObjectValue) {
    var filtered = false;
    if (!(currentSelectorValue1 === SELECTOR_ANY_VALUE)) {
      if (currentSelectorValue1 === 'middle' && !(currentObjectValue <= PRICE_MAX_VALUE && currentObjectValue >= PRICE_MIM_VALUE)) {
        filtered = true;
      } else if (currentSelectorValue1 === 'low' && !(currentObjectValue < PRICE_MIM_VALUE)) {
        filtered = true;
      } else if (currentSelectorValue1 === 'high' && !(currentObjectValue > PRICE_MAX_VALUE)) {
        filtered = true;
      }
    }
    return filtered;
  };

  /**
   * Возвращает результат необходимости фильтрации по чекбоксам
   * @param {Object} checkboxes
   * @param {Object} currentObjectValue
   * @return {Object} результат сравнения
   */
  var checkFeatureCheckBoxesForFiltering = function (checkboxes, currentObjectValue) {
    var filtered = false;

    for (var i = 0; i < checkboxes.length && !filtered; i++) {
      var featureCheckbox = checkboxes[i];

      if (featureCheckbox.checked && !(currentObjectValue.indexOf(featureCheckbox.value) > -1)) {
        filtered = true;
        break;
      }
    }
    return filtered;
  };

  /**
   * Фильтрует пины
   * @param {Object} toFilteringPins пины для фильтрации
   */
  var filterPins = function (toFilteringPins) {
    // кол-во видимых пинов
    var visiblePinsCount = 0;

    toFilteringPins.forEach(function (mapPin) {
      var filtered = false;

      // селектор числа комнат
      var isHouseTypePassed = checkSelectorTextForFiltering(housingTypeSelect.options[housingTypeSelect.selectedIndex], window.card.houseTypeMap[mapPin.data.offer.type]);
      // селектор цены
      var isHousePricePassed = checkPriceSelectorValuesForFiltering(housingPriceSelect.options[housingPriceSelect.selectedIndex].value, mapPin.data.offer.price);
      // селектор числа комнат
      var isHouseRoomsPassed = checkSelectorValueForFiltering(housingRoomsSelect.options[housingRoomsSelect.selectedIndex].value, mapPin.data.offer.rooms);
      // селектор числа гостей
      var isHouseGuestsPassed = checkSelectorValueForFiltering(housingGuestsSelect.options[housingGuestsSelect.selectedIndex].value, mapPin.data.offer.guests);
      // чекбоксы фич
      var isCheckBoxPassed = checkFeatureCheckBoxesForFiltering(featuresCheckboxes, mapPin.data.offer.features);

      filtered = isHouseTypePassed || isHousePricePassed || isHouseRoomsPassed || isHouseGuestsPassed || isCheckBoxPassed;

      if (filtered || visiblePinsCount >= MAX_PINS_AMOUNT_TO_SHOW) {
        mapPin.classList.add(HIDDEN_CLASS_NAME);
      } else if (visiblePinsCount < MAX_PINS_AMOUNT_TO_SHOW) {
        visiblePinsCount++;
        mapPin.classList.remove(HIDDEN_CLASS_NAME);
      }
    });
  };
})();
