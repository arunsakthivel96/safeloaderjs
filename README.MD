# SafeloaderJS 👨‍💻
[![npm version](https://badge.fury.io/js/safeloaderjs.svg)](https://badge.fury.io/js/safeloaderjs)
[![NPM Downloads][downloads-image]][downloads-url]
![PackageBuild](https://github.com/arunsakthivel96/safeloaderjs/actions/workflows/node.js.yml/badge.svg)
----
### SafeloaderJS - Features 
* SafeLoaderJS will help handle the  relative path configaration.
* SafeLoaderJS also works in single instance.

Please report bugs there [on Github](https://github.com/arunsakthivel96/safeloaderjs/issues).

----
Old method 
```javascript
const HomeController = require('../../HomeController');
// 😭  When we use it with this old method we have provide the relative path every time to load or import the files from other modules.
```
We have simplified this process by using the SaferLoaderJS. 

# Example
🌐 router.js
```javascript
let  express  =  require('express');
let  router  =  express.Router(); 
let HomeController = require('@Ctrl/HomeController.js');

router.get('/',HomeController);
module.exports = router;
```
`.paths` configaration
```
@Ctrl = /Controllers/
```


## License
[MIT](LICENSE)


[downloads-image]: https://badgen.net/npm/dm/safeloaderjs
[downloads-url]: https://npmjs.org/package/safeloaderjs
#### Reference 
[GitHub](https://github.com/sultan99/sexy-require)  