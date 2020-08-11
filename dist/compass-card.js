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
function e(e,t,i,n){var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o
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
 */}const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(e,t,i=null)=>{for(;t!==i;){const i=t.nextSibling;e.removeChild(t),t=i}},n=`{{lit-${String(Math.random()).slice(2)}}}`,s=`\x3c!--${n}--\x3e`,r=new RegExp(`${n}|${s}`);class o{constructor(e,t){this.parts=[],this.element=t;const i=[],s=[],o=document.createTreeWalker(t.content,133,null,!1);let l=0,p=-1,h=0;const{strings:u,values:{length:m}}=e;for(;h<m;){const e=o.nextNode();if(null!==e){if(p++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:i}=t;let n=0;for(let e=0;e<i;e++)a(t[e].name,"$lit$")&&n++;for(;n-- >0;){const t=u[h],i=d.exec(t)[2],n=i.toLowerCase()+"$lit$",s=e.getAttribute(n);e.removeAttribute(n);const o=s.split(r);this.parts.push({type:"attribute",index:p,name:i,strings:o}),h+=o.length-1}}"TEMPLATE"===e.tagName&&(s.push(e),o.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,s=t.split(r),o=s.length-1;for(let t=0;t<o;t++){let i,r=s[t];if(""===r)i=c();else{const e=d.exec(r);null!==e&&a(e[2],"$lit$")&&(r=r.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),i=document.createTextNode(r)}n.insertBefore(i,e),this.parts.push({type:"node",index:++p})}""===s[o]?(n.insertBefore(c(),e),i.push(e)):e.data=s[o],h+=o}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&p!==l||(p++,t.insertBefore(c(),e)),l=p,this.parts.push({type:"node",index:p}),null===e.nextSibling?e.data="":(i.push(e),p--),h++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),h++}}else o.currentNode=s.pop()}for(const e of i)e.parentNode.removeChild(e)}}const a=(e,t)=>{const i=e.length-t.length;return i>=0&&e.slice(i)===t},l=e=>-1!==e.index,c=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function p(e,t){const{element:{content:i},parts:n}=e,s=document.createTreeWalker(i,133,null,!1);let r=u(n),o=n[r],a=-1,l=0;const c=[];let d=null;for(;s.nextNode();){a++;const e=s.currentNode;for(e.previousSibling===d&&(d=null),t.has(e)&&(c.push(e),null===d&&(d=e)),null!==d&&l++;void 0!==o&&o.index===a;)o.index=null!==d?-1:o.index-l,r=u(n,r),o=n[r]}c.forEach(e=>e.parentNode.removeChild(e))}const h=e=>{let t=11===e.nodeType?0:1;const i=document.createTreeWalker(e,133,null,!1);for(;i.nextNode();)t++;return t},u=(e,t=-1)=>{for(let i=t+1;i<e.length;i++){const t=e[i];if(l(t))return i}return-1};
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
const m=new WeakMap,f=e=>"function"==typeof e&&m.has(e),g={},_={};
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
class y{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this.__parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],n=this.template.parts,s=document.createTreeWalker(e,133,null,!1);let r,o=0,a=0,c=s.nextNode();for(;o<n.length;)if(r=n[o],l(r)){for(;a<r.index;)a++,"TEMPLATE"===c.nodeName&&(i.push(c),s.currentNode=c.content),null===(c=s.nextNode())&&(s.currentNode=i.pop(),c=s.nextNode());if("node"===r.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,r.name,r.strings,this.options));o++}else this.__parts.push(void 0),o++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
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
 */const v=` ${n} `;class b{constructor(e,t,i,n){this.strings=e,this.values=t,this.type=i,this.processor=n}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let r=0;r<e;r++){const e=this.strings[r],o=e.lastIndexOf("\x3c!--");i=(o>-1||i)&&-1===e.indexOf("--\x3e",o+1);const a=d.exec(e);t+=null===a?e+(i?v:s):e.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+n}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}
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
 */const w=e=>null===e||!("object"==typeof e||"function"==typeof e),S=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class x{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let e=0;e<i.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new N(this)}_getValue(){const e=this.strings,t=e.length-1;let i="";for(let n=0;n<t;n++){i+=e[n];const t=this.parts[n];if(void 0!==t){const e=t.value;if(w(e)||!S(e))i+="string"==typeof e?e:String(e);else for(const t of e)i+="string"==typeof t?t:String(t)}}return i+=e[t],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class N{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===g||w(e)&&e===this.value||(this.value=e,f(e)||(this.committer.dirty=!0))}commit(){for(;f(this.value);){const e=this.value;this.value=g,e(this)}this.value!==g&&this.committer.commit()}}class P{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(c()),this.endNode=e.appendChild(c())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=c()),e.__insert(this.endNode=c())}insertAfterPart(e){e.__insert(this.startNode=c()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;f(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}const e=this.__pendingValue;e!==g&&(w(e)?e!==this.value&&this.__commitText(e):e instanceof b?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):S(e)?this.__commitIterable(e):e===_?(this.value=_,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,i="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof y&&this.value.template===t)this.value.update(e.values);else{const i=new y(t,e.processor,this.options),n=i._clone();i.update(e.values),this.__commitNode(n),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,n=0;for(const s of e)i=t[n],void 0===i&&(i=new P(this.options),t.push(i),0===n?i.appendIntoPart(this):i.insertAfterPart(t[n-1])),i.setValue(s),i.commit(),n++;n<t.length&&(t.length=n,this.clear(i&&i.endNode))}clear(e=this.startNode){i(this.startNode.parentNode,e.nextSibling,this.endNode)}}class C{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;f(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=g}}class M extends x{constructor(e,t,i){super(e,t,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new E(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class E extends N{}let k=!1;(()=>{try{const e={get capture(){return k=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class T{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;f(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=this.__pendingValue,t=this.value,i=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),n=null!=e&&(null==t||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),n&&(this.__options=A(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=g}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const A=e=>e&&(k?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
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
 */;function V(e){let t=O.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},O.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const s=e.strings.join(n);return i=t.keyString.get(s),void 0===i&&(i=new o(e,e.getTemplateElement()),t.keyString.set(s,i)),t.stringsArray.set(e.strings,i),i}const O=new Map,D=new WeakMap;
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
class{handleAttributeExpressions(e,t,i,n){const s=t[0];if("."===s){return new M(e,t.slice(1),i).parts}if("@"===s)return[new T(e,t.slice(1),n.eventContext)];if("?"===s)return[new C(e,t.slice(1),i)];return new x(e,t,i).parts}handleTextExpression(e){return new P(e)}};
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const $=(e,...t)=>new b(e,t,"html",z)
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
 */,j=(e,t)=>`${e}--${t}`;let Y=!0;void 0===window.ShadyCSS?Y=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Y=!1);const U=e=>t=>{const i=j(t.type,e);let s=O.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},O.set(i,s));let r=s.stringsArray.get(t.strings);if(void 0!==r)return r;const a=t.strings.join(n);if(r=s.keyString.get(a),void 0===r){const i=t.getTemplateElement();Y&&window.ShadyCSS.prepareTemplateDom(i,e),r=new o(t,i),s.keyString.set(a,r)}return s.stringsArray.set(t.strings,r),r},R=["html","svg"],H=new Set,q=(e,t,i)=>{H.add(e);const n=i?i.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:r}=s;if(0===r)return void window.ShadyCSS.prepareTemplateStyles(n,e);const o=document.createElement("style");for(let e=0;e<r;e++){const t=s[e];t.parentNode.removeChild(t),o.textContent+=t.textContent}(e=>{R.forEach(t=>{const i=O.get(j(t,e));void 0!==i&&i.keyString.forEach(e=>{const{element:{content:t}}=e,i=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{i.add(e)}),p(e,i)})})})(e);const a=n.content;i?function(e,t,i=null){const{element:{content:n},parts:s}=e;if(null==i)return void n.appendChild(t);const r=document.createTreeWalker(n,133,null,!1);let o=u(s),a=0,l=-1;for(;r.nextNode();){l++;for(r.currentNode===i&&(a=h(t),i.parentNode.insertBefore(t,i));-1!==o&&s[o].index===l;){if(a>0){for(;-1!==o;)s[o].index+=a,o=u(s,o);return}o=u(s,o)}}}(i,o,a.firstChild):a.insertBefore(o,a.firstChild),window.ShadyCSS.prepareTemplateStyles(n,e);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(i){a.insertBefore(o,a.firstChild);const e=new Set;e.add(o),p(i,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const F={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},I=(e,t)=>t!==e&&(t==t||e==e),W={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:I};class L extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,i)=>{const n=this._attributeNameForProperty(i,t);void 0!==n&&(this._attributeToPropertyMap.set(n,i),e.push(n))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=W){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const i="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,i,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(i){const n=this[e];this[t]=i,this._requestUpdate(e,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||W}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const i of t)this.createProperty(i,e[i])}}static _attributeNameForProperty(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=I){return i(e,t)}static _propertyValueFromAttribute(e,t){const i=t.type,n=t.converter||F,s="function"==typeof n?n:n.fromAttribute;return s?s(e,i):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const i=t.type,n=t.converter;return(n&&n.toAttribute||F.toAttribute)(e,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=W){const n=this.constructor,s=n._attributeNameForProperty(e,i);if(void 0!==s){const e=n._propertyValueToAttribute(t,i);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(s):this.setAttribute(s,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const i=this.constructor,n=i._attributeToPropertyMap.get(e);if(void 0!==n){const e=i.getPropertyOptions(n);this._updateState=16|this._updateState,this[n]=i._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let i=!0;if(void 0!==e){const n=this.constructor,s=n.getPropertyOptions(e);n._valueHasChanged(this[e],t,s.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==s.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,s))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}L.finalized=!0;
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
const B=e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:n}=t;return{kind:i,elements:n,finisher(t){window.customElements.define(e,t)}}})(e,t),J=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?Object.assign(Object.assign({},t),{finisher(i){i.createProperty(t.key,e)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}};function Z(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):J(e,t)}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const X="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol();class K{constructor(e,t){if(t!==G)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(X?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const Q=(e,...t)=>{const i=t.reduce((t,i,n)=>t+(e=>{if(e instanceof K)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+e[n+1],e[0]);return new K(i,G)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const ee={};class te extends L{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(void 0===e)this._styles=[];else if(Array.isArray(e)){const t=(e,i)=>e.reduceRight((e,i)=>Array.isArray(i)?t(i,e):(e.add(i),e),i),i=t(e,new Set),n=[];i.forEach(e=>n.unshift(e)),this._styles=n}else this._styles=[e]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?X?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==ee&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){return ee}}te.finalized=!0,te.render=(e,t,n)=>{if(!n||"object"!=typeof n||!n.scopeName)throw new Error("The `scopeName` option is required.");const s=n.scopeName,r=D.has(t),o=Y&&11===t.nodeType&&!!t.host,a=o&&!H.has(s),l=a?document.createDocumentFragment():t;if(((e,t,n)=>{let s=D.get(t);void 0===s&&(i(t,t.firstChild),D.set(t,s=new P(Object.assign({templateFactory:V},n))),s.appendInto(t)),s.setValue(e),s.commit()})(e,l,Object.assign({templateFactory:U(s)},n)),a){const e=D.get(l);D.delete(l);const n=e.value instanceof y?e.value.template:void 0;q(s,l,n),i(t,t.firstChild),t.appendChild(l),D.set(t,e)}!r&&o&&window.ShadyCSS.styleElement(t.host)};var ie=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,ne="[^\\s]+",se=/\[([^]*?)\]/gm;function re(e,t){for(var i=[],n=0,s=e.length;n<s;n++)i.push(e[n].substr(0,t));return i}var oe=function(e){return function(t,i){var n=i[e].map((function(e){return e.toLowerCase()})).indexOf(t.toLowerCase());return n>-1?n:null}};function ae(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];for(var n=0,s=t;n<s.length;n++){var r=s[n];for(var o in r)e[o]=r[o]}return e}var le=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ce=["January","February","March","April","May","June","July","August","September","October","November","December"],de=re(ce,3),pe={dayNamesShort:re(le,3),dayNames:le,monthNamesShort:de,monthNames:ce,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},he=ae({},pe),ue=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},me={D:function(e){return String(e.getDate())},DD:function(e){return ue(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return ue(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return ue(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return ue(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return ue(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return ue(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return ue(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return ue(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return ue(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return ue(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return ue(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ue(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ue(Math.floor(Math.abs(t)/60),2)+":"+ue(Math.abs(t)%60,2)}},fe=function(e){return+e-1},ge=[null,"[1-9]\\d?"],_e=[null,ne],ye=["isPm",ne,function(e,t){var i=e.toLowerCase();return i===t.amPm[0]?0:i===t.amPm[1]?1:null}],ve=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var i=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?i:-i}return 0}],be=(oe("monthNamesShort"),oe("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var we=function(e,t,i){if(void 0===t&&(t=be.default),void 0===i&&(i={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var n=[];t=(t=be[t]||t).replace(se,(function(e,t){return n.push(t),"@@@"}));var s=ae(ae({},he),i);return(t=t.replace(ie,(function(t){return me[t](e,s)}))).replace(/@@@/g,(function(){return n.shift()}))};(function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}})(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}();let Se=class extends te{setConfig(e){this._config=e}get _name(){return this._config&&this._config.name||""}get _entity(){return this._config&&this._config.entity||""}get _secondary_entity(){return this._config&&this._config.secondary_entity||""}get _direction_offset(){return this._config&&this._config.direction_offset||"0"}render(){if(!this.hass)return $``;const e=Object.keys(this.hass.states);return $`
      <div class="card-config">
        <div class="values">
          <paper-input
            label="Name (Optional)"
            .value=${this._name}
            .configValue=${"name"}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div class="values">
          <paper-dropdown-menu
            label="Direction Entity (Required)"
            @value-changed=${this._valueChanged}
            .configValue=${"entity"}
          >
            <paper-listbox slot="dropdown-content" .selected=${e.indexOf(this._entity)}>
              ${e.map(e=>$` <paper-item>${e}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class="values">
          <paper-dropdown-menu
            label="Secondary Entity (Required)"
            @value-changed=${this._valueChanged}
            .configValue=${"secondary_entity"}
          >
            <paper-listbox slot="dropdown-content" .selected=${e.indexOf(this._secondary_entity)}>
              ${e.map(e=>$` <paper-item>${e}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class="values">
          <paper-input
            label="Direction offset (Optional)"
            .value=${this._direction_offset}
            @value-changed=${this._valueChanged}
            .configValue=${"direction_offset"}
          ></paper-input>
        </div>
      </div>
    `}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;this["_"+t.configValue]!==t.value&&(t.configValue&&(""===t.value?delete this._config[t.configValue]:this._config=Object.assign(Object.assign({},this._config),{[t.configValue]:void 0!==t.checked?t.checked:t.value})),function(e,t,i,n){n=n||{},i=null==i?{}:i;var s=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});s.detail=i,e.dispatchEvent(s)}(this,"config-changed",{config:this._config}))}static get styles(){return Q`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
      }
      ha-switch {
        padding-bottom: 8px;
      }
    `}};e([Z()],Se.prototype,"hass",void 0),e([Z()],Se.prototype,"_config",void 0),Se=e([B("compass-card-editor")],Se);const xe=Q`
  :host {
    display: flex;
    flex-direction: column;
  }
  ha-card {
    flex-direction: column;
    flex: 1;
    padding: 16px 0;
    position: relative;
    overflow: hidden;
  }
  ha-card > div {
    padding: 0px 16px 16px 16px;
  }
  ha-card > div:last-child {
    padding-bottom: 0;
  }
  ha-card[points] .line--points,
  ha-card[labels] .graph__labels.--primary {
    opacity: 0;
    transition: opacity 0.25s;
    animation: none;
  }
  ha-card[labels-secondary] .graph__labels.--secondary {
    opacity: 0;
    transition: opacity 0.25s;
    animation: none;
  }
  /* ha-card:hover .graph__labels.--primary,
  ha-card:hover .graph__labels.--secondary, */
  ha-card[points]:hover .line--points {
    opacity: 1;
  }
  ha-card[fill] {
    padding-bottom: 0;
  }
  ha-card[fill] .graph {
    padding: 0;
    order: 10;
  }
  ha-card[fill] path {
    stroke-linecap: initial;
    stroke-linejoin: initial;
  }
  ha-card[fill] .graph__legend {
    order: -1;
    padding: 0 16px 8px 16px;
  }
  ha-card[fill] .info {
    padding-bottom: 16px;
  }
  ha-card[group] {
    box-shadow: none;
    padding: 0;
  }
  ha-card[group] > div {
    padding-left: 0;
    padding-right: 0;
  }
  ha-card[group] .graph__legend {
    padding-left: 0;
    padding-right: 0;
  }
  /* ha-card[hover] {
    cursor: pointer;
  } */
  .flex {
    display: flex;
    display: -webkit-flex;
    min-width: 0;
  }
  .header {
    justify-content: space-between;
    color: var(--ha-card-header-color, --primary-text-color);
  }
  .header[loc='center'] {
    justify-content: space-around;
  }
  .header[loc='left'] {
    align-self: flex-start;
  }
  .header[loc='right'] {
    align-self: flex-end;
  }
  .name {
    align-items: center;
    min-width: 0;
    letter-spacing: var(--mcg-title-letter-spacing, normal);
  }
  .name > span {
    font-size: 1.2em;
    font-weight: var(--mcg-title-font-weight, 500);
    max-height: 1.4em;
    min-height: 1.4em;
    opacity: 0.65;
  }
  .icon {
    color: var(--paper-item-icon-color, #44739e);
    display: inline-block;
    flex: 0 0 1.7em;
    text-align: center;
  }
  .icon > ha-icon {
    height: 1.7em;
    width: 1.7em;
  }
  .icon[loc='left'] {
    order: -1;
    margin-right: 0.6em;
    margin-left: 0;
  }
  .icon[loc='state'] {
    align-self: center;
  }
  .states {
    align-items: flex-start;
    font-weight: 300;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
  .states .icon {
    align-self: center;
    margin-left: 0;
  }
  .states[loc='center'] {
    justify-content: space-evenly;
  }
  .states[loc='right'] > .state {
    margin-left: auto;
    order: 2;
  }
  .states[loc='center'] .states--secondary,
  .states[loc='right'] .states--secondary {
    margin-left: 0;
  }
  .states[loc='center'] .states--secondary {
    align-items: center;
  }
  .states[loc='right'] .states--secondary {
    align-items: flex-start;
  }
  .states[loc='center'] .state__time {
    left: 50%;
    transform: translateX(-50%);
  }
  .states > .icon > ha-icon {
    height: 2em !important;
    width: 2em !important;
  }
  .states--secondary {
    display: flex;
    flex-flow: column;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-left: 1rem;
    min-width: 0;
    margin-left: 1.4em;
  }
  .states--secondary:empty {
    display: none;
  }
  .state {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    max-width: 100%;
    min-width: 0;
  }
  .state--small {
    font-size: 0.6em;
    margin-bottom: 0.6rem;
    flex-wrap: nowrap;
  }
  .state--small > svg {
    position: absolute;
    left: -1.6em;
    align-self: center;
    height: 1em;
    width: 1em;
    border-radius: 100%;
    margin-right: 1em;
  }
  .state--small:last-child {
    margin-bottom: 0;
  }
  .states--secondary > :only-child {
    font-size: 1em;
    margin-bottom: 0;
  }
  .states--secondary > :only-child svg {
    display: none;
  }
  .state__value {
    display: inline-block;
    font-size: 2.4em;
    margin-right: 0.25rem;
    line-height: 1.2em;
  }
  .state__uom {
    flex: 1;
    align-self: flex-end;
    display: inline-block;
    font-size: 1.4em;
    font-weight: 400;
    line-height: 1.6em;
    margin-top: 0.1em;
    opacity: 0.6;
    vertical-align: bottom;
  }
  .state--small .state__uom {
    flex: 1;
  }
  .state__time {
    font-size: 0.95rem;
    font-weight: 500;
    bottom: -1.1rem;
    left: 0;
    opacity: 0.75;
    position: absolute;
    white-space: nowrap;
    animation: fade 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .states[loc='right'] .state__time {
    left: initial;
    right: 0;
  }
  .graph {
    align-self: flex-end;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-top: auto;
    width: 100%;
  }
  .graph__container {
    display: flex;
    flex-direction: row;
    position: relative;
  }
  .graph__container__svg {
    cursor: default;
    flex: 1;
  }
  svg {
    overflow: hidden;
    display: block;
  }
  path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .fill[anim='false'] {
    animation: reveal 0.25s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .fill[anim='false'][type='fade'] {
    animation: reveal-2 0.25s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .line--points[anim='false'],
  .line[anim='false'] {
    animation: pop 0.25s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .line--points[inactive],
  .line--rect[inactive],
  .fill--rect[inactive] {
    opacity: 0 !important;
    animation: none !important;
    transition: all 0.15s !important;
  }
  .line--points[tooltip] .line--point[inactive] {
    opacity: 0;
  }
  .line--point {
    cursor: pointer;
    fill: var(--primary-background-color, white);
    stroke-width: inherit;
  }
  .line--point:hover {
    fill: var(--mcg-hover, inherit) !important;
  }
  .bars {
    animation: pop 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .bars[anim] {
    animation: bars 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .bar {
    transition: opacity 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .bar:hover {
    opacity: 0.5;
    cursor: pointer;
  }
  ha-card[gradient] .line--point:hover {
    fill: var(--primary-text-color, white);
  }
  path,
  .line--points,
  .fill {
    opacity: 0;
  }
  .line--points[anim='true'][init] {
    animation: pop 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .fill[anim='true'][init] {
    animation: reveal 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .fill[anim='true'][init][type='fade'] {
    animation: reveal-2 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .line[anim='true'][init] {
    animation: dash 1s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .graph__labels.--secondary {
    right: 0;
    margin-right: 0px;
  }
  .graph__labels {
    align-items: flex-start;
    flex-direction: column;
    font-size: calc(0.15em + 8.5px);
    font-weight: 400;
    justify-content: space-between;
    margin-right: 10px;
    padding: 0.6em;
    position: absolute;
    pointer-events: none;
    top: 0;
    bottom: 0;
    opacity: 0.75;
  }
  .graph__labels > span {
    cursor: pointer;
    background: var(--primary-background-color, white);
    border-radius: 1em;
    padding: 0.2em 0.6em;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  .graph__legend {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding-top: 16px;
    flex-wrap: wrap;
  }
  .graph__legend__item {
    cursor: pointer;
    display: flex;
    min-width: 0;
    margin: 0.4em;
    align-items: center;
  }
  .graph__legend__item span {
    opacity: 0.75;
    margin-left: 0.4em;
  }
  .graph__legend__item svg {
    border-radius: 100%;
    min-width: 10px;
  }
  .info {
    justify-content: space-between;
    align-items: middle;
  }
  .info__item {
    display: flex;
    flex-flow: column;
    text-align: center;
  }
  .info__item:last-child {
    align-items: flex-end;
    text-align: right;
  }
  .info__item:first-child {
    align-items: flex-start;
    text-align: left;
  }
  .info__item__type {
    text-transform: capitalize;
    font-weight: 500;
    opacity: 0.9;
  }
  .info__item__time,
  .info__item__value {
    opacity: 0.75;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @keyframes fade {
    0% {
      opacity: 0;
    }
  }
  @keyframes reveal {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.15;
    }
  }
  @keyframes reveal-2 {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.4;
    }
  }
  @keyframes pop {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes bars {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes dash {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }
  .compass {
    display: block;
    width: 120px;
    height: 120px;
    position: relative;
    margin: 0 auto;
  }
  .compass > .direction {
    height: 100%;
    width: 100%;
    display: block;
    background: var(--primary-background-color);
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
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 30px solid var(--success-color);
    position: absolute;
    margin-left: 0;
    /* substract left+right border width from full size to center */
    left: calc((100% - 16px) / 2);
    z-index: 99;
  }
`;var Ne={version:"Version",description:"Show a compass with an indicator in the direction of the entity's value",invalid_configuration:"Invalid configuration",no_entity:"Entity not configured",offset_not_a_number:"Direction offset is not a number",invalid:"invalid"},Pe={common:Ne},Ce={version:"Versie",description:"Toon een kompas met een pijl wijzend naar de waarde van de entity",invalid_configuration:"Foutieve configuratie",no_entity:"Entity niet geconfigureerd",offset_not_a_number:"Direction offset is geen nummer",invalid:"ongeldig"},Me={common:Ce};const Ee={en:Object.freeze({__proto__:null,common:Ne,default:Pe}),nl:Object.freeze({__proto__:null,common:Ce,default:Me})};function ke(e,t="",i=""){const n=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=e.split(".").reduce((e,t)=>e[t],Ee[n])}catch(t){s=e.split(".").reduce((e,t)=>e[t],Ee.en)}return void 0===s&&(s=e.split(".").reduce((e,t)=>e[t],Ee.en)),""!==t&&""!==i&&(s=s.replace(t,i)),s}const Te="mdi:compass",Ae={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5},Ve=Object.keys(Ae),Oe=ke("common.invalid");var De;console.info(`%c  COMPASS-CARD \n%c  ${ke("common.version")} 0.0.5    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"compass-card",name:"Compass Card",preview:!0,description:ke("common.description")});let ze=De=class extends te{static async getConfigElement(){return document.createElement("compass-card-editor")}static getStubConfig(){return{entity:"",secondary_entity:"",direction_offset:0,name:"Compass Card"}}setConfig(e){if(!e)throw new Error(ke("common.invalid_configuration"));e.test_gui&&function(){var e=document.querySelector("home-assistant");if(e=(e=(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root")){var t=e.lovelace;return t.current_view=e.___curView,t}return null}().setEditMode(!0),this._config=Object.assign({},e)}shouldUpdate(e){if(e.has("_config"))return!0;if(this._config.entity){const t=e.get("hass");if(t&&t.states[this._config.entity]!==this.hass.states[this._config.entity])return!0}if(this._config.secondary_entity){const t=e.get("hass");if(t&&t.states[this._config.secondary_entity]!==this.hass.states[this._config.secondary_entity])return!0}return!1}render(){if(!this._config||!this.hass)return $``;let e=0;Number.isNaN(Number(this._config.direction_offset))||(e=+this._config.direction_offset<0?+this._config.direction_offset+360*(Math.abs(Math.ceil(+this._config.direction_offset/360))+1):+this._config.direction_offset);const t=this.hass.states[this._config.entity],i=this._config.secondary_entity?this.hass.states[this._config.secondary_entity]:void 0,n=t?t.attributes.friendly_name:this._config.entity;return $`
      <ha-card tabindex="0" aria-label=${"Compass: "+n} class="flex" style="font-size: 14px;">
        ${this.renderHeader(t)}${this.renderCompass(t,i,e)}
      </ha-card>
    `}renderCompass(e,t,i){let n=0,s=ke("common.invalid");const r=e?e.state:Oe;return Number.isNaN(Number(r))?(n=De.get_degrees(r),s=r):(n=parseFloat(r),s=De.get_compass_point(n)),$`
      <div class="compass" style="padding: 16px;">
        <div class="direction">
          <p>
            ${s}
            ${t?$`
                  <span>
                    ${t.state} ${t.attributes.unit_of_measurement}
                  </span>
                `:""}
          </p>
        </div>
        <div class="indicator" style="transform: rotate(${(n+i)%360}deg)"></div>
      </div>
    `}renderHeader(e){return this.computeName()?$`
        <div class="header flex" style="font-size: ${14}px;">
          ${this.renderName()} ${this.renderIcon(e)}
        </div>
      `:""}renderIcon(e){return $`
      <div class="icon" }>
        <ha-icon .icon=${this.computeIcon(e)}></ha-icon>
      </div>
    `}renderName(){return $`
      <div class="name flex">
        <span class="ellipsis">${this.computeName()}</span>
      </div>
    `}getCardSize(){return 4}computeName(){if(this._config.name&&this._config.name.trim().length>0)return this._config.name}computeIcon(e){return e&&e.attributes.icon?e.attributes.icon:Te}static get styles(){return xe}static get_degrees(e){return Ae[e]?Ae[e]:0}static get_compass_point(e){const t=e<0?e+360*(Math.abs(Math.ceil(e/360))+1):e,i=Math.round(t%360/22.5);return i>15?Ve[0]:Ve[i]}};e([Z()],ze.prototype,"hass",void 0),e([Z()],ze.prototype,"_config",void 0),ze=De=e([B("compass-card")],ze);export{ze as CompassCard};
