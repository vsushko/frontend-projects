
'use strict';

(function () {
  window.util = {
    /**
     * Удаляет у элементов контейнера указанные классы
     * @param {Array} elementWithClasses контейнер с объектами у которых нужно удалить класс
     * @param {String} classToRemove имя класса
     */
    removeContainerElementsClassesByName: function (elementWithClasses, classToRemove) {
      for (var i = 0; i < elementWithClasses.length; i++) {
        var pinsClasses = elementWithClasses[i].classList;

        if (pinsClasses.contains(classToRemove)) {
          pinsClasses.remove(classToRemove);
        }
      }
    },
    /**
     * Устанавливает элементу указанное значение
     * @param {Object} element элемент кторому нужно установить значение
     * @param {Object} value значение
     */
    syncValues: function (element, value) {
      element.value = value;
    },
    /**
     * Устанавливает минимальному элементу указанное значение
     * @param {Object} element элемент кторому нужно установить значение
     * @param {Object} value значение
     */
    syncValueWithMin: function (element, value) {
      element.min = value;
    },

    /**
     * Удаляет первые элеметы у указанного элемента
     * @param {Object} elementWithChilds список элементов
     */
    removeFirstChilds: function (elementWithChilds) {
      while (elementWithChilds.firstChild) {
        elementWithChilds.removeChild(elementWithChilds.firstChild);
      }
    },

    /**
     * Возвращает флаг наличия в элементе поля с данными
     * @param {String} elementWithData сообщение
     * @return {Object} результат сравнения
     */
    isElementDataExist: function (elementWithData) {
      return !!elementWithData.data;
    },

    /**
     * Добавляет в дом элемент с указанным сообщением об ошибке
     * @param {String} errorMessage сообщение
     */
    onError: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; font-weight: bold; text-align: center; border-top-right-radius: 0; border-top-left-radius: 0; box-shadow: 0 5px 20px -8px rgba(0, 0, 0, 0.5); border: 1px solid transparent; border-radius: 4px; color: #c09853; background-color: #fcf8e3; border-color: #fbeed5;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '14px';

      node.textContent = 'Произошла ошибка: ' + errorMessage + '. Попробуйте еще раз.';
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();

