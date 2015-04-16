# [angular-veasy-table](https://github.com/NandoMB/angular-veasy-table)

The main objective of this AngularJS directive is to create quickly and practical data tables without giving up key features know.

### Features:
* Selecting rows using checkbox
* Sort columns
* Data paging (client-side)
* Global data filter (filter all columns)
* Possibility of changing the filter condition (AND, OR)
* Resize columns
* Show and hide columns
* Accepts asynchronous request

### Todo:
* Add dynamic '$filter' in columns data
* Add column with action buttons (edit, remove, ...)
* ...

### Dependencies
* [AngularJS](https://angularjs.org/) (requires AngularJS 1.2)
* [Font-Awesome](http://fortawesome.github.io/Font-Awesome/) (requires Font-Awesome 4.3)
* [Bootstrap CSS](http://getbootstrap.com/) (requires Bootstrap 3.x)
* [Angular Bootstrap](https://angular-ui.github.io/bootstrap/) (requires Bootstrap 0.12.x)

### Instalation
```sh
$ bower install angular-veasy-table
```

## Configuration

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
<br />
##### In your angular app
```js
angular.module('myModule', ['veasyTable']);
```
<br />
##### In your controller
PS: The array of columns used below ($scope.columns) need a specific configuration.
```js
$scope.columns = [
  {
    header: 'Id', // This string is displayed on table header name.
    value: 'id',  // This string is the name of property in your list declared on your html.
    show: false   // This property, show or hide this column on your table.
  },
  { header: 'First Name', value: 'first_name', show: true },
  { header: 'Last Name', value: 'last_name', show: true }
];

$scope.config = {
  id: 'my-table',
  columns: $scope.columns
};
```

## Documentation

If you need, you can add in config object the following properties:
<br />
<br />
##### Enable selection by checkbox:
```js
checkbox: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  size: 20          // Set checkbox column size in pixels. (Default is 20)
}
```
<br />
##### Enable pagination:
```js
pagination: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  currentPage: 0,   // Load in current page. (Default is 0)
  itemsPerPage: 5   // How many itens per page. (Default is 10)
}
```
<br />
##### Enable data filter:
```js
filter: {
  enable: true,      // Enable = true, Disable = false. (Default is false)
  conditional: true  // Conditional filter 'AND', 'OR'. (Default is false)
}
```
<br />
##### Enable column filter (show and hide columns):
```js
columnFilter: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
}
```
<br />
##### Enable column sort:
```js
ordenation: {
  enable: true      // Enable = true, Disable = false. (Default is false)
}
```
<br />
##### Enable column resize:
```js
resizable: {
  enable: true,     // Enable = true, Disable = false. (Default is false)
  minimumSize: 30   // Set minimum column size in pixels. (Default is 30)
}
```
<br />
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
