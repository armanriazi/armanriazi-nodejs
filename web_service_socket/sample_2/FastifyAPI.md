
# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).

---

## Fastify scafolding framework

```bash
pnpm add fastify fastify-cli

pnpm fastify generate ./mock-srv --esm

cd ./mock-srv

pnpm i

pnpm start

```

### Adding fastify-cors plugin

```bash
pnpm install @fastify/cors
```

This will ensure that the same Access-Control-Allow-Origin HTTP header that we manually set in the last section will be added **for every route we create**.
Append followed line to app.js

```js
import cors from '@fastify/cors'

export default async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(cors)
  //...
  //...
}
```

### Adding routes

```bash
cd routes
mkdir confectionery
mkdir electronics
cd ..
```

Now let's create the mock-srv/routes/confectionery/index.mjs file with the following content:

```js
"use strict";
const data = [
  {
    id: "B1",
    name: "Chocolate Bar",
    rrp: "22.40",
    info: "Delicious overpriced chocolate.",
  },
];
export default async function (fastify) {
  fastify.get("/", async function (request, reply) {
    return data
})};
```

Fastify works by dividing the service up into plugins. A plugin is a module that exports a function. The exported function is passed a Fastify instance and options. Here, we have created a route plugin, as opposed to a server plugin, which would go into the plugins folder.


we move back to the current working directory, which is set to our project folder, and run our 'static' script command:

```bash
cd .. && npm run static
```

current working directory set to the mock-srv folder, execute the following:

```bash
npm run dev
```

### Post & Plugin

Plugins define behavior that is common to all the routes in your
application. Authentication, caching, templates, and all the other cross
cutting concerns should be handled by plugins placed in this folder.

Files in this folder are typically defined through the
[`fastify-plugin`](https://github.com/fastify/fastify-plugin) module,
making them non-encapsulated. They can define decorators and set hooks
that will then be used in the rest of your application.

Check out:

* [The hitchhiker's guide to plugins](https://www.fastify.io/docs/latest/Guides/Plugins-Guide/)
* [Fastify decorators](https://www.fastify.io/docs/latest/Reference/Decorators/).
* [Fastify lifecycle](https://www.fastify.io/docs/latest/Reference/Lifecycle/).

It is highly recommended that production Node.js services are stateless. That is, they don't store their own state, but retrieve it from an upstream service or database. When we are creating mock web services, however, storing state in-memory is fine. We are just trying to carve out a “happy path” for the application or service that we are actually implementing. In order to store state, we are going to need to create the minimum set of database-like abstractions for our POST request to make sense. Namely, we will need to create an ID for each new entry. Since we have two routes and we don't want duplicate logic (even in mocking web services, the Don't Repeat Yourself principle applies) we can create a small data utility library plugin that both routes can use.


Next, we need to create a data utility library plugin to handle the insertion of new items into the mock data. Create a new file in the mock-srv/plugins directory called data-utils.js

Let us first concentrate our attention on the calculateID(idPrefix,data) method that we have created. It looks very eloquent and we have opted to express this method this particular way simply for terseness. However, it does require some explanation if you are unfamiliar with some of the methods expressed here. 

The function starts by extracting unique IDs from the data array and storing them in a variable called sorted. It ensures that there are no duplicate IDs by removing any duplicates using new Set(). 

Next, the code retrieves the last ID from the sorted array. It assumes that the IDs are formatted in a specific way, with a prefix followed by a numeric value. The code removes the prefix by slicing off the first character and converts the remaining numeric portion into a number. The code increments the extracted number by 1 to calculate the next ID value.

Finally, the function constructs a new ID string by combining the idPrefix and the calculated next value. Using string interpolation to concatenate the two values together. In summary, the function takes an existing set of IDs, finds the highest ID, increments it by 1, and combines it with a provided prefix to generate a new ID. It ensures uniqueness by removing duplicates before determining the next ID value.

Next we have a fastify-plugin module that is used to de-encapsulate a plugin. We pass the exported plugin function into fp to achieve this. This means that any modifications we make to the fastify instance will apply across our entire service. If we did not pass the exported function to fastify-plugin, any modifications to the fastify instance that is passed to it would only apply to itself and any descendent plugins that it could register. Since the plugin is loaded as a sibling to our routes, we need to indicate that we want our plugin to apply laterally. [For more information on the Fastify plugin system see Fastify Plugins Documentation](https://www.fastify.io/docs/v3.9.x/Plugins/).

In a production scenario, failing to sanitize and validate incoming POST data and then sending that same POST data back in the response can lead to vulnerabilities. For an example scenario, visit [Testing for Reflected Cross Site Scripting](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/01-Testing_for_Reflected_Cross_Site_Scripting). If we were to add validation to our POST route, we would use Fastify route schema support. See [Fastify Validation and Serialization Documentation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/) for more information.