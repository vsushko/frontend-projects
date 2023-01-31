
'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var XHR_TIMEOUT = 10000;
  var HTTP_OK_STATUS_CODE = 200;

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = XHR_TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_OK_STATUS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.backend = {
    /**
     * Получает с сервера данные
     * @param {function} onLoad callback успешной обработки
     * @param {function} onError callback неуспешной обработки обработки
     */
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    /**
     * Отправляет данные формы на сервер
     * @param {Object} data данные
     * @param {function} onLoad callback успешной обработки
     * @param {function} onError callback неуспешной обработки обработки
     */
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }
  };
})();
