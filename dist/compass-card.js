/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function e(e,t,i,n){var o,r=arguments.length,s=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(r<3?o(s):r>3?o(t,i,s):o(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */}const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(e,t,i=null)=>{for(;t!==i;){const i=t.nextSibling;e.removeChild(t),t=i}},n=`{{lit-${String(Math.random()).slice(2)}}}`,o=`\x3c!--${n}--\x3e`,r=new RegExp(`${n}|${o}`);class s{constructor(e,t){this.parts=[],this.element=t;const i=[],o=[],s=document.createTreeWalker(t.content,133,null,!1);let c=0,u=-1,p=0;const{strings:h,values:{length:f}}=e;for(;p<f;){const e=s.nextNode();if(null!==e){if(u++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:i}=t;let n=0;for(let e=0;e<i;e++)a(t[e].name,"$lit$")&&n++;for(;n-- >0;){const t=h[p],i=l.exec(t)[2],n=i.toLowerCase()+"$lit$",o=e.getAttribute(n);e.removeAttribute(n);const s=o.split(r);this.parts.push({type:"attribute",index:u,name:i,strings:s}),p+=s.length-1}}"TEMPLATE"===e.tagName&&(o.push(e),s.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,o=t.split(r),s=o.length-1;for(let t=0;t<s;t++){let i,r=o[t];if(""===r)i=d();else{const e=l.exec(r);null!==e&&a(e[2],"$lit$")&&(r=r.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),i=document.createTextNode(r)}n.insertBefore(i,e),this.parts.push({type:"node",index:++u})}""===o[s]?(n.insertBefore(d(),e),i.push(e)):e.data=o[s],p+=s}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&u!==c||(u++,t.insertBefore(d(),e)),c=u,this.parts.push({type:"node",index:u}),null===e.nextSibling?e.data="":(i.push(e),u--),p++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),p++}}else s.currentNode=o.pop()}for(const e of i)e.parentNode.removeChild(e)}}const a=(e,t)=>{const i=e.length-t.length;return i>=0&&e.slice(i)===t},c=e=>-1!==e.index,d=()=>document.createComment(""),l=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function u(e,t){const{element:{content:i},parts:n}=e,o=document.createTreeWalker(i,133,null,!1);let r=h(n),s=n[r],a=-1,c=0;const d=[];let l=null;for(;o.nextNode();){a++;const e=o.currentNode;for(e.previousSibling===l&&(l=null),t.has(e)&&(d.push(e),null===l&&(l=e)),null!==l&&c++;void 0!==s&&s.index===a;)s.index=null!==l?-1:s.index-c,r=h(n,r),s=n[r]}d.forEach(e=>e.parentNode.removeChild(e))}const p=e=>{let t=11===e.nodeType?0:1;const i=document.createTreeWalker(e,133,null,!1);for(;i.nextNode();)t++;return t},h=(e,t=-1)=>{for(let i=t+1;i<e.length;i++){const t=e[i];if(c(t))return i}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const f=new WeakMap,m=e=>"function"==typeof e&&f.has(e),g={},_={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class v{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this.__parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],n=this.template.parts,o=document.createTreeWalker(e,133,null,!1);let r,s=0,a=0,d=o.nextNode();for(;s<n.length;)if(r=n[s],c(r)){for(;a<r.index;)a++,"TEMPLATE"===d.nodeName&&(i.push(d),o.currentNode=d.content),null===(d=o.nextNode())&&(o.currentNode=i.pop(),d=o.nextNode());if("node"===r.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(d.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(d,r.name,r.strings,this.options));s++}else this.__parts.push(void 0),s++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const S=` ${n} `;class y{constructor(e,t,i,n){this.strings=e,this.values=t,this.type=i,this.processor=n}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let r=0;r<e;r++){const e=this.strings[r],s=e.lastIndexOf("\x3c!--");i=(s>-1||i)&&-1===e.indexOf("--\x3e",s+1);const a=l.exec(e);t+=null===a?e+(i?S:o):e.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+n}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const N=e=>null===e||!("object"==typeof e||"function"==typeof e),b=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class w{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let e=0;e<i.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new E(this)}_getValue(){const e=this.strings,t=e.length-1;let i="";for(let n=0;n<t;n++){i+=e[n];const t=this.parts[n];if(void 0!==t){const e=t.value;if(N(e)||!b(e))i+="string"==typeof e?e:String(e);else for(const t of e)i+="string"==typeof t?t:String(t)}}return i+=e[t],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class E{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===g||N(e)&&e===this.value||(this.value=e,m(e)||(this.committer.dirty=!0))}commit(){for(;m(this.value);){const e=this.value;this.value=g,e(this)}this.value!==g&&this.committer.commit()}}class x{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(d()),this.endNode=e.appendChild(d())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=d()),e.__insert(this.endNode=d())}insertAfterPart(e){e.__insert(this.startNode=d()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}const e=this.__pendingValue;e!==g&&(N(e)?e!==this.value&&this.__commitText(e):e instanceof y?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):b(e)?this.__commitIterable(e):e===_?(this.value=_,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,i="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof v&&this.value.template===t)this.value.update(e.values);else{const i=new v(t,e.processor,this.options),n=i._clone();i.update(e.values),this.__commitNode(n),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,n=0;for(const o of e)i=t[n],void 0===i&&(i=new x(this.options),t.push(i),0===n?i.appendIntoPart(this):i.insertAfterPart(t[n-1])),i.setValue(o),i.commit(),n++;n<t.length&&(t.length=n,this.clear(i&&i.endNode))}clear(e=this.startNode){i(this.startNode.parentNode,e.nextSibling,this.endNode)}}class W{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=g}}class O extends w{constructor(e,t,i){super(e,t,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new P(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class P extends E{}let C=!1;(()=>{try{const e={get capture(){return C=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class k{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=this.__pendingValue,t=this.value,i=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),n=null!=e&&(null==t||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),n&&(this.__options=$(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=g}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const $=e=>e&&(C?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function M(e){let t=V.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},V.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const o=e.strings.join(n);return i=t.keyString.get(o),void 0===i&&(i=new s(e,e.getTemplateElement()),t.keyString.set(o,i)),t.stringsArray.set(e.strings,i),i}const V=new Map,A=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const z=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(e,t,i,n){const o=t[0];if("."===o){return new O(e,t.slice(1),i).parts}if("@"===o)return[new k(e,t.slice(1),n.eventContext)];if("?"===o)return[new W(e,t.slice(1),i)];return new w(e,t,i).parts}handleTextExpression(e){return new x(e)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const T=(e,...t)=>new y(e,t,"html",z)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,D=(e,t)=>`${e}--${t}`;let j=!0;void 0===window.ShadyCSS?j=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),j=!1);const R=e=>t=>{const i=D(t.type,e);let o=V.get(i);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},V.set(i,o));let r=o.stringsArray.get(t.strings);if(void 0!==r)return r;const a=t.strings.join(n);if(r=o.keyString.get(a),void 0===r){const i=t.getTemplateElement();j&&window.ShadyCSS.prepareTemplateDom(i,e),r=new s(t,i),o.keyString.set(a,r)}return o.stringsArray.set(t.strings,r),r},U=["html","svg"],Y=new Set,q=(e,t,i)=>{Y.add(e);const n=i?i.element:document.createElement("template"),o=t.querySelectorAll("style"),{length:r}=o;if(0===r)return void window.ShadyCSS.prepareTemplateStyles(n,e);const s=document.createElement("style");for(let e=0;e<r;e++){const t=o[e];t.parentNode.removeChild(t),s.textContent+=t.textContent}(e=>{U.forEach(t=>{const i=V.get(D(t,e));void 0!==i&&i.keyString.forEach(e=>{const{element:{content:t}}=e,i=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{i.add(e)}),u(e,i)})})})(e);const a=n.content;i?function(e,t,i=null){const{element:{content:n},parts:o}=e;if(null==i)return void n.appendChild(t);const r=document.createTreeWalker(n,133,null,!1);let s=h(o),a=0,c=-1;for(;r.nextNode();){c++;for(r.currentNode===i&&(a=p(t),i.parentNode.insertBefore(t,i));-1!==s&&o[s].index===c;){if(a>0){for(;-1!==s;)o[s].index+=a,s=h(o,s);return}s=h(o,s)}}}(i,s,a.firstChild):a.insertBefore(s,a.firstChild),window.ShadyCSS.prepareTemplateStyles(n,e);const c=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==c)t.insertBefore(c.cloneNode(!0),t.firstChild);else if(i){a.insertBefore(s,a.firstChild);const e=new Set;e.add(s),u(i,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const H={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},Z=(e,t)=>t!==e&&(t==t||e==e),I={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:Z};class F extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,i)=>{const n=this._attributeNameForProperty(i,t);void 0!==n&&(this._attributeToPropertyMap.set(n,i),e.push(n))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=I){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const i="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,i,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(i){const n=this[e];this[t]=i,this._requestUpdate(e,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||I}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const i of t)this.createProperty(i,e[i])}}static _attributeNameForProperty(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=Z){return i(e,t)}static _propertyValueFromAttribute(e,t){const i=t.type,n=t.converter||H,o="function"==typeof n?n:n.fromAttribute;return o?o(e,i):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const i=t.type,n=t.converter;return(n&&n.toAttribute||H.toAttribute)(e,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=I){const n=this.constructor,o=n._attributeNameForProperty(e,i);if(void 0!==o){const e=n._propertyValueToAttribute(t,i);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(o):this.setAttribute(o,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const i=this.constructor,n=i._attributeToPropertyMap.get(e);if(void 0!==n){const e=i.getPropertyOptions(n);this._updateState=16|this._updateState,this[n]=i._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let i=!0;if(void 0!==e){const n=this.constructor,o=n.getPropertyOptions(e);n._valueHasChanged(this[e],t,o.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==o.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,o))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}F.finalized=!0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const L=e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:n}=t;return{kind:i,elements:n,finisher(t){window.customElements.define(e,t)}}})(e,t),B=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?Object.assign(Object.assign({},t),{finisher(i){i.createProperty(t.key,e)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}};function J(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):B(e,t)}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const K="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol();class Q{constructor(e,t){if(t!==G)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const X=(e,...t)=>{const i=t.reduce((t,i,n)=>t+(e=>{if(e instanceof Q)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+e[n+1],e[0]);return new Q(i,G)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const ee={};class te extends F{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(void 0===e)this._styles=[];else if(Array.isArray(e)){const t=(e,i)=>e.reduceRight((e,i)=>Array.isArray(i)?t(i,e):(e.add(i),e),i),i=t(e,new Set),n=[];i.forEach(e=>n.unshift(e)),this._styles=n}else this._styles=[e]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?K?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==ee&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){return ee}}te.finalized=!0,te.render=(e,t,n)=>{if(!n||"object"!=typeof n||!n.scopeName)throw new Error("The `scopeName` option is required.");const o=n.scopeName,r=A.has(t),s=j&&11===t.nodeType&&!!t.host,a=s&&!Y.has(o),c=a?document.createDocumentFragment():t;if(((e,t,n)=>{let o=A.get(t);void 0===o&&(i(t,t.firstChild),A.set(t,o=new x(Object.assign({templateFactory:M},n))),o.appendInto(t)),o.setValue(e),o.commit()})(e,c,Object.assign({templateFactory:R(o)},n)),a){const e=A.get(c);A.delete(c);const n=e.value instanceof v?e.value.template:void 0;q(o,c,n),i(t,t.firstChild),t.appendChild(c),A.set(t,e)}!r&&s&&window.ShadyCSS.styleElement(t.host)};var ie=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,ne="[^\\s]+",oe=/\[([^]*?)\]/gm;function re(e,t){for(var i=[],n=0,o=e.length;n<o;n++)i.push(e[n].substr(0,t));return i}var se=function(e){return function(t,i){var n=i[e].map((function(e){return e.toLowerCase()})).indexOf(t.toLowerCase());return n>-1?n:null}};function ae(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];for(var n=0,o=t;n<o.length;n++){var r=o[n];for(var s in r)e[s]=r[s]}return e}var ce=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],de=["January","February","March","April","May","June","July","August","September","October","November","December"],le=re(de,3),ue={dayNamesShort:re(ce,3),dayNames:ce,monthNamesShort:le,monthNames:de,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},pe=ae({},ue),he=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},fe={D:function(e){return String(e.getDate())},DD:function(e){return he(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return he(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return he(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return he(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return he(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return he(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return he(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return he(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return he(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return he(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return he(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+he(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+he(Math.floor(Math.abs(t)/60),2)+":"+he(Math.abs(t)%60,2)}},me=function(e){return+e-1},ge=[null,"[1-9]\\d?"],_e=[null,ne],ve=["isPm",ne,function(e,t){var i=e.toLowerCase();return i===t.amPm[0]?0:i===t.amPm[1]?1:null}],Se=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var i=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?i:-i}return 0}],ye=(se("monthNamesShort"),se("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var Ne=function(e,t,i){if(void 0===t&&(t=ye.default),void 0===i&&(i={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var n=[];t=(t=ye[t]||t).replace(oe,(function(e,t){return n.push(t),"@@@"}));var o=ae(ae({},pe),i);return(t=t.replace(ie,(function(t){return fe[t](e,o)}))).replace(/@@@/g,(function(){return n.shift()}))},be=(function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}(),{version:"Version",description:"Zeigt einen Kompass mit einem Indikator in Richtung des Entitätswertes an",invalid_configuration:"Ungültige Konfiguration",no_entity:"Entität nicht konfiguriert",offset_not_a_number:"Richtungs-Offset ist keine Zahl",invalid:"ungültig",on:"An",off:"Aus"}),we={name:"Name",optional:"Optional",entity:"Entität",required:"Benötigt",primary:"Richtung",secondary:"Sekundär",indicator:"Indikator",direction:"Richtung",offset:"Offset",show:"Zeige",abbreviations:"Abkürzungen",toggle:"Umschalten",language:"Sprache"},Ee={north:"Norden",east:"Osten",south:"Süden",west:"Westen",N:"N",NNE:"NNO",NE:"NO",ENE:"ONO",E:"O",ESE:"OSO",SE:"SO",SSE:"SSO",S:"S",SSW:"SSW",SW:"SW",WSW:"WSW",W:"W",WNW:"WNW",NW:"NW",NNW:"NNW"},xe={common:be,editor:we,directions:Ee},We={version:"Version",description:"Show a compass with an indicator in the direction of the entity's value",invalid_configuration:"Invalid configuration",no_entity:"Entity not configured",offset_not_a_number:"Direction offset is not a number",invalid:"invalid",on:"On",off:"Off"},Oe={name:"Name",optional:"Optional",entity:"Entity",required:"Required",primary:"Direction",secondary:"Secondary",indicator:"Indicator",direction:"Direction",offset:"Offset",show:"Show",abbreviations:"Abbreviations",toggle:"Toggle",language:"Language"},Pe={north:"North",east:"East",south:"South",west:"West",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSW",SW:"SW",WSW:"WSW",W:"W",WNW:"WNW",NW:"NW",NNW:"NNW"},Ce={common:We,editor:Oe,directions:Pe},ke={version:"Versión",description:"Mostrar una brújula con un indicador en la dirección del valor de la entidad",invalid_configuration:"Configuración inválida",no_entity:"Entidad no configurada",offset_not_a_number:"El desplazamiento de dirección no es un número",invalid:"inválido",on:"Encendido",off:"Apagado"},$e={name:"Nombre",optional:"Opcional",entity:"Entidad",required:"Requerido",primary:"Primario",secondary:"Secundario",indicator:"Indicador",direction:"Dirección",offset:"Desplazamiento",show:"Mostrar",abbreviations:"Abreviaturas",toggle:"Conmutar",language:"Idioma"},Me={north:"Norte",east:"Este",south:"Sur",west:"Oeste",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},Ve={common:ke,editor:$e,directions:Me},Ae={version:"version",description:"Montre une boussole avec un indicateur dans la direction de la valeur de l'entité",invalid_configuration:"configuration non valable",no_entity:"entité non configurée",offset_not_a_number:"Le décalage de direction n'est pas un nombre",invalid:"invalide",on:"allumé",off:"éteint"},ze={name:"Nom",optional:"Facultatif",entity:"entité",required:"obligatoire",primary:"primaire",secondary:"secondaire",indicator:"indicateur",direction:"direction",offset:"décalage",show:"montrer",abbreviations:"abréviations",toggle:"basculer",language:"langue"},Te={north:"Nord",east:"Est",south:"Sud",west:"Ouest",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},De={common:Ae,editor:ze,directions:Te},je={version:"Versione",description:"Mostra una bussola con un indicatore nella direzione indicata dal valore dell'entità.",invalid_configuration:"Configurazione non valida",no_entity:"Entità non configurata",offset_not_a_number:"L'offset della direzione non è un numero.",invalid:"invalido",on:"Acceso",off:"Spento"},Re={name:"Nome",optional:"Opzionale",entity:"Entità",required:"Richiesto",primary:"Direzione",secondary:"Secondario",indicator:"Indicatore",direction:"Direzione",offset:"Compensazione",show:"Mostra",abbreviations:"Abbreviazioni",toggle:"Inverti stato",language:"Lingua"},Ue={north:"Nord",east:"Est",south:"Sud",west:"Ovest",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},Ye={common:je,editor:Re,directions:Ue},qe={version:"Versie",description:"Toon een kompas met een pijl wijzend naar de waarde van de entity",invalid_configuration:"Foutieve configuratie",no_entity:"Entity niet geconfigureerd",offset_not_a_number:"Direction offset is geen nummer",invalid:"ongeldig",on:"Aan",off:"Uit"},He={name:"Naam",optional:"Optioneel",entity:"Entiteit",required:"Noodzakelijk",primary:"Richting",secondary:"Secundaire",indicator:"Wijzer",direction:"Richting",offset:"Afwijking",show:"Toon",abbreviations:"Afkorting",toggle:"Wissel",language:"Taal"},Ze={north:"Noorden",east:"Oosten",south:"Zuiden",west:"Westen",N:"N",NNE:"NNO",NE:"NO",ENE:"ONO",E:"O",ESE:"OZO",SE:"ZO",SSE:"ZZO",S:"Z",SSW:"ZZW",SW:"ZW",WSW:"WZW",W:"W",WNW:"WNW",NW:"NW",NNW:"NNW"},Ie={common:qe,editor:He,directions:Ze},Fe={version:"Versjon",description:"Vis et kompass med en indikator i retning av enhetens verdi",invalid_configuration:"Ugyldig konfigurasjon",no_entity:"Enheten er ikke konfigurert",offset_not_a_number:"Retningsforskyvning er ikke et tall",invalid:"Ugyldig",on:"På",off:"Av"},Le={name:"Navn",optional:"Valgfri",entity:"Enhet",required:"Obligatorisk",primary:"Primær",secondary:"Sekundær",indicator:"Indikator",direction:"Retning",offset:"Offset",show:"Vis",abbreviations:"Forkortelser",toggle:"Veksle",language:"Språk"},Be={north:"Nord",east:"Øst",south:"Sør",west:"Vest",N:"N",NNE:"NNØ",NE:"NØ",ENE:"ØNØ",E:"Ø",ESE:"ØSØ",SE:"SØ",SSE:"SSØ",S:"S",SSW:"SSV",SW:"SV",WSW:"VSV",W:"V",WNW:"VNV",NW:"NV",NNW:"NNV"},Je={common:Fe,editor:Le,directions:Be},Ke={version:"Wersja",description:"Pokazuje kompas ze wskaźnikiem w kierunku wartości encji",invalid_configuration:"Nieprawidłowa konfiguracja",no_entity:"Encja nie została skonfigurowana",offset_not_a_number:"Przesunięcie kierunkowe nie jest liczbą",invalid:"Nieprawidłowy",on:"Włączony",off:"Wyłączony"},Ge={name:"Nazwa",optional:"Opcjonalny",entity:"Encja",required:"Wymagany",primary:"Kierunek",secondary:"Dodatkowa",indicator:"Wskaźnik",direction:"Kierunek",offset:"Przesunięcie",show:"Pokaż",abbreviations:"Skróty",toggle:"Przełącznik",language:"Język"},Qe={north:"Północ",east:"Wschód",south:"Południe",west:"Zachód",N:"Pn",NNE:"Pn Pn Wsch",NE:"Pn Wsch",ENE:"Wsch Pn Wsch",E:"Wsch",ESE:"Wsch Pd Wsch",SE:"Pd Wsch",SSE:"Pd Pd Wsch",S:"Pd",SSW:"Pd Pd Zach",SW:"Pd Zach",WSW:"Zach Pd Zach",W:"Zach",WNW:"Zach Pn Zach",NW:"Pn Zach",NNW:"Pn Pn Zach"},Xe={common:Ke,editor:Ge,directions:Qe},et={version:"versão",description:"Exibe uma bússola com um indicador na direção do valor da entidade",invalid_configuration:"configuração inválida",no_entity:"entidade não configurada",offset_not_a_number:"o offset direcional não é um número",invalid:"inválido",on:"ligado",off:"desligado"},tt={name:"nome",optional:"opcional",entity:"entidade",required:"necessário",primary:"primário",secondary:"secundário",indicator:"indicador",direction:"direção",offset:"offset",show:"mostra",abbreviations:"abreviações",toggle:"alternar",language:"idioma"},it={north:"norte",east:"leste",south:"sul",west:"oeste",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"L",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},nt={common:et,editor:tt,directions:it};const ot={de:Object.freeze({__proto__:null,common:be,editor:we,directions:Ee,default:xe}),en:Object.freeze({__proto__:null,common:We,editor:Oe,directions:Pe,default:Ce}),es:Object.freeze({__proto__:null,common:ke,editor:$e,directions:Me,default:Ve}),fr:Object.freeze({__proto__:null,common:Ae,editor:ze,directions:Te,default:De}),it:Object.freeze({__proto__:null,common:je,editor:Re,directions:Ue,default:Ye}),nl:Object.freeze({__proto__:null,common:qe,editor:He,directions:Ze,default:Ie}),no:Object.freeze({__proto__:null,common:Fe,editor:Le,directions:Be,default:Je}),pl:Object.freeze({__proto__:null,common:Ke,editor:Ge,directions:Qe,default:Xe}),pt:Object.freeze({__proto__:null,common:et,editor:tt,directions:it,default:nt})},rt=[...Object.keys(ot),""].sort();function st(e,t="",i="",n=""){let o;""===n&&(n=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_"));try{o=e.split(".").reduce((e,t)=>e[t],ot[n])}catch(t){o=e.split(".").reduce((e,t)=>e[t],ot.en)}return void 0===o&&(o=e.split(".").reduce((e,t)=>e[t],ot.en)),""!==t&&""!==i&&(o=o.replace(t,i)),o}const at="mdi:compass",ct={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5},dt=[st("directions.N"),st("directions.NNE"),st("directions.NE"),st("directions.ENE"),st("directions.E"),st("directions.ESE"),st("directions.SE"),st("directions.SSE"),st("directions.S"),st("directions.SSW"),st("directions.SW"),st("directions.WSW"),st("directions.W"),st("directions.WNW"),st("directions.NW"),st("directions.NNW")],lt=st("common.invalid"),ut=["arrow_inward","arrow_outward","circle"].sort(),pt=["sensor","input_number","input_text"];let ht=class extends te{setConfig(e){this._config=e}get _name(){return this._config&&this._config.name||""}get _entity(){return this._config&&this._config.entity||""}get _secondary_entity(){return this._config&&this._config.secondary_entity||""}get _direction_offset(){return this._config&&this._config.direction_offset||"0"}get _compass_indicator(){var e,t,i,n;return console.log(null===(t=null===(e=this._config)||void 0===e?void 0:e.compass)||void 0===t?void 0:t.indicator,ut[1]),this._config&&(null===(n=null===(i=this._config)||void 0===i?void 0:i.compass)||void 0===n?void 0:n.indicator)||ut[1]}get _compass_show_north(){var e,t;return this._config&&(null===(t=null===(e=this._config)||void 0===e?void 0:e.compass)||void 0===t?void 0:t.show_north)||!1}get _compass_language(){var e,t;return this._config&&(null===(t=null===(e=this._config)||void 0===e?void 0:e.compass)||void 0===t?void 0:t.language)||""}render(){if(!this.hass)return T``;const e=Object.keys(this.hass.states).filter(e=>pt.includes(e.substr(0,e.indexOf(".")))).sort();return T`
      <div class="card-config">
        <paper-input label="${st("editor.name")} (${st("editor.optional")})" .value=${this._name} .configValue=${"name"} @value-changed=${this._valueChanged}></paper-input>
        <paper-dropdown-menu class="editor-entity-select" label="${st("editor.primary")} ${st("editor.entity")} (${st("editor.required")})" @value-changed=${this._valueChanged} .configValue=${"entity"}>
          <paper-listbox slot="dropdown-content" .selected=${e.indexOf(this._entity)}>
            ${e.map(e=>T` <paper-item>${e}</paper-item> `)}
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu class="editor-entity-select" label="${st("editor.secondary")} ${st("editor.entity")} (${st("editor.optional")})" @value-changed=${this._valueChanged} .configValue=${"secondary_entity"}>
          <paper-listbox slot="dropdown-content" .selected=${e.indexOf(this._secondary_entity)}>
            ${e.map(e=>T` <paper-item>${e}</paper-item> `)}
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu class="editor-entity-select" label="${st("editor.indicator")} (${st("editor.optional")})" @value-changed=${this._valueChanged} .configValue=${"compass.indicator"}>
          <paper-listbox slot="dropdown-content" .selected=${ut.indexOf(this._compass_indicator)}>
            ${ut.map(e=>T` <paper-item>${e}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu
          class="editor-entity-select"
          label="${st("editor.direction")} ${st("editor.abbreviations")} ${st("editor.language")} (${st("editor.optional")})"
          @value-changed=${this._valueChanged}
          .configValue=${"compass.language"}
        >
          <paper-listbox slot="dropdown-content" .selected=${rt.indexOf(this._compass_language)}>
            ${rt.map(e=>T` <paper-item>${e}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-input label="${st("editor.direction")} ${st("editor.offset")} (${st("editor.optional")})" .value=${this._direction_offset} @value-changed=${this._valueChanged} .configValue=${"direction_offset"}></paper-input>
        <div class="floated-label-placeholder">${st("editor.show")} ${st("directions.north")}</div>
        <ha-switch
          aria-label=${`${st("editor.toggle")} ${st("directions.north")} ${this._compass_show_north?st("common.off"):st("common.on")}`}
          .checked=${!1!==this._compass_show_north}
          .configValue=${"compass.show_north"}
          @change=${this._valueChanged}
          >${st("editor.show")} ${st("directions.north")}</ha-switch
        >
      </div>
    `}getValue(e,t){const i=e.configValue.indexOf(".");if(i>-1){const n=e.configValue.substr(0,i),o=e.configValue.substr(i+1,e.configValue.length);return o.indexOf(".")>-1&&this.getValue(e,o),Object.assign(Object.assign({},t),{[n]:Object.assign(Object.assign({},t[n]),{[o]:void 0!==e.checked?e.checked:e.value})})}return Object.assign(Object.assign({},t),{[e.configValue]:void 0!==e.checked?e.checked:e.value})}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(void 0!==t.checked){if(this["_"+t.configValue]===t.checked)return}else if(this["_"+t.configValue]===t.value)return;t.configValue&&(this._config=this.getValue(t,this._config)),function(e,t,i,n){n=n||{},i=null==i?{}:i;var o=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});o.detail=i,e.dispatchEvent(o)}(this,"config-changed",{config:this._config})}static get styles(){return X`
      .editor-entity-select {
        width: 100%;
      }

      ha-switch {
        padding-bottom: 8px;
      }
      .floated-label-placeholder {
        font-family: var(--paper-font-caption_-_font-family);
        -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
        white-space: var(--paper-font-caption_-_white-space);
        overflow: var(--paper-font-caption_-_overflow);
        text-overflow: var(--paper-font-caption_-_text-overflow);
        font-size: var(--paper-font-caption_-_font-size);
        font-weight: var(--paper-font-caption_-_font-weight);
        letter-spacing: var(--paper-font-caption_-_letter-spacing);
        line-height: var(--paper-font-caption_-_line-height);
      }
    `}};var ft;e([J({attribute:!1})],ht.prototype,"hass",void 0),e([J({attribute:!1,hasChanged:null==ft?void 0:ft.hasChanged})],ht.prototype,"_config",void 0),ht=e([L("compass-card-editor")],ht);const mt=X`
  :host ::slotted(.card-content:not(:first-child)),
  slot:not(:first-child)::slotted(.card-content) {
    padding-top: 0px;
    margin-top: -8px;
  }
  :host ::slotted(.card-content) {
    padding: 16px;
  }
  .floated-label-placeholder {
    font-family: var(--paper-font-caption_-_font-family);
    -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
    white-space: var(--paper-font-caption_-_white-space);
    overflow: var(--paper-font-caption_-_overflow);
    text-overflow: var(--paper-font-caption_-_text-overflow);
    font-size: var(--paper-font-caption_-_font-size);
    font-weight: var(--paper-font-caption_-_font-weight);
    letter-spacing: var(--paper-font-caption_-_letter-spacing);
    line-height: var(--paper-font-caption_-_line-height);
    color: var(--disabled-text-color);
  }
  ha-card {
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px 0px;
  }
  .header > .name {
    color: var(--secondary-text-color);
    line-height: 40px;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .icon {
    color: var(--state-icon-color);
    margin-top: 8px;
    float: right;
  }
  .compass {
    padding: 16px;
    display: block;
    width: 120px;
    height: 120px;
    position: relative;
    margin: 0 auto 10px;
    font-family: var(--paper-font-caption_-_font-family);
  }
  .compass > .direction {
    height: 100%;
    width: 100%;
    display: block;
    border-radius: 100%;
    border-width: 3px;
    border-color: var(--primary-color);
    border-style: solid;
    color: var(--primary-text-color);
  }
  .compass > .direction > p {
    text-align: center;
    margin: 0;
    padding: 30% 0 0 0;
    top: 30px;
    width: 100%;
    line-height: normal;
    display: block;
    font-size: 28px;
    font-weight: bold;
  }
  .compass > .direction > p > span {
    display: block;
    line-height: normal;
    font-size: 11px;
    font-weight: normal;
  }
  .compass > .indicator {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    /* substract the direction border width to get correct size */
    right: -3px;
    /* add the direction border width to get correct size */
    top: 3px;
  }
  .compass > .indicator:after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    margin-left: 0;
    z-index: 99;
  }

  .compass > .indicator.arrow_outward:after {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 30px solid var(--accent-color);
    /* substract left+right border width from full size to center */
    left: calc((100% - 16px) / 2);
  }
  .compass > .indicator.arrow_inward:after {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 30px solid var(--accent-color);
    /* substract left+right border width from full size to center */
    left: calc((100% - 16px) / 2);
  }
  .compass > .indicator.circle:after {
    border: 8px solid var(--accent-color);
    margin: 8px;
    border-radius: 50%;
    /* substract 2x border + 2x margin from full size to center */
    left: calc((100% - 32px) / 2);
  }
  .compass > .indicator.north:after {
    color: var(--primary-color);
    content: 'N';
    padding-top: 0px;
    margin: -3px;
    /* substract margin from full size to center */
    left: calc((100% - 3px) / 2);
  }
`;var gt;console.info(`%c  COMPASS-CARD \n%c  ${st("common.version")} 0.3.2    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"compass-card",name:"Compass Card",preview:!0,description:st("common.description")});let _t=gt=class extends te{static async getConfigElement(){return document.createElement("compass-card-editor")}static getStubConfig(){return{entity:"",secondary_entity:"",direction_offset:0,name:"Compass Card"}}setConfig(e){if(!e)throw new Error(st("common.invalid_configuration"));e.test_gui&&function(){var e=document.querySelector("home-assistant");if(e=(e=(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root")){var t=e.lovelace;return t.current_view=e.___curView,t}return null}().setEditMode(!0),this._config=Object.assign({},e)}shouldUpdate(e){if(e.has("_config"))return!0;if(this._config.entity){const t=e.get("hass");if(t&&t.states[this._config.entity]!==this.hass.states[this._config.entity])return!0}if(this._config.secondary_entity){const t=e.get("hass");if(t&&t.states[this._config.secondary_entity]!==this.hass.states[this._config.secondary_entity])return!0}return!1}render(){if(!this._config||!this.hass)return T``;let e=0;Number.isNaN(Number(this._config.direction_offset))||(e=gt.positiveDegrees(+this._config.direction_offset));const t=this.hass.states[this._config.entity],i=this._config.secondary_entity?this.hass.states[this._config.secondary_entity]:void 0,n=t?t.attributes.friendly_name:this._config.entity;return T`
      <ha-card tabindex="0" aria-label=${"Compass: "+n} class="flex">
        ${this.renderHeader()}
        <div class="content">
          ${this.renderCompass(t,i,e)}
        </div>
      </ha-card>
    `}renderCompass(e,t,i){var n,o,r;let s=0,a=st("common.invalid");const c=e?e.state:lt;if(Number.isNaN(Number(c))){if(s=gt.getDegrees(c),a=c,-1===s){const e=c.replace(/\s+/g,"").match(/[+-]?\d+(\.\d)?/);s=(null==e?void 0:e.length)?gt.positiveDegrees(parseFloat(e[0])):0,a=gt.getCompassAbbreviation(s,null===(n=this._config.compass)||void 0===n?void 0:n.language)}}else s=gt.positiveDegrees(parseFloat(c)),a=gt.getCompassAbbreviation(s,null===(o=this._config.compass)||void 0===o?void 0:o.language);return T`
      <div class="compass">
        <div class="direction" style="${this.getConfigStyle(this._config.compass)}">
          <p>
            ${a}
            ${t?T`
                  <span>
                    ${t.state} ${t.attributes.unit_of_measurement}
                  </span>
                `:""}
          </p>
        </div>
        <div class="indicator ${gt.computeIndicator(this._config)}" style="transform: rotate(${(s+i)%360}deg)"></div>
        ${(null===(r=this._config.compass)||void 0===r?void 0:r.show_north)?T`<div class="indicator north" style="transform: rotate(${gt.positiveDegrees(i)}deg)"></div>`:""}
      </div>
    `}getConfigStyle(e){return e&&e.style_css?e.style_css:""}renderHeader(){return this.computeName()?T`
        <div class="header">
          <div class="name">
            <span>${this.computeName()}</span>
          </div>
          <div class="icon">
            <ha-icon .icon=${this.computeIcon()}></ha-icon>
          </div>
        </div>
      `:""}getCardSize(){return 4}computeName(){if(this._config.name&&this._config.name.trim().length>0)return this._config.name}computeIcon(){const e=this.hass.states[this._config.entity];return e&&e.attributes.icon?e.attributes.icon:at}static get styles(){return mt}static computeIndicator(e){return e.compass&&e.compass.indicator&&ut.indexOf(e.compass.indicator)>=0?e.compass.indicator:ut[1]}static getDegrees(e){return ct[e]?ct[e]:-1}static getCompassAbbreviation(e,t){const i=Math.round(gt.positiveDegrees(e)/22.5);let n="N";return i>15&&(n=dt[0]),n=dt[i],st("directions."+n,"","",t)}static positiveDegrees(e){return e<0?e+360*(Math.abs(Math.ceil(e/360))+1):e%360}};e([J({attribute:!1})],_t.prototype,"hass",void 0),e([J({attribute:!1})],_t.prototype,"_config",void 0),_t=gt=e([L("compass-card")],_t);export{_t as CompassCard};
