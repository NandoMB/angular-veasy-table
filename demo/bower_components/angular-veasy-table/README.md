# [angular-veasy-table](http://nandomb.github.io/angular-veasy-table)

AngularJS directive to create quickly data tables without giving up the beauty and functionality.
<br/>

![alt tag](https://raw.githubusercontent.com/NandoMB/angular-veasy-table/gh-pages/images/v1.0.0.png)

### Features:
* Selecting rows using checkbox
* Order by specific column
* Sort columns
* Data paging (client-side)
* Global data filter (filter all columns)
* Possibility of changing the filter condition (AND, OR)
* Resize columns
* Show and hide columns
* Accepts asynchronous request
* Dynamic items by page
* Translate labels
* Select row event
* Auto open column filter modal

### Todo:
* Add dynamic '$filter' in columns data
* Add column with action buttons (edit, remove, ...)

### Dependencies
* [AngularJS](https://angularjs.org/) (requires AngularJS 1.3)
* [Font-Awesome](http://fortawesome.github.io/Font-Awesome/) (requires Font-Awesome 4.3)
* [Bootstrap CSS](http://getbootstrap.com/) (requires Bootstrap 3.x)
* [Angular Bootstrap](https://angular-ui.github.io/bootstrap/) (requires Bootstrap 0.12.x)
* [ng-sortable](https://github.com/a5hik/ng-sortable) (requires ng-sortable 1.2.x)


### Examples
* [Wit All Features Enabled](http://nandomb.github.io/angular-veasy-table/demo/)

### Instalation
```sh
$ bower install angular-veasy-table --save
```

## Configuration

Attributes           | Description
---------------------|----------------
list                 | This is a list of data
selected-items       | This is a list of selected rows
config               | This is an object used to configure your veasy-table

##### In your HTML
```html
<head>
  <link rel="stylesheet" href="./bower_components/angular-veasy-table/dist/veasy-table.min.css">
</head>
<body>
  <veasy-table list="items" selected-items="selectedItems" config="config"></veasy-table>
  <script type="text/javascript" src="./bower_components/angular-veasy-table/dist/veasy-table.min.js"></script>
  <script type="text/javascript" src="./bower_components/angular-veasy-table/dist/veasy-table-tpls.min.js"></script>
</body>
```

##### In your angular app
```js
angular.module('myModule', ['veasyTable']);
```

##### In your controller
PS: The array of columns used below ($scope.columns) need a specific configuration.
```js
$scope.columns = [
  {
    header: 'Id', // This string is displayed on table header name.
    
    value: 'id',  // This string is the name of property in your list declared on your html.
    
    show: false,  // This property, show or hide this column on your table.
    
    size: 20      // This property is used to define column size in percentage (%)
                  // If property 'show' is defined 'false', this size is ignored
  },
  { header: 'First Name', value: 'first_name', show: true, size: 40 },
  { header: 'Last Name', value: 'last_name', show: true, size: 40 }
];

$scope.config = {
  id: 'my-table',
  columns: $scope.columns
};
```

## Documentation
If you need, you can add in config object the following properties:
<br />
##### Enable selection by checkbox:

```js
checkbox: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  size: 20          // Set checkbox column size in pixels. (Default is 20)
}
```

##### Enable pagination:
```js
pagination: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  currentPage: 0,   // Load in current page. (Default is 0)
  itemsPerPage: 5   // How many itens per page. Minimum is 1 and maximum is 100. (Default is 10)
}
```

##### Enable data filter:
```js
filter: {
  enable: true,      // Enable = true, Disable = false. (Default is false)
  conditional: true  // Conditional filter 'AND', 'OR'. (Default is false)
  delay: 500         // Delay in milliseconds. (Default is 500ms)
}
```

##### Enable column filter (show and hide columns):
```js
columnFilter: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  autoOpen: true    // Open automatically column filter modal, if not have visible columns. (Default is false)
  modalSize: 'sm'   // The size of modal can be setted: 'sm, md or lg' (Default is 'sm')
}
```

##### Enable column sort:
```js
ordenation: {
  enable: true      // Enable = true, Disable = false. (Default is false)
}
```

##### Enable column resize:
```js
resizable: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  minimumSize: 5   // Set minimum column size in percentage '%'. (Default is 5)
}
```

##### Enable events:
```js
events: {
  onClickRow: function (row) {} // This event is called when an row is clicked
  onApplyColumnFilter: function (columns) {} // This event is called when 'apply column' button (in modal) is clicked
}
```

##### Enable translate:
```js
translate: {
  filter: {
    by: 'Filtrar por...',                           // Label of filter input
    and: 'E',                                       // Label of filter condition AND
    or: 'OU'                                        // Label of filter condition OR
  },
  pagination: {
    itemsByPage: 'Itens por Página',                // Label of items by page
    totalItems: 'Total de Itens'                    // Label of totel of items
  },
  columnFilter: {
    title: 'Quais colunas você deseja exibir?',     // Label of column filter modal title
    okButton: 'Ok',                                 // Label of column filter modal ok button
    cancelButton: 'Cancelar'                        // Label of column filter modal cancel button
  }
}
```

## License
The MIT License

Copyright (c) 2015 [NandoMB](https://github.com/NandoMB). https://github.com/NandoMB/angular-veasy-table

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
