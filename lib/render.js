/*!
 * xiekai <xk285985285@.qq.com>
 * create: 2020/10/22
 * since: 0.0.1
 */
'use strict';
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Resource = require('pigpen-inject-assets');

module.exports = (ops) => {
  const resource = new Resource(ops);

  const Render = {

    normalizeReactElement(reactElement) {
      return reactElement && reactElement.default ? reactElement.default : reactElement;
    },

    render(name, locals) {
      const reactElement = require(path.join(__dirname, '../build', name));
      const html = Render.renderElement(reactElement, locals);
      return resource.inject(html, name);
    },

    renderElement(reactElement, locals) {
      reactElement = Render.normalizeReactElement(reactElement);
      return Render.renderToString(reactElement, locals);
    },

    renderToString(reactElement, locals) {
      reactElement = Render.normalizeReactElement(reactElement);
      const element = React.createElement(reactElement, locals);
      return ReactDOMServer.renderToString(element);
    }
  };
  return async function ssrRender(ctx, next) {
    ctx.render = Render.render;
    await next();
  };
};
