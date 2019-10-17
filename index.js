/**
 * flexible express middleware which resolves mongoose model by id specified via params and assigns it to req.resolved
 * @module express-mongoose-resolve
 */

/**
 * Configures and returns middleware listener which will resolve model instance from request params and assign it
 * to "req.resolved" Object using lowercase name of the model, so such middleware:
 *
 * ...get('/foo/:vod', resolve(Vod))
 *
 * will save model as req.resolved.vod
 *
 * You cannot alter this behavior
 *
 * @param model {object} mongoose model
 * @param composeQuery {string} name of parameter or callback which will compose query from request params
 * @param index {string} name of model index to query against (if composeQuery is String)
 * @param prepareQuery {function} callback, which will alter query according to request query flags
 * @returns {function(*, *, *): *}
 */
function resolve(model, composeQuery, { index = 'id', prepareQuery = () => {} } = {}) {
  return async (req, res, next) => {
    const { modelName } = model;
    const propertyName = modelName.toLowerCase();
    composeQuery = composeQuery || propertyName;
    req.resolved = req.resolved || {};
    const { resolved, params, flags } = req;
    const criteria = typeof composeQuery === 'string' ? { [index]: params[composeQuery] } : composeQuery(params);
    const query = model.findOne(criteria);
    prepareQuery(query, flags);
    resolved[propertyName] = await query.exec();

    return next();
  };
}

module.exports = resolve;
