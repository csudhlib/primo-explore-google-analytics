# primo-explore-google-analytics

## Features
Enables the use of Google Analytics within Primo

Due to the nature of how Primo updates the page title, a couple alternatives have been implemented for better tracking. The `defaultTitle` config option is used whenever an empty document.title is identified. If the page being loaded is an openurl services page or a fulldisplay record page, the code will attempt to find the title of the record and provide it instead of `document.title`. In all other instances, `document.title` will be provided as the page title.

## Install
1. Copy the contents of `googleAnalytics.module.js` into your package's `custom.js` file.

## Usage
Once this module is installed, add `googleAnalytics` as a dependency for your custom module definition.

```js
var app = angular.module('viewCustom', ['googleAnalytics'])
```

### Configuration
| name           | type         | usage                                                                                 |
|----------------|--------------|---------------------------------------------------------------------------------------|
| `enabled`      | string       | Provided for consortium implementations. Single institutions should leave this `true` |
| `siteId`       | string       | The Site ID provided in your Google Analytics Suite admin settings                    |
| `defaultTitle` | string       | The default page title to use when `document.title` returns an empty string           |

#### Example
```js
app.value('analyticsOptions', {
    enabled: true,
    siteId: 'UA-012345678-1',
    defaultTitle: 'Discovery Search'
});
```
