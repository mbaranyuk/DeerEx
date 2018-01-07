angular.module('DeerEx')
.factory('customStorage', function () {
  return {
    put: function (name, value) {
      localStorage.setItem('DeerLang', value);
    },
    get: function (name) {
      var lang = localStorage.getItem('DeerLang');
      return lang === null ? 'en' : lang;
    }
  };
});