angular.module('myModule', ['veasy.table'])

  .controller('myController', ['$scope', '$timeout', 'mockService', function ($scope, $timeout, mockService) {
    var init = function () {
      $scope.veasyTableConfig = mockService.veasyTableConfig();

      addListeners();
      $scope.resultList = loadUsers();
    };

    var loadUsers = function() {
      // mockService.findAll().then(function (data) {
      //   $scope.resultList = data;
      // });
      return [
        {
          "id": 1,
          "first_name": "Thómás",
          "gender": null,
          "company": "Googlé",
          "address": "2 Lãkêwood Road",
          "money": "206.00",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAINSURBVDjLY/j//z8DPlxYWFgAxA9ANDZ5BiIMeASlH5BswPz58+uampo2kuUCkGYgPg/EQvgsweZk5rlz5zYSoxnDAKBmprq6umONjY1vsmdeamvd9Pzc1N2vv/Zse/k0a/6jZWGT7hWGTLhrEdR7hwOrAfPmzWtob29/XlRc9qdjw8P76fMeTU2c9WBi5LQH7UB6ftS0B9MDe+7k+XfeCvRpu6Xr1XJTEMPP2TMvlkzZ8fhn9JSb+ujO9e+6ZebbcSvMu/Wmm2fzDSv3hmuGsHh+BAptkJ9Llj3e2LDu2SVcfvZqucHm0XhD163+mplLzVVtjHgGar7asO75bXSNRyLkKg748j3c48Tyb6cr86MNnsJNDhVXVDFSWuO6Z/c6Nj//jKI5XK78YrHFz+9be///u7bj/9cVRf9PZ+v+2enMlofhxKKlj89M2PHiP9CvxjCxnS7Md78BNf+f5Pv/f7ng//9tiv9fdzn8B4rfwzAgfuaDjZN2vvrv2XIjByYGcva/s+v+I4P39RL/QeIYBni33GycuOPl/8DeW0vgLnBlfvxlbvL//0BNP8oY/r8D4ocZzP+B4k8wDABGjXf7puf/8xY/euZYcYUNJHY4XKrhZIrq72fliv9fVbL+v5vC+H+vL8ufHa7MVRgGAKNGqHLV0z8Vqx7/ty29FIgISNkKoI33obHwGKQZJA4AVQ2j4x4gIJMAAAAASUVORK5CYII=",
          "birth_date": "2009-05-21 07:34:11"
        },
        {
          "id": 2,
          "first_name": "Lisa",
          "gender": "Female",
          "company": "Apple",
          "address": "193 Straubel Plaza",
          "money": "834.78",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB4SURBVCjPzZChCoAwFEX3GSbBLzMaDOblBduqrAlDYcKCqNFiF39Gp8iDq91plhPvgQOXgX3D/iRM50gDWdKkSNJDmNJxHmbb6kN10gjjTdhA7z2kE6E3cc9rDYsC3GWRR9BbhQYVSuRIFo+gICHAkSFB7H765BsXhQcRTCg+5ikAAAAASUVORK5CYII=",
          "birth_date": "1964-10-08 02:59:14"
        },
        {
          "id": 3,
          "first_name": "Melissa",
          "gender": "Female",
          "company": "Facebook",
          "address": "61272 Marcy Junction",
          "money": "219.52",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHbSURBVDjLpZM/a1RBFEfPnfciq4uChLgrWChaihBYbAxqBD+AgrGwVBDRxipgH1AMEQJpbawU9SvYCRaiEmOaBUkRDRYBwf3zZt691+K9DWuXxYELwzCce37MXHF3/mfJtYcv789d7jzZ7XvTHTDDzVBT3Bxzw1Uxd1wVNePIgdTb3NxefLuysJZ3LnRWpxrN0GpM1LjZ6+sqsJb3k4f+7p+J1QfJA0Du6izdOjMx4M7jLSqAGwCxVBxwc9TAcMwcNUNLr8qNqM6p9mHUtAJQv4IEQdzxILg4YkIIgkhARJHMySyQl9V9K2vAiBQAFwGBzMEEzJzMIUhGLqDiaKiMTa2OYPU/EAH3f0Ai4OqYgAsQhMyyCjCKMNpUDKk2YyDLhcV3t0mxJMZEGiZe3HyDWWUQypT2DEYAkbp9Ha0YJi6dnGf+9BUG/QKAMpV1hDpLBvhYlHGjYlBQlAVREw1psPlzA68N8pEKgNQ16r78folvP9aZOXiMYRmJGpk52uLB87ukvAXcIN/+vvXq3rO0YKqYGqqKmaEpYX6WeGKDQ9MFRRoSNbLza4fe7ymOl9dfA8h+pvHq8sUv7en2uRgT3W7388en67N71vsd5/OPZj+kYUqfVr7OjZ//BRjUGmnYsJxdAAAAAElFTkSuQmCC",
          "birth_date": "1995-08-29 16:43:47"
        },
        {
          "id": 4,
          "first_name": "Heather",
          "gender": "Female",
          "company": "LinkedIn",
          "address": "1869 Almo Alley",
          "money": "169.34",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB8SURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYwMORk/54C0w2FOcemgmSIMyH1P7LNCHiLBDcEZ/+agqwXaFbOIxLc4P0f1e7fUPiZGDcw/AdD02z9/5r/Vf7L/Zf8L/Kf/z/3f/ZsiAwjxbEJAKUIVgAswNGVAAAAAElFTkSuQmCC",
          "birth_date": "1972-04-25 10:53:27"
        },
        {
          "id": 5,
          "first_name": "Janice",
          "gender": "Female",
          "company": "Google",
          "address": "062 Maryland Way",
          "money": "961.79",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAC3SURBVCjPvdCxDYMwEAVQSxQ0CImKKldE19FRITeu3LihiGQGYYKbIBtkgtuACdiACW4NcgEnpKJE11j6T98+m9Wcj7kERIqsM6ymHwJ7dvQJmhvSryFK5N1rLFtc4gT8Bx4JOO42gC+Y6wM8pJ/D6Ec3dnOrAJ9ga64O0EtIDS3fBS0sGi/FklMCQXwCjQIoa1vZYsqnrEnAi0sAGWQ/5Zx9r/CkT+NW18QBWMu39TIydN1Xn88bUK7xEQPM95QAAAAASUVORK5CYII=",
          "birth_date": "1999-11-23 13:17:36"
        },
        {
          "id": 6,
          "first_name": "David",
          "gender": "Male",
          "company": "Apple",
          "address": "1 Moose Junction",
          "money": "989.81",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ3SURBVDjLpVJdSJNhFD7bp7Js6qaUDqmxEFfRQFmZ00wjXYK2kgX+h114Ed5siZf9aIWFUSLRReVFgUElGVkURDCkKI3NlKIaRYmWmJmSue3b+9f5DGuBBNoHLwfe7zw/57yPSggB//NFLQcUKHG4BCEuESbt6uUQCDncqNm3x4gEbtVSR5jbuStGEPoaHSRibV7yCDxMWhH8HsHpCd6n7J8E9mPDLsGZmzN27tHJze2z23aUIbAcCTITfM+Y0qMiDQd7gNJSQdnd6MudZZEEhYd9Y5VbpFRZ9kJmlG/OdOGNdC0+58wNg03ijFZxTnGJhJZKjt1RuBCHXFmV9QfszccmbXf/9Lfc2MeTZkvBytFiw/h1Q/Z6xkhTuS3eyCh1qeQDdT0Kya/FUC3am7yjt769aCjMp4Lv7yzoyNeZHM26Ndnw7mHTjODcXnO/NpdzdggFzv71CkVHBmNKxp/cy5sY3Jo2MxKiejY7VZGwzlhUD0D8EAia4VP/+V7BuNNS84AoGHXEvCmMUc/tJOsXt7kuGdddPJsZbUqy1gKEfDBwtQu0uiDQULgUj2MBp7YfHXLhvONo5yWnpMdzylbd15YXHG3QrobtWao4fQC4/AHTw4H9eA6mgkYVleXjAx22uHkCVHXtzYhGdcI8p3PalMuhK/YYVDmhW5sBPDCM2CBYnWY09Rk0Gj8kWyo2UDnsnifgjLTf7P8+guqtC7aYHK5PTCuxxsZ9BUGn8LEl8N7yKzECHvLDqnQj9pCGvpZNGxeNMtobs1R3pUrqj0gwraQ/4q8apBVmmHj1Avy9Ld2LJhHtaXyXnEHBBdrnEUf8rqBUIVJ+AugPahHelS39AAAAAElFTkSuQmCC",
          "birth_date": "2008-11-10 06:40:20"
        },
        {
          "id": 7,
          "first_name": "Fred",
          "gender": "Male",
          "company": "Apple",
          "address": "29 American Road",
          "money": "906.23",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAI9SURBVDjLpVNfSFNRHP7u3MiHZqJCumZZamVRaSas0V40i4gKeoreIjKI3iK40GsPEpQEIRRBj/17kYKMSodlZk8rmy42mUjjLrfVnPt/77nn9jt3NSFfFH/w8f3OOfd+v3/nSIZhYD1mwTrN+s8JBoOXNU0bIBTJcoVCIZ3P5+OEL7lcLkacIg4R3sqyzFYI0Ad36UcQZI/Hc3/NGWQyGRtFHSahp2spQRoLsx/EzmzICxJA9Z7j0HUOZkKHxnQwTYdKrGlizUxWS35ECBibremyopiKGAwX4Ia51omFL/Z0zk2f9DEW+L08hRaHHZFYFq1bqjC/kMbuxiqElSXsbapGKJJCe0sNAvNJdO2qM/dEhqrKIHlnVcogg0g8ayqLAxGRiSjlUowytzfX4uDOWoz6ohiZisPCWCml7o4GHO10UK0cJ12NKKo6znqaUFA5zvc0Q0m8R0i5hYev+3Dpzml8mnls9kN65c8ajso85qJLYExEXo4qMtCIo79GUGH3obPtEJw1rfBOD2HS/wHFpBtWs8sU9dThrXgyGsa57h0rRtU3cB1nuo5Bt+g40NCLdzPP4drnxrOhYVhVjYHZOD5/T2BbvR0f/QtmhznnJaYpxBajsEkbcaLtoil4recBXn4bpLMXsBZVlghkjbr/5lvy/96BZHoR08oEvirjkHsfof/NBVRWbIAk2QxpNa/RddVx07l90w33/iNore9A6KcPE1PjiMylbkurfc4k0k90hWAniJs3OHlPkf8A2YeC/G6HEpkAAAAASUVORK5CYII=",
          "birth_date": "2000-01-04 17:34:37"
        },
        {
          "id": 8,
          "first_name": "Bobby",
          "gender": null,
          "company": null,
          "address": "9 Grover Center",
          "money": "568.64",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACzSURBVCjPY/jPgB8yEKmg0aHxf93/6jPlR4vP5P/I+p9yFMOEuvP7/pedKerJ7cmYnNwTOx9DQaVB9/8J/3McILyw/VjcUFA//3/a/QQBPI5MOT/7f2QBHgWxCRHvg2bhVBAjEHY/8DaecAhd73/GswfCNvmPoSA4we+8x2kQywLoTP33aAqCDHzeu79xrLepN+83uq/3Xwvdm94Jrvsd9lvtN91vuF93v+Z+tX5S44ICBQA4egHkwuNCKQAAAABJRU5ErkJggg==",
          "birth_date": "1971-12-12 04:48:04"
        },
        {
          "id": 9,
          "first_name": "Shirley",
          "gender": "Female",
          "company": "Apple",
          "address": "2021 Jenna Circle",
          "money": "13.16",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKASURBVDjLxVNLTxNRFP7udDp9TCEtFSzloUBwY4FUF0ZjVDYsTDSw0/gjXBii/gk2GjZudO1G4wONK40CGkQSRKTybqGAfVHa6dy5M/d6WwMhccnCk3yLk3u+L9+55xwihMBRQsERQz2crK+vX3Txyn1SyfXDMnyE24AjwR0Q4qLQw1M82H4vGo1+3OeQ/RZSqdQTV2XnhkKzmqaoYJaJQj4P27LgcQGNdTocRmFzyWiJv2zqil0/EJDkt67C0oAGhtTmJpLpHEwSAPNEwBwCy+bQ7W1EsYlYWxiKdMSjvbPhniu96tra2ohmbAxovILZxCq0E5dh6M1g0jllAqYEZRw7lhRp1ZDdewW9tILAykRPingfk9Ti7BbJJ47viiC645cwNm2gYPAaefhWH4TgGB79JoU4vG6Cu0MNyMx/Bv8+hkzJtlWWW27yRfrQ0dhS+4sq0aAOqHQgOK8JGJbMKZf9/h1asPssyv56sBejqupuinEtEHI5jgNFURCuA5JZB6a0fPvBF1BLClbsmoPT7X5wKVqrbWhFqDMmFFHcKLLiNmzbBmMM7WEFAY2jbDCUJbFsMpQkjgUI4ifVWk21lqaXoBQ2mMJ94adi6wes5AxoMYOw7uBcl4JTEQFVULhhId5GcO2MJtuUEykXQRc+gb1/hLTl/VobY2JmctyfnTvvUwlEqCMPvdGEHrKgevj+wlTrxO8VL1+ebLaSc1gwA2kj9bPlYJGmPrx7bm0lrkbIrhrwewFPPbjbj+pzdSPtUh7YXsRqpiT2gp1T9NfEhcGR1zY5fEzjo3c8ud3SIKV0SJrp1wgCLjiS7/CKaU5LPCOcj918+Gb+n1X+b9f4B22tbKhgZZpBAAAAAElFTkSuQmCC",
          "birth_date": "1997-04-11 13:14:54"
        },
        {
          "id": 10,
          "first_name": "Beverly",
          "gender": "Female",
          "company": "Facebook",
          "address": "2950 6th Way",
          "money": "746.08",
          "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIiSURBVBgZpcHfa81hHMDx9/l+n82x0zadyBabMFtKSS03XGxXUlMspqxcufGrcOMPQHHhR1v8B26Wxi7ccOlKLUlqTJvQ0H5gv8737DzP5/OxJ5RcyPJ6OTPjf7juCwOn93a0X/tSsoIZoIqpIiqYGmqKiaBmmAiiSl21XxwZmbg4eKPntmvf095XlS8k6/OsRGGxJH3AbVfylpS+LLBSmbeEZc7EuNLbwkqduPqOyJkpUSUIBoT5Z5Q/9mMSMFE0KCaKeI9Rg990mc3NWxEVIocZUS7JkVNB5p6wqmY9adU6zAfMB6SSkX19hTX0UFVoINIgRE5UiBJAwhSV6UfUbugizA6T5HchMkP52yhp4zFcQxdiSqSiRM7U+EFYmnpIdW0LkKLZZ3BLzH54zOotZ8g3HUINUk2JVIXIqQpRKI1S/nSfuqZ9WMggbQTvMXXownsWR26hPsOSOvJtR1BVIhe8J1oYv0l1/TaymVdoUKprWkAd9Q2dZDMvEF9h7uNzirsvka5aQ/CByJkoUb7YSShPQ5KQSyt8HR+irrGDUP5GpTRNUr+T5u7ruNomkjTFVImcqhIVNvbyi4YFZl/fpTT5kvL8JMUd56hvPczv1IzITbx9N3Dypu9REVQUEaF3Yz9ta4s8fZMw9Pks2XCKySBqiqmiSjTAMjd4o+cocJSfxu9t369e7mQzcv7gqbEHB/k7xx/Uy4R6OdB6fOwl/+A7Obk497M21x8AAAAASUVORK5CYII=",
          "birth_date": "1973-07-30 13:04:08"
        }
      ];
    };

    var addListeners = function() {
      addPaginationListeners();
      addSearchListeners();
      addSortListeners();
      addRowListeners();
      addColumnListeners();
      addSelectionListeners();
    };

    var addPaginationListeners = function() {
      $scope.$on('veasyTable:onStartPagination', function (event, data) {
        console.log('veasyTable:onStartPagination', data);
      });
      $scope.$on('veasyTable:onEndPagination', function (event, data) {
        console.log('veasyTable:onEndPagination', data);
      });
    };

    var addSearchListeners = function() {
      $scope.$on('veasyTable:onStartSearch', function (event, data) {
        console.log('veasyTable:onStartSearch', data);
      });
      $scope.$on('veasyTable:onEndSearch', function (event, data) {
        console.log('veasyTable:onEndSearch', data);
      });
    };

    var addSortListeners = function() {
      $scope.$on('veasyTable:onStartSort', function (event, data) {
        console.log('veasyTable:onStartSort', data);
      });
      $scope.$on('veasyTable:onEndSort', function (event, data) {
        console.log('veasyTable:onEndSort', data);
      });
    };

    var addRowListeners = function() {
      $scope.$on('veasyTable:onClickRow', function (event, data) {
        console.log('veasyTable:onClickRow', data);
      });
    };

    var addColumnListeners = function() {
      $scope.$on('veasyTable:onApplyColumnFilter', function (event, data) {
        console.log('veasyTable:onApplyColumnFilter', data);
      });
    };

    var addSelectionListeners = function() {
      $scope.$on('veasyTable:selectedItems', function (event, data) {
        console.log('veasyTable:selectedItems', data);
      });
    };

    init();
  }])

  .factory('mockService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    return {
      veasyTableConfig: function() {
        return {
          columns: [
            { size: 5,  header: 'Id', value: 'id', filter: { type: 'number', fractionSize: 0 } },
            { size: 10, header: 'First Name', value: 'first_name' },
            { size: 10, header: 'Gender', value: 'gender', dropdown: false, hideOn: '', default: 'Not Informed' },
            { size: 10, header: 'Company', value: 'company', dropdown: false, hideOn: 'xs', default: 'Not Informed' },
            { size: 15, header: 'Address', value: 'address', hideOn: 'xs' },
            { size: 10, header: 'Money', value: 'money', hideOn: '', filter: { type: 'currency', symbol: 'R$', fractionSize: 2 } },
            { size: 30, header: 'Photo', value: 'photo', hideOn: 'sm xs' },
            { size: 10, header: 'Date of Birth', value: 'birth_date', hideOn: 'lg md sm xs', filter: { type: 'date', format: 'dd/MM/yyyy HH:mm:ss' } }
          ],
          contextMenu: {
            enable: false,
            icon: 'fa fa-ellipsis-v',
            options: [
              { icon: 'fa fa-pencil', label: 'Editar', action: function(row) { alert('Editar: ' + JSON.stringify(row)); } },
              { icon: 'fa fa-trash', label: 'Excluir', action: function(row) { alert('Excluir: ' + JSON.stringify(row)); } }
            ]
          },
          toggleColumns: {
            enable: false,
            position: 'begin',
            icons: {
              opened: 'fa fa-chevron-down',
              closed: 'fa fa-chevron-right'
            }
          },
          clickRow: {
            enable: false
          },
          checkbox: {
            enable: false
          },
          sort: {
            enable: false
          },
          pagination: {
            enable: false,
            currentPage: 0,
            itemsPerPage: 50
          },
          filter: {
            enable: false,
            conditional: true,
            isCaseSensitive: false,
            ignoreSpecialCharacters: true,
            delay: 300
          },
          columnFilter: {
            enable: false,
            modalOptions: {
              size: 'md',
              autoOpen: false,
              keyboard: true,
              backdrop: true
            }
          },
          labels: {
            filter: {
              by: 'Filtrar por...',
              all: 'Todas',
              and: 'E',
              or: 'OU'
            },
            pagination: {
              itemsPerPage: 'Itens por Página',
              totalItems: 'Total de Itens'
            },
            modal: {
              title: 'Quais colunas você deseja exibir?',
              okButton: 'Aplicar',
              cancelButton: 'Cancelar'
            }
          }
        };
      },
      findAll: function() {
        var deferred = $q.defer();

        $timeout(function() {
          $http.get('../../mocks/MOCK_DATA_NEW.json').then(function(res) {
            res.data.forEach(function(row) {
              row.birth_date = new Date(row.birth_date);
              row.money = parseFloat(row.money);
            });

            deferred.resolve(res.data);
          }, function(err) {
            deferred.reject(err);
          });
        }, 0);

        return deferred.promise;
      }
    };
  }]);
