# Leo

## Project setup

||Command|
|--|--|
|Install everything|`npm install`|
|Start vue GUI|`vue ui`|
|Lints and fixes files|`npm run lint`|
|Run unit tests|`npm run test:unit`|
|Run end-to-end tests|`npm run test:e2e`|
|Compiles and hot-reloads for development|`vue serve` or `npm run serve`|
|Compiles and minifies for preproduction|`npm run build:preprod`|
|Compiles and minifies for production|`vue build` or `npm run build`|
|Generate icons and icons css|`npm run icons:generate`|
|Generate all documentation|`npm run docs:generate`|
|Generate only Vue `Components` documentation|`npm run styleguide:build`|
|Generate only Typescript documentation|`npm run typedoc:build`|

### HTTPS setup for local server
- Install [Mkcert](https://mkcert.org/) (on mac, install Mkcert through [Homebrew](https://brew.sh/index_fr) with `brew install mkcert`)
- Run `mkcert -install`
- Run `mkcert dev-leo.testapic.com` at the root of the project
- Ensure that the variable VUE_APP_HTTPS is set to `true` in .env.development

## Mandatory rules to respect before any modification

*A good code is ajustable, readable, and maintainable.*
Zarathoustra

### Project related
- Any of the following rules are made to have the most robust, efficient, readable, consistent, modular, adjustable, optimized, code possible. You must not take them lightly and have of thorough understanding of each of them if you want to change them.
- A lot of the rules are already enforced by the plugins of the project. It is *highly* advised to use [VS Code](https://code.visualstudio.com/) as it is a very good IDE for this project, has all the necessary extensions, and will automatically lint and format the code for you (the .code-workspace file is used to set this up).
- If you choose (wisely) to use VS Code, the extensions you have to install are: [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) (by Pine Wu), [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) (by Microsoft), and [TSLint Vue](https://marketplace.visualstudio.com/items?itemName=prograhammer.tslint-vue) (by prograhammer). Everything else is optional.
- Depending on the current state of the project, you may find parts of the code that do not respect the rules. Consider those parts as either unfinished, or plain wrong, and in both cases destined to be corrected.

### Architecture related

 - The "components" folder must contain only components.
 - A component must be a vue `Component` (or parts of it) that contains complex logics and is meant to be reused multiple times in several views.
 - A component should be made with reusability and adjustability in mind. It should avoid at all costs
 functionnalities that are too specific for its initial purpose, and instead expose a public interface allowing for very fine tuning.
 - If inheritance is taking place for a component, all modification should be made in the most relevant component regarding the specialization of the component. In other words, don't modify the parent with code that should only concern the child.
 - The "views" folder must contain only views.
 - A view is a vue `Component` that doesn't necessarily involve complex logic, mostly setup variables and basic functions, and is meant to be re-used in the least possible views.
 - The "services" folder must contain only services.
 - A service is a typescript singleton containing generic functions usable anywhere in the code.
 - The creation of services is to be kept to a bare minimum as it can easily render the code harder to read.
 - The "styles" folder must contain only scss files containing generic styles meant to be used anywhere in the code.
 - Everything related to the root of the application is to be placed at the root (i.e. the "src" folder), be it types, functions, declarations, decorators, directives, etc. Temporary files used for development only may be placed here too (for example the `ignore` and `development` files).
 - No component or view can share the same name.
 - Every .vue or .ts file must be named after the component, view, class, interface, etc it describes.
 - Every folder situated at the end of the tree must be named after the most relevant file it contains.
 - Every folder *not* situated at the end of the tree must be named after the most relevant group of folders it contains.
 - Every folder must have a unique name. Use your imagination.
 - If there is too many types or setup variables in a component or a view, they are to be split in a different file which name will contain "Types" or "Config" depending on its content.
 - The names of the .vue and .ts files must respect the same case as the typescript classes, i.e. CamelCase (except for the files at the root of src as they may not contain any class relevant to the naming).

*Addendum:*
    The support and management of the old product should, as much as possible, **never** have a long-term impact on the working of the new product. **Always** try to keep it contained and with a dedicated inteface to interact with it. It is a contagious disease, it **will** spread if you don't protect your code well enough, so stay clean and stay safe.

### Code related
 - The code should always respect the indentation currently in place, i.e. a 4 size tab.
 - **Type**script is installed on this project. A language that is strongly **typed** and offers a lot of powerful **types** features. Which means everything must be **typed**, every vue `Component` is a **class**, and the keyword `any` is **forbidden**. The only reason this last rule is not enforced by the linter or the formater, is because of exceptions. They are sparse and very specific, but they do exist (for example components that send or recieve unknown data from an unknown api, thrown exceptions, undefined types from a plugin, or extremely modular types and functions).
 - Data retrieved from an api in a view also can and must be typed.
 - The code must respect all the rules dictated in the configuration files of the prettier and tslint plugins. If they are not respected, errors and warnings will be thrown at compilation.
 - **Neither errors nor warnings directly generated by the code are allowed** at compilation in a production build. No exceptions. All green. Everywhere.
 - Vue `Components` in the `template` section and their attributes must be in kebab-case.
 - Global Events are useful and powerful. They are also a pain in the ass to track in the code, so use them parsimoniously.
 - The use of html4 tags (`<br>`, `<center>`, `<big>`, ...) is forbidden, except for `<i>` because their orginal purpose has been changed and they are now used for icons
 - Css classes, ids, and mixins must be in kebab-case
 - Flexbox is love. Flexbox is life. Embrace the ✦*Flex*✦
 - `position: absolute` must **never** be used to position structural elements. Again, sparse and specific exceptions exist, but use flexboxes for god sake.
 - `transparent` must be used only if necessary. If there is no background, use `background: none;`, if there is no shadow, use `box-shadow: none`, etc.
 - In general, the use of `none` (when available) is preferable to everything else to describe the absence of a property (use `border: none` instead of `border: 0`).
 - All scss must respect the hierarchy element > variables > rules > extensions of the current element > elements inside the current element:
```scss
 .class-or-id {
	$variable: value; //.................Notice that the variables should also be separated from the rules by a line break

	rules: value; //.....................We know we are still describing .class-or-id

	&.class-or-id-extension1 { ... } //..Here too

	&.class-or-id-extension2 { ... } //..And also here

	.components-class-or-id { ... } //...And only now we are describing its components, which will be following the same rules.
 }
```


## Tips and tricks
 - You can create files that will be ignored in production builds but not in development by putting ".development" in their name.
 - Inheritance is your friend, use it.
 - The `Vision` component has been created as a potential replacement for the `Vue` component, it can be customized to contain everything you might want shared in all of your components, be it a variable, a function, or an option.
 - You may also have a look at the `v-master` directive and its decorator `@Master`, created as a more powerful replacement for `v-model` (multiple and named `v-master`, direct use of accessors, possibility of chaining `v-master` to each others and to `v-model`, etc)
 - Pug may not be required but is still very useful, especially thanks to its inheritance and its syntax, both keeping the templates very clean and simple.

