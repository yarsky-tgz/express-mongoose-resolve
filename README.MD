## express-mongoose-resolve

### Install

```bash
npm i express-mongoose-resolve
```

### Example

```javascript
const resolve = require('express-mongoose-resolve');
const Model = require('./models/Model');
...
router.get('view/:model', resolve(Model), (req, res) => res.json(req.resolved.model));
```

### API Reference

#### resolve(model, options) ⇒ <code>function</code>
Configures and returns middleware listener which will resolve model instance from request params and assign it
to "req.resolved" Object using lowercase name of the model, so such middleware:

...get('/foo/:vod', resolve(Vod))

will save model as req.resolved.vod

You cannot alter this behavior

| Param | Type | Description |
| --- | --- | --- |
| model | `object` | mongoose model |
| options | `object` | options

##### Options

| Key | Type | Description |
| --- | --- | --- |
| paramName | `string` | `req.params` object property key |
| composeCondition | <code>function</code> | callback which will return custom query condition from request params |
| index | <code>string</code> | name of model index to query against (if composeQuery is String) |
| prepareQuery | <code>function</code> | callback, which will alter query according to request query flags |
