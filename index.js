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
 * @param index {string} name of model index to query against (if composeQuery is String)
 * @param composeCondition {function} function which will compose query from params
 * @param paramName {string} name of parameter (by default model name with first letter lowercase)
 * @param prepareQuery {function} callback, which will alter query according to request query flags
 * @returns {function(*, *, *): *}
 */
function resolve(model, { composeCondition = undefined, paramName = undefined, index = 'id', prepareQuery = () => {} } = {}) {
  return async (req, res, next) => {
    const { modelName } = model;
    const propertyName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    paramName = paramName || propertyName;
    req.resolved = req.resolved || {};
    const { resolved, params, flags } = req;
    const condition = typeof composeCondition === 'function' ? composeCondition(params) : { [index]: params[paramName] };
    const query = model.findOne(condition);
    prepareQuery(query, flags);
    resolved[propertyName] = await query.exec();

    return next();
  };
}

module.exports = resolve;
