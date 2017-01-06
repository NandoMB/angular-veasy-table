# angular-veasy-table
AngularJS directive to create quickly data tables without giving up the beauty and functionality.

## Dependencies
* [angular](https://angularjs.org/) (^1.5.8)
* [angular-sanitize](https://docs.angularjs.org/api/ngSanitize) (^1.5.8)
* [bootstrap](http://getbootstrap.com/) (^3.3.7)
* [font-awesome](http://fontawesome.io/icons/) (^4.6.3)

## Images
![v2.1.x](http://nandomb.github.io/angular-veasy-table/images/v2.1.0.png)
![v2.1.x (modal)](http://nandomb.github.io/angular-veasy-table/images/v2.1.0_modal.png)

## [Demonstration](http://nandomb.github.io/angular-veasy-table/demo/demo_all_features/)

## Instalation
```sh
$ bower install angular-veasy-table --save
```

##### In your angular app
```js
angular.module('yourModule', ['veasy.table'])

  .controller('yourController', function() {
    $scope.config = {
      // This 'id' is not necessary. Use it only if you want to set a specific id for this component.
      // If you not set a specific id, it will be randomly generated.
      id: 'my-specific-id',

      // Columns configuration
      columns: [
        {
          // That's the label of your column.
          header: 'Id',

          // That's the field of your column, and it's used to get value
          // from your result array.
          value: 'id',

          // This property is used to define the default value to the column when necessary.
          // The default value will be applied when the column value is: undefined, null, false or '' (empty string).
          default: 'Not Informed',

          // It's used only if you want to hide this column in a specific screen size.
          // The screen sizes are separated by spaces.
          // Ex: hideOn: 'lg md sm xs'.
          hideOn: 'xs',

          // It's used only if you want to apply an angular filter to this column.
          filter: {
            type: 'number',
            fractionSize: 0
          }
        },
        { header: 'First Name', value: 'first_name' },
        { header: 'Last Name', value: 'last_name', hideOn: 'xs' },
        { header: 'Email', value: 'email', hideOn: 'sm xs' },
        { header: 'Gender', value: 'gender', hideOn: 'sm xs' },
        { header: 'Money', value: 'money', hideOn: 'xs', filter: { type: 'currency', symbol: 'R$', fractionSize: 2 } },
        { header: 'Date', value: 'date', hideOn: 'lg md sm xs', filter: { type: 'date', format: 'dd/MM/yyyy HH:mm:ss' } }
      ]
    };
  });
```

##### In your HTML
```html
<head>
  <link rel="stylesheet" href="bower_components/angular-veasy-table/dist/css/veasy-table.min.css" media="screen" charset="utf-8"/>
</head>
<body>
  ...
  <veasy-table list="items" config="config"></veasy-table>
  ...

  <script src="bower_components/angular-veasy-table/dist/js/veasy-table-tpls.min.js" charset="utf-8"></script>
  <script src="bower_components/angular-veasy-table/dist/js/veasy-table.min.js" charset="utf-8"></script>
</body>
```

## Documentation
All of these configurations, you need put inside your config object, like '$scope.config'.

##### Enable toggle columns

```js
toggleColumns: {
  enable: true,         // Enable this feature. (Default is false).
  position: 'begin',    // Use it if you want to put the 'toggle' icon at the begin of the table. Default is undefined.
  icons: {              // Use it if you want to replace the default icons.
    opened: 'fa fa-chevron-down',
    closed: 'fa fa-chevron-right'
  }
}
```

##### Enable context menu

```js
contextMenu: {
  enable: true,                 // Enable this feature. (Default is false).
  icon: 'fa fa-ellipsis-v',     // Use it to set an icon to your menu.
  options: [
    {
      icon: 'fa fa-trash-o',    // Use it to set an icon to your menu item.
      label: 'Delete',          // Use it to set a text to your menu item.
      action: function(row) {   // Use it to set a action to your menu item. The first parameter aways will be the selected row.
        ...
        alert('Your row has been deleted!');
      }
    }
  ]
}
```

##### Enable pagination

```js
pagination: {
  enable: true,         // Enable this feature. (Default is false).
  currentPage: 0,       // Load in current page. (Default is 0)
  itemsPerPage: 10,     // How many items per page you want to see. Minimum is 1 and maximum is 50. (Default is 10)
}
```

##### Enable data filter

```js
filter: {
  enable: true,         // Enable this feature. (Default is false).
  conditional: true,    // Conditional filter 'AND' or 'OR'. (Default is AND)
  delay: 300            // Delay in milliseconds. (Default is 300ms)
}
```

##### Enable column filter (show and hide columns)

```js
columnFilter: {
  enable: true,         // Enable this feature. (Default is false).
  modalOptions: {
    size: 'md',         // The size of modal: 'sm', 'md' or 'lg'. (Default is 'md')
    autoOpen: false,    // Open automatically column filter modal, if not have visible columns. (Default is false)
    keyboard: true,     // Enable to use keyboard on filter modal. (Default is true)
    backdrop: true      // Enable to use backdrop on filter modal. (Default is true)
  }
}
```

##### Enable click row

```js
clickRow: {
  enable: true         // Enable this feature. (Default is false).
}
```

##### Enable checkboxes

```js
checkbox: {
  enable: true,        // Enable this feature. (Default is false).
}
```

##### Enable column sort

```js
sort: {
  enable: true         // Enable this feature. (Default is false).
}
```

##### Enable translate

```js
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
```

### Enable Events
All of veasy-table events are use [$emit](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), and to listen these events you need to use [$on](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on)

##### Click

```js
$scope.$on('veasyTable:onClickRow', function(event, data) {
  console.log('Some row was clicked', data);
});
```
##### Selected Items
```js
$scope.$on('veasyTable:selectedItems', function(event, data) {
  console.log('Some items were selected', data);
});
```
##### Column filter
```js
$scope.$on('veasyTable:onApplyColumnFilter', function(event, data) {
  console.log('Some columns was applied', data);
});
```
##### Pagination
```js
$scope.$on('veasyTable:onStartPagination', function(event) {
  console.log('Pagination event was started');
});

$scope.$on('veasyTable:onEndPagination', function(event) {
  console.log('Pagination event was done');
});
```
##### Search
```js
$scope.$on('veasyTable:onStartSearch', function(event) {
  console.log('Search event was started');
});

$scope.$on('veasyTable:onEndSearch', function(event) {
  console.log('Search event was done');
});
```
##### Sort
```js
$scope.$on('veasyTable:onStartSort', function(event) {
  console.log('Sort event was started');
});

$scope.$on('veasyTable:onEndSort', function(event) {
  console.log('Sort event was done');
});
```

### Enable angular [$filter](https://docs.angularjs.org/api/ng/filter) at columns?
All of these configurations, you need put inside your target column, in your $scope.config object.

###### [Currency](https://docs.angularjs.org/api/ng/filter/currency)
```js
filter: {
  name: 'currency',
  symbol: 'R$',
  fractionSize: 0
}
```
###### [Date](https://docs.angularjs.org/api/ng/filter/date)
```js
filter: {
  name: 'date',
  format: 'dd/MM/yyyy HH:mm:ss',
  timezone: ''
}
```
###### [Json](https://docs.angularjs.org/api/ng/filter/json)
```js
filter: {
  name: 'json',
  spacing: 2
}
```
###### [Number](https://docs.angularjs.org/api/ng/filter/number)
```js
filter: {
  name: 'number',
  fractionSize: 2
}
```
###### [LimitTo](https://docs.angularjs.org/api/ng/filter/limitTo)
```js
filter: {
  name: 'limitTo',
  limit: 10,
  begin: 0
}
```
###### [Lowercase](https://docs.angularjs.org/api/ng/filter/lowercase)
```js
filter: {
  name: 'lowercase'
}
```
###### [Uppercase](https://docs.angularjs.org/api/ng/filter/uppercase)
```js
filter: {
  name: 'uppercase'
}
```
###### Url
```js
filter: {
  name: 'url',
  text: '',
  target: '_blank'
}
```

---

# Migrating from 1.x.x to 2.x.x version


### In your HTML:
Just remove the 'selected-items' property
```html
<!-- from -->
<veasy-table config="config" list="resultList" selected-items="selectedItems"></veasy-table>

<!-- to -->
<veasy-table config="config" list="resultList"></veasy-table>
```

### In your Angular app:

##### On your app dependencies, just replace 'veasyTable' to 'veasy.table'.
```js
// FROM
angular.module('yourModule', [ 'veasyTable' ]);

// TO
angular.module('yourModule', [ 'veasy.table' ]);
```

##### On columns config, just remove 'size' and 'show' properties.
```js
// FROM
columns: [
  {
    header: 'Id',
    value: 'id',
    // TODO: REMOVE
    // size: 5,
    // show: true
  }
]

// TO
columns: [
  {
    header: 'Id',
    value: 'id',
    // Use something like this, if you want to use responsive columns and/or angular filters
    hideOn: 'lg md sm xs',
    filter: { type: 'number', fractionSize: 0 }
  }
]
```

##### On checkbox config, just remove 'size' property.
```js
// FROM
checkbox: {
  enable: true
  // TODO: REMOVE
  // size: 20
}

// TO
checkbox: {
  enable: true
}
```

##### On columnFilter config, just:
##### 1 - Move 'autoOpen' property to inside of new property named 'modalOptions'.
##### 2 - Move 'modalSize' property to inside of new property named 'modalOptions' and rename to 'size'.
```js
// FROM
columnFilter: {
  enable: true,
  // TODO: MOVE
  // autoOpen: true,
  // TODO: MOVE and RENAME
  // modalSize: 'md'
}

// TO
columnFilter: {
  enable: true,
  modalOptions: {
    size: 'md',
    autoOpen: false,
    keyboard: true,
    backdrop: true
  }
}
```

##### On resizable config, just remove.
```js
// TODO: REMOVE
// resizable: {
//   enable: true,
//   minimumSize: 5
// },
```

##### On translation config, just:
##### 1 - Rename 'translate' property to 'labels'.
##### 2 - Add 'all' property inside 'filter' object.
##### 3 - Rename 'itemsByPage' property, inside 'pagination' object, to 'itemsPerPage'.
##### 4 - Rename 'columnFilter' property to 'modal'.
```js
// FROM
translate: {
  filter: {
    by: 'Filtrar por...',
    and: 'E',
    or: 'OU'
  },
  pagination: {
    itemsByPage: 'Itens por Página',
    totalItems: 'Total de Itens'
  },
  columnFilter: {
    title: 'Quais colunas você deseja exibir?',
    okButton: 'Ok',
    cancelButton: 'Cancelar'
  }
}

// TO
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
```


##### On events config, just remove, because now, all events use [$emit](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), and to listen these events you need to use [$on](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on).
```js
// FROM
// TODO: REMOVE
// events: {
//   onClickRow: function(row) {
//     alert('Row Clicked: ' + JSON.stringify(row.id) + '. More details in your console.');
//     console.log(JSON.stringify(row, null, 2));
//     console.log('---------------------------------');
//     console.log('');
//   },
//   onApplyColumnFilter: function(columns) {
//     alert('Applied Columns! More details in your console.');
//     console.log(JSON.stringify(columns, null, 2));
//     console.log('---------------------------------');
//     console.log('');
//   },
//   onTableStateChange: function(columns) {
//     alert('State changed! More details in your console.');
//     console.log(JSON.stringify(columns, null, 2));
//     console.log('---------------------------------');
//     console.log('');
//   }
// }

// TO
$scope.$on('veasyTable:onClickRow', function(event, data) {
  console.log('Some row was clicked', data);
});

$scope.$on('veasyTable:onApplyColumnFilter', function(event, data) {
  console.log('Some columns was applied', data);
});
```
