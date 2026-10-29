"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/code.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.regexpCode = exports2.getEsmExportName = exports2.getProperty = exports2.safeStringify = exports2.stringify = exports2.strConcat = exports2.addCodeArg = exports2.str = exports2._ = exports2.nil = exports2._Code = exports2.Name = exports2.IDENTIFIER = exports2._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports2._CodeOrName = _CodeOrName;
    exports2.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports2.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports2.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a2;
        return (_a2 = this._str) !== null && _a2 !== void 0 ? _a2 : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a2;
        return (_a2 = this._names) !== null && _a2 !== void 0 ? _a2 : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports2._Code = _Code;
    exports2.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports2._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports2.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports2.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports2.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify2(x) {
      return new _Code(safeStringify(x));
    }
    exports2.stringify = stringify2;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports2.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports2.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports2.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports2.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports2.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports2.regexpCode = regexpCode;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/scope.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ValueScope = exports2.ValueScopeName = exports2.Scope = exports2.varKinds = exports2.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports2.UsedValueState = UsedValueState = {}));
    exports2.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent: parent2 } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent2;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a2, _b;
        if (((_b = (_a2 = this._parent) === null || _a2 === void 0 ? void 0 : _a2._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports2.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports2.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a2;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a2 = value.key) !== null && _a2 !== void 0 ? _a2 : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports2.varKinds.var : exports2.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports2.ValueScope = ValueScope;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.or = exports2.and = exports2.not = exports2.CodeGen = exports2.operators = exports2.varKinds = exports2.ValueScopeName = exports2.ValueScope = exports2.Scope = exports2.Name = exports2.regexpCode = exports2.stringify = exports2.getProperty = exports2.nil = exports2.strConcat = exports2.str = exports2._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports2, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports2, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports2, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports2, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports2, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports2, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports2, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports2, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports2, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports2, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports2, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports2.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node2 = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node2 {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node2 {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node2 {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node2 {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node2 {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node2 {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node2 {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root2 = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not2(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a2;
        this.else = (_a2 = this.else) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a2, _b;
        super.optimizeNodes();
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a2, _b;
        super.optimizeNames(names, constants);
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root2()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports2.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports2.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not2(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports2.not = not2;
    var andCode = mappend(exports2.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports2.and = and;
    var orCode = mappend(exports2.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports2.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.checkStrictMode = exports2.getErrorPath = exports2.Type = exports2.useFunc = exports2.setEvaluated = exports2.evaluatedPropsToName = exports2.mergeEvaluated = exports2.eachItem = exports2.unescapeJsonPointer = exports2.escapeJsonPointer = exports2.escapeFragment = exports2.unescapeFragment = exports2.schemaRefOrVal = exports2.schemaHasRulesButRef = exports2.schemaHasRules = exports2.checkUnknownRules = exports2.alwaysValidSchema = exports2.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports2.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports2.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports2.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports2.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports2.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports2.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports2.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports2.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports2.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports2.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports2.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports2.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports2.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports2.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports2.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports2.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber3 = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber3 ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber3 ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports2.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports2.checkStrictMode = checkStrictMode;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/names.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports2.default = names;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.extendErrors = exports2.resetErrorsCount = exports2.reportExtraError = exports2.reportError = exports2.keyword$DataError = exports2.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports2.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports2.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports2.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports2.reportError = reportError;
    function reportExtraError(cxt, error = exports2.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports2.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports2.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data: data2, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data2);
        }
      });
    }
    exports2.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data: data2, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data2]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.boolOrEmptySchema = exports2.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports2.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports2.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data: data2 } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data: data2,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/rules.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getRules = exports2.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports2.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports2.getRules = getRules;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/applicability.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.shouldUseRule = exports2.shouldUseGroup = exports2.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports2.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports2.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a2;
      return schema[rule.keyword] !== void 0 || ((_a2 = rule.definition.implements) === null || _a2 === void 0 ? void 0 : _a2.some((kwd) => schema[kwd] !== void 0));
    }
    exports2.shouldUseRule = shouldUseRule;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/dataType.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.reportTypeError = exports2.checkDataTypes = exports2.checkDataType = exports2.coerceAndCheckDataType = exports2.getJSONTypes = exports2.getSchemaTypes = exports2.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports2.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports2.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports2.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data: data2, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data2, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports2.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data: data2, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data2}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data2}) && ${data2}.length == 1`, () => gen.assign(data2, (0, codegen_1._)`${data2}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data2}`).if(checkDataTypes(types, data2, opts.strictNumbers), () => gen.assign(coerced, data2)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data2, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data2}`).elseIf((0, codegen_1._)`${data2} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data2} === null
              || (${dataType} == "string" && ${data2} && ${data2} == +${data2})`).assign(coerced, (0, codegen_1._)`+${data2}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data2} === null
              || (${dataType} === "string" && ${data2} && ${data2} == +${data2} && !(${data2} % 1))`).assign(coerced, (0, codegen_1._)`+${data2}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data2} === "false" || ${data2} === 0 || ${data2} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data2} === "true" || ${data2} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data2} === "" || ${data2} === 0 || ${data2} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data2} === null`).assign(coerced, (0, codegen_1._)`[${data2}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data2, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data2} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data2})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data2} && typeof ${data2} == "object" && !Array.isArray(${data2})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data2} % 1) && !isNaN(${data2})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data2} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data2} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data2})` : codegen_1.nil);
      }
    }
    exports2.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data2, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data2, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data2} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data2} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data2, strictNums, correct));
      return cond;
    }
    exports2.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports2.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data: data2, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data: data2,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/defaults.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports2.assignDefaults = assignDefaults;
    function assignDefault(it, prop2, defaultValue) {
      const { gen, compositeRule, data: data2, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data2}${(0, codegen_1.getProperty)(prop2)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/code.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateUnion = exports2.validateArray = exports2.usePattern = exports2.callValidateCode = exports2.schemaProperties = exports2.allSchemaProperties = exports2.noPropertyInData = exports2.propertyInData = exports2.isOwnProperty = exports2.hasPropFunc = exports2.reportMissingProp = exports2.checkMissingProp = exports2.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop2) {
      const { gen, data: data2, it } = cxt;
      gen.if(noPropertyInData(gen, data2, prop2, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop2}` }, true);
        cxt.error();
      });
    }
    exports2.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data: data2, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop2) => (0, codegen_1.and)(noPropertyInData(gen, data2, prop2, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop2}`)));
    }
    exports2.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports2.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports2.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data2, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data2}, ${property})`;
    }
    exports2.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data2, property, ownProperties) {
      const cond = (0, codegen_1._)`${data2}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data2, property)}` : cond;
    }
    exports2.propertyInData = propertyInData;
    function noPropertyInData(gen, data2, property, ownProperties) {
      const cond = (0, codegen_1._)`${data2}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data2, property))) : cond;
    }
    exports2.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports2.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports2.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data: data2, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data2}, ${topSchemaRef}${schemaPath}` : data2;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports2.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports2.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data: data2, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data2}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports2.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports2.validateUnion = validateUnion;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/keyword.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateKeywordUsage = exports2.validSchemaType = exports2.funcKeywordCode = exports2.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports2.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a2;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a3;
        gen.if((0, codegen_1.not)((_a3 = def.valid) !== null && _a3 !== void 0 ? _a3 : valid), errors);
      }
    }
    exports2.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data: data2, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data2, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports2.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports2.validateKeywordUsage = validateKeywordUsage;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/subschema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.extendSubschemaMode = exports2.extendSubschemaData = exports2.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports2.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data: data2, dataTypes, propertyName }) {
      if (data2 !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data2 !== void 0) {
        const nextData = data2 instanceof codegen_1.Name ? data2 : gen.let("data", data2, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports2.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports2.extendSubschemaMode = extendSubschemaMode;
  }
});

// ../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../node_modules/.pnpm/json-schema-traverse@1.0.0/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "../../node_modules/.pnpm/json-schema-traverse@1.0.0/node_modules/json-schema-traverse/index.js"(exports2, module2) {
    "use strict";
    var traverse = module2.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop2 in sch)
                _traverse(opts, pre, post, sch[prop2], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop2), rootSchema, jsonPtr, key, schema, prop2);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/resolve.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getSchemaRefs = exports2.resolveUrl = exports2.normalizeId = exports2._getFullPath = exports2.getFullPath = exports2.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports2.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports2.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports2._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports2.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports2.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports2.getSchemaRefs = getSchemaRefs;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getData = exports2.KeywordCxt = exports2.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports2.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data: data2, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data2, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append3, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append3, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append3, errorPaths);
      }
      _error(append3, errorPaths) {
        ;
        (append3 ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports2.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data2;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data2 = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data2 = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data2;
      }
      let expr = data2;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data2 = (0, codegen_1._)`${data2}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data2}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports2.getData = getData;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/validation_error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports2.default = ValidationError;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/ref_error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports2.default = MissingRefError;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveSchema = exports2.getCompilingSchema = exports2.resolveRef = exports2.compileSchema = exports2.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a2;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a2 = env.baseId) !== null && _a2 !== void 0 ? _a2 : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports2.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports2.compileSchema = compileSchema;
    function resolveRef(root2, baseId, ref) {
      var _a2;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root2.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root2, ref);
      if (_sch === void 0) {
        const schema = (_a2 = root2.localRefs) === null || _a2 === void 0 ? void 0 : _a2[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root: root2, baseId });
      }
      if (_sch === void 0)
        return;
      return root2.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports2.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports2.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root2, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root2, ref);
    }
    function resolveSchema(root2, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root2.baseId, void 0);
      if (Object.keys(root2.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root2);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root2, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root: root2, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports2.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root: root2 }) {
      var _a2;
      if (((_a2 = parsedRef.fragment) === null || _a2 === void 0 ? void 0 : _a2[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root2, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root: root2, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/data.json"(exports2, module2) {
    module2.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// ../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/lib/utils.js"(exports2, module2) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isPort = RegExp.prototype.test.bind(/^\d*$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head = hextets.slice(0, bestStart).join(":");
      const tail = hextets.slice(bestStart + bestLength).join(":");
      return head + "::" + tail;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed) return { host, isIPV6: false, error: true };
      let input = bracketed ? host.slice(1, -1) : host;
      if (bracketed && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path2) {
      let input = path2;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    function removeDotSegmentsRelative(path2) {
      if (path2 === "" || path2[0] === "/") {
        return removeDotSegments(path2);
      }
      const segments = path2.split("/");
      const last2 = segments.length - 1;
      const output = [];
      let trailingDirectory = false;
      for (let i = 0; i <= last2; i++) {
        const segment = segments[i];
        if (segment === "." || segment === "..") {
          if (segment === "..") {
            if (output.length !== 0 && output[output.length - 1] !== "..") {
              output.pop();
            } else {
              output.push("..");
            }
          }
          trailingDirectory = i === last2;
        } else {
          output.push(segment);
        }
      }
      if (trailingDirectory && output[output.length - 1] !== "..") {
        output.push("");
      }
      if (output.length === 0 || output[0] === "" || output[0].includes(":")) {
        output.unshift(".");
      }
      return output.join("/");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        const port = String(component.port);
        if (!isPort(port)) {
          throw new TypeError("URI port is malformed.");
        }
        uriTokens.push(":");
        uriTokens.push(port);
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module2.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      removeDotSegmentsRelative,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// ../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/lib/schemes.js"(exports2, module2) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path2 = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path2 && path2 !== "/" ? path2 : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module2.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// ../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "../../node_modules/.pnpm/fast-uri@3.1.9/node_modules/fast-uri/index.js"(exports2, module2) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    var MALFORMED_HOST_ERROR = "URI host is malformed.";
    var FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
    function validateScheme(scheme) {
      const stringScheme = String(scheme);
      if (!VALID_SCHEME.test(stringScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return stringScheme;
    }
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse4(serialize2(uri, options), options);
      }
      return uri;
    }
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) {
        throw new Error(MALFORMED_HOST_ERROR);
      }
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !new RegExp("\\P{ASCII}", "u").test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize2(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse4(serialize2(base, options), options);
        relative = parse4(serialize2(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              const baseHasAuthority = base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0;
              if (baseHasAuthority && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = base.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize2(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = validateScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
      const pathNoScheme = !options.skipEscape && schemelessReference;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = validateScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
        }
        if (schemelessReference) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function isIPLiteral(host) {
      return host[0] === "[" && host[host.length - 1] === "]";
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP) {
      if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP)) {
        parsed.error = parsed.error || MALFORMED_HOST_ERROR;
        return true;
      }
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
        let url;
        try {
          url = new URL("http://" + parsed.host);
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
        if (!isHostOnlyURL(url)) {
          parsed.error = parsed.error || MALFORMED_HOST_ERROR;
          return true;
        }
        parsed.host = url.hostname;
      }
      return false;
    }
    function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP) {
      return Boolean(
        parsed.host && isIP === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host)
      );
    }
    function isHostOnlyURL(url) {
      return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          if (VALID_SCHEME.test(parsed.scheme)) {
            parsed.scheme = parsed.scheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = isIPLiteral(parsed.host);
            const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
            const ipv6result = normalizeIPv6(parsed.host);
            isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
            parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || MALFORMED_HOST_ERROR;
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!malformedIPLiteral) {
          malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
        }
        if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
          let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
          if (!isIP) {
            host = normalizePercentEncoding(host.toLowerCase());
          }
          parsed.host = isIP || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP) : host;
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse4(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize2(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize2(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve,
      resolveComponent,
      equal,
      serialize: serialize2,
      parse: parse4
    };
    module2.exports = fastUri;
    module2.exports.default = fastUri;
    module2.exports.fastUri = fastUri;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/uri.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports2.default = uri;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/core.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CodeGen = exports2.Name = exports2.nil = exports2.stringify = exports2.str = exports2._ = exports2.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports2, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports2, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports2, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports2, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports2, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports2, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a2 = o.code) === null || _a2 === void 0 ? void 0 : _a2.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv2 = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data2) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data2);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root2 = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root2, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text3, msg) => text3 + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv2.ValidationError = validation_error_1.default;
    Ajv2.MissingRefError = ref_error_1.default;
    exports2.default = Ajv2;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a2;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a2 = definition.implements) === null || _a2 === void 0 ? void 0 : _a2.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before2) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before2);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before2} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/id.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/ref.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.callRef = exports2.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root: root2 } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root2.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root2, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root2)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root2 });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root2, root2.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports2.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a2;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a2 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a2 === void 0 ? void 0 : _a2.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports2.callRef = callRef;
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports2.default = core;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data: data2, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data2} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data2})`);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data: data2, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data2}/${schemaCode}, ${invalid}))`);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports2.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data: data2, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data2}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data2})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data: data2, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data2})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data2})`);
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data: data2, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data2}).length ${op} ${schemaCode}`);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/required.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data: data2, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop2 of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop2);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop2) => {
            cxt.setParams({ missingProperty: prop2 });
            gen.if((0, code_1.noPropertyInData)(gen, data2, prop2, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data2, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data: data2, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data2}.length ${op} ${schemaCode}`);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports2.default = equal;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data: data2, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data2}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data2}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data2}[${i}], ${data2}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/const.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data: data2, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data2}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data2}`);
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data: data2, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data2}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data2}, ${vSchema}[${i}])` : (0, codegen_1._)`${data2} === ${sch}`;
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports2.default = validation;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data: data2, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data2}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports2.validateAdditionalItems = validateAdditionalItems;
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data: data2, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data2}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports2.validateTuple = validateTuple;
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data: data2, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data2}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data2}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateSchemaDeps = exports2.validatePropertyDeps = exports2.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports2.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports2.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data: data2, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop2 in propertyDeps) {
        const deps = propertyDeps[prop2];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data2, prop2, it.opts.ownProperties);
        cxt.setParams({
          property: prop2,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports2.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data: data2, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop2 in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop2]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data2, prop2, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop2 }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports2.validateSchemaDeps = validateSchemaDeps;
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data: data2, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data2, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data: data2, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data2, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data2}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data: data2, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop2 of allProps) {
          it.definedProperties.add(prop2);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop2 of properties) {
          if (hasDefault(prop2)) {
            applyPropertySchema(prop2);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data2, prop2, it.opts.ownProperties));
            applyPropertySchema(prop2);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop2);
          cxt.ok(valid);
        }
        function hasDefault(prop2) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop2].default !== void 0;
        }
        function applyPropertySchema(prop2) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop2,
            dataProp: prop2
          }, valid);
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data: data2, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop2 in checkProperties) {
            if (new RegExp(pat).test(prop2)) {
              (0, util_1.checkStrictMode)(it, `property ${prop2} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data2, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports2.default = getApplicator;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/format.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data: data2, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data2}) : ${format}(${data2}))` : (0, codegen_1._)`${format}(${data2})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data2}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data2})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data2})` : (0, codegen_1._)`${fmtRef}.test(${data2})`;
          }
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports2.default = format;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/metadata.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.contentVocabulary = exports2.metadataVocabulary = void 0;
    exports2.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports2.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft7.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports2.default = draft7Vocabularies;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports2.DiscrError = DiscrError = {}));
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data: data2, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data2}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a2;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a2 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a2 === void 0 ? void 0 : _a2[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports2.default = def;
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports2, module2) {
    module2.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/ajv.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MissingRefError = exports2.ValidationError = exports2.CodeGen = exports2.Name = exports2.nil = exports2.stringify = exports2.str = exports2._ = exports2.KeywordCxt = exports2.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv2 = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports2.Ajv = Ajv2;
    module2.exports = exports2 = Ajv2;
    module2.exports.Ajv = Ajv2;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.default = Ajv2;
    var validate_1 = require_validate();
    Object.defineProperty(exports2, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports2, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports2, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports2, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports2, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports2, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports2, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports2, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../../node_modules/.pnpm/boolbase@1.0.0/node_modules/boolbase/index.js
var require_boolbase = __commonJS({
  "../../node_modules/.pnpm/boolbase@1.0.0/node_modules/boolbase/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      trueFunc: function trueFunc2() {
        return true;
      },
      falseFunc: function falseFunc() {
        return false;
      }
    };
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  run: () => run
});
module.exports = __toCommonJS(index_exports);

// src/runner-context.ts
var import_node_fs = __toESM(require("fs"), 1);
var memoryOutputs = {};
var memorySummary = "";
function getInput(name, options) {
  const envKey = "INPUT_" + name.toUpperCase().replace(/ /g, "_");
  const val2 = process.env[envKey] || "";
  const trimmed = val2.trim();
  if (options?.required && !trimmed) {
    const errorMsg = `Input required and not supplied: ${name}`;
    setFailed(errorMsg);
    throw new Error(errorMsg);
  }
  return trimmed;
}
function setOutput(name, value) {
  memoryOutputs[name] = value;
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    if (value.includes("\n")) {
      const delimiter = `ghadelimiter_${Math.random().toString(36).substring(2, 10)}`;
      const formatted = `${name}<<${delimiter}
${value}
${delimiter}
`;
      import_node_fs.default.appendFileSync(outputPath, formatted, "utf-8");
    } else {
      import_node_fs.default.appendFileSync(outputPath, `${name}=${value}
`, "utf-8");
    }
  }
}
function addStepSummary(markdownContent) {
  memorySummary += markdownContent + "\n";
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    import_node_fs.default.appendFileSync(summaryPath, markdownContent + "\n", "utf-8");
  }
}
function logInfo(message) {
  console.log(message);
}
function logWarning(message) {
  console.log(`::warning::${message}`);
}
function logError(message) {
  console.log(`::error::${message}`);
}
function setFailed(message) {
  logError(message);
  process.exitCode = 1;
}

// ../../packages/core/dist/charge.js
var import_apify = require("apify");

// ../../packages/core/dist/http.js
var import_got_scraping = require("got-scraping");

// ../../packages/core/dist/schema.js
var import_ajv = __toESM(require_ajv(), 1);
var AjvClass = import_ajv.default.default ?? import_ajv.default;
var ajv = new AjvClass({ coerceTypes: true, removeAdditional: true });
function createSchemaValidator(schema) {
  const validate = ajv.compile(schema);
  return (data2) => {
    const valid = validate(data2);
    if (!valid) {
      throw new Error(`Schema validation error: ${JSON.stringify(validate.errors)}`);
    }
    return data2;
  };
}

// ../../packages/core/dist/charging/ChargingManager.js
var import_apify2 = require("apify");

// ../../packages/core/dist/engines/errors.js
var ExtractionErrorCode;
(function(ExtractionErrorCode2) {
  ExtractionErrorCode2["NETWORK_BLOCKED"] = "NETWORK_BLOCKED";
  ExtractionErrorCode2["SCHEMA_MISMATCH"] = "SCHEMA_MISMATCH";
  ExtractionErrorCode2["EMPTY_TARGET"] = "EMPTY_TARGET";
  ExtractionErrorCode2["RATE_LIMITED"] = "RATE_LIMITED";
  ExtractionErrorCode2["EXTRACTION_TIMEOUT"] = "EXTRACTION_TIMEOUT";
  ExtractionErrorCode2["PARSING_ERROR"] = "PARSING_ERROR";
  ExtractionErrorCode2["PROTOCOL_VIOLATION"] = "PROTOCOL_VIOLATION";
})(ExtractionErrorCode || (ExtractionErrorCode = {}));
var ExtractionError = class extends Error {
  code;
  url;
  statusCode;
  retryable;
  details;
  constructor(options) {
    super(options.message, { cause: options.cause });
    this.name = "ExtractionError";
    this.code = options.code;
    this.url = options.url;
    this.statusCode = options.statusCode;
    this.retryable = options.retryable ?? (options.code === ExtractionErrorCode.RATE_LIMITED || options.code === ExtractionErrorCode.NETWORK_BLOCKED);
    this.details = options.details;
  }
};

// ../../packages/core/dist/engines/EcommerceJsonLdEngine.js
var import_got_scraping2 = require("got-scraping");
function withoutUndefined(value) {
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    if (item !== void 0)
      out[key] = item;
  }
  return out;
}
var EcommerceJsonLdEngine = class {
  name = "EcommerceJsonLdEngine";
  async extract(target, options) {
    const startTime = Date.now();
    const url = typeof target === "string" ? target : target.href;
    try {
      let html3 = options?.html;
      if (html3 === void 0) {
        html3 = await this.fetchHtml(url, options);
      }
      const products = this.parseJsonLd(html3, url, options);
      if (products.length === 0 && options?.tryProductsJsonFallback) {
        const fallbackProducts = await this.fetchShopifyProducts(url, options);
        products.push(...fallbackProducts);
      }
      if (products.length === 0) {
        const metaProduct = this.parseMetaFallback(html3, url);
        if (metaProduct) {
          products.push(metaProduct);
        }
      }
      if (products.length === 0) {
        return {
          success: false,
          error: new ExtractionError({
            code: ExtractionErrorCode.EMPTY_TARGET,
            message: `No product schema or fallback products found for ${url}`,
            url,
            retryable: false
          }),
          durationMs: Date.now() - startTime
        };
      }
      return {
        success: true,
        data: products,
        durationMs: Date.now() - startTime
      };
    } catch (err) {
      const extractionError = err instanceof ExtractionError ? err : new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: err.message || "Extraction failed",
        url,
        cause: err
      });
      return {
        success: false,
        error: extractionError,
        durationMs: Date.now() - startTime
      };
    }
  }
  async fetchHtml(url, options) {
    try {
      const res = await (0, import_got_scraping2.gotScraping)({
        url,
        headers: options?.headers,
        proxyUrl: options?.proxyUrl,
        timeout: options?.timeoutMs ? { request: options.timeoutMs } : void 0,
        throwHttpErrors: false
      });
      if (res.statusCode === 403 || res.statusCode === 401) {
        throw new ExtractionError({
          code: ExtractionErrorCode.NETWORK_BLOCKED,
          message: `HTTP blocked with status ${res.statusCode}`,
          statusCode: res.statusCode,
          url,
          retryable: true
        });
      }
      if (res.statusCode === 429) {
        throw new ExtractionError({
          code: ExtractionErrorCode.RATE_LIMITED,
          message: `Rate limited with status 429`,
          statusCode: 429,
          url,
          retryable: true
        });
      }
      return res.body;
    } catch (err) {
      if (err instanceof ExtractionError)
        throw err;
      const msg = err.message || "";
      if (msg.includes("Timeout") || msg.includes("timeout") || err.name === "TimeoutError") {
        throw new ExtractionError({
          code: ExtractionErrorCode.EXTRACTION_TIMEOUT,
          message: `Request timed out: ${msg}`,
          url,
          cause: err,
          retryable: true
        });
      }
      throw new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: `Network request failed: ${msg}`,
        url,
        cause: err,
        retryable: true
      });
    }
  }
  parseJsonLd(html3, pageUrl, options) {
    const products = [];
    const scriptRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html3)) !== null) {
      const rawContent = match[1].trim();
      if (!rawContent)
        continue;
      let parsed;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          const sanitized = rawContent.replace(/[\u0000-\u001F]+/g, " ");
          parsed = JSON.parse(sanitized);
        } catch {
          continue;
        }
      }
      const rawProducts = this.collectProductNodes(parsed);
      for (const item of rawProducts) {
        const product = this.mapToProduct(item, pageUrl, options);
        if (product) {
          products.push(product);
        }
      }
    }
    return products;
  }
  collectProductNodes(node, results = [], seen = /* @__PURE__ */ new Set()) {
    if (!node || typeof node !== "object")
      return results;
    if (seen.has(node))
      return results;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const item of node) {
        this.collectProductNodes(item, results, seen);
      }
      return results;
    }
    const obj = node;
    const type = obj["@type"];
    const isProduct = typeof type === "string" ? /(?:^|\/)Product$/i.test(type) || type === "IndividualProduct" || type === "ProductModel" : Array.isArray(type) ? type.some((t) => typeof t === "string" && (/(?:^|\/)Product$/i.test(t) || t === "IndividualProduct")) : false;
    if (isProduct) {
      results.push(obj);
    }
    if (Array.isArray(obj["@graph"])) {
      this.collectProductNodes(obj["@graph"], results, seen);
    }
    return results;
  }
  mapToProduct(item, pageUrl, options) {
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!name && !item.sku && !item["@id"]) {
      return null;
    }
    const rawOffers = Array.isArray(item.offers) ? item.offers : item.offers && typeof item.offers === "object" ? Array.isArray(item.offers.offers) ? item.offers.offers : [item.offers] : [];
    const firstOffer = rawOffers[0];
    let price;
    let originalPrice;
    let currency;
    let availability = "Unknown";
    if (firstOffer) {
      const parsed = this.parsePrice(firstOffer.price ?? firstOffer.lowPrice);
      price = parsed > 0 ? parsed : void 0;
      if (firstOffer.highPrice) {
        originalPrice = this.parsePrice(firstOffer.highPrice);
      } else if (Array.isArray(firstOffer.priceSpecification)) {
        const listSpec = firstOffer.priceSpecification.find((ps) => String(ps.priceType || "").includes("ListPrice") || String(ps.priceType || "").includes("Original") || String(ps.name || "").toLowerCase().includes("original") || String(ps.name || "").toLowerCase().includes("list"));
        if (listSpec && listSpec.price) {
          originalPrice = this.parsePrice(listSpec.price);
        }
      }
      currency = firstOffer.priceCurrency ? String(firstOffer.priceCurrency) : void 0;
      availability = this.parseAvailability(firstOffer.availability);
    }
    const variants = [];
    if (options?.extractVariants !== false && rawOffers.length > 1) {
      for (const off of rawOffers) {
        if (!off || typeof off !== "object")
          continue;
        variants.push({
          id: off["@id"] ? String(off["@id"]) : off.id ? String(off.id) : void 0,
          sku: off.sku ? String(off.sku) : void 0,
          name: off.name ? String(off.name) : void 0,
          price: this.parsePrice(off.price ?? off.lowPrice),
          currency: off.priceCurrency ? String(off.priceCurrency) : currency,
          availability: this.parseAvailability(off.availability),
          attributes: off.itemOffered && typeof off.itemOffered === "object" ? { variant: String(off.itemOffered.name || "") } : void 0
        });
      }
    }
    let rating;
    if (item.aggregateRating && typeof item.aggregateRating === "object") {
      const ar = item.aggregateRating;
      const val2 = parseFloat(String(ar.ratingValue ?? 0));
      const count = parseInt(String(ar.reviewCount ?? ar.ratingCount ?? 0), 10);
      rating = {
        value: isNaN(val2) ? 0 : val2,
        count: isNaN(count) ? 0 : count,
        bestRating: ar.bestRating ? parseFloat(String(ar.bestRating)) : void 0
      };
    }
    const images = this.extractImages(item.image);
    return withoutUndefined({
      id: item["@id"] ? String(item["@id"]) : item.id ? String(item.id) : item.sku ? String(item.sku) : void 0,
      sku: item.sku ? String(item.sku) : item.mpn ? String(item.mpn) : void 0,
      name: name || "Untitled Product",
      description: typeof item.description === "string" ? item.description : void 0,
      brand: typeof item.brand === "string" ? item.brand : item.brand && typeof item.brand === "object" ? String(item.brand.name || "") : void 0,
      url: typeof item.url === "string" ? item.url : pageUrl,
      currency,
      price,
      originalPrice,
      availability,
      images,
      rating,
      variants: variants.length > 0 ? variants : void 0,
      rawSchemaType: Array.isArray(item["@type"]) ? item["@type"].join(",") : String(item["@type"] || "Product"),
      metadata: options?.includeRawLdJson ? { rawLdJson: item } : void 0
    });
  }
  extractImages(rawImg) {
    const images = [];
    if (typeof rawImg === "string") {
      images.push(rawImg);
    } else if (Array.isArray(rawImg)) {
      for (const img of rawImg) {
        if (typeof img === "string")
          images.push(img);
        else if (img && typeof img === "object" && img.url)
          images.push(String(img.url));
      }
    } else if (rawImg && typeof rawImg === "object" && rawImg.url) {
      images.push(String(rawImg.url));
    }
    return Array.from(new Set(images.filter(Boolean)));
  }
  parsePrice(p) {
    if (typeof p === "number")
      return p;
    if (!p)
      return 0;
    const clean = String(p).replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }
  parseAvailability(availStr) {
    if (typeof availStr !== "string")
      return "Unknown";
    if (/InStock/i.test(availStr))
      return "InStock";
    if (/OutOfStock/i.test(availStr))
      return "OutOfStock";
    if (/PreOrder/i.test(availStr))
      return "PreOrder";
    if (/Discontinued/i.test(availStr))
      return "Discontinued";
    return "Unknown";
  }
  async fetchShopifyProducts(url, options) {
    try {
      const origin = new URL(url).origin;
      const res = await (0, import_got_scraping2.gotScraping)({
        url: `${origin}/products.json`,
        headers: options?.headers,
        proxyUrl: options?.proxyUrl,
        timeout: options?.timeoutMs ? { request: options.timeoutMs } : void 0,
        throwHttpErrors: false
      });
      if (res.statusCode !== 200)
        return [];
      const parsed = JSON.parse(res.body);
      if (!Array.isArray(parsed.products))
        return [];
      return parsed.products.map((p) => {
        const firstVar = p.variants?.[0] || {};
        const variants = (p.variants || []).map((v) => ({
          id: String(v.id),
          sku: v.sku || void 0,
          name: v.title,
          price: parseFloat(v.price || "0") || 0,
          availability: v.available ? "InStock" : "OutOfStock",
          attributes: {
            ...v.option1 ? { option1: v.option1 } : {},
            ...v.option2 ? { option2: v.option2 } : {},
            ...v.option3 ? { option3: v.option3 } : {}
          }
        }));
        return {
          id: String(p.id),
          sku: firstVar.sku || void 0,
          name: p.title || "Untitled",
          description: p.body_html ? p.body_html.replace(/<[^>]*>/g, "").trim() : void 0,
          brand: p.vendor || void 0,
          url: `${origin}/products/${p.handle}`,
          currency: "USD",
          price: parseFloat(firstVar.price || "0") || 0,
          originalPrice: firstVar.compare_at_price ? parseFloat(firstVar.compare_at_price) : void 0,
          availability: p.variants?.some((v) => v.available) ? "InStock" : "OutOfStock",
          images: (p.images || []).map((img) => typeof img === "string" ? img : img.src).filter(Boolean),
          variants: variants.length > 0 ? variants : void 0,
          rawSchemaType: "ShopifyProductsJson"
        };
      });
    } catch {
      return [];
    }
  }
  parseMetaFallback(html3, url) {
    const getMeta = (prop2) => {
      const match = html3.match(new RegExp(`<meta\\b[^>]*(?:property|name)=["']${prop2}["'][^>]*content=["']([^"']*)["']`, "i")) || html3.match(new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop2}["']`, "i"));
      return match ? match[1].trim() : void 0;
    };
    const title = getMeta("og:title") || getMeta("twitter:title");
    const priceStr = getMeta("product:price:amount") || getMeta("og:price:amount");
    if (!title && !priceStr)
      return null;
    const price = priceStr ? this.parsePrice(priceStr) : void 0;
    const currency = getMeta("product:price:currency") || getMeta("og:price:currency") || "USD";
    const image = getMeta("og:image");
    const description = getMeta("og:description") || getMeta("description");
    return {
      name: title || "Product",
      url,
      price,
      currency,
      description,
      availability: "InStock",
      images: image ? [image] : [],
      rawSchemaType: "OpenGraphFallback"
    };
  }
};

// ../../packages/core/dist/engines/B2BEnricherEngine.js
var import_promises = __toESM(require("dns/promises"), 1);
var import_got_scraping3 = require("got-scraping");
var B2BEnricherEngine = class {
  name = "B2BEnricherEngine";
  async extract(target, options) {
    const startTime = Date.now();
    const urlStr = typeof target === "string" ? target : target.href;
    let parsedUrl;
    try {
      parsedUrl = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    } catch {
      parsedUrl = new URL(`https://${urlStr}`);
    }
    const domain = options?.domain || parsedUrl.hostname;
    try {
      let html3 = options?.html;
      let headers = options?.headers || {};
      if (!html3) {
        const fetched = await this.fetchPage(parsedUrl.href, options);
        html3 = fetched.html;
        headers = { ...headers, ...fetched.headers };
      }
      const emails = this.extractEmails(html3);
      const phoneNumbers = this.extractPhones(html3);
      const socialLinks = this.extractSocialLinks(html3);
      const serverInfo = this.detectServerInfo(headers, html3);
      const technologies = options?.detectTechnologies !== false ? this.detectTechnologies(html3, headers, serverInfo) : [];
      const careers = options?.probeCareers !== false ? this.detectCareers(html3, parsedUrl.href) : void 0;
      const companyName = this.extractCompanyName(html3, domain);
      let dnsRecords = {
        mxRecords: [],
        txtRecords: [],
        hasGoogleWorkspace: false,
        hasMicrosoft365: false
      };
      if (options?.resolveDns !== false) {
        dnsRecords = await this.resolveDnsRecords(domain);
      }
      const profile = {
        domain,
        companyName,
        emails,
        phoneNumbers,
        socialLinks,
        dns: dnsRecords,
        serverInfo,
        technologies,
        careers
      };
      return {
        success: true,
        data: profile,
        durationMs: Date.now() - startTime
      };
    } catch (err) {
      const extractionError = err instanceof ExtractionError ? err : new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: err.message || "B2B enrichment failed",
        url: parsedUrl.href,
        cause: err
      });
      return {
        success: false,
        error: extractionError,
        durationMs: Date.now() - startTime
      };
    }
  }
  async fetchPage(url, options) {
    try {
      const res = await (0, import_got_scraping3.gotScraping)({
        url,
        headers: options?.headers,
        proxyUrl: options?.proxyUrl,
        timeout: options?.timeoutMs ? { request: options.timeoutMs } : void 0,
        throwHttpErrors: false
      });
      if (res.statusCode === 403 || res.statusCode === 401) {
        throw new ExtractionError({
          code: ExtractionErrorCode.NETWORK_BLOCKED,
          message: `HTTP blocked with status ${res.statusCode}`,
          statusCode: res.statusCode,
          url,
          retryable: true
        });
      }
      if (res.statusCode === 429) {
        throw new ExtractionError({
          code: ExtractionErrorCode.RATE_LIMITED,
          message: `Rate limited with status 429`,
          statusCode: 429,
          url,
          retryable: true
        });
      }
      const normalizedHeaders = {};
      for (const [k, v] of Object.entries(res.headers)) {
        normalizedHeaders[k.toLowerCase()] = Array.isArray(v) ? v.join(", ") : v ?? "";
      }
      return { html: res.body, headers: normalizedHeaders };
    } catch (err) {
      if (err instanceof ExtractionError)
        throw err;
      const msg = err.message || "";
      if (msg.includes("Timeout") || msg.includes("timeout") || err.name === "TimeoutError") {
        throw new ExtractionError({
          code: ExtractionErrorCode.EXTRACTION_TIMEOUT,
          message: `Request timed out: ${msg}`,
          url,
          cause: err,
          retryable: true
        });
      }
      throw new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: `Network request failed: ${msg}`,
        url,
        cause: err,
        retryable: true
      });
    }
  }
  extractEmails(html3) {
    const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
    const matches = html3.match(emailRegex) || [];
    const ignoredExtensions = /\.(?:png|jpg|jpeg|gif|svg|webp|css|js|woff2?|ico)$/i;
    const ignoredDomains = /(?:example\.com|domain\.com|sentry\.io|w3\.org|schema\.org)$/i;
    const filtered = matches.filter((e) => {
      if (ignoredExtensions.test(e))
        return false;
      if (ignoredDomains.test(e))
        return false;
      if (e.includes("..") || e.startsWith(".") || e.endsWith("."))
        return false;
      return true;
    });
    return Array.from(new Set(filtered.map((e) => e.toLowerCase())));
  }
  extractPhones(html3) {
    const phones = [];
    const telHrefRegex = /href=["']tel:([^"'>\s]+)["']/gi;
    let match;
    while ((match = telHrefRegex.exec(html3)) !== null) {
      const raw = match[1].replace(/[^\d+]/g, "");
      if (raw.length >= 7 && raw.length <= 15) {
        phones.push(raw);
      }
    }
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,9}/g;
    const textMatches = html3.match(phoneRegex) || [];
    for (const item of textMatches) {
      const digits = item.replace(/\D/g, "");
      if (digits.length >= 7 && digits.length <= 15) {
        if (/^(19\d\d|20\d\d)[-/.](19\d\d|20\d\d)$/.test(item.trim()))
          continue;
        phones.push(item.trim());
      }
    }
    return Array.from(new Set(phones)).slice(0, 10);
  }
  extractSocialLinks(html3) {
    const links = {};
    const linkedin = html3.match(/https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9_-]+/i);
    if (linkedin)
      links.linkedin = linkedin[0];
    const twitter = html3.match(/https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?!intent|share|home)[a-zA-Z0-9_]+/i);
    if (twitter)
      links.twitter = twitter[0];
    const github = html3.match(/https?:\/\/(?:www\.)?github\.com\/(?!features|pricing|security)[a-zA-Z0-9_-]+/i);
    if (github)
      links.github = github[0];
    const facebook = html3.match(/https?:\/\/(?:www\.)?facebook\.com\/(?!sharer|share|privacy)[a-zA-Z0-9._-]+/i);
    if (facebook)
      links.facebook = facebook[0];
    const instagram = html3.match(/https?:\/\/(?:www\.)?instagram\.com\/(?!explore|accounts)[a-zA-Z0-9._-]+/i);
    if (instagram)
      links.instagram = instagram[0];
    const youtube = html3.match(/https?:\/\/(?:www\.)?youtube\.com\/(?:c\/|user\/|channel\/|@)[a-zA-Z0-9_-]+/i);
    if (youtube)
      links.youtube = youtube[0];
    return links;
  }
  detectServerInfo(headers, html3) {
    const lowerHeaders = {};
    for (const [k, v] of Object.entries(headers)) {
      lowerHeaders[k.toLowerCase()] = v;
    }
    const serverHeader = lowerHeaders["server"];
    const poweredBy = lowerHeaders["x-powered-by"];
    let cdnOrWaf = "None";
    const server = (serverHeader || "").toLowerCase();
    const via = (lowerHeaders["via"] || "").toLowerCase();
    if (lowerHeaders["cf-ray"] || server.includes("cloudflare")) {
      cdnOrWaf = "Cloudflare";
    } else if (lowerHeaders["x-amz-cf-id"] || via.includes("cloudfront")) {
      cdnOrWaf = "CloudFront";
    } else if (lowerHeaders["x-fastly-request-id"] || lowerHeaders["fastly-debug-digest"]) {
      cdnOrWaf = "Fastly";
    } else if (lowerHeaders["x-akamai-transformed"] || server.includes("akamai")) {
      cdnOrWaf = "Akamai";
    } else if (lowerHeaders["x-vercel-id"]) {
      cdnOrWaf = "Vercel";
    } else if (via || lowerHeaders["x-cache"] || lowerHeaders["cdn"]) {
      cdnOrWaf = "Other";
    }
    return {
      serverHeader,
      poweredBy,
      cdnOrWaf
    };
  }
  detectTechnologies(html3, headers, serverInfo) {
    const techs = /* @__PURE__ */ new Set();
    if (serverInfo.cdnOrWaf && serverInfo.cdnOrWaf !== "None" && serverInfo.cdnOrWaf !== "Other") {
      techs.add(serverInfo.cdnOrWaf);
    }
    if (/wp-content|wp-includes/i.test(html3) || /wordpress/i.test(headers["x-powered-by"] || "")) {
      techs.add("WordPress");
    }
    if (/shopify\.com|Shopify\./i.test(html3)) {
      techs.add("Shopify");
    }
    if (/__NEXT_DATA__|(\/_next\/)/i.test(html3)) {
      techs.add("Next.js");
    }
    if (/__NUXT__|(\/_nuxt\/)/i.test(html3)) {
      techs.add("Nuxt");
    }
    if (/data-reactroot|react\.production/i.test(html3)) {
      techs.add("React");
    }
    if (/data-v-|vue\.runtime|vue\.global/i.test(html3)) {
      techs.add("Vue.js");
    }
    if (/ng-version|angular/i.test(html3)) {
      techs.add("Angular");
    }
    if (/webflow\.com|wf-page/i.test(html3)) {
      techs.add("Webflow");
    }
    if (/hs-scripts|hbspt/i.test(html3)) {
      techs.add("HubSpot");
    }
    if (/googletagmanager\.com\/gtm\.js/i.test(html3)) {
      techs.add("Google Tag Manager");
    }
    if (/google-analytics\.com|gtag\/js/i.test(html3)) {
      techs.add("Google Analytics");
    }
    if (/js\.stripe\.com/i.test(html3)) {
      techs.add("Stripe");
    }
    if (/tailwind/i.test(html3)) {
      techs.add("Tailwind CSS");
    }
    return Array.from(techs);
  }
  detectCareers(html3, baseUrl) {
    const atsMatchers = [
      { regex: /https?:\/\/boards\.greenhouse\.io\/[a-zA-Z0-9_-]+/i, platform: "Greenhouse" },
      { regex: /https?:\/\/jobs\.lever\.co\/[a-zA-Z0-9_-]+/i, platform: "Lever" },
      { regex: /https?:\/\/apply\.workable\.com\/[a-zA-Z0-9_-]+/i, platform: "Workable" },
      { regex: /https?:\/\/jobs\.ashbyhq\.com\/[a-zA-Z0-9_-]+/i, platform: "Ashby" },
      { regex: /https?:\/\/[a-zA-Z0-9_-]+\.bamboohr\.com\/careers\/[0-9]+/i, platform: "BambooHR" }
    ];
    for (const { regex, platform } of atsMatchers) {
      const match = html3.match(regex);
      if (match) {
        return {
          careersUrl: match[0],
          atsPlatform: platform
        };
      }
    }
    const hrefRegex = /href=["']([^"']*(?:careers|jobs|join-us|work-with-us)[^"']*)["']/i;
    const careersMatch = html3.match(hrefRegex);
    if (careersMatch) {
      const rawHref = careersMatch[1];
      try {
        const resolved = new URL(rawHref, baseUrl).href;
        return {
          careersUrl: resolved,
          atsPlatform: "Other"
        };
      } catch {
        return {
          careersUrl: rawHref,
          atsPlatform: "Other"
        };
      }
    }
    return void 0;
  }
  extractCompanyName(html3, domain) {
    const ogSiteName = html3.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);
    if (ogSiteName && ogSiteName[1].trim()) {
      return ogSiteName[1].trim();
    }
    const titleMatch = html3.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1].trim()) {
      const rawTitle = titleMatch[1].trim();
      const parts = rawTitle.split(/[-–|·•]/);
      if (parts.length > 1) {
        return parts[0].trim();
      }
      return rawTitle;
    }
    return domain.replace(/\.[a-z]{2,}$/i, "").replace(/^[a-z0-9_-]+\./i, "");
  }
  async resolveDnsRecords(domain) {
    try {
      const [mxResult, txtResult] = await Promise.allSettled([
        import_promises.default.resolveMx(domain),
        import_promises.default.resolveTxt(domain)
      ]);
      const mxRecords = mxResult.status === "fulfilled" ? mxResult.value.map((r) => ({ exchange: r.exchange, priority: r.priority })) : [];
      const txtRecords = txtResult.status === "fulfilled" ? txtResult.value.map((chunks) => chunks.join("")) : [];
      const combined = (mxRecords.map((m) => m.exchange).join(" ") + " " + txtRecords.join(" ")).toLowerCase();
      const hasGoogleWorkspace = /aspmx.*google|googlemail|_spf\.google|google-site-verification/.test(combined);
      const hasMicrosoft365 = /outlook\.com|protection\.outlook|_spf\.protection\.outlook|ms=ms/.test(combined);
      return {
        mxRecords,
        txtRecords,
        hasGoogleWorkspace,
        hasMicrosoft365
      };
    } catch {
      return {
        mxRecords: [],
        txtRecords: [],
        hasGoogleWorkspace: false,
        hasMicrosoft365: false
      };
    }
  }
};

// ../../packages/core/dist/engines/SSRHydrationEngine.js
var import_node_vm = __toESM(require("vm"), 1);
var import_got_scraping4 = require("got-scraping");
var SSRHydrationEngine = class {
  name = "SSRHydrationEngine";
  async extract(target, options) {
    const startTime = Date.now();
    const url = typeof target === "string" ? target : target.href;
    try {
      let html3 = options?.html;
      if (!html3) {
        html3 = await this.fetchHtml(url, options);
      }
      const allowedTargets = options?.targets;
      const shouldCheck = (framework) => {
        if (!allowedTargets || allowedTargets.length === 0)
          return true;
        return allowedTargets.includes(framework);
      };
      if (shouldCheck("next")) {
        const nextMatch = html3.match(/<script\b[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
        if (nextMatch) {
          const raw = nextMatch[1].trim();
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "next",
              data: parsed,
              buildId: typeof parsed.buildId === "string" ? parsed.buildId : void 0,
              pagePath: typeof parsed.page === "string" ? parsed.page : void 0,
              rawScriptContentLength: raw.length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (shouldCheck("nuxt")) {
        const nuxtDataMatch = html3.match(/<script\b[^>]*id=["']__NUXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
        if (nuxtDataMatch) {
          const raw = nuxtDataMatch[1].trim();
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "nuxt",
              data: Array.isArray(parsed) ? { items: parsed } : parsed,
              rawScriptContentLength: raw.length
            },
            durationMs: Date.now() - startTime
          };
        }
        const nuxtInlineMatch = html3.match(/<script\b[^>]*>[\s\S]*?window\.__NUXT__\s*=\s*([\s\S]*?)(?:;|<\/script>)/i);
        if (nuxtInlineMatch) {
          const raw = this.sanitizeJsPayload(nuxtInlineMatch[1]);
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "nuxt",
              data: parsed,
              rawScriptContentLength: nuxtInlineMatch[1].length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (shouldCheck("remix")) {
        const remixMatch = html3.match(/<script\b[^>]*>[\s\S]*?window\.__remixContext\s*=\s*([\s\S]*?)(?:;|<\/script>)/i);
        if (remixMatch) {
          const raw = this.sanitizeJsPayload(remixMatch[1]);
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "remix",
              data: parsed,
              rawScriptContentLength: remixMatch[1].length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (shouldCheck("redux")) {
        const reduxMatch = html3.match(/<script\b[^>]*>[\s\S]*?window\.(?:__INITIAL_STATE__|__PRELOADED_STATE__)\s*=\s*([\s\S]*?)(?:;|<\/script>)/i);
        if (reduxMatch) {
          const raw = this.sanitizeJsPayload(reduxMatch[1]);
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "redux",
              data: parsed,
              rawScriptContentLength: reduxMatch[1].length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (shouldCheck("apollo")) {
        const apolloMatch = html3.match(/<script\b[^>]*>[\s\S]*?window\.__APOLLO_STATE__\s*=\s*([\s\S]*?)(?:;|<\/script>)/i);
        if (apolloMatch) {
          const raw = this.sanitizeJsPayload(apolloMatch[1]);
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "apollo",
              data: parsed,
              rawScriptContentLength: apolloMatch[1].length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (shouldCheck("vue")) {
        const vueMatch = html3.match(/<script\b[^>]*>[\s\S]*?window\.(?:__VUE_STATE__|__INITIAL_VIEW_STATE__)\s*=\s*([\s\S]*?)(?:;|<\/script>)/i);
        if (vueMatch) {
          const raw = this.sanitizeJsPayload(vueMatch[1]);
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "vue",
              data: parsed,
              rawScriptContentLength: vueMatch[1].length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (shouldCheck("sveltekit")) {
        const svelteMatch = html3.match(/<script\b[^>]*data-sveltekit-fetched[^>]*>([\s\S]*?)<\/script>/i);
        if (svelteMatch) {
          const raw = svelteMatch[1].trim();
          const parsed = this.parseJsonSafely(raw, url);
          return {
            success: true,
            data: {
              framework: "sveltekit",
              data: parsed,
              rawScriptContentLength: raw.length
            },
            durationMs: Date.now() - startTime
          };
        }
      }
      if (options?.customVarNames && options.customVarNames.length > 0) {
        for (const varName of options.customVarNames) {
          const safeVar = varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const scriptTag = new RegExp(`<script\\b[^>]*id=["']${safeVar}["'][^>]*>([\\s\\S]*?)<\\/script>`, "i");
          const idMatch = html3.match(scriptTag);
          if (idMatch) {
            const raw = idMatch[1].trim();
            const parsed = this.parseJsonSafely(raw, url);
            return {
              success: true,
              data: {
                framework: "unknown",
                data: parsed,
                rawScriptContentLength: raw.length
              },
              durationMs: Date.now() - startTime
            };
          }
          const windowRegex = new RegExp(`<script\\b[^>]*>[\\s\\S]*?window\\.${safeVar}\\s*=\\s*([\\s\\S]*?)(?:;|<\\/script>)`, "i");
          const winMatch = html3.match(windowRegex);
          if (winMatch) {
            const raw = this.sanitizeJsPayload(winMatch[1]);
            const parsed = this.parseJsonSafely(raw, url);
            return {
              success: true,
              data: {
                framework: "unknown",
                data: parsed,
                rawScriptContentLength: winMatch[1].length
              },
              durationMs: Date.now() - startTime
            };
          }
        }
      }
      return {
        success: false,
        error: new ExtractionError({
          code: ExtractionErrorCode.EMPTY_TARGET,
          message: `No supported SSR hydration state found in document: ${url}`,
          url,
          retryable: false
        }),
        durationMs: Date.now() - startTime
      };
    } catch (err) {
      const extractionError = err instanceof ExtractionError ? err : new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: err.message || "SSR extraction failed",
        url,
        cause: err
      });
      return {
        success: false,
        error: extractionError,
        durationMs: Date.now() - startTime
      };
    }
  }
  async fetchHtml(url, options) {
    try {
      const res = await (0, import_got_scraping4.gotScraping)({
        url,
        headers: options?.headers,
        proxyUrl: options?.proxyUrl,
        timeout: options?.timeoutMs ? { request: options.timeoutMs } : void 0,
        throwHttpErrors: false
      });
      if (res.statusCode === 403 || res.statusCode === 401) {
        throw new ExtractionError({
          code: ExtractionErrorCode.NETWORK_BLOCKED,
          message: `HTTP blocked with status ${res.statusCode}`,
          statusCode: res.statusCode,
          url,
          retryable: true
        });
      }
      if (res.statusCode === 429) {
        throw new ExtractionError({
          code: ExtractionErrorCode.RATE_LIMITED,
          message: `Rate limited with status 429`,
          statusCode: 429,
          url,
          retryable: true
        });
      }
      return res.body;
    } catch (err) {
      if (err instanceof ExtractionError)
        throw err;
      const msg = err.message || "";
      if (msg.includes("Timeout") || msg.includes("timeout") || err.name === "TimeoutError") {
        throw new ExtractionError({
          code: ExtractionErrorCode.EXTRACTION_TIMEOUT,
          message: `Request timed out: ${msg}`,
          url,
          cause: err,
          retryable: true
        });
      }
      throw new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: `Network request failed: ${msg}`,
        url,
        cause: err,
        retryable: true
      });
    }
  }
  sanitizeJsPayload(raw) {
    let clean = raw.trim();
    if (clean.endsWith(";"))
      clean = clean.slice(0, -1).trim();
    if (clean.startsWith("(") && clean.endsWith(")"))
      clean = clean.slice(1, -1).trim();
    return clean;
  }
  parseJsonSafely(raw, url) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
      return { value: parsed };
    } catch (err) {
      try {
        const relaxed = raw.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":').replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"').replace(/,\s*([}\]])/g, "$1").replace(/[\u0000-\u001F]+/g, " ");
        const parsed = JSON.parse(relaxed);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
        return { value: parsed };
      } catch {
        try {
          const sandbox = /* @__PURE__ */ Object.create(null);
          const evalResult = import_node_vm.default.runInNewContext(`(${raw})`, sandbox, {
            timeout: 200,
            breakOnSigint: true
          });
          if (evalResult && typeof evalResult === "object") {
            return evalResult;
          }
          return { value: evalResult };
        } catch (vmErr) {
          throw new ExtractionError({
            code: ExtractionErrorCode.PARSING_ERROR,
            message: `Failed to parse SSR JSON payload: ${err.message}`,
            url,
            cause: err,
            retryable: false
          });
        }
      }
    }
  }
};

// ../../packages/core/dist/engines/AIMarkdownEngine.js
var import_got_scraping5 = require("got-scraping");
var AIMarkdownEngine = class {
  name = "AIMarkdownEngine";
  async extract(target, options) {
    const startTime = Date.now();
    const url = typeof target === "string" ? target : target.href;
    try {
      let html3 = options?.html;
      if (!html3) {
        html3 = await this.fetchHtml(url, options);
      }
      const title = this.extractTitle(html3);
      const description = this.extractDescription(html3);
      const language = this.extractLanguage(html3);
      const extractedAt = (/* @__PURE__ */ new Date()).toISOString();
      let workingHtml = html3;
      if (options?.cleanBoilerplate !== false) {
        workingHtml = this.removeBoilerplate(workingHtml);
      }
      const headings = this.extractHeadings(workingHtml);
      let markdown = this.htmlToMarkdown(workingHtml, options);
      if (options?.includeFrontmatter) {
        const fm = [
          "---",
          `title: "${(title || "").replace(/"/g, '\\"')}"`,
          `url: "${url}"`,
          `extractedAt: "${extractedAt}"`,
          "---",
          ""
        ].join("\n");
        markdown = `${fm}${markdown}`;
      }
      const charCount = markdown.length;
      const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
      const tokenEstimate = Math.ceil(charCount / 4);
      let chunks;
      if (options?.chunking?.enabled) {
        chunks = this.createChunks(markdown, options.chunking);
      }
      let selectedSection;
      if (options?.targetSectionPattern) {
        const pat = typeof options.targetSectionPattern === "string" ? new RegExp(options.targetSectionPattern, "i") : options.targetSectionPattern;
        selectedSection = this.extractSection(markdown, pat) || void 0;
      }
      const result = {
        url,
        title,
        markdown,
        charCount,
        wordCount,
        tokenEstimate,
        headings,
        selectedSection,
        chunks,
        metadata: {
          extractedAt,
          language,
          description
        }
      };
      return {
        success: true,
        data: result,
        durationMs: Date.now() - startTime
      };
    } catch (err) {
      const extractionError = err instanceof ExtractionError ? err : new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: err.message || "Markdown extraction failed",
        url,
        cause: err
      });
      return {
        success: false,
        error: extractionError,
        durationMs: Date.now() - startTime
      };
    }
  }
  async fetchSitemap(options) {
    const res = await (0, import_got_scraping5.gotScraping)({
      url: options.sitemapUrl,
      timeout: { request: 1e4 },
      throwHttpErrors: false
    });
    if (res.statusCode !== 200) {
      throw new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: `Failed to fetch sitemap, status ${res.statusCode}`,
        statusCode: res.statusCode,
        url: options.sitemapUrl
      });
    }
    const entries = [];
    const body = res.body;
    const urlBlockRegex = /<url>([\s\S]*?)<\/url>/gi;
    let match;
    while ((match = urlBlockRegex.exec(body)) !== null) {
      const block = match[1];
      const locMatch = block.match(/<loc>([^<]+)<\/loc>/i);
      if (!locMatch)
        continue;
      const loc = locMatch[1].trim();
      if (options.filterPatterns && options.filterPatterns.length > 0) {
        const passed = options.filterPatterns.some((pattern) => pattern.test(loc));
        if (!passed)
          continue;
      }
      const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/i);
      const changefreqMatch = block.match(/<changefreq>([^<]+)<\/changefreq>/i);
      const priorityMatch = block.match(/<priority>([^<]+)<\/priority>/i);
      entries.push({
        loc,
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : void 0,
        changefreq: changefreqMatch ? changefreqMatch[1].trim() : void 0,
        priority: priorityMatch ? parseFloat(priorityMatch[1].trim()) : void 0
      });
      if (options.maxUrls && entries.length >= options.maxUrls) {
        break;
      }
    }
    if (entries.length === 0) {
      const sitemapBlockRegex = /<sitemap>([\s\S]*?)<\/sitemap>/gi;
      while ((match = sitemapBlockRegex.exec(body)) !== null) {
        const block = match[1];
        const locMatch = block.match(/<loc>([^<]+)<\/loc>/i);
        if (locMatch) {
          const loc = locMatch[1].trim();
          const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/i);
          entries.push({
            loc,
            lastmod: lastmodMatch ? lastmodMatch[1].trim() : void 0
          });
          if (options.maxUrls && entries.length >= options.maxUrls)
            break;
        }
      }
    }
    return entries;
  }
  async fetchHtml(url, options) {
    try {
      const res = await (0, import_got_scraping5.gotScraping)({
        url,
        headers: options?.headers,
        proxyUrl: options?.proxyUrl,
        timeout: options?.timeoutMs ? { request: options.timeoutMs } : void 0,
        throwHttpErrors: false
      });
      if (res.statusCode === 403 || res.statusCode === 401) {
        throw new ExtractionError({
          code: ExtractionErrorCode.NETWORK_BLOCKED,
          message: `HTTP blocked with status ${res.statusCode}`,
          statusCode: res.statusCode,
          url,
          retryable: true
        });
      }
      if (res.statusCode === 429) {
        throw new ExtractionError({
          code: ExtractionErrorCode.RATE_LIMITED,
          message: `Rate limited with status 429`,
          statusCode: 429,
          url,
          retryable: true
        });
      }
      return res.body;
    } catch (err) {
      if (err instanceof ExtractionError)
        throw err;
      const msg = err.message || "";
      if (msg.includes("Timeout") || msg.includes("timeout") || err.name === "TimeoutError") {
        throw new ExtractionError({
          code: ExtractionErrorCode.EXTRACTION_TIMEOUT,
          message: `Request timed out: ${msg}`,
          url,
          cause: err,
          retryable: true
        });
      }
      throw new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: `Network request failed: ${msg}`,
        url,
        cause: err,
        retryable: true
      });
    }
  }
  removeBoilerplate(html3) {
    return html3.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "").replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "").replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "").replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, "").replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "").replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "").replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
  }
  extractTitle(html3) {
    const titleMatch = html3.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1].trim())
      return titleMatch[1].trim();
    const ogTitle = html3.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    if (ogTitle && ogTitle[1].trim())
      return ogTitle[1].trim();
    const h1Match = html3.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match)
      return h1Match[1].replace(/<[^>]+>/g, "").trim();
    return void 0;
  }
  extractDescription(html3) {
    const metaDesc = html3.match(/<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["']([^"']+)["']/i);
    return metaDesc && metaDesc[1].trim() ? metaDesc[1].trim() : void 0;
  }
  extractLanguage(html3) {
    const langMatch = html3.match(/<html\b[^>]*\blang=["']([^"']+)["']/i);
    return langMatch ? langMatch[1].trim() : void 0;
  }
  extractHeadings(html3) {
    const headings = [];
    const headingRegex = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;
    while ((match = headingRegex.exec(html3)) !== null) {
      const level = parseInt(match[1], 10);
      const rawText = match[2].replace(/<[^>]+>/g, "").trim();
      const text3 = this.decodeHtmlEntities(rawText);
      if (text3) {
        headings.push({ level, text: text3 });
      }
    }
    return headings;
  }
  htmlToMarkdown(html3, options) {
    let md = html3;
    md = md.replace(/<pre\b[^>]*><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_m, code) => {
      return `

\`\`\`
${this.decodeHtmlEntities(code.trim())}
\`\`\`

`;
    });
    md = md.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, code) => {
      return ` \`${this.decodeHtmlEntities(code.trim())}\` `;
    });
    md = md.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, levelStr, content) => {
      const level = parseInt(levelStr, 10);
      const prefix = "#".repeat(level);
      const text3 = this.decodeHtmlEntities(content.replace(/<[^>]+>/g, "").trim());
      return `

${prefix} ${text3}

`;
    });
    md = md.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, content) => {
      const clean = content.replace(/<[^>]+>/g, "").trim();
      return `

> ${this.decodeHtmlEntities(clean)}

`;
    });
    md = md.replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**");
    md = md.replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*");
    if (options?.preserveImages) {
      md = md.replace(/<img\b[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, "![$2]($1)");
      md = md.replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi, "![$1]($2)");
      md = md.replace(/<img\b[^>]*src=["']([^"']*)["'][^>]*>/gi, "![]($1)");
    } else {
      md = md.replace(/<img\b[^>]*>/gi, "");
    }
    if (options?.preserveLinks !== false) {
      md = md.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, content) => {
        const text3 = content.replace(/<[^>]+>/g, "").trim();
        return text3 ? `[${text3}](${href})` : "";
      });
    } else {
      md = md.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1");
    }
    md = md.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, content) => {
      const clean = content.replace(/<[^>]+>/g, "").trim();
      return `
* ${clean}`;
    });
    md = md.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");
    md = md.replace(/<hr\b[^>]*\/?>/gi, "\n\n---\n\n");
    md = md.replace(/<br\b[^>]*\/?>/gi, "\n");
    md = md.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_match, tableContent) => {
      const rows = [];
      const trRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = trRegex.exec(tableContent)) !== null) {
        const rowCells = [];
        const cellRegex = /<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
        let cellMatch;
        while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
          const text3 = cellMatch[1].replace(/<[^>]+>/g, "").replace(/[\r\n\t]+/g, " ").trim();
          rowCells.push(text3);
        }
        if (rowCells.length > 0) {
          rows.push(rowCells);
        }
      }
      if (rows.length === 0)
        return "";
      const maxCols = Math.max(...rows.map((r) => r.length));
      const normalized = rows.map((r) => {
        const padded = [...r];
        while (padded.length < maxCols)
          padded.push("");
        return `| ${padded.join(" | ")} |`;
      });
      const separator = `| ${new Array(maxCols).fill("---").join(" | ")} |`;
      return `

${normalized[0]}
${separator}
${normalized.slice(1).join("\n")}

`;
    });
    md = md.replace(/<\/?(?:div|section|article|main|ul|ol|table|tr|td|th|tbody|thead)\b[^>]*>/gi, "\n");
    md = md.replace(/<[^>]+>/g, "");
    md = this.decodeHtmlEntities(md);
    md = md.replace(/\r\n/g, "\n");
    md = md.replace(/[ \t]+/g, " ");
    md = md.replace(/\n{3,}/g, "\n\n");
    return md.trim();
  }
  decodeHtmlEntities(str) {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ");
  }
  createChunks(markdown, config) {
    const maxSize = config.maxChunkSize || 1e3;
    const overlap = Math.min(config.chunkOverlap || 100, Math.floor(maxSize / 2));
    const chunks = [];
    const paragraphs = markdown.split(/\n\n+/);
    let currentChunk = "";
    let currentHeading = "";
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed)
        continue;
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/m);
      if (headingMatch) {
        currentHeading = headingMatch[2].trim();
      }
      if ((currentChunk + "\n\n" + trimmed).length > maxSize && currentChunk.length > 0) {
        const chunkText = currentChunk.trim();
        chunks.push({
          index: chunks.length,
          text: chunkText,
          headingContext: currentHeading || void 0,
          tokenEstimate: Math.ceil(chunkText.length / 4),
          charCount: chunkText.length
        });
        const overlapSlice = currentChunk.slice(-overlap);
        currentChunk = `${overlapSlice}

${trimmed}`;
      } else {
        currentChunk = currentChunk ? `${currentChunk}

${trimmed}` : trimmed;
      }
    }
    if (currentChunk.trim().length > 0) {
      const chunkText = currentChunk.trim();
      chunks.push({
        index: chunks.length,
        text: chunkText,
        headingContext: currentHeading || void 0,
        tokenEstimate: Math.ceil(chunkText.length / 4),
        charCount: chunkText.length
      });
    }
    return chunks;
  }
  /**
   * Extrae una sección específica de Markdown delimitada por encabezados coincidentes.
   */
  extractSection(markdown, headingPattern) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;
    let targetHeading = null;
    let nextHeadingStart = null;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text3 = match[2].trim();
      if (targetHeading === null) {
        if (headingPattern.test(text3)) {
          targetHeading = {
            level,
            text: text3,
            start: match.index,
            end: match.index + match[0].length
          };
        }
      } else {
        if (level <= targetHeading.level) {
          nextHeadingStart = match.index;
          break;
        }
      }
    }
    if (!targetHeading)
      return null;
    const content = markdown.slice(targetHeading.end, nextHeadingStart !== null ? nextHeadingStart : markdown.length).trim();
    return {
      title: targetHeading.text,
      content
    };
  }
};

// ../../packages/core/dist/engines/TechnicalAuditorEngine.js
var import_node_tls = __toESM(require("tls"), 1);
var import_got_scraping6 = require("got-scraping");
var TechnicalAuditorEngine = class {
  name = "TechnicalAuditorEngine";
  async extract(target, options) {
    const startTime = Date.now();
    const urlStr = typeof target === "string" ? target : target.href;
    let targetUrl;
    try {
      targetUrl = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    } catch (err) {
      return {
        success: false,
        error: new ExtractionError({
          code: ExtractionErrorCode.PROTOCOL_VIOLATION,
          message: `Invalid URL target: ${urlStr}`,
          url: urlStr,
          cause: err
        }),
        durationMs: Date.now() - startTime
      };
    }
    try {
      let html3 = options?.html || "";
      let statusCode = 200;
      let finalUrl = targetUrl.href;
      const redirects = [];
      if (!options?.html) {
        const pageRes = await this.fetchTarget(targetUrl.href, options);
        html3 = pageRes.html;
        statusCode = pageRes.statusCode;
        finalUrl = pageRes.finalUrl;
        redirects.push(...pageRes.redirects);
      }
      const issues = [];
      let score = 100;
      if (statusCode >= 400) {
        score -= 20;
        issues.push({
          severity: "ERROR",
          code: "HTTP_ERROR_STATUS",
          message: `Target returned HTTP status code ${statusCode}`
        });
      }
      let ssl;
      if (options?.checkSsl !== false && targetUrl.protocol === "https:") {
        ssl = await this.auditSsl(targetUrl.hostname, options?.timeoutMs);
        if (!ssl.authorized || !ssl.valid) {
          score -= 25;
          issues.push({
            severity: "ERROR",
            code: "SSL_INVALID",
            message: ssl.authorizationError || "SSL certificate is unauthorized or invalid"
          });
        } else if (ssl.daysRemaining <= 14) {
          score -= 10;
          issues.push({
            severity: "WARN",
            code: "SSL_EXPIRING_SOON",
            message: `SSL certificate expires in ${ssl.daysRemaining} days`
          });
        }
      }
      let openGraph;
      if (options?.checkOpenGraph !== false) {
        openGraph = this.auditOpenGraph(html3);
        if (!openGraph.valid) {
          score -= 15;
          issues.push({
            severity: "WARN",
            code: "OG_INCOMPLETE",
            message: `Missing required OpenGraph tags: ${openGraph.missingRequiredTags.join(", ")}`
          });
        }
      }
      let securityTxt;
      if (options?.checkSecurityTxt !== false) {
        securityTxt = await this.auditSecurityTxt(targetUrl.origin, options?.timeoutMs);
        if (!securityTxt.found) {
          score -= 5;
          issues.push({
            severity: "INFO",
            code: "SECURITY_TXT_NOT_FOUND",
            message: "No security.txt found at standard locations"
          });
        } else if (securityTxt.isExpired) {
          score -= 10;
          issues.push({
            severity: "WARN",
            code: "SECURITY_TXT_EXPIRED",
            message: "security.txt file is expired"
          });
        }
      }
      let robotsTxt;
      if (options?.checkRobotsTxt !== false) {
        robotsTxt = await this.auditRobotsTxt(targetUrl.origin, options?.timeoutMs);
        if (robotsTxt.disallowAll) {
          score -= 10;
          issues.push({
            severity: "WARN",
            code: "ROBOTS_DISALLOW_ALL",
            message: "Robots.txt blocks crawling with Disallow: /"
          });
        }
      }
      let rdap;
      if (options?.checkRdap) {
        rdap = await this.auditRdap(targetUrl.hostname, options?.timeoutMs);
      }
      const complianceScore = Math.max(0, Math.min(100, score));
      const report = {
        targetUrl: targetUrl.href,
        finalUrl,
        statusCode,
        redirects,
        ssl,
        openGraph,
        securityTxt,
        robotsTxt,
        rdap,
        complianceScore,
        issues
      };
      return {
        success: true,
        data: report,
        durationMs: Date.now() - startTime
      };
    } catch (err) {
      const extractionError = err instanceof ExtractionError ? err : new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: err.message || "Technical audit failed",
        url: targetUrl.href,
        cause: err
      });
      return {
        success: false,
        error: extractionError,
        durationMs: Date.now() - startTime
      };
    }
  }
  async fetchTarget(url, options) {
    try {
      const res = await (0, import_got_scraping6.gotScraping)({
        url,
        headers: options?.headers,
        proxyUrl: options?.proxyUrl,
        timeout: options?.timeoutMs ? { request: options.timeoutMs } : void 0,
        maxRedirects: options?.maxRedirects ?? 5,
        followRedirect: options?.checkRedirects !== false,
        throwHttpErrors: false
      });
      const redirects = (res.redirectUrls || []).map((u) => ({
        url: typeof u === "string" ? u : u.href,
        statusCode: 301
      }));
      return {
        html: res.body,
        statusCode: res.statusCode,
        finalUrl: res.url || url,
        redirects
      };
    } catch (err) {
      if (err instanceof ExtractionError)
        throw err;
      const msg = err.message || "";
      if (msg.includes("Timeout") || msg.includes("timeout") || err.name === "TimeoutError") {
        throw new ExtractionError({
          code: ExtractionErrorCode.EXTRACTION_TIMEOUT,
          message: `Target fetch timed out: ${msg}`,
          url,
          cause: err,
          retryable: true
        });
      }
      throw new ExtractionError({
        code: ExtractionErrorCode.NETWORK_BLOCKED,
        message: `Target fetch failed: ${msg}`,
        url,
        cause: err,
        retryable: true
      });
    }
  }
  async auditSsl(hostname, timeoutMs = 5e3) {
    return new Promise((resolve) => {
      const socket = import_node_tls.default.connect({
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false
      }, () => {
        const cert = socket.getPeerCertificate(true);
        const authorized = socket.authorized;
        const authorizationError = socket.authorizationError ? String(socket.authorizationError) : void 0;
        const validTo = cert.valid_to || "";
        const validFrom = cert.valid_from || "";
        const validToTime = validTo ? new Date(validTo).getTime() : 0;
        const daysRemaining = validToTime > 0 ? Math.floor((validToTime - Date.now()) / (1e3 * 60 * 60 * 24)) : 0;
        const rawIssuer = cert.issuer ? cert.issuer.O || cert.issuer.CN : void 0;
        const issuer = Array.isArray(rawIssuer) ? rawIssuer.join(", ") : typeof rawIssuer === "string" ? rawIssuer : "Unknown";
        const protocol = socket.getProtocol() || "TLS";
        socket.destroy();
        resolve({
          valid: authorized && daysRemaining > 0,
          issuer,
          validFrom,
          validTo,
          daysRemaining,
          protocol,
          authorized,
          authorizationError
        });
      });
      socket.on("error", (err) => {
        socket.destroy();
        resolve({
          valid: false,
          issuer: "Unknown",
          validFrom: "",
          validTo: "",
          daysRemaining: 0,
          protocol: "Unknown",
          authorized: false,
          authorizationError: err.message
        });
      });
      socket.setTimeout(timeoutMs, () => {
        socket.destroy();
        resolve({
          valid: false,
          issuer: "Unknown",
          validFrom: "",
          validTo: "",
          daysRemaining: 0,
          protocol: "Unknown",
          authorized: false,
          authorizationError: "TLS handshake timeout"
        });
      });
    });
  }
  auditOpenGraph(html3) {
    const getMeta = (prop2) => {
      const match = html3.match(new RegExp(`<meta\\s+property=["']${prop2}["']\\s+content=["']([^"']+)["']`, "i")) || html3.match(new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${prop2}["']`, "i"));
      return match ? match[1].trim() : void 0;
    };
    const title = getMeta("og:title");
    const description = getMeta("og:description");
    const image = getMeta("og:image");
    const type = getMeta("og:type");
    const missingRequiredTags = [];
    if (!title)
      missingRequiredTags.push("og:title");
    if (!description)
      missingRequiredTags.push("og:description");
    if (!image)
      missingRequiredTags.push("og:image");
    if (!type)
      missingRequiredTags.push("og:type");
    return {
      valid: missingRequiredTags.length === 0,
      title,
      description,
      image,
      type,
      missingRequiredTags
    };
  }
  async auditSecurityTxt(origin, timeoutMs = 5e3) {
    const locations = [`${origin}/.well-known/security.txt`, `${origin}/security.txt`];
    for (const loc of locations) {
      try {
        const res = await (0, import_got_scraping6.gotScraping)({
          url: loc,
          timeout: { request: timeoutMs },
          throwHttpErrors: false
        });
        if (res.statusCode === 200 && res.body.includes("Contact:")) {
          const contacts = [];
          const contactMatches = res.body.match(/^Contact:\s*(.+)$/gim) || [];
          for (const cm of contactMatches) {
            const val2 = cm.replace(/^Contact:\s*/i, "").trim();
            if (val2)
              contacts.push(val2);
          }
          const expiresMatch = res.body.match(/^Expires:\s*(.+)$/im);
          const expires = expiresMatch ? expiresMatch[1].trim() : void 0;
          const encMatch = res.body.match(/^Encryption:\s*(.+)$/im);
          const encryption = encMatch ? encMatch[1].trim() : void 0;
          const isExpired = expires ? new Date(expires).getTime() < Date.now() : false;
          return {
            found: true,
            location: loc,
            contacts,
            expires,
            isExpired,
            encryption
          };
        }
      } catch {
      }
    }
    return {
      found: false,
      contacts: []
    };
  }
  async auditRobotsTxt(origin, timeoutMs = 5e3) {
    try {
      const res = await (0, import_got_scraping6.gotScraping)({
        url: `${origin}/robots.txt`,
        timeout: { request: timeoutMs },
        throwHttpErrors: false
      });
      if (res.statusCode === 200 && typeof res.body === "string") {
        const lines = res.body.split(/\r?\n/);
        const sitemaps = [];
        const userAgents = [];
        let currentUserAgent = "";
        let disallowAll = false;
        for (const line of lines) {
          const clean = line.replace(/#.*$/, "").trim();
          if (!clean)
            continue;
          const sitemapMatch = clean.match(/^Sitemap:\s*(.+)$/i);
          if (sitemapMatch) {
            sitemaps.push(sitemapMatch[1].trim());
            continue;
          }
          const uaMatch = clean.match(/^User-agent:\s*(.+)$/i);
          if (uaMatch) {
            currentUserAgent = uaMatch[1].trim();
            if (!userAgents.includes(currentUserAgent)) {
              userAgents.push(currentUserAgent);
            }
            continue;
          }
          const disallowMatch = clean.match(/^Disallow:\s*(.+)$/i);
          if (disallowMatch && currentUserAgent === "*") {
            const path2 = disallowMatch[1].trim();
            if (path2 === "/") {
              disallowAll = true;
            }
          }
        }
        return {
          found: true,
          sitemaps: Array.from(new Set(sitemaps)),
          disallowAll,
          userAgents
        };
      }
    } catch {
    }
    return {
      found: false,
      sitemaps: [],
      disallowAll: false,
      userAgents: []
    };
  }
  async auditRdap(hostname, timeoutMs = 5e3) {
    try {
      const parts = hostname.split(".");
      const domain = parts.slice(-2).join(".");
      const res = await (0, import_got_scraping6.gotScraping)({
        url: `https://rdap.org/domain/${domain}`,
        timeout: { request: timeoutMs },
        throwHttpErrors: false
      });
      if (res.statusCode === 200) {
        const parsed = JSON.parse(res.body);
        let registrationDate;
        let expirationDate;
        if (Array.isArray(parsed.events)) {
          for (const ev of parsed.events) {
            if (ev.eventAction === "registration")
              registrationDate = ev.eventDate;
            if (ev.eventAction === "expiration")
              expirationDate = ev.eventDate;
          }
        }
        let registrar;
        if (Array.isArray(parsed.entities)) {
          for (const ent of parsed.entities) {
            if (Array.isArray(ent.roles) && ent.roles.includes("registrar")) {
              const vcard = ent.vcardArray?.[1];
              if (Array.isArray(vcard)) {
                const fn = vcard.find((item) => item[0] === "fn");
                if (fn)
                  registrar = fn[3];
              }
            }
          }
        }
        const nameservers = [];
        if (Array.isArray(parsed.nameservers)) {
          for (const ns of parsed.nameservers) {
            if (ns.ldhName)
              nameservers.push(ns.ldhName);
          }
        }
        return {
          domain,
          registrar,
          registrationDate,
          expirationDate,
          nameservers
        };
      }
    } catch {
    }
    return void 0;
  }
};

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/options.js
var defaultOpts = {
  xml: false,
  decodeEntities: true
};
var options_default = defaultOpts;
var xmlModeDefault = {
  _useHtmlParser2: true,
  xmlMode: true
};
function flatten(options) {
  return (options === null || options === void 0 ? void 0 : options.xml) ? typeof options.xml === "boolean" ? xmlModeDefault : { ...xmlModeDefault, ...options.xml } : options !== null && options !== void 0 ? options : void 0;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/static.js
var static_exports = {};
__export(static_exports, {
  contains: () => contains,
  html: () => html,
  merge: () => merge,
  parseHTML: () => parseHTML,
  root: () => root,
  text: () => text,
  xml: () => xml
});

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  DocumentPosition: () => DocumentPosition,
  append: () => append,
  appendChild: () => appendChild,
  compareDocumentPosition: () => compareDocumentPosition,
  existsOne: () => existsOne,
  filter: () => filter,
  find: () => find,
  findAll: () => findAll,
  findOne: () => findOne,
  findOneChild: () => findOneChild,
  getAttributeValue: () => getAttributeValue,
  getChildren: () => getChildren,
  getElementById: () => getElementById,
  getElements: () => getElements,
  getElementsByClassName: () => getElementsByClassName,
  getElementsByTagName: () => getElementsByTagName,
  getElementsByTagType: () => getElementsByTagType,
  getFeed: () => getFeed,
  getInnerHTML: () => getInnerHTML,
  getName: () => getName,
  getOuterHTML: () => getOuterHTML,
  getParent: () => getParent,
  getSiblings: () => getSiblings,
  getText: () => getText,
  hasAttrib: () => hasAttrib,
  hasChildren: () => hasChildren,
  innerText: () => innerText,
  isCDATA: () => isCDATA,
  isComment: () => isComment,
  isDocument: () => isDocument,
  isTag: () => isTag2,
  isText: () => isText,
  nextElementSibling: () => nextElementSibling,
  prepend: () => prepend,
  prependChild: () => prependChild,
  prevElementSibling: () => prevElementSibling,
  removeElement: () => removeElement,
  removeSubsets: () => removeSubsets,
  replaceElement: () => replaceElement,
  testElement: () => testElement,
  textContent: () => textContent,
  uniqueSort: () => uniqueSort
});

// ../../node_modules/.pnpm/domelementtype@2.3.0/node_modules/domelementtype/lib/esm/index.js
var ElementType;
(function(ElementType2) {
  ElementType2["Root"] = "root";
  ElementType2["Text"] = "text";
  ElementType2["Directive"] = "directive";
  ElementType2["Comment"] = "comment";
  ElementType2["Script"] = "script";
  ElementType2["Style"] = "style";
  ElementType2["Tag"] = "tag";
  ElementType2["CDATA"] = "cdata";
  ElementType2["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
var Root = ElementType.Root;
var Text = ElementType.Text;
var Directive = ElementType.Directive;
var Comment = ElementType.Comment;
var Script = ElementType.Script;
var Style = ElementType.Style;
var Tag = ElementType.Tag;
var CDATA = ElementType.CDATA;
var Doctype = ElementType.Doctype;

// ../../node_modules/.pnpm/domhandler@5.0.3/node_modules/domhandler/lib/esm/node.js
var Node = class {
  constructor() {
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
  // Read-write aliases for properties
  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode() {
    return this.parent;
  }
  set parentNode(parent2) {
    this.parent = parent2;
  }
  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling() {
    return this.prev;
  }
  set previousSibling(prev2) {
    this.prev = prev2;
  }
  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling() {
    return this.next;
  }
  set nextSibling(next2) {
    this.next = next2;
  }
  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
  /**
   * @param data The content of the data node
   */
  constructor(data2) {
    super();
    this.data = data2;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue() {
    return this.data;
  }
  set nodeValue(data2) {
    this.data = data2;
  }
};
var Text2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Text;
  }
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Comment;
  }
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  constructor(name, data2) {
    super(data2);
    this.name = name;
    this.type = ElementType.Directive;
  }
  get nodeType() {
    return 1;
  }
};
var NodeWithChildren = class extends Node {
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(children2) {
    super();
    this.children = children2;
  }
  // Aliases
  /** First child of the node. */
  get firstChild() {
    var _a2;
    return (_a2 = this.children[0]) !== null && _a2 !== void 0 ? _a2 : null;
  }
  /** Last child of the node. */
  get lastChild() {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }
  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes() {
    return this.children;
  }
  set childNodes(children2) {
    this.children = children2;
  }
};
var CDATA2 = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.CDATA;
  }
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.Root;
  }
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(name, attribs, children2 = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
    super(children2);
    this.name = name;
    this.attribs = attribs;
    this.type = type;
  }
  get nodeType() {
    return 1;
  }
  // DOM Level 1 aliases
  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName() {
    return this.name;
  }
  set tagName(name) {
    this.name = name;
  }
  get attributes() {
    return Object.keys(this.attribs).map((name) => {
      var _a2, _b;
      return {
        name,
        value: this.attribs[name],
        namespace: (_a2 = this["x-attribsNamespace"]) === null || _a2 === void 0 ? void 0 : _a2[name],
        prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
      };
    });
  }
};
function isTag2(node) {
  return isTag(node);
}
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
function isText(node) {
  return node.type === ElementType.Text;
}
function isComment(node) {
  return node.type === ElementType.Comment;
}
function isDirective(node) {
  return node.type === ElementType.Directive;
}
function isDocument(node) {
  return node.type === ElementType.Root;
}
function hasChildren(node) {
  return Object.prototype.hasOwnProperty.call(node, "children");
}
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text2(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children2 = recursive ? cloneChildren(node.children) : [];
    const clone2 = new Element(node.name, { ...node.attribs }, children2);
    children2.forEach((child) => child.parent = clone2);
    if (node.namespace != null) {
      clone2.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone2["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone2["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone2;
  } else if (isCDATA(node)) {
    const children2 = recursive ? cloneChildren(node.children) : [];
    const clone2 = new CDATA2(children2);
    children2.forEach((child) => child.parent = clone2);
    result = clone2;
  } else if (isDocument(node)) {
    const children2 = recursive ? cloneChildren(node.children) : [];
    const clone2 = new Document(children2);
    children2.forEach((child) => child.parent = clone2);
    if (node["x-mode"]) {
      clone2["x-mode"] = node["x-mode"];
    }
    result = clone2;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
function cloneChildren(childs) {
  const children2 = childs.map((child) => cloneNode(child, true));
  for (let i = 1; i < children2.length; i++) {
    children2[i].prev = children2[i - 1];
    children2[i - 1].next = children2[i];
  }
  return children2;
}

// ../../node_modules/.pnpm/domhandler@5.0.3/node_modules/domhandler/lib/esm/index.js
var defaultOpts2 = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts2;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts2;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }
  onparserinit(parser) {
    this.parser = parser;
  }
  // Resets the handler back to starting state
  onreset() {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  }
  // Signals the handler that parsing is done
  onend() {
    if (this.done)
      return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  }
  onerror(error) {
    this.handleCallback(error);
  }
  onclosetag() {
    this.lastNode = null;
    const elem = this.tagStack.pop();
    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(elem);
  }
  onopentag(name, attribs) {
    const type = this.options.xmlMode ? ElementType.Tag : void 0;
    const element = new Element(name, attribs, void 0, type);
    this.addNode(element);
    this.tagStack.push(element);
  }
  ontext(data2) {
    const { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      lastNode.data += data2;
      if (this.options.withEndIndices) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      const node = new Text2(data2);
      this.addNode(node);
      this.lastNode = node;
    }
  }
  oncomment(data2) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data2;
      return;
    }
    const node = new Comment2(data2);
    this.addNode(node);
    this.lastNode = node;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    const text3 = new Text2("");
    const node = new CDATA2([text3]);
    this.addNode(node);
    text3.parent = node;
    this.lastNode = text3;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name, data2) {
    const node = new ProcessingInstruction(name, data2);
    this.addNode(node);
  }
  handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  }
  addNode(node) {
    const parent2 = this.tagStack[this.tagStack.length - 1];
    const previousSibling = parent2.children[parent2.children.length - 1];
    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices) {
      node.endIndex = this.parser.endIndex;
    }
    parent2.children.push(node);
    if (previousSibling) {
      node.prev = previousSibling;
      previousSibling.next = node;
    }
    node.parent = parent2;
    this.lastNode = null;
  }
};

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/generated/decode-data-html.js
var decode_data_html_default = new Uint16Array(
  // prettier-ignore
  '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c) => c.charCodeAt(0))
);

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/generated/decode-data-xml.js
var decode_data_xml_default = new Uint16Array(
  // prettier-ignore
  "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c) => c.charCodeAt(0))
);

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/decode_codepoint.js
var _a;
var decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint(codePoint) {
  var _a2;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a2 = decodeMap.get(codePoint)) !== null && _a2 !== void 0 ? _a2 : codePoint;
}

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/decode.js
var CharCodes;
(function(CharCodes3) {
  CharCodes3[CharCodes3["NUM"] = 35] = "NUM";
  CharCodes3[CharCodes3["SEMI"] = 59] = "SEMI";
  CharCodes3[CharCodes3["EQUALS"] = 61] = "EQUALS";
  CharCodes3[CharCodes3["ZERO"] = 48] = "ZERO";
  CharCodes3[CharCodes3["NINE"] = 57] = "NINE";
  CharCodes3[CharCodes3["LOWER_A"] = 97] = "LOWER_A";
  CharCodes3[CharCodes3["LOWER_F"] = 102] = "LOWER_F";
  CharCodes3[CharCodes3["LOWER_X"] = 120] = "LOWER_X";
  CharCodes3[CharCodes3["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes3[CharCodes3["UPPER_A"] = 65] = "UPPER_A";
  CharCodes3[CharCodes3["UPPER_F"] = 70] = "UPPER_F";
  CharCodes3[CharCodes3["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end2, base) {
    if (start !== end2) {
      const digitCount = end2 - start;
      this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a2;
    if (this.consumed <= expectedLength) {
      (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a2;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a2;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
};
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
var htmlDecoder = getDecoder(decode_data_html_default);
var xmlDecoder = getDecoder(decode_data_xml_default);

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/generated/encode-html.js
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
var encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/escape.js
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.prototype.codePointAt != null ? (str, index2) => str.codePointAt(index2) : (
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    (c, index2) => (c.charCodeAt(index2) & 64512) === 55296 ? (c.charCodeAt(index2) - 55296) * 1024 + c.charCodeAt(index2 + 1) - 56320 + 65536 : c.charCodeAt(index2)
  )
);
function encodeXML(str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = xmlReplacer.exec(str)) !== null) {
    const i = match.index;
    const char = str.charCodeAt(i);
    const next2 = xmlCodeMap.get(char);
    if (next2 !== void 0) {
      ret += str.substring(lastIdx, i) + next2;
      lastIdx = i + 1;
    } else {
      ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
      lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
    }
  }
  return ret + str.substr(lastIdx);
}
function getEscaper(regex, map2) {
  return function escape3(data2) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data2)) {
      if (lastIdx !== match.index) {
        result += data2.substring(lastIdx, match.index);
      }
      result += map2.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data2.substring(lastIdx);
  };
}
var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));

// ../../node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/index.js
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));

// ../../node_modules/.pnpm/dom-serializer@2.0.0/node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((val2) => [val2.toLowerCase(), val2]));
var attributeNames = new Map([
  "definitionURL",
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((val2) => [val2.toLowerCase(), val2]));

// ../../node_modules/.pnpm/dom-serializer@2.0.0/node_modules/dom-serializer/lib/esm/index.js
var unencodedElements = /* @__PURE__ */ new Set([
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]);
function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
function formatAttributes(attributes2, opts) {
  var _a2;
  if (!attributes2)
    return;
  const encode = ((_a2 = opts.encodeEntities) !== null && _a2 !== void 0 ? _a2 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes2).map((key) => {
    var _a3, _b;
    const value = (_a3 = attributes2[key]) !== null && _a3 !== void 0 ? _a3 : "";
    if (opts.xmlMode === "foreign") {
      key = (_b = attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key;
    }
    return `${key}="${encode(value)}"`;
  }).join(" ");
}
var singleTag = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function render(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  let output = "";
  for (let i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
var esm_default = render;
function renderNode(node, options) {
  switch (node.type) {
    case Root:
      return render(node.children, options);
    // @ts-expect-error We don't use `Doctype` yet
    case Doctype:
    case Directive:
      return renderDirective(node);
    case Comment:
      return renderComment(node);
    case CDATA:
      return renderCdata(node);
    case Script:
    case Style:
    case Tag:
      return renderTag(node, options);
    case Text:
      return renderText(node, options);
  }
}
var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
function renderTag(elem, opts) {
  var _a2;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a2 = elementNames.get(elem.name)) !== null && _a2 !== void 0 ? _a2 : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = { ...opts, xmlMode: false };
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = { ...opts, xmlMode: "foreign" };
  }
  let tag = `<${elem.name}`;
  const attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += ` ${attribs}`;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? (
    // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
    opts.selfClosingTags !== false
  ) : (
    // User explicitly asked for self-closing tags, even in HTML mode
    opts.selfClosingTags && singleTag.has(elem.name)
  ))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += `</${elem.name}>`;
    }
  }
  return tag;
}
function renderDirective(elem) {
  return `<${elem.data}>`;
}
function renderText(elem, opts) {
  var _a2;
  let data2 = elem.data || "";
  if (((_a2 = opts.encodeEntities) !== null && _a2 !== void 0 ? _a2 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data2 = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data2) : escapeText(data2);
  }
  return data2;
}
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
  return `<!--${elem.data}-->`;
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/stringify.js
function getOuterHTML(node, options) {
  return esm_default(node, options);
}
function getInnerHTML(node, options) {
  return hasChildren(node) ? node.children.map((node2) => getOuterHTML(node2, options)).join("") : "";
}
function getText(node) {
  if (Array.isArray(node))
    return node.map(getText).join("");
  if (isTag2(node))
    return node.name === "br" ? "\n" : getText(node.children);
  if (isCDATA(node))
    return getText(node.children);
  if (isText(node))
    return node.data;
  return "";
}
function textContent(node) {
  if (Array.isArray(node))
    return node.map(textContent).join("");
  if (hasChildren(node) && !isComment(node)) {
    return textContent(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}
function innerText(node) {
  if (Array.isArray(node))
    return node.map(innerText).join("");
  if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) {
    return innerText(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/traversal.js
function getChildren(elem) {
  return hasChildren(elem) ? elem.children : [];
}
function getParent(elem) {
  return elem.parent || null;
}
function getSiblings(elem) {
  const parent2 = getParent(elem);
  if (parent2 != null)
    return getChildren(parent2);
  const siblings2 = [elem];
  let { prev: prev2, next: next2 } = elem;
  while (prev2 != null) {
    siblings2.unshift(prev2);
    ({ prev: prev2 } = prev2);
  }
  while (next2 != null) {
    siblings2.push(next2);
    ({ next: next2 } = next2);
  }
  return siblings2;
}
function getAttributeValue(elem, name) {
  var _a2;
  return (_a2 = elem.attribs) === null || _a2 === void 0 ? void 0 : _a2[name];
}
function hasAttrib(elem, name) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
function getName(elem) {
  return elem.name;
}
function nextElementSibling(elem) {
  let { next: next2 } = elem;
  while (next2 !== null && !isTag2(next2))
    ({ next: next2 } = next2);
  return next2;
}
function prevElementSibling(elem) {
  let { prev: prev2 } = elem;
  while (prev2 !== null && !isTag2(prev2))
    ({ prev: prev2 } = prev2);
  return prev2;
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/manipulation.js
function removeElement(elem) {
  if (elem.prev)
    elem.prev.next = elem.next;
  if (elem.next)
    elem.next.prev = elem.prev;
  if (elem.parent) {
    const childs = elem.parent.children;
    const childsIndex = childs.lastIndexOf(elem);
    if (childsIndex >= 0) {
      childs.splice(childsIndex, 1);
    }
  }
  elem.next = null;
  elem.prev = null;
  elem.parent = null;
}
function replaceElement(elem, replacement) {
  const prev2 = replacement.prev = elem.prev;
  if (prev2) {
    prev2.next = replacement;
  }
  const next2 = replacement.next = elem.next;
  if (next2) {
    next2.prev = replacement;
  }
  const parent2 = replacement.parent = elem.parent;
  if (parent2) {
    const childs = parent2.children;
    childs[childs.lastIndexOf(elem)] = replacement;
    elem.parent = null;
  }
}
function appendChild(parent2, child) {
  removeElement(child);
  child.next = null;
  child.parent = parent2;
  if (parent2.children.push(child) > 1) {
    const sibling = parent2.children[parent2.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
function append(elem, next2) {
  removeElement(next2);
  const { parent: parent2 } = elem;
  const currNext = elem.next;
  next2.next = currNext;
  next2.prev = elem;
  elem.next = next2;
  next2.parent = parent2;
  if (currNext) {
    currNext.prev = next2;
    if (parent2) {
      const childs = parent2.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next2);
    }
  } else if (parent2) {
    parent2.children.push(next2);
  }
}
function prependChild(parent2, child) {
  removeElement(child);
  child.parent = parent2;
  child.prev = null;
  if (parent2.children.unshift(child) !== 1) {
    const sibling = parent2.children[1];
    sibling.prev = child;
    child.next = sibling;
  } else {
    child.next = null;
  }
}
function prepend(elem, prev2) {
  removeElement(prev2);
  const { parent: parent2 } = elem;
  if (parent2) {
    const childs = parent2.children;
    childs.splice(childs.indexOf(elem), 0, prev2);
  }
  if (elem.prev) {
    elem.prev.next = prev2;
  }
  prev2.parent = parent2;
  prev2.prev = elem.prev;
  prev2.next = elem;
  elem.prev = prev2;
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/querying.js
function filter(test, node, recurse = true, limit = Infinity) {
  return find(test, Array.isArray(node) ? node : [node], recurse, limit);
}
function find(test, nodes, recurse, limit) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (indexStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (test(elem)) {
      result.push(elem);
      if (--limit <= 0)
        return result;
    }
    if (recurse && hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}
function findOneChild(test, nodes) {
  return nodes.find(test);
}
function findOne(test, nodes, recurse = true) {
  const searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
  for (let i = 0; i < searchedNodes.length; i++) {
    const node = searchedNodes[i];
    if (isTag2(node) && test(node)) {
      return node;
    }
    if (recurse && hasChildren(node) && node.children.length > 0) {
      const found = findOne(test, node.children, true);
      if (found)
        return found;
    }
  }
  return null;
}
function existsOne(test, nodes) {
  return (Array.isArray(nodes) ? nodes : [nodes]).some((node) => isTag2(node) && test(node) || hasChildren(node) && existsOne(test, node.children));
}
function findAll(test, nodes) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (isTag2(elem) && test(elem))
      result.push(elem);
    if (hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/legacy.js
var Checks = {
  tag_name(name) {
    if (typeof name === "function") {
      return (elem) => isTag2(elem) && name(elem.name);
    } else if (name === "*") {
      return isTag2;
    }
    return (elem) => isTag2(elem) && elem.name === name;
  },
  tag_type(type) {
    if (typeof type === "function") {
      return (elem) => type(elem.type);
    }
    return (elem) => elem.type === type;
  },
  tag_contains(data2) {
    if (typeof data2 === "function") {
      return (elem) => isText(elem) && data2(elem.data);
    }
    return (elem) => isText(elem) && elem.data === data2;
  }
};
function getAttribCheck(attrib, value) {
  if (typeof value === "function") {
    return (elem) => isTag2(elem) && value(elem.attribs[attrib]);
  }
  return (elem) => isTag2(elem) && elem.attribs[attrib] === value;
}
function combineFuncs(a, b) {
  return (elem) => a(elem) || b(elem);
}
function compileTest(options) {
  const funcs = Object.keys(options).map((key) => {
    const value = options[key];
    return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
function testElement(options, node) {
  const test = compileTest(options);
  return test ? test(node) : true;
}
function getElements(options, nodes, recurse, limit = Infinity) {
  const test = compileTest(options);
  return test ? filter(test, nodes, recurse, limit) : [];
}
function getElementById(id, nodes, recurse = true) {
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return findOne(getAttribCheck("id", id), nodes, recurse);
}
function getElementsByTagName(tagName, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_name"](tagName), nodes, recurse, limit);
}
function getElementsByClassName(className, nodes, recurse = true, limit = Infinity) {
  return filter(getAttribCheck("class", className), nodes, recurse, limit);
}
function getElementsByTagType(type, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_type"](type), nodes, recurse, limit);
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/helpers.js
function removeSubsets(nodes) {
  let idx = nodes.length;
  while (--idx >= 0) {
    const node = nodes[idx];
    if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }
    for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
  }
  return nodes;
}
var DocumentPosition;
(function(DocumentPosition2) {
  DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));
function compareDocumentPosition(nodeA, nodeB) {
  const aParents = [];
  const bParents = [];
  if (nodeA === nodeB) {
    return 0;
  }
  let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }
  current = hasChildren(nodeB) ? nodeB : nodeB.parent;
  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }
  const maxIdx = Math.min(aParents.length, bParents.length);
  let idx = 0;
  while (idx < maxIdx && aParents[idx] === bParents[idx]) {
    idx++;
  }
  if (idx === 0) {
    return DocumentPosition.DISCONNECTED;
  }
  const sharedParent = aParents[idx - 1];
  const siblings2 = sharedParent.children;
  const aSibling = aParents[idx];
  const bSibling = bParents[idx];
  if (siblings2.indexOf(aSibling) > siblings2.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
    }
    return DocumentPosition.FOLLOWING;
  }
  if (sharedParent === nodeA) {
    return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
  }
  return DocumentPosition.PRECEDING;
}
function uniqueSort(nodes) {
  nodes = nodes.filter((node, i, arr) => !arr.includes(node, i + 1));
  nodes.sort((a, b) => {
    const relative = compareDocumentPosition(a, b);
    if (relative & DocumentPosition.PRECEDING) {
      return -1;
    } else if (relative & DocumentPosition.FOLLOWING) {
      return 1;
    }
    return 0;
  });
  return nodes;
}

// ../../node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/feeds.js
function getFeed(doc) {
  const feedRoot = getOneElement(isValidFeed, doc);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
function getAtomFeed(feedRoot) {
  var _a2;
  const childs = feedRoot.children;
  const feed = {
    type: "atom",
    items: getElementsByTagName("entry", childs).map((item) => {
      var _a3;
      const { children: children2 } = item;
      const entry = { media: getMediaElements(children2) };
      addConditionally(entry, "id", "id", children2);
      addConditionally(entry, "title", "title", children2);
      const href2 = (_a3 = getOneElement("link", children2)) === null || _a3 === void 0 ? void 0 : _a3.attribs["href"];
      if (href2) {
        entry.link = href2;
      }
      const description = fetch2("summary", children2) || fetch2("content", children2);
      if (description) {
        entry.description = description;
      }
      const pubDate = fetch2("updated", children2);
      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }
      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs);
  addConditionally(feed, "title", "title", childs);
  const href = (_a2 = getOneElement("link", childs)) === null || _a2 === void 0 ? void 0 : _a2.attribs["href"];
  if (href) {
    feed.link = href;
  }
  addConditionally(feed, "description", "subtitle", childs);
  const updated = fetch2("updated", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "email", childs, true);
  return feed;
}
function getRssFeed(feedRoot) {
  var _a2, _b;
  const childs = (_b = (_a2 = getOneElement("channel", feedRoot.children)) === null || _a2 === void 0 ? void 0 : _a2.children) !== null && _b !== void 0 ? _b : [];
  const feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: getElementsByTagName("item", feedRoot.children).map((item) => {
      const { children: children2 } = item;
      const entry = { media: getMediaElements(children2) };
      addConditionally(entry, "id", "guid", children2);
      addConditionally(entry, "title", "title", children2);
      addConditionally(entry, "link", "link", children2);
      addConditionally(entry, "description", "description", children2);
      const pubDate = fetch2("pubDate", children2) || fetch2("dc:date", children2);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs);
  addConditionally(feed, "link", "link", childs);
  addConditionally(feed, "description", "description", childs);
  const updated = fetch2("lastBuildDate", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "managingEditor", childs, true);
  return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
  "fileSize",
  "bitrate",
  "framerate",
  "samplingrate",
  "channels",
  "duration",
  "height",
  "width"
];
function getMediaElements(where) {
  return getElementsByTagName("media:content", where).map((elem) => {
    const { attribs } = elem;
    const media = {
      medium: attribs["medium"],
      isDefault: !!attribs["isDefault"]
    };
    for (const attrib of MEDIA_KEYS_STRING) {
      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }
    for (const attrib of MEDIA_KEYS_INT) {
      if (attribs[attrib]) {
        media[attrib] = parseInt(attribs[attrib], 10);
      }
    }
    if (attribs["expression"]) {
      media.expression = attribs["expression"];
    }
    return media;
  });
}
function getOneElement(tagName, node) {
  return getElementsByTagName(tagName, node, true, 1)[0];
}
function fetch2(tagName, where, recurse = false) {
  return textContent(getElementsByTagName(tagName, where, recurse, 1)).trim();
}
function addConditionally(obj, prop2, tagName, where, recurse = false) {
  const val2 = fetch2(tagName, where, recurse);
  if (val2)
    obj[prop2] = val2;
}
function isValidFeed(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/static.js
function render2(that, dom, options) {
  if (!that)
    return "";
  return that(dom !== null && dom !== void 0 ? dom : that._root.children, null, void 0, options).toString();
}
function isOptions(dom, options) {
  return !options && typeof dom === "object" && dom != null && !("length" in dom) && !("type" in dom);
}
function html(dom, options) {
  const toRender = isOptions(dom) ? (options = dom, void 0) : dom;
  const opts = {
    ...options_default,
    ...this === null || this === void 0 ? void 0 : this._options,
    ...flatten(options !== null && options !== void 0 ? options : {})
  };
  return render2(this, toRender, opts);
}
function xml(dom) {
  const options = { ...this._options, xmlMode: true };
  return render2(this, dom, options);
}
function text(elements) {
  const elems = elements ? elements : this ? this.root() : [];
  let ret = "";
  for (let i = 0; i < elems.length; i++) {
    ret += textContent(elems[i]);
  }
  return ret;
}
function parseHTML(data2, context, keepScripts = typeof context === "boolean" ? context : false) {
  if (!data2 || typeof data2 !== "string") {
    return null;
  }
  if (typeof context === "boolean") {
    keepScripts = context;
  }
  const parsed = this.load(data2, options_default, false);
  if (!keepScripts) {
    parsed("script").remove();
  }
  return parsed.root()[0].children.slice();
}
function root() {
  return this(this._root);
}
function contains(container, contained) {
  if (contained === container) {
    return false;
  }
  let next2 = contained;
  while (next2 && next2 !== next2.parent) {
    next2 = next2.parent;
    if (next2 === container) {
      return true;
    }
  }
  return false;
}
function merge(arr1, arr2) {
  if (!isArrayLike(arr1) || !isArrayLike(arr2)) {
    return;
  }
  let newLength = arr1.length;
  const len = +arr2.length;
  for (let i = 0; i < len; i++) {
    arr1[newLength++] = arr2[i];
  }
  arr1.length = newLength;
  return arr1;
}
function isArrayLike(item) {
  if (Array.isArray(item)) {
    return true;
  }
  if (typeof item !== "object" || !Object.prototype.hasOwnProperty.call(item, "length") || typeof item.length !== "number" || item.length < 0) {
    return false;
  }
  for (let i = 0; i < item.length; i++) {
    if (!(i in item)) {
      return false;
    }
  }
  return true;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/attributes.js
var attributes_exports = {};
__export(attributes_exports, {
  addClass: () => addClass,
  attr: () => attr,
  data: () => data,
  hasClass: () => hasClass,
  prop: () => prop,
  removeAttr: () => removeAttr,
  removeClass: () => removeClass,
  toggleClass: () => toggleClass,
  val: () => val
});

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/utils.js
function isCheerio(maybeCheerio) {
  return maybeCheerio.cheerio != null;
}
function camelCase(str) {
  return str.replace(/[_.-](\w|$)/g, (_, x) => x.toUpperCase());
}
function cssCase(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase();
}
function domEach(array, fn) {
  const len = array.length;
  for (let i = 0; i < len; i++)
    fn(array[i], i);
  return array;
}
function cloneDom(dom) {
  const clone2 = "length" in dom ? Array.prototype.map.call(dom, (el) => cloneNode(el, true)) : [cloneNode(dom, true)];
  const root2 = new Document(clone2);
  clone2.forEach((node) => {
    node.parent = root2;
  });
  return clone2;
}
var CharacterCodes;
(function(CharacterCodes2) {
  CharacterCodes2[CharacterCodes2["LowerA"] = 97] = "LowerA";
  CharacterCodes2[CharacterCodes2["LowerZ"] = 122] = "LowerZ";
  CharacterCodes2[CharacterCodes2["UpperA"] = 65] = "UpperA";
  CharacterCodes2[CharacterCodes2["UpperZ"] = 90] = "UpperZ";
  CharacterCodes2[CharacterCodes2["Exclamation"] = 33] = "Exclamation";
})(CharacterCodes || (CharacterCodes = {}));
function isHtml(str) {
  const tagStart = str.indexOf("<");
  if (tagStart < 0 || tagStart > str.length - 3)
    return false;
  const tagChar = str.charCodeAt(tagStart + 1);
  return (tagChar >= CharacterCodes.LowerA && tagChar <= CharacterCodes.LowerZ || tagChar >= CharacterCodes.UpperA && tagChar <= CharacterCodes.UpperZ || tagChar === CharacterCodes.Exclamation) && str.includes(">", tagStart + 2);
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/attributes.js
var hasOwn = Object.prototype.hasOwnProperty;
var rspace = /\s+/;
var dataAttrPrefix = "data-";
var primitives = {
  null: null,
  true: true,
  false: false
};
var rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i;
var rbrace = /^{[^]*}$|^\[[^]*]$/;
function getAttr(elem, name, xmlMode) {
  var _a2;
  if (!elem || !isTag2(elem))
    return void 0;
  (_a2 = elem.attribs) !== null && _a2 !== void 0 ? _a2 : elem.attribs = {};
  if (!name) {
    return elem.attribs;
  }
  if (hasOwn.call(elem.attribs, name)) {
    return !xmlMode && rboolean.test(name) ? name : elem.attribs[name];
  }
  if (elem.name === "option" && name === "value") {
    return text(elem.children);
  }
  if (elem.name === "input" && (elem.attribs["type"] === "radio" || elem.attribs["type"] === "checkbox") && name === "value") {
    return "on";
  }
  return void 0;
}
function setAttr(el, name, value) {
  if (value === null) {
    removeAttribute(el, name);
  } else {
    el.attribs[name] = `${value}`;
  }
}
function attr(name, value) {
  if (typeof name === "object" || value !== void 0) {
    if (typeof value === "function") {
      if (typeof name !== "string") {
        {
          throw new Error("Bad combination of arguments.");
        }
      }
      return domEach(this, (el, i) => {
        if (isTag2(el))
          setAttr(el, name, value.call(el, i, el.attribs[name]));
      });
    }
    return domEach(this, (el) => {
      if (!isTag2(el))
        return;
      if (typeof name === "object") {
        Object.keys(name).forEach((objName) => {
          const objValue = name[objName];
          setAttr(el, objName, objValue);
        });
      } else {
        setAttr(el, name, value);
      }
    });
  }
  return arguments.length > 1 ? this : getAttr(this[0], name, this.options.xmlMode);
}
function getProp(el, name, xmlMode) {
  return name in el ? (
    // @ts-expect-error TS doesn't like us accessing the value directly here.
    el[name]
  ) : !xmlMode && rboolean.test(name) ? getAttr(el, name, false) !== void 0 : getAttr(el, name, xmlMode);
}
function setProp(el, name, value, xmlMode) {
  if (name in el) {
    el[name] = value;
  } else {
    setAttr(el, name, !xmlMode && rboolean.test(name) ? value ? "" : null : `${value}`);
  }
}
function prop(name, value) {
  var _a2;
  if (typeof name === "string" && value === void 0) {
    const el = this[0];
    if (!el || !isTag2(el))
      return void 0;
    switch (name) {
      case "style": {
        const property = this.css();
        const keys = Object.keys(property);
        keys.forEach((p, i) => {
          property[i] = p;
        });
        property.length = keys.length;
        return property;
      }
      case "tagName":
      case "nodeName": {
        return el.name.toUpperCase();
      }
      case "href":
      case "src": {
        const prop2 = (_a2 = el.attribs) === null || _a2 === void 0 ? void 0 : _a2[name];
        if (typeof URL !== "undefined" && (name === "href" && (el.tagName === "a" || el.name === "link") || name === "src" && (el.tagName === "img" || el.tagName === "iframe" || el.tagName === "audio" || el.tagName === "video" || el.tagName === "source")) && prop2 !== void 0 && this.options.baseURI) {
          return new URL(prop2, this.options.baseURI).href;
        }
        return prop2;
      }
      case "innerText": {
        return innerText(el);
      }
      case "textContent": {
        return textContent(el);
      }
      case "outerHTML":
        return this.clone().wrap("<container />").parent().html();
      case "innerHTML":
        return this.html();
      default:
        return getProp(el, name, this.options.xmlMode);
    }
  }
  if (typeof name === "object" || value !== void 0) {
    if (typeof value === "function") {
      if (typeof name === "object") {
        throw new Error("Bad combination of arguments.");
      }
      return domEach(this, (el, i) => {
        if (isTag2(el)) {
          setProp(el, name, value.call(el, i, getProp(el, name, this.options.xmlMode)), this.options.xmlMode);
        }
      });
    }
    return domEach(this, (el) => {
      if (!isTag2(el))
        return;
      if (typeof name === "object") {
        Object.keys(name).forEach((key) => {
          const val2 = name[key];
          setProp(el, key, val2, this.options.xmlMode);
        });
      } else {
        setProp(el, name, value, this.options.xmlMode);
      }
    });
  }
  return void 0;
}
function setData(el, name, value) {
  var _a2;
  const elem = el;
  (_a2 = elem.data) !== null && _a2 !== void 0 ? _a2 : elem.data = {};
  if (typeof name === "object")
    Object.assign(elem.data, name);
  else if (typeof name === "string" && value !== void 0) {
    elem.data[name] = value;
  }
}
function readData(el, name) {
  let domNames;
  let jsNames;
  let value;
  if (name == null) {
    domNames = Object.keys(el.attribs).filter((attrName) => attrName.startsWith(dataAttrPrefix));
    jsNames = domNames.map((domName) => camelCase(domName.slice(dataAttrPrefix.length)));
  } else {
    domNames = [dataAttrPrefix + cssCase(name)];
    jsNames = [name];
  }
  for (let idx = 0; idx < domNames.length; ++idx) {
    const domName = domNames[idx];
    const jsName = jsNames[idx];
    if (hasOwn.call(el.attribs, domName) && !hasOwn.call(el.data, jsName)) {
      value = el.attribs[domName];
      if (hasOwn.call(primitives, value)) {
        value = primitives[value];
      } else if (value === String(Number(value))) {
        value = Number(value);
      } else if (rbrace.test(value)) {
        try {
          value = JSON.parse(value);
        } catch (e) {
        }
      }
      el.data[jsName] = value;
    }
  }
  return name == null ? el.data : value;
}
function data(name, value) {
  var _a2;
  const elem = this[0];
  if (!elem || !isTag2(elem))
    return;
  const dataEl = elem;
  (_a2 = dataEl.data) !== null && _a2 !== void 0 ? _a2 : dataEl.data = {};
  if (!name) {
    return readData(dataEl);
  }
  if (typeof name === "object" || value !== void 0) {
    domEach(this, (el) => {
      if (isTag2(el)) {
        if (typeof name === "object")
          setData(el, name);
        else
          setData(el, name, value);
      }
    });
    return this;
  }
  if (hasOwn.call(dataEl.data, name)) {
    return dataEl.data[name];
  }
  return readData(dataEl, name);
}
function val(value) {
  const querying = arguments.length === 0;
  const element = this[0];
  if (!element || !isTag2(element))
    return querying ? void 0 : this;
  switch (element.name) {
    case "textarea":
      return this.text(value);
    case "select": {
      const option = this.find("option:selected");
      if (!querying) {
        if (this.attr("multiple") == null && typeof value === "object") {
          return this;
        }
        this.find("option").removeAttr("selected");
        const values = typeof value !== "object" ? [value] : value;
        for (let i = 0; i < values.length; i++) {
          this.find(`option[value="${values[i]}"]`).attr("selected", "");
        }
        return this;
      }
      return this.attr("multiple") ? option.toArray().map((el) => text(el.children)) : option.attr("value");
    }
    case "input":
    case "option":
      return querying ? this.attr("value") : this.attr("value", value);
  }
  return void 0;
}
function removeAttribute(elem, name) {
  if (!elem.attribs || !hasOwn.call(elem.attribs, name))
    return;
  delete elem.attribs[name];
}
function splitNames(names) {
  return names ? names.trim().split(rspace) : [];
}
function removeAttr(name) {
  const attrNames = splitNames(name);
  for (let i = 0; i < attrNames.length; i++) {
    domEach(this, (elem) => {
      if (isTag2(elem))
        removeAttribute(elem, attrNames[i]);
    });
  }
  return this;
}
function hasClass(className) {
  return this.toArray().some((elem) => {
    const clazz = isTag2(elem) && elem.attribs["class"];
    let idx = -1;
    if (clazz && className.length) {
      while ((idx = clazz.indexOf(className, idx + 1)) > -1) {
        const end2 = idx + className.length;
        if ((idx === 0 || rspace.test(clazz[idx - 1])) && (end2 === clazz.length || rspace.test(clazz[end2]))) {
          return true;
        }
      }
    }
    return false;
  });
}
function addClass(value) {
  if (typeof value === "function") {
    return domEach(this, (el, i) => {
      if (isTag2(el)) {
        const className = el.attribs["class"] || "";
        addClass.call([el], value.call(el, i, className));
      }
    });
  }
  if (!value || typeof value !== "string")
    return this;
  const classNames = value.split(rspace);
  const numElements = this.length;
  for (let i = 0; i < numElements; i++) {
    const el = this[i];
    if (!isTag2(el))
      continue;
    const className = getAttr(el, "class", false);
    if (!className) {
      setAttr(el, "class", classNames.join(" ").trim());
    } else {
      let setClass = ` ${className} `;
      for (let j = 0; j < classNames.length; j++) {
        const appendClass = `${classNames[j]} `;
        if (!setClass.includes(` ${appendClass}`))
          setClass += appendClass;
      }
      setAttr(el, "class", setClass.trim());
    }
  }
  return this;
}
function removeClass(name) {
  if (typeof name === "function") {
    return domEach(this, (el, i) => {
      if (isTag2(el)) {
        removeClass.call([el], name.call(el, i, el.attribs["class"] || ""));
      }
    });
  }
  const classes = splitNames(name);
  const numClasses = classes.length;
  const removeAll = arguments.length === 0;
  return domEach(this, (el) => {
    if (!isTag2(el))
      return;
    if (removeAll) {
      el.attribs["class"] = "";
    } else {
      const elClasses = splitNames(el.attribs["class"]);
      let changed = false;
      for (let j = 0; j < numClasses; j++) {
        const index2 = elClasses.indexOf(classes[j]);
        if (index2 >= 0) {
          elClasses.splice(index2, 1);
          changed = true;
          j--;
        }
      }
      if (changed) {
        el.attribs["class"] = elClasses.join(" ");
      }
    }
  });
}
function toggleClass(value, stateVal) {
  if (typeof value === "function") {
    return domEach(this, (el, i) => {
      if (isTag2(el)) {
        toggleClass.call([el], value.call(el, i, el.attribs["class"] || "", stateVal), stateVal);
      }
    });
  }
  if (!value || typeof value !== "string")
    return this;
  const classNames = value.split(rspace);
  const numClasses = classNames.length;
  const state = typeof stateVal === "boolean" ? stateVal ? 1 : -1 : 0;
  const numElements = this.length;
  for (let i = 0; i < numElements; i++) {
    const el = this[i];
    if (!isTag2(el))
      continue;
    const elementClasses = splitNames(el.attribs["class"]);
    for (let j = 0; j < numClasses; j++) {
      const index2 = elementClasses.indexOf(classNames[j]);
      if (state >= 0 && index2 < 0) {
        elementClasses.push(classNames[j]);
      } else if (state <= 0 && index2 >= 0) {
        elementClasses.splice(index2, 1);
      }
    }
    el.attribs["class"] = elementClasses.join(" ");
  }
  return this;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/traversing.js
var traversing_exports = {};
__export(traversing_exports, {
  add: () => add,
  addBack: () => addBack,
  children: () => children,
  closest: () => closest,
  contents: () => contents,
  each: () => each,
  end: () => end,
  eq: () => eq,
  filter: () => filter3,
  filterArray: () => filterArray,
  find: () => find3,
  first: () => first,
  get: () => get,
  has: () => has,
  index: () => index,
  is: () => is3,
  last: () => last,
  map: () => map,
  next: () => next,
  nextAll: () => nextAll,
  nextUntil: () => nextUntil,
  not: () => not,
  parent: () => parent,
  parents: () => parents,
  parentsUntil: () => parentsUntil,
  prev: () => prev,
  prevAll: () => prevAll,
  prevUntil: () => prevUntil,
  siblings: () => siblings,
  slice: () => slice,
  toArray: () => toArray
});

// ../../node_modules/.pnpm/css-what@6.2.2/node_modules/css-what/lib/es/types.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["Attribute"] = "attribute";
  SelectorType2["Pseudo"] = "pseudo";
  SelectorType2["PseudoElement"] = "pseudo-element";
  SelectorType2["Tag"] = "tag";
  SelectorType2["Universal"] = "universal";
  SelectorType2["Adjacent"] = "adjacent";
  SelectorType2["Child"] = "child";
  SelectorType2["Descendant"] = "descendant";
  SelectorType2["Parent"] = "parent";
  SelectorType2["Sibling"] = "sibling";
  SelectorType2["ColumnCombinator"] = "column-combinator";
})(SelectorType || (SelectorType = {}));
var AttributeAction;
(function(AttributeAction2) {
  AttributeAction2["Any"] = "any";
  AttributeAction2["Element"] = "element";
  AttributeAction2["End"] = "end";
  AttributeAction2["Equals"] = "equals";
  AttributeAction2["Exists"] = "exists";
  AttributeAction2["Hyphen"] = "hyphen";
  AttributeAction2["Not"] = "not";
  AttributeAction2["Start"] = "start";
})(AttributeAction || (AttributeAction = {}));

// ../../node_modules/.pnpm/css-what@6.2.2/node_modules/css-what/lib/es/parse.js
var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes = /* @__PURE__ */ new Map([
  [126, AttributeAction.Element],
  [94, AttributeAction.Start],
  [36, AttributeAction.End],
  [42, AttributeAction.Any],
  [33, AttributeAction.Not],
  [124, AttributeAction.Hyphen]
]);
var unpackPseudos = /* @__PURE__ */ new Set([
  "has",
  "not",
  "matches",
  "is",
  "where",
  "host",
  "host-context"
]);
function isTraversal(selector) {
  switch (selector.type) {
    case SelectorType.Adjacent:
    case SelectorType.Child:
    case SelectorType.Descendant:
    case SelectorType.Parent:
    case SelectorType.Sibling:
    case SelectorType.ColumnCombinator:
      return true;
    default:
      return false;
  }
}
var stripQuotesFromPseudos = /* @__PURE__ */ new Set(["contains", "icontains"]);
function funescape(_, escaped, escapedWhitespace) {
  const high = parseInt(escaped, 16) - 65536;
  return high !== high || escapedWhitespace ? escaped : high < 0 ? (
    // BMP codepoint
    String.fromCharCode(high + 65536)
  ) : (
    // Supplemental Plane codepoint (surrogate pair)
    String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320)
  );
}
function unescapeCSS(str) {
  return str.replace(reEscape, funescape);
}
function isQuote(c) {
  return c === 39 || c === 34;
}
function isWhitespace(c) {
  return c === 32 || c === 9 || c === 10 || c === 12 || c === 13;
}
function parse(selector) {
  const subselects2 = [];
  const endIndex = parseSelector(subselects2, `${selector}`, 0);
  if (endIndex < selector.length) {
    throw new Error(`Unmatched selector: ${selector.slice(endIndex)}`);
  }
  return subselects2;
}
function parseSelector(subselects2, selector, selectorIndex) {
  let tokens = [];
  function getName2(offset) {
    const match = selector.slice(selectorIndex + offset).match(reName);
    if (!match) {
      throw new Error(`Expected name, found ${selector.slice(selectorIndex)}`);
    }
    const [name] = match;
    selectorIndex += offset + name.length;
    return unescapeCSS(name);
  }
  function stripWhitespace(offset) {
    selectorIndex += offset;
    while (selectorIndex < selector.length && isWhitespace(selector.charCodeAt(selectorIndex))) {
      selectorIndex++;
    }
  }
  function readValueWithParenthesis() {
    selectorIndex += 1;
    const start = selectorIndex;
    let counter = 1;
    for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
      if (selector.charCodeAt(selectorIndex) === 40 && !isEscaped(selectorIndex)) {
        counter++;
      } else if (selector.charCodeAt(selectorIndex) === 41 && !isEscaped(selectorIndex)) {
        counter--;
      }
    }
    if (counter) {
      throw new Error("Parenthesis not matched");
    }
    return unescapeCSS(selector.slice(start, selectorIndex - 1));
  }
  function isEscaped(pos) {
    let slashCount = 0;
    while (selector.charCodeAt(--pos) === 92)
      slashCount++;
    return (slashCount & 1) === 1;
  }
  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
      throw new Error("Did not expect successive traversals.");
    }
  }
  function addTraversal(type) {
    if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens[tokens.length - 1].type = type;
      return;
    }
    ensureNotTraversal();
    tokens.push({ type });
  }
  function addSpecialAttribute(name, action) {
    tokens.push({
      type: SelectorType.Attribute,
      name,
      action,
      value: getName2(1),
      namespace: null,
      ignoreCase: "quirks"
    });
  }
  function finalizeSubselector() {
    if (tokens.length && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens.pop();
    }
    if (tokens.length === 0) {
      throw new Error("Empty sub-selector");
    }
    subselects2.push(tokens);
  }
  stripWhitespace(0);
  if (selector.length === selectorIndex) {
    return selectorIndex;
  }
  loop: while (selectorIndex < selector.length) {
    const firstChar = selector.charCodeAt(selectorIndex);
    switch (firstChar) {
      // Whitespace
      case 32:
      case 9:
      case 10:
      case 12:
      case 13: {
        if (tokens.length === 0 || tokens[0].type !== SelectorType.Descendant) {
          ensureNotTraversal();
          tokens.push({ type: SelectorType.Descendant });
        }
        stripWhitespace(1);
        break;
      }
      // Traversals
      case 62: {
        addTraversal(SelectorType.Child);
        stripWhitespace(1);
        break;
      }
      case 60: {
        addTraversal(SelectorType.Parent);
        stripWhitespace(1);
        break;
      }
      case 126: {
        addTraversal(SelectorType.Sibling);
        stripWhitespace(1);
        break;
      }
      case 43: {
        addTraversal(SelectorType.Adjacent);
        stripWhitespace(1);
        break;
      }
      // Special attribute selectors: .class, #id
      case 46: {
        addSpecialAttribute("class", AttributeAction.Element);
        break;
      }
      case 35: {
        addSpecialAttribute("id", AttributeAction.Equals);
        break;
      }
      case 91: {
        stripWhitespace(1);
        let name;
        let namespace = null;
        if (selector.charCodeAt(selectorIndex) === 124) {
          name = getName2(1);
        } else if (selector.startsWith("*|", selectorIndex)) {
          namespace = "*";
          name = getName2(2);
        } else {
          name = getName2(0);
          if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 61) {
            namespace = name;
            name = getName2(1);
          }
        }
        stripWhitespace(0);
        let action = AttributeAction.Exists;
        const possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
        if (possibleAction) {
          action = possibleAction;
          if (selector.charCodeAt(selectorIndex + 1) !== 61) {
            throw new Error("Expected `=`");
          }
          stripWhitespace(2);
        } else if (selector.charCodeAt(selectorIndex) === 61) {
          action = AttributeAction.Equals;
          stripWhitespace(1);
        }
        let value = "";
        let ignoreCase = null;
        if (action !== "exists") {
          if (isQuote(selector.charCodeAt(selectorIndex))) {
            const quote = selector.charCodeAt(selectorIndex);
            let sectionEnd = selectorIndex + 1;
            while (sectionEnd < selector.length && (selector.charCodeAt(sectionEnd) !== quote || isEscaped(sectionEnd))) {
              sectionEnd += 1;
            }
            if (selector.charCodeAt(sectionEnd) !== quote) {
              throw new Error("Attribute value didn't end");
            }
            value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
            selectorIndex = sectionEnd + 1;
          } else {
            const valueStart = selectorIndex;
            while (selectorIndex < selector.length && (!isWhitespace(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== 93 || isEscaped(selectorIndex))) {
              selectorIndex += 1;
            }
            value = unescapeCSS(selector.slice(valueStart, selectorIndex));
          }
          stripWhitespace(0);
          const forceIgnore = selector.charCodeAt(selectorIndex) | 32;
          if (forceIgnore === 115) {
            ignoreCase = false;
            stripWhitespace(1);
          } else if (forceIgnore === 105) {
            ignoreCase = true;
            stripWhitespace(1);
          }
        }
        if (selector.charCodeAt(selectorIndex) !== 93) {
          throw new Error("Attribute selector didn't terminate");
        }
        selectorIndex += 1;
        const attributeSelector = {
          type: SelectorType.Attribute,
          name,
          action,
          value,
          namespace,
          ignoreCase
        };
        tokens.push(attributeSelector);
        break;
      }
      case 58: {
        if (selector.charCodeAt(selectorIndex + 1) === 58) {
          tokens.push({
            type: SelectorType.PseudoElement,
            name: getName2(2).toLowerCase(),
            data: selector.charCodeAt(selectorIndex) === 40 ? readValueWithParenthesis() : null
          });
          continue;
        }
        const name = getName2(1).toLowerCase();
        let data2 = null;
        if (selector.charCodeAt(selectorIndex) === 40) {
          if (unpackPseudos.has(name)) {
            if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
              throw new Error(`Pseudo-selector ${name} cannot be quoted`);
            }
            data2 = [];
            selectorIndex = parseSelector(data2, selector, selectorIndex + 1);
            if (selector.charCodeAt(selectorIndex) !== 41) {
              throw new Error(`Missing closing parenthesis in :${name} (${selector})`);
            }
            selectorIndex += 1;
          } else {
            data2 = readValueWithParenthesis();
            if (stripQuotesFromPseudos.has(name)) {
              const quot = data2.charCodeAt(0);
              if (quot === data2.charCodeAt(data2.length - 1) && isQuote(quot)) {
                data2 = data2.slice(1, -1);
              }
            }
            data2 = unescapeCSS(data2);
          }
        }
        tokens.push({ type: SelectorType.Pseudo, name, data: data2 });
        break;
      }
      case 44: {
        finalizeSubselector();
        tokens = [];
        stripWhitespace(1);
        break;
      }
      default: {
        if (selector.startsWith("/*", selectorIndex)) {
          const endIndex = selector.indexOf("*/", selectorIndex + 2);
          if (endIndex < 0) {
            throw new Error("Comment was not terminated");
          }
          selectorIndex = endIndex + 2;
          if (tokens.length === 0) {
            stripWhitespace(0);
          }
          break;
        }
        let namespace = null;
        let name;
        if (firstChar === 42) {
          selectorIndex += 1;
          name = "*";
        } else if (firstChar === 124) {
          name = "";
          if (selector.charCodeAt(selectorIndex + 1) === 124) {
            addTraversal(SelectorType.ColumnCombinator);
            stripWhitespace(2);
            break;
          }
        } else if (reName.test(selector.slice(selectorIndex))) {
          name = getName2(0);
        } else {
          break loop;
        }
        if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 124) {
          namespace = name;
          if (selector.charCodeAt(selectorIndex + 1) === 42) {
            name = "*";
            selectorIndex += 2;
          } else {
            name = getName2(1);
          }
        }
        tokens.push(name === "*" ? { type: SelectorType.Universal, namespace } : { type: SelectorType.Tag, name, namespace });
      }
    }
  }
  finalizeSubselector();
  return selectorIndex;
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/index.js
var import_boolbase6 = __toESM(require_boolbase(), 1);

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/compile.js
var import_boolbase5 = __toESM(require_boolbase(), 1);

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/sort.js
var procedure = /* @__PURE__ */ new Map([
  [SelectorType.Universal, 50],
  [SelectorType.Tag, 30],
  [SelectorType.Attribute, 1],
  [SelectorType.Pseudo, 0]
]);
function isTraversal2(token) {
  return !procedure.has(token.type);
}
var attributes = /* @__PURE__ */ new Map([
  [AttributeAction.Exists, 10],
  [AttributeAction.Equals, 8],
  [AttributeAction.Not, 7],
  [AttributeAction.Start, 6],
  [AttributeAction.End, 6],
  [AttributeAction.Any, 5]
]);
function sortByProcedure(arr) {
  const procs = arr.map(getProcedure);
  for (let i = 1; i < arr.length; i++) {
    const procNew = procs[i];
    if (procNew < 0)
      continue;
    for (let j = i - 1; j >= 0 && procNew < procs[j]; j--) {
      const token = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = token;
      procs[j + 1] = procs[j];
      procs[j] = procNew;
    }
  }
}
function getProcedure(token) {
  var _a2, _b;
  let proc = (_a2 = procedure.get(token.type)) !== null && _a2 !== void 0 ? _a2 : -1;
  if (token.type === SelectorType.Attribute) {
    proc = (_b = attributes.get(token.action)) !== null && _b !== void 0 ? _b : 4;
    if (token.action === AttributeAction.Equals && token.name === "id") {
      proc = 9;
    }
    if (token.ignoreCase) {
      proc >>= 1;
    }
  } else if (token.type === SelectorType.Pseudo) {
    if (!token.data) {
      proc = 3;
    } else if (token.name === "has" || token.name === "contains") {
      proc = 0;
    } else if (Array.isArray(token.data)) {
      proc = Math.min(...token.data.map((d) => Math.min(...d.map(getProcedure))));
      if (proc < 0) {
        proc = 0;
      }
    } else {
      proc = 2;
    }
  }
  return proc;
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/attributes.js
var import_boolbase = __toESM(require_boolbase(), 1);
var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
function escapeRegex(value) {
  return value.replace(reChars, "\\$&");
}
var caseInsensitiveAttributes = /* @__PURE__ */ new Set([
  "accept",
  "accept-charset",
  "align",
  "alink",
  "axis",
  "bgcolor",
  "charset",
  "checked",
  "clear",
  "codetype",
  "color",
  "compact",
  "declare",
  "defer",
  "dir",
  "direction",
  "disabled",
  "enctype",
  "face",
  "frame",
  "hreflang",
  "http-equiv",
  "lang",
  "language",
  "link",
  "media",
  "method",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "rel",
  "rev",
  "rules",
  "scope",
  "scrolling",
  "selected",
  "shape",
  "target",
  "text",
  "type",
  "valign",
  "valuetype",
  "vlink"
]);
function shouldIgnoreCase(selector, options) {
  return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options.quirksMode : !options.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
var attributeRules = {
  equals(next2, data2, options) {
    const { adapter } = options;
    const { name } = data2;
    let { value } = data2;
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr2 = adapter.getAttributeValue(elem, name);
        return attr2 != null && attr2.length === value.length && attr2.toLowerCase() === value && next2(elem);
      };
    }
    return (elem) => adapter.getAttributeValue(elem, name) === value && next2(elem);
  },
  hyphen(next2, data2, options) {
    const { adapter } = options;
    const { name } = data2;
    let { value } = data2;
    const len = value.length;
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return function hyphenIC(elem) {
        const attr2 = adapter.getAttributeValue(elem, name);
        return attr2 != null && (attr2.length === len || attr2.charAt(len) === "-") && attr2.substr(0, len).toLowerCase() === value && next2(elem);
      };
    }
    return function hyphen(elem) {
      const attr2 = adapter.getAttributeValue(elem, name);
      return attr2 != null && (attr2.length === len || attr2.charAt(len) === "-") && attr2.substr(0, len) === value && next2(elem);
    };
  },
  element(next2, data2, options) {
    const { adapter } = options;
    const { name, value } = data2;
    if (/\s/.test(value)) {
      return import_boolbase.default.falseFunc;
    }
    const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, shouldIgnoreCase(data2, options) ? "i" : "");
    return function element(elem) {
      const attr2 = adapter.getAttributeValue(elem, name);
      return attr2 != null && attr2.length >= value.length && regex.test(attr2) && next2(elem);
    };
  },
  exists(next2, { name }, { adapter }) {
    return (elem) => adapter.hasAttrib(elem, name) && next2(elem);
  },
  start(next2, data2, options) {
    const { adapter } = options;
    const { name } = data2;
    let { value } = data2;
    const len = value.length;
    if (len === 0) {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr2 = adapter.getAttributeValue(elem, name);
        return attr2 != null && attr2.length >= len && attr2.substr(0, len).toLowerCase() === value && next2(elem);
      };
    }
    return (elem) => {
      var _a2;
      return !!((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.startsWith(value)) && next2(elem);
    };
  },
  end(next2, data2, options) {
    const { adapter } = options;
    const { name } = data2;
    let { value } = data2;
    const len = -value.length;
    if (len === 0) {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        var _a2;
        return ((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.substr(len).toLowerCase()) === value && next2(elem);
      };
    }
    return (elem) => {
      var _a2;
      return !!((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.endsWith(value)) && next2(elem);
    };
  },
  any(next2, data2, options) {
    const { adapter } = options;
    const { name, value } = data2;
    if (value === "") {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      const regex = new RegExp(escapeRegex(value), "i");
      return function anyIC(elem) {
        const attr2 = adapter.getAttributeValue(elem, name);
        return attr2 != null && attr2.length >= value.length && regex.test(attr2) && next2(elem);
      };
    }
    return (elem) => {
      var _a2;
      return !!((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.includes(value)) && next2(elem);
    };
  },
  not(next2, data2, options) {
    const { adapter } = options;
    const { name } = data2;
    let { value } = data2;
    if (value === "") {
      return (elem) => !!adapter.getAttributeValue(elem, name) && next2(elem);
    } else if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr2 = adapter.getAttributeValue(elem, name);
        return (attr2 == null || attr2.length !== value.length || attr2.toLowerCase() !== value) && next2(elem);
      };
    }
    return (elem) => adapter.getAttributeValue(elem, name) !== value && next2(elem);
  }
};

// ../../node_modules/.pnpm/nth-check@2.1.1/node_modules/nth-check/lib/esm/parse.js
var whitespace = /* @__PURE__ */ new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
function parse2(formula) {
  formula = formula.trim().toLowerCase();
  if (formula === "even") {
    return [2, 0];
  } else if (formula === "odd") {
    return [2, 1];
  }
  let idx = 0;
  let a = 0;
  let sign = readSign();
  let number = readNumber();
  if (idx < formula.length && formula.charAt(idx) === "n") {
    idx++;
    a = sign * (number !== null && number !== void 0 ? number : 1);
    skipWhitespace();
    if (idx < formula.length) {
      sign = readSign();
      skipWhitespace();
      number = readNumber();
    } else {
      sign = number = 0;
    }
  }
  if (number === null || idx < formula.length) {
    throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
  }
  return [a, sign * number];
  function readSign() {
    if (formula.charAt(idx) === "-") {
      idx++;
      return -1;
    }
    if (formula.charAt(idx) === "+") {
      idx++;
    }
    return 1;
  }
  function readNumber() {
    const start = idx;
    let value = 0;
    while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
      value = value * 10 + (formula.charCodeAt(idx) - ZERO);
      idx++;
    }
    return idx === start ? null : value;
  }
  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx))) {
      idx++;
    }
  }
}

// ../../node_modules/.pnpm/nth-check@2.1.1/node_modules/nth-check/lib/esm/compile.js
var import_boolbase2 = __toESM(require_boolbase(), 1);
function compile(parsed) {
  const a = parsed[0];
  const b = parsed[1] - 1;
  if (b < 0 && a <= 0)
    return import_boolbase2.default.falseFunc;
  if (a === -1)
    return (index2) => index2 <= b;
  if (a === 0)
    return (index2) => index2 === b;
  if (a === 1)
    return b < 0 ? import_boolbase2.default.trueFunc : (index2) => index2 >= b;
  const absA = Math.abs(a);
  const bMod = (b % absA + absA) % absA;
  return a > 1 ? (index2) => index2 >= b && index2 % absA === bMod : (index2) => index2 <= b && index2 % absA === bMod;
}

// ../../node_modules/.pnpm/nth-check@2.1.1/node_modules/nth-check/lib/esm/index.js
function nthCheck(formula) {
  return compile(parse2(formula));
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/pseudo-selectors/filters.js
var import_boolbase3 = __toESM(require_boolbase(), 1);
function getChildFunc(next2, adapter) {
  return (elem) => {
    const parent2 = adapter.getParent(elem);
    return parent2 != null && adapter.isTag(parent2) && next2(elem);
  };
}
var filters = {
  contains(next2, text3, { adapter }) {
    return function contains2(elem) {
      return next2(elem) && adapter.getText(elem).includes(text3);
    };
  },
  icontains(next2, text3, { adapter }) {
    const itext = text3.toLowerCase();
    return function icontains(elem) {
      return next2(elem) && adapter.getText(elem).toLowerCase().includes(itext);
    };
  },
  // Location specific methods
  "nth-child"(next2, rule, { adapter, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next2, adapter);
    return function nthChild(elem) {
      const siblings2 = adapter.getSiblings(elem);
      let pos = 0;
      for (let i = 0; i < siblings2.length; i++) {
        if (equals(elem, siblings2[i]))
          break;
        if (adapter.isTag(siblings2[i])) {
          pos++;
        }
      }
      return func(pos) && next2(elem);
    };
  },
  "nth-last-child"(next2, rule, { adapter, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next2, adapter);
    return function nthLastChild(elem) {
      const siblings2 = adapter.getSiblings(elem);
      let pos = 0;
      for (let i = siblings2.length - 1; i >= 0; i--) {
        if (equals(elem, siblings2[i]))
          break;
        if (adapter.isTag(siblings2[i])) {
          pos++;
        }
      }
      return func(pos) && next2(elem);
    };
  },
  "nth-of-type"(next2, rule, { adapter, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next2, adapter);
    return function nthOfType(elem) {
      const siblings2 = adapter.getSiblings(elem);
      let pos = 0;
      for (let i = 0; i < siblings2.length; i++) {
        const currentSibling = siblings2[i];
        if (equals(elem, currentSibling))
          break;
        if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
          pos++;
        }
      }
      return func(pos) && next2(elem);
    };
  },
  "nth-last-of-type"(next2, rule, { adapter, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next2, adapter);
    return function nthLastOfType(elem) {
      const siblings2 = adapter.getSiblings(elem);
      let pos = 0;
      for (let i = siblings2.length - 1; i >= 0; i--) {
        const currentSibling = siblings2[i];
        if (equals(elem, currentSibling))
          break;
        if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
          pos++;
        }
      }
      return func(pos) && next2(elem);
    };
  },
  // TODO determine the actual root element
  root(next2, _rule, { adapter }) {
    return (elem) => {
      const parent2 = adapter.getParent(elem);
      return (parent2 == null || !adapter.isTag(parent2)) && next2(elem);
    };
  },
  scope(next2, rule, options, context) {
    const { equals } = options;
    if (!context || context.length === 0) {
      return filters["root"](next2, rule, options);
    }
    if (context.length === 1) {
      return (elem) => equals(context[0], elem) && next2(elem);
    }
    return (elem) => context.includes(elem) && next2(elem);
  },
  hover: dynamicStatePseudo("isHovered"),
  visited: dynamicStatePseudo("isVisited"),
  active: dynamicStatePseudo("isActive")
};
function dynamicStatePseudo(name) {
  return function dynamicPseudo(next2, _rule, { adapter }) {
    const func = adapter[name];
    if (typeof func !== "function") {
      return import_boolbase3.default.falseFunc;
    }
    return function active(elem) {
      return func(elem) && next2(elem);
    };
  };
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js
var pseudos = {
  empty(elem, { adapter }) {
    return !adapter.getChildren(elem).some((elem2) => (
      // FIXME: `getText` call is potentially expensive.
      adapter.isTag(elem2) || adapter.getText(elem2) !== ""
    ));
  },
  "first-child"(elem, { adapter, equals }) {
    if (adapter.prevElementSibling) {
      return adapter.prevElementSibling(elem) == null;
    }
    const firstChild = adapter.getSiblings(elem).find((elem2) => adapter.isTag(elem2));
    return firstChild != null && equals(elem, firstChild);
  },
  "last-child"(elem, { adapter, equals }) {
    const siblings2 = adapter.getSiblings(elem);
    for (let i = siblings2.length - 1; i >= 0; i--) {
      if (equals(elem, siblings2[i]))
        return true;
      if (adapter.isTag(siblings2[i]))
        break;
    }
    return false;
  },
  "first-of-type"(elem, { adapter, equals }) {
    const siblings2 = adapter.getSiblings(elem);
    const elemName = adapter.getName(elem);
    for (let i = 0; i < siblings2.length; i++) {
      const currentSibling = siblings2[i];
      if (equals(elem, currentSibling))
        return true;
      if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "last-of-type"(elem, { adapter, equals }) {
    const siblings2 = adapter.getSiblings(elem);
    const elemName = adapter.getName(elem);
    for (let i = siblings2.length - 1; i >= 0; i--) {
      const currentSibling = siblings2[i];
      if (equals(elem, currentSibling))
        return true;
      if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "only-of-type"(elem, { adapter, equals }) {
    const elemName = adapter.getName(elem);
    return adapter.getSiblings(elem).every((sibling) => equals(elem, sibling) || !adapter.isTag(sibling) || adapter.getName(sibling) !== elemName);
  },
  "only-child"(elem, { adapter, equals }) {
    return adapter.getSiblings(elem).every((sibling) => equals(elem, sibling) || !adapter.isTag(sibling));
  }
};
function verifyPseudoArgs(func, name, subselect, argIndex) {
  if (subselect === null) {
    if (func.length > argIndex) {
      throw new Error(`Pseudo-class :${name} requires an argument`);
    }
  } else if (func.length === argIndex) {
    throw new Error(`Pseudo-class :${name} doesn't have any arguments`);
  }
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/pseudo-selectors/aliases.js
var aliases = {
  // Links
  "any-link": ":is(a, area, link)[href]",
  link: ":any-link:not(:visited)",
  // Forms
  // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
  disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
  enabled: ":not(:disabled)",
  checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
  required: ":is(input, select, textarea)[required]",
  optional: ":is(input, select, textarea):not([required])",
  // JQuery extensions
  // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
  selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
  checkbox: "[type=checkbox]",
  file: "[type=file]",
  password: "[type=password]",
  radio: "[type=radio]",
  reset: "[type=reset]",
  image: "[type=image]",
  submit: "[type=submit]",
  parent: ":not(:empty)",
  header: ":is(h1, h2, h3, h4, h5, h6)",
  button: ":is(button, input[type=button])",
  input: ":is(input, textarea, select, button)",
  text: "input:is(:not([type!='']), [type=text])"
};

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/pseudo-selectors/subselects.js
var import_boolbase4 = __toESM(require_boolbase(), 1);
var PLACEHOLDER_ELEMENT = {};
function ensureIsTag(next2, adapter) {
  if (next2 === import_boolbase4.default.falseFunc)
    return import_boolbase4.default.falseFunc;
  return (elem) => adapter.isTag(elem) && next2(elem);
}
function getNextSiblings(elem, adapter) {
  const siblings2 = adapter.getSiblings(elem);
  if (siblings2.length <= 1)
    return [];
  const elemIndex = siblings2.indexOf(elem);
  if (elemIndex < 0 || elemIndex === siblings2.length - 1)
    return [];
  return siblings2.slice(elemIndex + 1).filter(adapter.isTag);
}
function copyOptions(options) {
  return {
    xmlMode: !!options.xmlMode,
    lowerCaseAttributeNames: !!options.lowerCaseAttributeNames,
    lowerCaseTags: !!options.lowerCaseTags,
    quirksMode: !!options.quirksMode,
    cacheResults: !!options.cacheResults,
    pseudos: options.pseudos,
    adapter: options.adapter,
    equals: options.equals
  };
}
var is = (next2, token, options, context, compileToken2) => {
  const func = compileToken2(token, copyOptions(options), context);
  return func === import_boolbase4.default.trueFunc ? next2 : func === import_boolbase4.default.falseFunc ? import_boolbase4.default.falseFunc : (elem) => func(elem) && next2(elem);
};
var subselects = {
  is,
  /**
   * `:matches` and `:where` are aliases for `:is`.
   */
  matches: is,
  where: is,
  not(next2, token, options, context, compileToken2) {
    const func = compileToken2(token, copyOptions(options), context);
    return func === import_boolbase4.default.falseFunc ? next2 : func === import_boolbase4.default.trueFunc ? import_boolbase4.default.falseFunc : (elem) => !func(elem) && next2(elem);
  },
  has(next2, subselect, options, _context, compileToken2) {
    const { adapter } = options;
    const opts = copyOptions(options);
    opts.relativeSelector = true;
    const context = subselect.some((s) => s.some(isTraversal2)) ? (
      // Used as a placeholder. Will be replaced with the actual element.
      [PLACEHOLDER_ELEMENT]
    ) : void 0;
    const compiled = compileToken2(subselect, opts, context);
    if (compiled === import_boolbase4.default.falseFunc)
      return import_boolbase4.default.falseFunc;
    const hasElement = ensureIsTag(compiled, adapter);
    if (context && compiled !== import_boolbase4.default.trueFunc) {
      const { shouldTestNextSiblings = false } = compiled;
      return (elem) => {
        if (!next2(elem))
          return false;
        context[0] = elem;
        const childs = adapter.getChildren(elem);
        const nextElements = shouldTestNextSiblings ? [...childs, ...getNextSiblings(elem, adapter)] : childs;
        return adapter.existsOne(hasElement, nextElements);
      };
    }
    return (elem) => next2(elem) && adapter.existsOne(hasElement, adapter.getChildren(elem));
  }
};

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/pseudo-selectors/index.js
function compilePseudoSelector(next2, selector, options, context, compileToken2) {
  var _a2;
  const { name, data: data2 } = selector;
  if (Array.isArray(data2)) {
    if (!(name in subselects)) {
      throw new Error(`Unknown pseudo-class :${name}(${data2})`);
    }
    return subselects[name](next2, data2, options, context, compileToken2);
  }
  const userPseudo = (_a2 = options.pseudos) === null || _a2 === void 0 ? void 0 : _a2[name];
  const stringPseudo = typeof userPseudo === "string" ? userPseudo : aliases[name];
  if (typeof stringPseudo === "string") {
    if (data2 != null) {
      throw new Error(`Pseudo ${name} doesn't have any arguments`);
    }
    const alias = parse(stringPseudo);
    return subselects["is"](next2, alias, options, context, compileToken2);
  }
  if (typeof userPseudo === "function") {
    verifyPseudoArgs(userPseudo, name, data2, 1);
    return (elem) => userPseudo(elem, data2) && next2(elem);
  }
  if (name in filters) {
    return filters[name](next2, data2, options, context);
  }
  if (name in pseudos) {
    const pseudo = pseudos[name];
    verifyPseudoArgs(pseudo, name, data2, 2);
    return (elem) => pseudo(elem, options, data2) && next2(elem);
  }
  throw new Error(`Unknown pseudo-class :${name}`);
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/general.js
function getElementParent(node, adapter) {
  const parent2 = adapter.getParent(node);
  if (parent2 && adapter.isTag(parent2)) {
    return parent2;
  }
  return null;
}
function compileGeneralSelector(next2, selector, options, context, compileToken2) {
  const { adapter, equals } = options;
  switch (selector.type) {
    case SelectorType.PseudoElement: {
      throw new Error("Pseudo-elements are not supported by css-select");
    }
    case SelectorType.ColumnCombinator: {
      throw new Error("Column combinators are not yet supported by css-select");
    }
    case SelectorType.Attribute: {
      if (selector.namespace != null) {
        throw new Error("Namespaced attributes are not yet supported by css-select");
      }
      if (!options.xmlMode || options.lowerCaseAttributeNames) {
        selector.name = selector.name.toLowerCase();
      }
      return attributeRules[selector.action](next2, selector, options);
    }
    case SelectorType.Pseudo: {
      return compilePseudoSelector(next2, selector, options, context, compileToken2);
    }
    // Tags
    case SelectorType.Tag: {
      if (selector.namespace != null) {
        throw new Error("Namespaced tag names are not yet supported by css-select");
      }
      let { name } = selector;
      if (!options.xmlMode || options.lowerCaseTags) {
        name = name.toLowerCase();
      }
      return function tag(elem) {
        return adapter.getName(elem) === name && next2(elem);
      };
    }
    // Traversal
    case SelectorType.Descendant: {
      if (options.cacheResults === false || typeof WeakSet === "undefined") {
        return function descendant(elem) {
          let current = elem;
          while (current = getElementParent(current, adapter)) {
            if (next2(current)) {
              return true;
            }
          }
          return false;
        };
      }
      const isFalseCache = /* @__PURE__ */ new WeakSet();
      return function cachedDescendant(elem) {
        let current = elem;
        while (current = getElementParent(current, adapter)) {
          if (!isFalseCache.has(current)) {
            if (adapter.isTag(current) && next2(current)) {
              return true;
            }
            isFalseCache.add(current);
          }
        }
        return false;
      };
    }
    case "_flexibleDescendant": {
      return function flexibleDescendant(elem) {
        let current = elem;
        do {
          if (next2(current))
            return true;
        } while (current = getElementParent(current, adapter));
        return false;
      };
    }
    case SelectorType.Parent: {
      return function parent2(elem) {
        return adapter.getChildren(elem).some((elem2) => adapter.isTag(elem2) && next2(elem2));
      };
    }
    case SelectorType.Child: {
      return function child(elem) {
        const parent2 = adapter.getParent(elem);
        return parent2 != null && adapter.isTag(parent2) && next2(parent2);
      };
    }
    case SelectorType.Sibling: {
      return function sibling(elem) {
        const siblings2 = adapter.getSiblings(elem);
        for (let i = 0; i < siblings2.length; i++) {
          const currentSibling = siblings2[i];
          if (equals(elem, currentSibling))
            break;
          if (adapter.isTag(currentSibling) && next2(currentSibling)) {
            return true;
          }
        }
        return false;
      };
    }
    case SelectorType.Adjacent: {
      if (adapter.prevElementSibling) {
        return function adjacent(elem) {
          const previous = adapter.prevElementSibling(elem);
          return previous != null && next2(previous);
        };
      }
      return function adjacent(elem) {
        const siblings2 = adapter.getSiblings(elem);
        let lastElement;
        for (let i = 0; i < siblings2.length; i++) {
          const currentSibling = siblings2[i];
          if (equals(elem, currentSibling))
            break;
          if (adapter.isTag(currentSibling)) {
            lastElement = currentSibling;
          }
        }
        return !!lastElement && next2(lastElement);
      };
    }
    case SelectorType.Universal: {
      if (selector.namespace != null && selector.namespace !== "*") {
        throw new Error("Namespaced universal selectors are not yet supported by css-select");
      }
      return next2;
    }
  }
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/compile.js
function compile2(selector, options, context) {
  const next2 = compileUnsafe(selector, options, context);
  return ensureIsTag(next2, options.adapter);
}
function compileUnsafe(selector, options, context) {
  const token = typeof selector === "string" ? parse(selector) : selector;
  return compileToken(token, options, context);
}
function includesScopePseudo(t) {
  return t.type === SelectorType.Pseudo && (t.name === "scope" || Array.isArray(t.data) && t.data.some((data2) => data2.some(includesScopePseudo)));
}
var DESCENDANT_TOKEN = { type: SelectorType.Descendant };
var FLEXIBLE_DESCENDANT_TOKEN = {
  type: "_flexibleDescendant"
};
var SCOPE_TOKEN = {
  type: SelectorType.Pseudo,
  name: "scope",
  data: null
};
function absolutize(token, { adapter }, context) {
  const hasContext = !!(context === null || context === void 0 ? void 0 : context.every((e) => {
    const parent2 = adapter.isTag(e) && adapter.getParent(e);
    return e === PLACEHOLDER_ELEMENT || parent2 && adapter.isTag(parent2);
  }));
  for (const t of token) {
    if (t.length > 0 && isTraversal2(t[0]) && t[0].type !== SelectorType.Descendant) {
    } else if (hasContext && !t.some(includesScopePseudo)) {
      t.unshift(DESCENDANT_TOKEN);
    } else {
      continue;
    }
    t.unshift(SCOPE_TOKEN);
  }
}
function compileToken(token, options, context) {
  var _a2;
  token.forEach(sortByProcedure);
  context = (_a2 = options.context) !== null && _a2 !== void 0 ? _a2 : context;
  const isArrayContext = Array.isArray(context);
  const finalContext = context && (Array.isArray(context) ? context : [context]);
  if (options.relativeSelector !== false) {
    absolutize(token, options, finalContext);
  } else if (token.some((t) => t.length > 0 && isTraversal2(t[0]))) {
    throw new Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
  }
  let shouldTestNextSiblings = false;
  const query = token.map((rules) => {
    if (rules.length >= 2) {
      const [first2, second] = rules;
      if (first2.type !== SelectorType.Pseudo || first2.name !== "scope") {
      } else if (isArrayContext && second.type === SelectorType.Descendant) {
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      } else if (second.type === SelectorType.Adjacent || second.type === SelectorType.Sibling) {
        shouldTestNextSiblings = true;
      }
    }
    return compileRules(rules, options, finalContext);
  }).reduce(reduceRules, import_boolbase5.default.falseFunc);
  query.shouldTestNextSiblings = shouldTestNextSiblings;
  return query;
}
function compileRules(rules, options, context) {
  var _a2;
  return rules.reduce((previous, rule) => previous === import_boolbase5.default.falseFunc ? import_boolbase5.default.falseFunc : compileGeneralSelector(previous, rule, options, context, compileToken), (_a2 = options.rootFunc) !== null && _a2 !== void 0 ? _a2 : import_boolbase5.default.trueFunc);
}
function reduceRules(a, b) {
  if (b === import_boolbase5.default.falseFunc || a === import_boolbase5.default.trueFunc) {
    return a;
  }
  if (a === import_boolbase5.default.falseFunc || b === import_boolbase5.default.trueFunc) {
    return b;
  }
  return function combine(elem) {
    return a(elem) || b(elem);
  };
}

// ../../node_modules/.pnpm/css-select@5.2.2/node_modules/css-select/lib/esm/index.js
var defaultEquals = (a, b) => a === b;
var defaultOptions = {
  adapter: esm_exports2,
  equals: defaultEquals
};
function convertOptionFormats(options) {
  var _a2, _b, _c, _d;
  const opts = options !== null && options !== void 0 ? options : defaultOptions;
  (_a2 = opts.adapter) !== null && _a2 !== void 0 ? _a2 : opts.adapter = esm_exports2;
  (_b = opts.equals) !== null && _b !== void 0 ? _b : opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals;
  return opts;
}
function wrapCompile(func) {
  return function addAdapter(selector, options, context) {
    const opts = convertOptionFormats(options);
    return func(selector, opts, context);
  };
}
var compile3 = wrapCompile(compile2);
var _compileUnsafe = wrapCompile(compileUnsafe);
var _compileToken = wrapCompile(compileToken);
function getSelectorFunc(searchFunc) {
  return function select2(query, elements, options) {
    const opts = convertOptionFormats(options);
    if (typeof query !== "function") {
      query = compileUnsafe(query, opts, elements);
    }
    const filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings);
    return searchFunc(query, filteredElements, opts);
  };
}
function prepareContext(elems, adapter, shouldTestNextSiblings = false) {
  if (shouldTestNextSiblings) {
    elems = appendNextSiblings(elems, adapter);
  }
  return Array.isArray(elems) ? adapter.removeSubsets(elems) : adapter.getChildren(elems);
}
function appendNextSiblings(elem, adapter) {
  const elems = Array.isArray(elem) ? elem.slice(0) : [elem];
  const elemsLength = elems.length;
  for (let i = 0; i < elemsLength; i++) {
    const nextSiblings = getNextSiblings(elems[i], adapter);
    elems.push(...nextSiblings);
  }
  return elems;
}
var selectAll = getSelectorFunc((query, elems, options) => query === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query, elems));
var selectOne = getSelectorFunc((query, elems, options) => query === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query, elems));

// ../../node_modules/.pnpm/cheerio-select@2.1.0/node_modules/cheerio-select/lib/esm/index.js
var boolbase7 = __toESM(require_boolbase(), 1);

// ../../node_modules/.pnpm/cheerio-select@2.1.0/node_modules/cheerio-select/lib/esm/positionals.js
var filterNames = /* @__PURE__ */ new Set([
  "first",
  "last",
  "eq",
  "gt",
  "nth",
  "lt",
  "even",
  "odd"
]);
function isFilter(s) {
  if (s.type !== "pseudo")
    return false;
  if (filterNames.has(s.name))
    return true;
  if (s.name === "not" && Array.isArray(s.data)) {
    return s.data.some((s2) => s2.some(isFilter));
  }
  return false;
}
function getLimit(filter4, data2, partLimit) {
  const num = data2 != null ? parseInt(data2, 10) : NaN;
  switch (filter4) {
    case "first":
      return 1;
    case "nth":
    case "eq":
      return isFinite(num) ? num >= 0 ? num + 1 : Infinity : 0;
    case "lt":
      return isFinite(num) ? num >= 0 ? Math.min(num, partLimit) : Infinity : 0;
    case "gt":
      return isFinite(num) ? Infinity : 0;
    case "odd":
      return 2 * partLimit;
    case "even":
      return 2 * partLimit - 1;
    case "last":
    case "not":
      return Infinity;
  }
}

// ../../node_modules/.pnpm/cheerio-select@2.1.0/node_modules/cheerio-select/lib/esm/helpers.js
function getDocumentRoot(node) {
  while (node.parent)
    node = node.parent;
  return node;
}
function groupSelectors(selectors) {
  const filteredSelectors = [];
  const plainSelectors = [];
  for (const selector of selectors) {
    if (selector.some(isFilter)) {
      filteredSelectors.push(selector);
    } else {
      plainSelectors.push(selector);
    }
  }
  return [plainSelectors, filteredSelectors];
}

// ../../node_modules/.pnpm/cheerio-select@2.1.0/node_modules/cheerio-select/lib/esm/index.js
var UNIVERSAL_SELECTOR = {
  type: SelectorType.Universal,
  namespace: null
};
var SCOPE_PSEUDO = {
  type: SelectorType.Pseudo,
  name: "scope",
  data: null
};
function is2(element, selector, options = {}) {
  return some([element], selector, options);
}
function some(elements, selector, options = {}) {
  if (typeof selector === "function")
    return elements.some(selector);
  const [plain, filtered] = groupSelectors(parse(selector));
  return plain.length > 0 && elements.some(_compileToken(plain, options)) || filtered.some((sel) => filterBySelector(sel, elements, options).length > 0);
}
function filterByPosition(filter4, elems, data2, options) {
  const num = typeof data2 === "string" ? parseInt(data2, 10) : NaN;
  switch (filter4) {
    case "first":
    case "lt":
      return elems;
    case "last":
      return elems.length > 0 ? [elems[elems.length - 1]] : elems;
    case "nth":
    case "eq":
      return isFinite(num) && Math.abs(num) < elems.length ? [num < 0 ? elems[elems.length + num] : elems[num]] : [];
    case "gt":
      return isFinite(num) ? elems.slice(num + 1) : [];
    case "even":
      return elems.filter((_, i) => i % 2 === 0);
    case "odd":
      return elems.filter((_, i) => i % 2 === 1);
    case "not": {
      const filtered = new Set(filterParsed(data2, elems, options));
      return elems.filter((e) => !filtered.has(e));
    }
  }
}
function filter2(selector, elements, options = {}) {
  return filterParsed(parse(selector), elements, options);
}
function filterParsed(selector, elements, options) {
  if (elements.length === 0)
    return [];
  const [plainSelectors, filteredSelectors] = groupSelectors(selector);
  let found;
  if (plainSelectors.length) {
    const filtered = filterElements(elements, plainSelectors, options);
    if (filteredSelectors.length === 0) {
      return filtered;
    }
    if (filtered.length) {
      found = new Set(filtered);
    }
  }
  for (let i = 0; i < filteredSelectors.length && (found === null || found === void 0 ? void 0 : found.size) !== elements.length; i++) {
    const filteredSelector = filteredSelectors[i];
    const missing = found ? elements.filter((e) => isTag2(e) && !found.has(e)) : elements;
    if (missing.length === 0)
      break;
    const filtered = filterBySelector(filteredSelector, elements, options);
    if (filtered.length) {
      if (!found) {
        if (i === filteredSelectors.length - 1) {
          return filtered;
        }
        found = new Set(filtered);
      } else {
        filtered.forEach((el) => found.add(el));
      }
    }
  }
  return typeof found !== "undefined" ? found.size === elements.length ? elements : (
    // Filter elements to preserve order
    elements.filter((el) => found.has(el))
  ) : [];
}
function filterBySelector(selector, elements, options) {
  var _a2;
  if (selector.some(isTraversal)) {
    const root2 = (_a2 = options.root) !== null && _a2 !== void 0 ? _a2 : getDocumentRoot(elements[0]);
    const opts = { ...options, context: elements, relativeSelector: false };
    selector.push(SCOPE_PSEUDO);
    return findFilterElements(root2, selector, opts, true, elements.length);
  }
  return findFilterElements(elements, selector, options, false, elements.length);
}
function select(selector, root2, options = {}, limit = Infinity) {
  if (typeof selector === "function") {
    return find2(root2, selector);
  }
  const [plain, filtered] = groupSelectors(parse(selector));
  const results = filtered.map((sel) => findFilterElements(root2, sel, options, true, limit));
  if (plain.length) {
    results.push(findElements(root2, plain, options, limit));
  }
  if (results.length === 0) {
    return [];
  }
  if (results.length === 1) {
    return results[0];
  }
  return uniqueSort(results.reduce((a, b) => [...a, ...b]));
}
function findFilterElements(root2, selector, options, queryForSelector, totalLimit) {
  const filterIndex = selector.findIndex(isFilter);
  const sub = selector.slice(0, filterIndex);
  const filter4 = selector[filterIndex];
  const partLimit = selector.length - 1 === filterIndex ? totalLimit : Infinity;
  const limit = getLimit(filter4.name, filter4.data, partLimit);
  if (limit === 0)
    return [];
  const elemsNoLimit = sub.length === 0 && !Array.isArray(root2) ? getChildren(root2).filter(isTag2) : sub.length === 0 ? (Array.isArray(root2) ? root2 : [root2]).filter(isTag2) : queryForSelector || sub.some(isTraversal) ? findElements(root2, [sub], options, limit) : filterElements(root2, [sub], options);
  const elems = elemsNoLimit.slice(0, limit);
  let result = filterByPosition(filter4.name, elems, filter4.data, options);
  if (result.length === 0 || selector.length === filterIndex + 1) {
    return result;
  }
  const remainingSelector = selector.slice(filterIndex + 1);
  const remainingHasTraversal = remainingSelector.some(isTraversal);
  if (remainingHasTraversal) {
    if (isTraversal(remainingSelector[0])) {
      const { type } = remainingSelector[0];
      if (type === SelectorType.Sibling || type === SelectorType.Adjacent) {
        result = prepareContext(result, esm_exports2, true);
      }
      remainingSelector.unshift(UNIVERSAL_SELECTOR);
    }
    options = {
      ...options,
      // Avoid absolutizing the selector
      relativeSelector: false,
      /*
       * Add a custom root func, to make sure traversals don't match elements
       * that aren't a part of the considered tree.
       */
      rootFunc: (el) => result.includes(el)
    };
  } else if (options.rootFunc && options.rootFunc !== boolbase7.trueFunc) {
    options = { ...options, rootFunc: boolbase7.trueFunc };
  }
  return remainingSelector.some(isFilter) ? findFilterElements(result, remainingSelector, options, false, totalLimit) : remainingHasTraversal ? (
    // Query existing elements to resolve traversal.
    findElements(result, [remainingSelector], options, totalLimit)
  ) : (
    // If we don't have any more traversals, simply filter elements.
    filterElements(result, [remainingSelector], options)
  );
}
function findElements(root2, sel, options, limit) {
  const query = _compileToken(sel, options, root2);
  return find2(root2, query, limit);
}
function find2(root2, query, limit = Infinity) {
  const elems = prepareContext(root2, esm_exports2, query.shouldTestNextSiblings);
  return find((node) => isTag2(node) && query(node), elems, true, limit);
}
function filterElements(elements, sel, options) {
  const els = (Array.isArray(elements) ? elements : [elements]).filter(isTag2);
  if (els.length === 0)
    return els;
  const query = _compileToken(sel, options);
  return query === boolbase7.trueFunc ? els : els.filter(query);
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/traversing.js
var reSiblingSelector = /^\s*[~+]/;
function find3(selectorOrHaystack) {
  var _a2;
  if (!selectorOrHaystack) {
    return this._make([]);
  }
  const context = this.toArray();
  if (typeof selectorOrHaystack !== "string") {
    const haystack = isCheerio(selectorOrHaystack) ? selectorOrHaystack.toArray() : [selectorOrHaystack];
    return this._make(haystack.filter((elem) => context.some((node) => contains(node, elem))));
  }
  const elems = reSiblingSelector.test(selectorOrHaystack) ? context : this.children().toArray();
  const options = {
    context,
    root: (_a2 = this._root) === null || _a2 === void 0 ? void 0 : _a2[0],
    // Pass options that are recognized by `cheerio-select`
    xmlMode: this.options.xmlMode,
    lowerCaseTags: this.options.lowerCaseTags,
    lowerCaseAttributeNames: this.options.lowerCaseAttributeNames,
    pseudos: this.options.pseudos,
    quirksMode: this.options.quirksMode
  };
  return this._make(select(selectorOrHaystack, elems, options));
}
function _getMatcher(matchMap) {
  return function(fn, ...postFns) {
    return function(selector) {
      var _a2;
      let matched = matchMap(fn, this);
      if (selector) {
        matched = filterArray(matched, selector, this.options.xmlMode, (_a2 = this._root) === null || _a2 === void 0 ? void 0 : _a2[0]);
      }
      return this._make(
        // Post processing is only necessary if there is more than one element.
        this.length > 1 && matched.length > 1 ? postFns.reduce((elems, fn2) => fn2(elems), matched) : matched
      );
    };
  };
}
var _matcher = _getMatcher((fn, elems) => {
  const ret = [];
  for (let i = 0; i < elems.length; i++) {
    const value = fn(elems[i]);
    ret.push(value);
  }
  return new Array().concat(...ret);
});
var _singleMatcher = _getMatcher((fn, elems) => {
  const ret = [];
  for (let i = 0; i < elems.length; i++) {
    const value = fn(elems[i]);
    if (value !== null) {
      ret.push(value);
    }
  }
  return ret;
});
function _matchUntil(nextElem, ...postFns) {
  let matches = null;
  const innerMatcher = _getMatcher((nextElem2, elems) => {
    const matched = [];
    domEach(elems, (elem) => {
      for (let next2; next2 = nextElem2(elem); elem = next2) {
        if (matches === null || matches === void 0 ? void 0 : matches(next2, matched.length))
          break;
        matched.push(next2);
      }
    });
    return matched;
  })(nextElem, ...postFns);
  return function(selector, filterSelector) {
    matches = typeof selector === "string" ? (elem) => is2(elem, selector, this.options) : selector ? getFilterFn(selector) : null;
    const ret = innerMatcher.call(this, filterSelector);
    matches = null;
    return ret;
  };
}
function _removeDuplicates(elems) {
  return Array.from(new Set(elems));
}
var parent = _singleMatcher(({ parent: parent2 }) => parent2 && !isDocument(parent2) ? parent2 : null, _removeDuplicates);
var parents = _matcher((elem) => {
  const matched = [];
  while (elem.parent && !isDocument(elem.parent)) {
    matched.push(elem.parent);
    elem = elem.parent;
  }
  return matched;
}, uniqueSort, (elems) => elems.reverse());
var parentsUntil = _matchUntil(({ parent: parent2 }) => parent2 && !isDocument(parent2) ? parent2 : null, uniqueSort, (elems) => elems.reverse());
function closest(selector) {
  var _a2;
  const set = [];
  if (!selector) {
    return this._make(set);
  }
  const selectOpts = {
    xmlMode: this.options.xmlMode,
    root: (_a2 = this._root) === null || _a2 === void 0 ? void 0 : _a2[0]
  };
  const selectFn = typeof selector === "string" ? (elem) => is2(elem, selector, selectOpts) : getFilterFn(selector);
  domEach(this, (elem) => {
    while (elem && isTag2(elem)) {
      if (selectFn(elem, 0)) {
        if (!set.includes(elem)) {
          set.push(elem);
        }
        break;
      }
      elem = elem.parent;
    }
  });
  return this._make(set);
}
var next = _singleMatcher((elem) => nextElementSibling(elem));
var nextAll = _matcher((elem) => {
  const matched = [];
  while (elem.next) {
    elem = elem.next;
    if (isTag2(elem))
      matched.push(elem);
  }
  return matched;
}, _removeDuplicates);
var nextUntil = _matchUntil((el) => nextElementSibling(el), _removeDuplicates);
var prev = _singleMatcher((elem) => prevElementSibling(elem));
var prevAll = _matcher((elem) => {
  const matched = [];
  while (elem.prev) {
    elem = elem.prev;
    if (isTag2(elem))
      matched.push(elem);
  }
  return matched;
}, _removeDuplicates);
var prevUntil = _matchUntil((el) => prevElementSibling(el), _removeDuplicates);
var siblings = _matcher((elem) => getSiblings(elem).filter((el) => isTag2(el) && el !== elem), uniqueSort);
var children = _matcher((elem) => getChildren(elem).filter(isTag2), _removeDuplicates);
function contents() {
  const elems = this.toArray().reduce((newElems, elem) => hasChildren(elem) ? newElems.concat(elem.children) : newElems, []);
  return this._make(elems);
}
function each(fn) {
  let i = 0;
  const len = this.length;
  while (i < len && fn.call(this[i], i, this[i]) !== false)
    ++i;
  return this;
}
function map(fn) {
  let elems = [];
  for (let i = 0; i < this.length; i++) {
    const el = this[i];
    const val2 = fn.call(el, i, el);
    if (val2 != null) {
      elems = elems.concat(val2);
    }
  }
  return this._make(elems);
}
function getFilterFn(match) {
  if (typeof match === "function") {
    return (el, i) => match.call(el, i, el);
  }
  if (isCheerio(match)) {
    return (el) => Array.prototype.includes.call(match, el);
  }
  return function(el) {
    return match === el;
  };
}
function filter3(match) {
  var _a2;
  return this._make(filterArray(this.toArray(), match, this.options.xmlMode, (_a2 = this._root) === null || _a2 === void 0 ? void 0 : _a2[0]));
}
function filterArray(nodes, match, xmlMode, root2) {
  return typeof match === "string" ? filter2(match, nodes, { xmlMode, root: root2 }) : nodes.filter(getFilterFn(match));
}
function is3(selector) {
  const nodes = this.toArray();
  return typeof selector === "string" ? some(nodes.filter(isTag2), selector, this.options) : selector ? nodes.some(getFilterFn(selector)) : false;
}
function not(match) {
  let nodes = this.toArray();
  if (typeof match === "string") {
    const matches = new Set(filter2(match, nodes, this.options));
    nodes = nodes.filter((el) => !matches.has(el));
  } else {
    const filterFn = getFilterFn(match);
    nodes = nodes.filter((el, i) => !filterFn(el, i));
  }
  return this._make(nodes);
}
function has(selectorOrHaystack) {
  return this.filter(typeof selectorOrHaystack === "string" ? (
    // Using the `:has` selector here short-circuits searches.
    `:has(${selectorOrHaystack})`
  ) : (_, el) => this._make(el).find(selectorOrHaystack).length > 0);
}
function first() {
  return this.length > 1 ? this._make(this[0]) : this;
}
function last() {
  return this.length > 0 ? this._make(this[this.length - 1]) : this;
}
function eq(i) {
  var _a2;
  i = +i;
  if (i === 0 && this.length <= 1)
    return this;
  if (i < 0)
    i = this.length + i;
  return this._make((_a2 = this[i]) !== null && _a2 !== void 0 ? _a2 : []);
}
function get(i) {
  if (i == null) {
    return this.toArray();
  }
  return this[i < 0 ? this.length + i : i];
}
function toArray() {
  return Array.prototype.slice.call(this);
}
function index(selectorOrNeedle) {
  let $haystack;
  let needle;
  if (selectorOrNeedle == null) {
    $haystack = this.parent().children();
    needle = this[0];
  } else if (typeof selectorOrNeedle === "string") {
    $haystack = this._make(selectorOrNeedle);
    needle = this[0];
  } else {
    $haystack = this;
    needle = isCheerio(selectorOrNeedle) ? selectorOrNeedle[0] : selectorOrNeedle;
  }
  return Array.prototype.indexOf.call($haystack, needle);
}
function slice(start, end2) {
  return this._make(Array.prototype.slice.call(this, start, end2));
}
function end() {
  var _a2;
  return (_a2 = this.prevObject) !== null && _a2 !== void 0 ? _a2 : this._make([]);
}
function add(other, context) {
  const selection = this._make(other, context);
  const contents2 = uniqueSort([...this.get(), ...selection.get()]);
  return this._make(contents2);
}
function addBack(selector) {
  return this.prevObject ? this.add(selector ? this.prevObject.filter(selector) : this.prevObject) : this;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/manipulation.js
var manipulation_exports = {};
__export(manipulation_exports, {
  _makeDomArray: () => _makeDomArray,
  after: () => after,
  append: () => append2,
  appendTo: () => appendTo,
  before: () => before,
  clone: () => clone,
  empty: () => empty,
  html: () => html2,
  insertAfter: () => insertAfter,
  insertBefore: () => insertBefore,
  prepend: () => prepend2,
  prependTo: () => prependTo,
  remove: () => remove,
  replaceWith: () => replaceWith,
  text: () => text2,
  toString: () => toString,
  unwrap: () => unwrap,
  wrap: () => wrap,
  wrapAll: () => wrapAll,
  wrapInner: () => wrapInner
});

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/parse.js
function getParse(parser) {
  return function parse4(content, options, isDocument2, context) {
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(content)) {
      content = content.toString();
    }
    if (typeof content === "string") {
      return parser(content, options, isDocument2, context);
    }
    const doc = content;
    if (!Array.isArray(doc) && isDocument(doc)) {
      return doc;
    }
    const root2 = new Document([]);
    update(doc, root2);
    return root2;
  };
}
function update(newChilds, parent2) {
  const arr = Array.isArray(newChilds) ? newChilds : [newChilds];
  if (parent2) {
    parent2.children = arr;
  } else {
    parent2 = null;
  }
  for (let i = 0; i < arr.length; i++) {
    const node = arr[i];
    if (node.parent && node.parent.children !== arr) {
      removeElement(node);
    }
    if (parent2) {
      node.prev = arr[i - 1] || null;
      node.next = arr[i + 1] || null;
    } else {
      node.prev = node.next = null;
    }
    node.parent = parent2;
  }
  return parent2;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/manipulation.js
function _makeDomArray(elem, clone2) {
  if (elem == null) {
    return [];
  }
  if (isCheerio(elem)) {
    return clone2 ? cloneDom(elem.get()) : elem.get();
  }
  if (Array.isArray(elem)) {
    return elem.reduce((newElems, el) => newElems.concat(this._makeDomArray(el, clone2)), []);
  }
  if (typeof elem === "string") {
    return this._parse(elem, this.options, false, null).children;
  }
  return clone2 ? cloneDom([elem]) : [elem];
}
function _insert(concatenator) {
  return function(...elems) {
    const lastIdx = this.length - 1;
    return domEach(this, (el, i) => {
      if (!hasChildren(el))
        return;
      const domSrc = typeof elems[0] === "function" ? elems[0].call(el, i, this._render(el.children)) : elems;
      const dom = this._makeDomArray(domSrc, i < lastIdx);
      concatenator(dom, el.children, el);
    });
  };
}
function uniqueSplice(array, spliceIdx, spliceCount, newElems, parent2) {
  var _a2, _b;
  const spliceArgs = [
    spliceIdx,
    spliceCount,
    ...newElems
  ];
  const prev2 = spliceIdx === 0 ? null : array[spliceIdx - 1];
  const next2 = spliceIdx + spliceCount >= array.length ? null : array[spliceIdx + spliceCount];
  for (let idx = 0; idx < newElems.length; ++idx) {
    const node = newElems[idx];
    const oldParent = node.parent;
    if (oldParent) {
      const oldSiblings = oldParent.children;
      const prevIdx = oldSiblings.indexOf(node);
      if (prevIdx > -1) {
        oldParent.children.splice(prevIdx, 1);
        if (parent2 === oldParent && spliceIdx > prevIdx) {
          spliceArgs[0]--;
        }
      }
    }
    node.parent = parent2;
    if (node.prev) {
      node.prev.next = (_a2 = node.next) !== null && _a2 !== void 0 ? _a2 : null;
    }
    if (node.next) {
      node.next.prev = (_b = node.prev) !== null && _b !== void 0 ? _b : null;
    }
    node.prev = idx === 0 ? prev2 : newElems[idx - 1];
    node.next = idx === newElems.length - 1 ? next2 : newElems[idx + 1];
  }
  if (prev2) {
    prev2.next = newElems[0];
  }
  if (next2) {
    next2.prev = newElems[newElems.length - 1];
  }
  return array.splice(...spliceArgs);
}
function appendTo(target) {
  const appendTarget = isCheerio(target) ? target : this._make(target);
  appendTarget.append(this);
  return this;
}
function prependTo(target) {
  const prependTarget = isCheerio(target) ? target : this._make(target);
  prependTarget.prepend(this);
  return this;
}
var append2 = _insert((dom, children2, parent2) => {
  uniqueSplice(children2, children2.length, 0, dom, parent2);
});
var prepend2 = _insert((dom, children2, parent2) => {
  uniqueSplice(children2, 0, 0, dom, parent2);
});
function _wrap(insert) {
  return function(wrapper) {
    const lastIdx = this.length - 1;
    const lastParent = this.parents().last();
    for (let i = 0; i < this.length; i++) {
      const el = this[i];
      const wrap2 = typeof wrapper === "function" ? wrapper.call(el, i, el) : typeof wrapper === "string" && !isHtml(wrapper) ? lastParent.find(wrapper).clone() : wrapper;
      const [wrapperDom] = this._makeDomArray(wrap2, i < lastIdx);
      if (!wrapperDom || !hasChildren(wrapperDom))
        continue;
      let elInsertLocation = wrapperDom;
      let j = 0;
      while (j < elInsertLocation.children.length) {
        const child = elInsertLocation.children[j];
        if (isTag2(child)) {
          elInsertLocation = child;
          j = 0;
        } else {
          j++;
        }
      }
      insert(el, elInsertLocation, [wrapperDom]);
    }
    return this;
  };
}
var wrap = _wrap((el, elInsertLocation, wrapperDom) => {
  const { parent: parent2 } = el;
  if (!parent2)
    return;
  const siblings2 = parent2.children;
  const index2 = siblings2.indexOf(el);
  update([el], elInsertLocation);
  uniqueSplice(siblings2, index2, 0, wrapperDom, parent2);
});
var wrapInner = _wrap((el, elInsertLocation, wrapperDom) => {
  if (!hasChildren(el))
    return;
  update(el.children, elInsertLocation);
  update(wrapperDom, el);
});
function unwrap(selector) {
  this.parent(selector).not("body").each((_, el) => {
    this._make(el).replaceWith(el.children);
  });
  return this;
}
function wrapAll(wrapper) {
  const el = this[0];
  if (el) {
    const wrap2 = this._make(typeof wrapper === "function" ? wrapper.call(el, 0, el) : wrapper).insertBefore(el);
    let elInsertLocation;
    for (let i = 0; i < wrap2.length; i++) {
      if (wrap2[i].type === "tag")
        elInsertLocation = wrap2[i];
    }
    let j = 0;
    while (elInsertLocation && j < elInsertLocation.children.length) {
      const child = elInsertLocation.children[j];
      if (child.type === "tag") {
        elInsertLocation = child;
        j = 0;
      } else {
        j++;
      }
    }
    if (elInsertLocation)
      this._make(elInsertLocation).append(this);
  }
  return this;
}
function after(...elems) {
  const lastIdx = this.length - 1;
  return domEach(this, (el, i) => {
    const { parent: parent2 } = el;
    if (!hasChildren(el) || !parent2) {
      return;
    }
    const siblings2 = parent2.children;
    const index2 = siblings2.indexOf(el);
    if (index2 < 0)
      return;
    const domSrc = typeof elems[0] === "function" ? elems[0].call(el, i, this._render(el.children)) : elems;
    const dom = this._makeDomArray(domSrc, i < lastIdx);
    uniqueSplice(siblings2, index2 + 1, 0, dom, parent2);
  });
}
function insertAfter(target) {
  if (typeof target === "string") {
    target = this._make(target);
  }
  this.remove();
  const clones = [];
  this._makeDomArray(target).forEach((el) => {
    const clonedSelf = this.clone().toArray();
    const { parent: parent2 } = el;
    if (!parent2) {
      return;
    }
    const siblings2 = parent2.children;
    const index2 = siblings2.indexOf(el);
    if (index2 < 0)
      return;
    uniqueSplice(siblings2, index2 + 1, 0, clonedSelf, parent2);
    clones.push(...clonedSelf);
  });
  return this._make(clones);
}
function before(...elems) {
  const lastIdx = this.length - 1;
  return domEach(this, (el, i) => {
    const { parent: parent2 } = el;
    if (!hasChildren(el) || !parent2) {
      return;
    }
    const siblings2 = parent2.children;
    const index2 = siblings2.indexOf(el);
    if (index2 < 0)
      return;
    const domSrc = typeof elems[0] === "function" ? elems[0].call(el, i, this._render(el.children)) : elems;
    const dom = this._makeDomArray(domSrc, i < lastIdx);
    uniqueSplice(siblings2, index2, 0, dom, parent2);
  });
}
function insertBefore(target) {
  const targetArr = this._make(target);
  this.remove();
  const clones = [];
  domEach(targetArr, (el) => {
    const clonedSelf = this.clone().toArray();
    const { parent: parent2 } = el;
    if (!parent2) {
      return;
    }
    const siblings2 = parent2.children;
    const index2 = siblings2.indexOf(el);
    if (index2 < 0)
      return;
    uniqueSplice(siblings2, index2, 0, clonedSelf, parent2);
    clones.push(...clonedSelf);
  });
  return this._make(clones);
}
function remove(selector) {
  const elems = selector ? this.filter(selector) : this;
  domEach(elems, (el) => {
    removeElement(el);
    el.prev = el.next = el.parent = null;
  });
  return this;
}
function replaceWith(content) {
  return domEach(this, (el, i) => {
    const { parent: parent2 } = el;
    if (!parent2) {
      return;
    }
    const siblings2 = parent2.children;
    const cont = typeof content === "function" ? content.call(el, i, el) : content;
    const dom = this._makeDomArray(cont);
    update(dom, null);
    const index2 = siblings2.indexOf(el);
    uniqueSplice(siblings2, index2, 1, dom, parent2);
    if (!dom.includes(el)) {
      el.parent = el.prev = el.next = null;
    }
  });
}
function empty() {
  return domEach(this, (el) => {
    if (!hasChildren(el))
      return;
    el.children.forEach((child) => {
      child.next = child.prev = child.parent = null;
    });
    el.children.length = 0;
  });
}
function html2(str) {
  if (str === void 0) {
    const el = this[0];
    if (!el || !hasChildren(el))
      return null;
    return this._render(el.children);
  }
  return domEach(this, (el) => {
    if (!hasChildren(el))
      return;
    el.children.forEach((child) => {
      child.next = child.prev = child.parent = null;
    });
    const content = isCheerio(str) ? str.toArray() : this._parse(`${str}`, this.options, false, el).children;
    update(content, el);
  });
}
function toString() {
  return this._render(this);
}
function text2(str) {
  if (str === void 0) {
    return text(this);
  }
  if (typeof str === "function") {
    return domEach(this, (el, i) => this._make(el).text(str.call(el, i, text([el]))));
  }
  return domEach(this, (el) => {
    if (!hasChildren(el))
      return;
    el.children.forEach((child) => {
      child.next = child.prev = child.parent = null;
    });
    const textNode = new Text2(`${str}`);
    update(textNode, el);
  });
}
function clone() {
  return this._make(cloneDom(this.get()));
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/css.js
var css_exports = {};
__export(css_exports, {
  css: () => css
});
function css(prop2, val2) {
  if (prop2 != null && val2 != null || // When `prop` is a "plain" object
  typeof prop2 === "object" && !Array.isArray(prop2)) {
    return domEach(this, (el, i) => {
      if (isTag2(el)) {
        setCss(el, prop2, val2, i);
      }
    });
  }
  if (this.length === 0) {
    return void 0;
  }
  return getCss(this[0], prop2);
}
function setCss(el, prop2, value, idx) {
  if (typeof prop2 === "string") {
    const styles = getCss(el);
    const val2 = typeof value === "function" ? value.call(el, idx, styles[prop2]) : value;
    if (val2 === "") {
      delete styles[prop2];
    } else if (val2 != null) {
      styles[prop2] = val2;
    }
    el.attribs["style"] = stringify(styles);
  } else if (typeof prop2 === "object") {
    Object.keys(prop2).forEach((k, i) => {
      setCss(el, k, prop2[k], i);
    });
  }
}
function getCss(el, prop2) {
  if (!el || !isTag2(el))
    return;
  const styles = parse3(el.attribs["style"]);
  if (typeof prop2 === "string") {
    return styles[prop2];
  }
  if (Array.isArray(prop2)) {
    const newStyles = {};
    prop2.forEach((item) => {
      if (styles[item] != null) {
        newStyles[item] = styles[item];
      }
    });
    return newStyles;
  }
  return styles;
}
function stringify(obj) {
  return Object.keys(obj).reduce((str, prop2) => `${str}${str ? " " : ""}${prop2}: ${obj[prop2]};`, "");
}
function parse3(styles) {
  styles = (styles || "").trim();
  if (!styles)
    return {};
  const obj = {};
  let key;
  for (const str of styles.split(";")) {
    const n = str.indexOf(":");
    if (n < 1 || n === str.length - 1) {
      const trimmed = str.trimEnd();
      if (trimmed.length > 0 && key !== void 0) {
        obj[key] += `;${trimmed}`;
      }
    } else {
      key = str.slice(0, n).trim();
      obj[key] = str.slice(n + 1).trim();
    }
  }
  return obj;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/api/forms.js
var forms_exports = {};
__export(forms_exports, {
  serialize: () => serialize,
  serializeArray: () => serializeArray
});
var submittableSelector = "input,select,textarea,keygen";
var r20 = /%20/g;
var rCRLF = /\r?\n/g;
function serialize() {
  const arr = this.serializeArray();
  const retArr = arr.map((data2) => `${encodeURIComponent(data2.name)}=${encodeURIComponent(data2.value)}`);
  return retArr.join("&").replace(r20, "+");
}
function serializeArray() {
  return this.map((_, elem) => {
    const $elem = this._make(elem);
    if (isTag2(elem) && elem.name === "form") {
      return $elem.find(submittableSelector).toArray();
    }
    return $elem.filter(submittableSelector).toArray();
  }).filter(
    // Verify elements have a name (`attr.name`) and are not disabled (`:enabled`)
    '[name!=""]:enabled:not(:submit, :button, :image, :reset, :file):matches([checked], :not(:checkbox, :radio))'
    // Convert each of the elements to its value(s)
  ).map((_, elem) => {
    var _a2;
    const $elem = this._make(elem);
    const name = $elem.attr("name");
    const value = (_a2 = $elem.val()) !== null && _a2 !== void 0 ? _a2 : "";
    if (Array.isArray(value)) {
      return value.map((val2) => (
        /*
         * We trim replace any line endings (e.g. `\r` or `\r\n` with `\r\n`) to guarantee consistency across platforms
         * These can occur inside of `<textarea>'s`
         */
        { name, value: val2.replace(rCRLF, "\r\n") }
      ));
    }
    return { name, value: value.replace(rCRLF, "\r\n") };
  }).toArray();
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/cheerio.js
var Cheerio = class {
  /**
   * Instance of cheerio. Methods are specified in the modules. Usage of this
   * constructor is not recommended. Please use `$.load` instead.
   *
   * @private
   * @param elements - The new selection.
   * @param root - Sets the root node.
   * @param options - Options for the instance.
   */
  constructor(elements, root2, options) {
    this.length = 0;
    this.options = options;
    this._root = root2;
    if (elements) {
      for (let idx = 0; idx < elements.length; idx++) {
        this[idx] = elements[idx];
      }
      this.length = elements.length;
    }
  }
};
Cheerio.prototype.cheerio = "[cheerio object]";
Cheerio.prototype.splice = Array.prototype.splice;
Cheerio.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
Object.assign(Cheerio.prototype, attributes_exports, traversing_exports, manipulation_exports, css_exports, forms_exports);

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/load.js
function getLoad(parse4, render3) {
  return function load2(content, options, isDocument2 = true) {
    if (content == null) {
      throw new Error("cheerio.load() expects a string");
    }
    const internalOpts = { ...options_default, ...flatten(options) };
    const initialRoot = parse4(content, internalOpts, isDocument2, null);
    class LoadedCheerio extends Cheerio {
      _make(selector, context) {
        const cheerio = initialize(selector, context);
        cheerio.prevObject = this;
        return cheerio;
      }
      _parse(content2, options2, isDocument3, context) {
        return parse4(content2, options2, isDocument3, context);
      }
      _render(dom) {
        return render3(dom, this.options);
      }
    }
    function initialize(selector, context, root2 = initialRoot, opts) {
      if (selector && isCheerio(selector))
        return selector;
      const options2 = {
        ...internalOpts,
        ...flatten(opts)
      };
      const r = typeof root2 === "string" ? [parse4(root2, options2, false, null)] : "length" in root2 ? root2 : [root2];
      const rootInstance = isCheerio(r) ? r : new LoadedCheerio(r, null, options2);
      rootInstance._root = rootInstance;
      if (!selector) {
        return new LoadedCheerio(void 0, rootInstance, options2);
      }
      const elements = typeof selector === "string" && isHtml(selector) ? (
        // $(<html>)
        parse4(selector, options2, false, null).children
      ) : isNode(selector) ? (
        // $(dom)
        [selector]
      ) : Array.isArray(selector) ? (
        // $([dom])
        selector
      ) : void 0;
      const instance = new LoadedCheerio(elements, rootInstance, options2);
      if (elements) {
        return instance;
      }
      if (typeof selector !== "string") {
        throw new Error("Unexpected type of selector");
      }
      let search = selector;
      const searchContext = !context ? (
        // If we don't have a context, maybe we have a root, from loading
        rootInstance
      ) : typeof context === "string" ? isHtml(context) ? (
        // $('li', '<ul>...</ul>')
        new LoadedCheerio([parse4(context, options2, false, null)], rootInstance, options2)
      ) : (
        // $('li', 'ul')
        (search = `${context} ${search}`, rootInstance)
      ) : isCheerio(context) ? (
        // $('li', $)
        context
      ) : (
        // $('li', node), $('li', [nodes])
        new LoadedCheerio(Array.isArray(context) ? context : [context], rootInstance, options2)
      );
      if (!searchContext)
        return instance;
      return searchContext.find(search);
    }
    Object.assign(initialize, static_exports, {
      load: load2,
      // `_root` and `_options` are used in static methods.
      _root: initialRoot,
      _options: internalOpts,
      // Add `fn` for plugins
      fn: LoadedCheerio.prototype,
      // Add the prototype here to maintain `instanceof` behavior.
      prototype: LoadedCheerio.prototype
    });
    return initialize;
  };
}
function isNode(obj) {
  return !!obj.name || obj.type === "root" || obj.type === "text" || obj.type === "comment";
}

// ../../node_modules/.pnpm/htmlparser2@8.0.2/node_modules/htmlparser2/lib/esm/Tokenizer.js
var CharCodes2;
(function(CharCodes3) {
  CharCodes3[CharCodes3["Tab"] = 9] = "Tab";
  CharCodes3[CharCodes3["NewLine"] = 10] = "NewLine";
  CharCodes3[CharCodes3["FormFeed"] = 12] = "FormFeed";
  CharCodes3[CharCodes3["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes3[CharCodes3["Space"] = 32] = "Space";
  CharCodes3[CharCodes3["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes3[CharCodes3["Number"] = 35] = "Number";
  CharCodes3[CharCodes3["Amp"] = 38] = "Amp";
  CharCodes3[CharCodes3["SingleQuote"] = 39] = "SingleQuote";
  CharCodes3[CharCodes3["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes3[CharCodes3["Dash"] = 45] = "Dash";
  CharCodes3[CharCodes3["Slash"] = 47] = "Slash";
  CharCodes3[CharCodes3["Zero"] = 48] = "Zero";
  CharCodes3[CharCodes3["Nine"] = 57] = "Nine";
  CharCodes3[CharCodes3["Semi"] = 59] = "Semi";
  CharCodes3[CharCodes3["Lt"] = 60] = "Lt";
  CharCodes3[CharCodes3["Eq"] = 61] = "Eq";
  CharCodes3[CharCodes3["Gt"] = 62] = "Gt";
  CharCodes3[CharCodes3["Questionmark"] = 63] = "Questionmark";
  CharCodes3[CharCodes3["UpperA"] = 65] = "UpperA";
  CharCodes3[CharCodes3["LowerA"] = 97] = "LowerA";
  CharCodes3[CharCodes3["UpperF"] = 70] = "UpperF";
  CharCodes3[CharCodes3["LowerF"] = 102] = "LowerF";
  CharCodes3[CharCodes3["UpperZ"] = 90] = "UpperZ";
  CharCodes3[CharCodes3["LowerZ"] = 122] = "LowerZ";
  CharCodes3[CharCodes3["LowerX"] = 120] = "LowerX";
  CharCodes3[CharCodes3["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
  State2[State2["InCommentLike"] = 21] = "InCommentLike";
  State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
  State2[State2["BeforeEntity"] = 25] = "BeforeEntity";
  State2[State2["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
  State2[State2["InNamedEntity"] = 27] = "InNamedEntity";
  State2[State2["InNumericEntity"] = 28] = "InNumericEntity";
  State2[State2["InHexEntity"] = 29] = "InHexEntity";
})(State || (State = {}));
function isWhitespace2(c) {
  return c === CharCodes2.Space || c === CharCodes2.NewLine || c === CharCodes2.Tab || c === CharCodes2.FormFeed || c === CharCodes2.CarriageReturn;
}
function isEndOfTagSection(c) {
  return c === CharCodes2.Slash || c === CharCodes2.Gt || isWhitespace2(c);
}
function isNumber2(c) {
  return c >= CharCodes2.Zero && c <= CharCodes2.Nine;
}
function isASCIIAlpha(c) {
  return c >= CharCodes2.LowerA && c <= CharCodes2.LowerZ || c >= CharCodes2.UpperA && c <= CharCodes2.UpperZ;
}
function isHexDigit(c) {
  return c >= CharCodes2.UpperA && c <= CharCodes2.UpperF || c >= CharCodes2.LowerA && c <= CharCodes2.LowerF;
}
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  CdataEnd: new Uint8Array([93, 93, 62]),
  CommentEnd: new Uint8Array([45, 45, 62]),
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
  // `</title`
};
var Tokenizer = class {
  constructor({ xmlMode = false, decodeEntities = true }, cbs) {
    this.cbs = cbs;
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.running = true;
    this.offset = 0;
    this.currentSequence = void 0;
    this.sequenceIndex = 0;
    this.trieIndex = 0;
    this.trieCurrent = 0;
    this.entityResult = 0;
    this.entityExcess = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityTrie = xmlMode ? decode_data_xml_default : decode_data_html_default;
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = void 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  /**
   * The current index within all of the written data.
   */
  getIndex() {
    return this.index;
  }
  /**
   * The start of the current section.
   */
  getSectionStart() {
    return this.sectionStart;
  }
  stateText(c) {
    if (c === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.state = State.BeforeEntity;
    }
  }
  stateSpecialStartSequence(c) {
    const isEnd = this.sequenceIndex === this.currentSequence.length;
    const isMatch = isEnd ? (
      // If we are at the end of the sequence, make sure the tag name has ended
      isEndOfTagSection(c)
    ) : (
      // Otherwise, do a case-insensitive comparison
      (c | 32) === this.currentSequence[this.sequenceIndex]
    );
    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes2.Gt || isWhitespace2(c)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        if (this.decodeEntities && c === CharCodes2.Amp) {
          this.state = State.BeforeEntity;
        }
      } else if (this.fastForwardTo(CharCodes2.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c === CharCodes2.Lt);
    }
  }
  stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  stateInCommentLike(c) {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c) {
    if (c === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c)) {
      const lower = c | 32;
      this.sectionStart = this.index;
      if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
        this.startSpecial(Sequences.TitleEnd, 3);
      } else {
        this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
      }
    } else if (c === CharCodes2.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  }
  stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateBeforeClosingTagName(c) {
    if (isWhitespace2(c)) {
    } else if (c === CharCodes2.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (c === CharCodes2.Gt || isWhitespace2(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  }
  stateAfterClosingTagName(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onopentagend(this.index);
      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }
      this.baseState = this.state;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace2(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateInSelfClosingTag(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false;
    } else if (!isWhitespace2(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateInAttributeName(c) {
    if (c === CharCodes2.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  }
  stateAfterAttributeName(c) {
    if (c === CharCodes2.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes2.Slash || c === CharCodes2.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace2(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c) {
    if (c === CharCodes2.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace2(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c);
    }
  }
  handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  }
  stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c) {
    if (isWhitespace2(c) || c === CharCodes2.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  }
  stateBeforeDeclaration(c) {
    if (c === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateInProcessingInstruction(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeSpecialS(c) {
    const lower = c | 32;
    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c);
    }
  }
  stateBeforeEntity(c) {
    this.entityExcess = 1;
    this.entityResult = 0;
    if (c === CharCodes2.Number) {
      this.state = State.BeforeNumericEntity;
    } else if (c === CharCodes2.Amp) {
    } else {
      this.trieIndex = 0;
      this.trieCurrent = this.entityTrie[0];
      this.state = State.InNamedEntity;
      this.stateInNamedEntity(c);
    }
  }
  stateInNamedEntity(c) {
    this.entityExcess += 1;
    this.trieIndex = determineBranch(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
    if (this.trieIndex < 0) {
      this.emitNamedEntity();
      this.index--;
      return;
    }
    this.trieCurrent = this.entityTrie[this.trieIndex];
    const masked = this.trieCurrent & BinTrieFlags.VALUE_LENGTH;
    if (masked) {
      const valueLength = (masked >> 14) - 1;
      if (!this.allowLegacyEntity() && c !== CharCodes2.Semi) {
        this.trieIndex += valueLength;
      } else {
        const entityStart = this.index - this.entityExcess + 1;
        if (entityStart > this.sectionStart) {
          this.emitPartial(this.sectionStart, entityStart);
        }
        this.entityResult = this.trieIndex;
        this.trieIndex += valueLength;
        this.entityExcess = 0;
        this.sectionStart = this.index + 1;
        if (valueLength === 0) {
          this.emitNamedEntity();
        }
      }
    }
  }
  emitNamedEntity() {
    this.state = this.baseState;
    if (this.entityResult === 0) {
      return;
    }
    const valueLength = (this.entityTrie[this.entityResult] & BinTrieFlags.VALUE_LENGTH) >> 14;
    switch (valueLength) {
      case 1: {
        this.emitCodePoint(this.entityTrie[this.entityResult] & ~BinTrieFlags.VALUE_LENGTH);
        break;
      }
      case 2: {
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        break;
      }
      case 3: {
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
      }
    }
  }
  stateBeforeNumericEntity(c) {
    if ((c | 32) === CharCodes2.LowerX) {
      this.entityExcess++;
      this.state = State.InHexEntity;
    } else {
      this.state = State.InNumericEntity;
      this.stateInNumericEntity(c);
    }
  }
  emitNumericEntity(strict) {
    const entityStart = this.index - this.entityExcess - 1;
    const numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
    if (numberStart !== this.index) {
      if (entityStart > this.sectionStart) {
        this.emitPartial(this.sectionStart, entityStart);
      }
      this.sectionStart = this.index + Number(strict);
      this.emitCodePoint(replaceCodePoint(this.entityResult));
    }
    this.state = this.baseState;
  }
  stateInNumericEntity(c) {
    if (c === CharCodes2.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber2(c)) {
      this.entityResult = this.entityResult * 10 + (c - CharCodes2.Zero);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }
      this.index--;
    }
  }
  stateInHexEntity(c) {
    if (c === CharCodes2.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber2(c)) {
      this.entityResult = this.entityResult * 16 + (c - CharCodes2.Zero);
      this.entityExcess++;
    } else if (isHexDigit(c)) {
      this.entityResult = this.entityResult * 16 + ((c | 32) - CharCodes2.LowerA + 10);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }
      this.index--;
    }
  }
  allowLegacyEntity() {
    return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c);
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c);
          break;
        }
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c);
          break;
        }
        case State.InNamedEntity: {
          this.stateInNamedEntity(c);
          break;
        }
        case State.BeforeEntity: {
          this.stateBeforeEntity(c);
          break;
        }
        case State.InHexEntity: {
          this.stateInHexEntity(c);
          break;
        }
        case State.InNumericEntity: {
          this.stateInNumericEntity(c);
          break;
        }
        default: {
          this.stateBeforeNumericEntity(c);
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InNamedEntity) {
      this.emitNamedEntity();
    }
    if (this.sectionStart < this.index) {
      this.handleTrailingData();
    }
    this.cbs.onend();
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false);
    } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false);
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
    }
  }
  emitPartial(start, endIndex) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribdata(start, endIndex);
    } else {
      this.cbs.ontext(start, endIndex);
    }
  }
  emitCodePoint(cp) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribentity(cp);
    } else {
      this.cbs.ontextentity(cp);
    }
  }
};

// ../../node_modules/.pnpm/htmlparser2@8.0.2/node_modules/htmlparser2/lib/esm/Parser.js
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", pTag],
  ["h2", pTag],
  ["h3", pTag],
  ["h4", pTag],
  ["h5", pTag],
  ["h6", pTag],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignobject",
  "desc",
  "title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
  constructor(cbs, options = {}) {
    var _a2, _b, _c, _d, _e;
    this.options = options;
    this.startIndex = 0;
    this.endIndex = 0;
    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.foreignContext = [];
    this.buffers = [];
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.lowerCaseTagNames = (_a2 = options.lowerCaseTags) !== null && _a2 !== void 0 ? _a2 : !options.xmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
    this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer)(this.options, this);
    (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
  }
  // Tokenizer event handlers
  /** @internal */
  ontext(start, endIndex) {
    var _a2, _b;
    const data2 = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, data2);
    this.startIndex = endIndex;
  }
  /** @internal */
  ontextentity(cp) {
    var _a2, _b;
    const index2 = this.tokenizer.getSectionStart();
    this.endIndex = index2 - 1;
    (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, fromCodePoint(cp));
    this.startIndex = index2;
  }
  isVoidElement(name) {
    return !this.options.xmlMode && voidElements.has(name);
  }
  /** @internal */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    this.emitOpenTag(name);
  }
  emitOpenTag(name) {
    var _a2, _b, _c, _d;
    this.openTagStart = this.startIndex;
    this.tagname = name;
    const impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
        const element = this.stack.pop();
        (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, element, true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.push(name);
      if (foreignContextElements.has(name)) {
        this.foreignContext.push(true);
      } else if (htmlIntegrationElements.has(name)) {
        this.foreignContext.push(false);
      }
    }
    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a2, _b;
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      (_b = (_a2 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a2, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /** @internal */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onclosetag(start, endIndex) {
    var _a2, _b, _c, _d, _e, _f;
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
      this.foreignContext.pop();
    }
    if (!this.isVoidElement(name)) {
      const pos = this.stack.lastIndexOf(name);
      if (pos !== -1) {
        if (this.cbs.onclosetag) {
          let count = this.stack.length - pos;
          while (count--) {
            this.cbs.onclosetag(this.stack.pop(), count !== 0);
          }
        } else
          this.stack.length = pos;
      } else if (!this.options.xmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (!this.options.xmlMode && name === "br") {
      (_b = (_a2 = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a2, "br");
      (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
      (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  closeCurrentTag(isOpenImplied) {
    var _a2, _b;
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[this.stack.length - 1] === name) {
      (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, name, !isOpenImplied);
      this.stack.pop();
    }
  }
  /** @internal */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /** @internal */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /** @internal */
  onattribend(quote, endIndex) {
    var _a2, _b;
    this.endIndex = endIndex;
    (_b = (_a2 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a2, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index2 = value.search(reNameEnd);
    let name = index2 < 0 ? value : value.substr(0, index2);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    return name;
  }
  /** @internal */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncomment(start, endIndex, offset) {
    var _a2, _b, _c, _d;
    this.endIndex = endIndex;
    (_b = (_a2 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a2, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncdata(start, endIndex, offset) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (this.options.xmlMode || this.options.recognizeCDATA) {
      (_b = (_a2 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a2);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    var _a2, _b;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index2 = this.stack.length; index2 > 0; this.cbs.onclosetag(this.stack[--index2], true))
        ;
    }
    (_b = (_a2 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a2);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    var _a2, _b, _c, _d;
    (_b = (_a2 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a2);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  parseComplete(data2) {
    this.reset();
    this.end(data2);
  }
  getSlice(start, end2) {
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice2 = this.buffers[0].slice(start - this.bufferOffset, end2 - this.bufferOffset);
    while (end2 - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice2 += this.buffers[0].slice(0, end2 - this.bufferOffset);
    }
    return slice2;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   *
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    var _a2, _b;
    if (this.ended) {
      (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   *
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    var _a2, _b;
    if (this.ended) {
      (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  done(chunk) {
    this.end(chunk);
  }
};

// ../../node_modules/.pnpm/htmlparser2@8.0.2/node_modules/htmlparser2/lib/esm/index.js
function parseDocument(data2, options) {
  const handler = new DomHandler(void 0, options);
  new Parser(handler, options).end(data2);
  return handler.root;
}

// ../../node_modules/.pnpm/cheerio@1.0.0-rc.12/node_modules/cheerio/lib/esm/slim.js
var load = getLoad(getParse(parseDocument), esm_default);

// ../../packages/core/dist/browser/license-verifier.js
var DEFAULT_ED25519_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAPDKGZKGybKTZBEP6YKZJ2CeaH7Xtc5N7au4NzyHDyLM=
-----END PUBLIC KEY-----`;
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
function pemToDer(pem) {
  const clean = pem.replace(/-----[^\n]+-----/g, "").replace(/\s+/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
async function verifyLicenseToken(tokenString, publicKeyPem = DEFAULT_ED25519_PUBLIC_KEY_PEM) {
  try {
    if (!tokenString || typeof tokenString !== "string") {
      return { valid: false, error: "MALFORMED_TOKEN" };
    }
    const parts = tokenString.trim().split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "MALFORMED_TOKEN" };
    }
    const [payloadB64, signatureB64] = parts;
    if (!payloadB64 || !signatureB64) {
      return { valid: false, error: "MALFORMED_TOKEN" };
    }
    const payloadBuffer = base64UrlDecode(payloadB64);
    const signatureBuffer = base64UrlDecode(signatureB64);
    let payload;
    try {
      const jsonText = new TextDecoder().decode(payloadBuffer);
      payload = JSON.parse(jsonText);
    } catch {
      return { valid: false, error: "MALFORMED_TOKEN" };
    }
    if (!payload || typeof payload !== "object" || !payload.sub || !payload.exp) {
      return { valid: false, error: "MALFORMED_TOKEN" };
    }
    const now = Math.floor(Date.now() / 1e3);
    if (payload.exp < now) {
      return { valid: false, error: "TOKEN_EXPIRED" };
    }
    const der = pemToDer(publicKeyPem);
    const cryptoKey = await crypto.subtle.importKey("spki", der, { name: "Ed25519" }, false, ["verify"]);
    const isSignatureValid = await crypto.subtle.verify("Ed25519", cryptoKey, signatureBuffer, payloadBuffer);
    if (!isSignatureValid) {
      return { valid: false, error: "INVALID_SIGNATURE" };
    }
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ../../packages/core/dist/sheets/cache-key.js
var import_node_crypto = require("crypto");
var APPS_SCRIPT_CACHE_KEY_FUNCTION_SNIPPET = `
/**
 * Generates a deterministic, collision-resistant 64-char Hex SHA-256 cache key
 * compliant with Google Apps Script CacheService key constraints (<= 250 ASCII chars, no spaces/colons).
 * @param {string} url Destination page URL
 * @param {string} [preset] Preset ID or slug
 * @return {string} Fixed-length cache key (e.g. "zb_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
 */
function getZabreuitCacheKey(url, preset) {
  var raw = (url || '').trim() + '_' + (preset || '001-universal-ecommerce-product').trim();
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < digest.length; i++) {
    var byteVal = digest[i];
    if (byteVal < 0) byteVal += 256;
    var byteHex = byteVal.toString(16);
    if (byteHex.length === 1) hex += '0';
    hex += byteHex;
  }
  return 'zb_' + hex;
}
`.trim();

// ../../packages/core/dist/runner/universal-runner.js
var import_node_fs2 = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);

// ../../packages/core/dist/commercial/catalog-10000.js
var MACRO_CLUSTERS_DATA = [
  {
    "id": "1",
    "code": "C01",
    "name": "Global Retail & E-Commerce Arbitrage",
    "engine": "M1",
    "ppeRange": [
      1.5,
      3.5
    ],
    "dpRange": [
      9.99,
      14.99
    ],
    "category": "ecommerce",
    "deliverableType": "standalone_cli",
    "mechanism": 'Extracci\xF3n determinista de bloques Schema.org en <script type="application/ld+json"> (Product, Offer, SKU, Price, In-Stock Availability, Rating) y metadatos estructurados sin requerir browser headless',
    "icp": "E-commerce retailers, Amazon/Walmart arbitrageurs, pricing intelligence teams",
    "subsectors": [
      "Consumer Electronics & Gadgets Arbitrage",
      "Fashion & Apparel Price Catalog Snapshot",
      "Home Goods & Kitchenware Catalog Snapshot",
      "Grocery & Supermarket Price Extractor",
      "Beauty, Cosmetics & Personal Care",
      "Automotive Parts & Accessories Catalog Scanner",
      "Sporting Goods & Fitness Equipment Auditor",
      "Toys, Hobbies & Collectibles Arbitrage",
      "Luxury Goods & High-End Watches Inspector",
      "Books, Media & Video Games Price Validator"
    ],
    "intentions": [
      [
        "Catalog Product SKU & Title Identifier",
        "sku-title-identifier",
        "M1",
        "Extracci\xF3n de Schema.org Product (name, sku)"
      ],
      [
        "Inventory Stock Availability Inspector",
        "stock-availability",
        "M1",
        "Extracci\xF3n de Schema.org ItemAvailability (InStock, OutOfStock, PreOrder)"
      ],
      [
        "Product Offer Price & Currency Snapshot",
        "offer-price-currency",
        "M1",
        "Extracci\xF3n de Schema.org Offer (price, priceCurrency)"
      ],
      [
        "Original vs Promotional Price Extractor",
        "original-promotional-price",
        "M1",
        "Extracci\xF3n de Schema.org AggregateOffer highPrice o PriceSpecification ListPrice frente a price de oferta y c\xE1lculo de descuento"
      ],
      [
        "Aggregate Star Rating Score Extractor",
        "rating-score",
        "M1",
        "Extracci\xF3n de Schema.org AggregateRating (ratingValue, bestRating)"
      ],
      [
        "Customer Review Count Metric Extractor",
        "review-count-metric",
        "M1",
        "Extracci\xF3n de Schema.org AggregateRating (reviewCount)"
      ],
      [
        "Brand & Manufacturer Attribute Extractor",
        "brand-manufacturer",
        "M1",
        "Extracci\xF3n de Schema.org Brand (name, manufacturer)"
      ],
      [
        "Product Image Gallery URL Extractor",
        "image-gallery-urls",
        "M1",
        "Extracci\xF3n de Schema.org ImageObject (image URLs)"
      ],
      [
        "Product Variant & Option Matrix Extractor",
        "variant-option-matrix",
        "M1",
        "Extracci\xF3n de Schema.org hasVariant y matrices de ofertas anidadas"
      ],
      [
        "Product Description & Feature List Extractor",
        "description-features",
        "M1",
        "Extracci\xF3n de Schema.org Product (name, description)"
      ]
    ],
    "targets": [
      [
        "Amazon US",
        "amazon.com",
        "us"
      ],
      [
        "Walmart Marketplace",
        "walmart.com",
        "us"
      ],
      [
        "Target Superstores",
        "target.com",
        "us"
      ],
      [
        "Best Buy",
        "bestbuy.com",
        "us"
      ],
      [
        "eBay Marketplace",
        "ebay.com",
        "us"
      ],
      [
        "AliExpress Direct",
        "aliexpress.com",
        "global"
      ],
      [
        "MercadoLibre LatAm",
        "mercadolibre.com",
        "latam"
      ],
      [
        "Otto GmbH",
        "otto.de",
        "de"
      ],
      [
        "Rakuten Ichiba",
        "rakuten.co.jp",
        "jp"
      ],
      [
        "Flipkart Retail",
        "flipkart.com",
        "in"
      ]
    ]
  },
  {
    "id": "2",
    "code": "C02",
    "name": "D2C & Multi-Platform Storefronts",
    "engine": "M1",
    "ppeRange": [
      1,
      2.5
    ],
    "dpRange": [
      9.99,
      12.99
    ],
    "category": "ecommerce",
    "deliverableType": "standalone_cli",
    "mechanism": "Consumo directo de endpoints p\xFAblicos REST/GraphQL (/products.json) y JSON nativo sin parseo DOM ni browser headless",
    "icp": "Shopify/WooCommerce brand owners, D2C marketers, dropshipping aggregators",
    "subsectors": [
      "Shopify D2C Apparel & Footwear Stores",
      "WooCommerce Artisanal & Craft Storefronts",
      "BigCommerce Consumer Electronics Channels",
      "Magento Enterprise B2B Distributor Catalogs",
      "Tiendanube LatAm D2C Multi-Vendor Brands",
      "PrestaShop European Retail Product Feeds",
      "Wix Stores Boutique Decor & Furnishings",
      "Squarespace Designer Lifestyle Collections",
      "Ecwid Embedded Fast-Checkout Storefronts",
      "Custom Headless Commerce API Storefronts"
    ],
    "intentions": [
      [
        "Full Catalog /products.json Dumper",
        "catalog-dumper",
        "M1"
      ],
      [
        "Inventory Stock-Level Delta Snapshot",
        "inventory-snapshot",
        "M1"
      ],
      [
        "Price Change & Discount Code Validator",
        "discount-validator",
        "M1"
      ],
      [
        "Barcode & UPC Barcode Sync Extractor",
        "barcode-sync",
        "M1"
      ],
      [
        "Multi-Currency Regional Pricing Extractor",
        "currency-pricing",
        "M1"
      ],
      [
        "New Collection Drop & SKU Arrival Scanner",
        "new-drops-scanner",
        "M1"
      ],
      [
        "Product Tag & Category Hierarchy Crawler",
        "category-hierarchy",
        "M1"
      ],
      [
        "Weight & Shipping Dimensions Extractor",
        "shipping-dimensions",
        "M1"
      ],
      [
        "Product Description & Rich HTML Sync",
        "description-sync",
        "M1"
      ],
      [
        "Out-of-Stock Back-in-Stock Event Validator",
        "back-in-stock-validator",
        "M1"
      ]
    ],
    "targets": [
      [
        "Shopify Global",
        "shopify.com",
        "global"
      ],
      [
        "WooCommerce Network",
        "woocommerce.com",
        "global"
      ],
      [
        "BigCommerce Enterprise",
        "bigcommerce.com",
        "us"
      ],
      [
        "Magento Open Source",
        "magento.com",
        "global"
      ],
      [
        "Tiendanube LatAm",
        "tiendanube.com",
        "latam"
      ],
      [
        "PrestaShop Hub",
        "prestashop.com",
        "eu"
      ],
      [
        "Wix eCommerce",
        "wix.com",
        "global"
      ],
      [
        "Squarespace Commerce",
        "squarespace.com",
        "us"
      ],
      [
        "Ecwid Storefronts",
        "ecwid.com",
        "global"
      ],
      [
        "Shopware 6",
        "shopware.com",
        "eu"
      ]
    ]
  },
  {
    "id": "3",
    "code": "C03",
    "name": "B2B Leads, Tech Stack & Hiring Signals",
    "engine": "M4",
    "ppeRange": [
      3,
      6
    ],
    "dpRange": [
      14.99,
      19.99
    ],
    "category": "b2b_leads",
    "deliverableType": "standalone_cli",
    "mechanism": "Consultas DNS nativas (MX/TXT), inspecci\xF3n de cabeceras HTTP y regex compilada multihilo para ATS y contactos sin Chromium",
    "icp": "B2B SDRs, sales operations, recruiters, technographic intelligence analysts",
    "subsectors": [
      "SaaS Enterprise Cloud Infrastructure Stack",
      "Fintech & Payment Gateway Detection Scanner",
      "MarTech & Customer Analytics Stack Tracker",
      "CyberSecurity & Zero-Trust Tooling Audit",
      "Developer Tooling & CI/CD Pipeline Discovery",
      "HealthTech & Telemedicine Tech Compliance",
      "EdTech & Remote Learning Platform Signals",
      "PropTech & Construction Tech Stack Signals",
      "Logistics & Supply Chain Automation Signals",
      "AI & Machine Learning Infrastructure Signals"
    ],
    "intentions": [
      [
        "DNS MX & Mail Provider Classifier",
        "dns-mx-classifier",
        "M4"
      ],
      [
        "DNS TXT SPF & Verification Analyzer",
        "dns-txt-spf",
        "M4"
      ],
      [
        "Server Header & WAF Firewall Fingerprinter",
        "server-waf-fingerprint",
        "M4"
      ],
      [
        "ATS Job Board & Active Vacancies Scanner",
        "ats-vacancies-scanner",
        "M4"
      ],
      [
        "Corporate Contact & Executive Link Extractor",
        "corporate-contacts",
        "M4"
      ],
      [
        "SDK & Frontend Framework Detector",
        "sdk-framework-detector",
        "M4"
      ],
      [
        "Analytics & Tracking Pixel Auditor",
        "analytics-pixel-audit",
        "M4"
      ],
      [
        "Cloud Provider & Hosting Datacenter Detector",
        "cloud-datacenter-detector",
        "M4"
      ],
      [
        "CRM & Helpdesk Integration Detector",
        "crm-helpdesk-detector",
        "M4"
      ],
      [
        "SSL Issuer & Security Posture Probe",
        "ssl-security-probe",
        "M4"
      ]
    ],
    "targets": [
      [
        "Enterprise Portals",
        "enterprise.net",
        "us"
      ],
      [
        "SaaS Founders Hub",
        "saashub.com",
        "global"
      ],
      [
        "Cloud Startups Index",
        "cloudstartups.org",
        "us"
      ],
      [
        "FinTech Global Network",
        "fintechnetwork.io",
        "global"
      ],
      [
        "European Tech Hub",
        "eurotechhub.eu",
        "eu"
      ],
      [
        "UK Tech Companies",
        "uktechdirectory.co.uk",
        "uk"
      ],
      [
        "Silicon Valley Directory",
        "svdirectory.com",
        "us"
      ],
      [
        "LatAm SaaS Ecosystem",
        "latamsaas.la",
        "latam"
      ],
      [
        "APAC Business Exchange",
        "apacbiz.asia",
        "apac"
      ],
      [
        "Global Corporate Index",
        "corporateindex.org",
        "global"
      ]
    ]
  },
  {
    "id": "4",
    "code": "C04",
    "name": "Real Estate, Proptech & Asset Yield",
    "engine": "M2",
    "ppeRange": [
      4,
      8
    ],
    "dpRange": [
      14.99,
      19.99
    ],
    "category": "real_estate",
    "deliverableType": "standalone_cli",
    "mechanism": "Extracci\xF3n selectiva de JSON en __NEXT_DATA__ y state hydration en portales inmobiliarios sin requerir browser headless",
    "icp": "Real estate investors, property managers, cap-rate analysts, proptech founders",
    "subsectors": [
      "Residential Single-Family Home Cap Rate",
      "Multi-Family Apartment Rental Yield Scanner",
      "Commercial Office & Retail Space Lease Auditor",
      "Industrial Warehouses & Logistics Hubs",
      "Vacation Rentals & Short-Term Stay Properties",
      "Distressed Assets & Foreclosure Auction Inspector",
      "Land Parcels & Agricultural Real Estate",
      "Student Housing & Co-Living Space Analyzer",
      "Luxury Penthouses & Waterfront Estates",
      "New Construction & Development Project Launches"
    ],
    "intentions": [
      [
        "Cap Rate & Rental Yield Calculator",
        "cap-rate-yield",
        "M2"
      ],
      [
        "Price Drop & Days on Market Parser",
        "price-drop-parser",
        "M2"
      ],
      [
        "Price per Square Meter/Foot Benchmark",
        "price-per-m2",
        "M2"
      ],
      [
        "Historical Valuation & Tax Record Extractor",
        "tax-valuation-history",
        "M2"
      ],
      [
        "Agent Fee & Commission Calculator",
        "agent-fee-calculator",
        "M2"
      ],
      [
        "Mortgage & HOA Cost Breakdown Extractor",
        "mortgage-hoa-breakdown",
        "M2"
      ],
      [
        "Geo Coordinates & Neighborhood Metric Extractor",
        "geo-neighborhood-metrics",
        "M2"
      ],
      [
        "Property Features & Floorplan Spec Extractor",
        "features-floorplan-spec",
        "M2"
      ],
      [
        "Investment ROI & Cash Flow Projector",
        "investment-roi-cashflow",
        "M2"
      ],
      [
        "Foreclosure & Distressed Price Scanner",
        "foreclosure-price-scanner",
        "M2"
      ]
    ],
    "targets": [
      [
        "Zillow Real Estate",
        "zillow.com",
        "us"
      ],
      [
        "Redfin Property Portal",
        "redfin.com",
        "us"
      ],
      [
        "Realtor.com Network",
        "realtor.com",
        "us"
      ],
      [
        "Idealista Spain & Portugal",
        "idealista.com",
        "es"
      ],
      [
        "Fotocasa Iberia",
        "fotocasa.es",
        "es"
      ],
      [
        "Rightmove UK",
        "rightmove.co.uk",
        "uk"
      ],
      [
        "Zoopla UK Property",
        "zoopla.co.uk",
        "uk"
      ],
      [
        "Properati LatAm",
        "properati.com",
        "latam"
      ],
      [
        "Domain Australia",
        "domain.com.au",
        "au"
      ],
      [
        "Immobilienscout24 Germany",
        "immobilienscout24.de",
        "de"
      ]
    ]
  },
  {
    "id": "5",
    "code": "C05",
    "name": "Financial Markets, SEC Filings & Registries",
    "engine": "M3",
    "ppeRange": [
      3.5,
      7.5
    ],
    "dpRange": [
      14.99,
      19.99
    ],
    "category": "finance_osint",
    "deliverableType": "standalone_cli",
    "mechanism": "Descarga HTTP est\xE1tica de filings con cabeceras est\xE1ndar y transformaci\xF3n a Markdown limpio y tablas JSON",
    "icp": "Financial analysts, equity research associates, compliance officers, forensic accountants",
    "subsectors": [
      "Technology & Software Enterprise Filings",
      "Financial Services & Banking Filings",
      "Healthcare & Pharmaceutical Filings",
      "Consumer Goods & Retail Enterprise Filings",
      "Industrial Manufacturing & Aerospace Filings",
      "Energy, Oil & Renewable Utilities Filings",
      "Telecommunications & Digital Media Filings",
      "Automotive & Electric Mobility Filings",
      "Real Estate Investment Trusts & REIT Filings",
      "Materials, Mining & Chemicals Corporate Filings"
    ],
    "intentions": [
      [
        "Statutory Annual Filing HTML to Markdown Parser",
        "statutory-filing-html-markdown",
        "M3",
        "Conversi\xF3n completa de reportes HTML/XML a Markdown GFM normalizado"
      ],
      [
        "Statutory Disclosure Table & Data Block Extractor",
        "disclosure-table-extractor",
        "M3",
        "Extracci\xF3n y transformaci\xF3n de tablas contables HTML a tablas Markdown GFM"
      ],
      [
        "Document Heading & Regulatory Section Indexer",
        "heading-section-indexer",
        "M3",
        "Extracci\xF3n de jerarqu\xEDa completa de encabezados y tabla de contenido regulatoria"
      ],
      [
        "Filing Metadata & Document Metric Inspector",
        "metadata-metric-inspector",
        "M3",
        "Inspecci\xF3n de metadatos, idioma, conteo de palabras y estimaci\xF3n de tokens"
      ],
      [
        "Filing Content Chunker & Token Budget Estimator",
        "content-chunker-token-budget",
        "M3",
        "Segmentaci\xF3n de documentos en chunks con l\xEDmite de tokens para ingesta en LLMs"
      ],
      [
        "Targeted Regulatory Section Extractor",
        "targeted-section-extractor",
        "M3",
        "Aislamiento de secciones normativas delimitadas mediante b\xFAsqueda de encabezados"
      ],
      [
        "Boilerplate & Disclosure Disclaimer Stripper",
        "boilerplate-disclaimer-stripper",
        "M3",
        "Limpieza y remoci\xF3n determinista de disclaimers repetitivos y navegaci\xF3n"
      ],
      [
        "Regulatory Filing Hyperlink & Reference Parser",
        "hyperlink-reference-parser",
        "M3",
        "Preservaci\xF3n y parseo de hiperv\xEDnculos normativos a enlaces Markdown"
      ],
      [
        "Financial Note & Accounting Schedule Table Extractor",
        "accounting-schedule-extractor",
        "M3",
        "Extracci\xF3n de tablas de notas a estados financieros en formato GFM"
      ],
      [
        "Executive Frontmatter & Document Header Ingester",
        "frontmatter-header-ingester",
        "M3",
        "Generaci\xF3n de encabezado YAML frontmatter con metadatos del filing"
      ]
    ],
    "targets": [
      [
        "SEC EDGAR",
        "sec.gov",
        "us"
      ],
      [
        "Companies House UK",
        "companieshouse.gov.uk",
        "uk"
      ],
      [
        "SEDAR+ Canada",
        "sedarplus.ca",
        "ca"
      ],
      [
        "ASX Australia",
        "asx.com.au",
        "au"
      ],
      [
        "CNMV Spain",
        "cnmv.es",
        "es"
      ],
      [
        "AMF France",
        "amf-france.org",
        "eu"
      ],
      [
        "Unternehmensregister Germany",
        "unternehmensregister.de",
        "eu"
      ],
      [
        "B3 Brazil",
        "b3.com.br",
        "latam"
      ],
      [
        "Bolsa Mexicana BMV",
        "bmv.com.mx",
        "latam"
      ],
      [
        "SGX Singapore",
        "sgx.com",
        "apac"
      ]
    ]
  },
  {
    "id": "6",
    "code": "C06",
    "name": "Travel, Hospitality & Event Ticketing",
    "engine": "M2",
    "ppeRange": [
      2.5,
      5
    ],
    "dpRange": [
      12.99,
      16.99
    ],
    "category": "other",
    "deliverableType": "standalone_cli",
    "mechanism": "Inspecci\xF3n de cach\xE9s Apollo (__APOLLO_STATE__) y microdatos Schema.org de eventos sin simulaci\xF3n de navegador",
    "icp": "Hospitality revenue managers, event organizers, travel deal aggregators",
    "subsectors": [
      "Hotel Room Rates & Calendar Availability",
      "Short-Term Rental Cleaning Fees & Taxes",
      "Flight Routes & Dynamic Airfare Trackers",
      "Cruise Line Cabin Pricing & Itineraries",
      "Car Rental Fleet Rates & Airport Surcharges",
      "Live Concert & Music Festival Ticket Tiers",
      "Sports League Stadium Seat & Pass Pricing",
      "Conference & Expo Attendee Passes Scanner",
      "Restaurant Reservation Slots & Tasting Menus",
      "Theme Park Daily Passes & Fast-Track Rates"
    ],
    "intentions": [
      [
        "Daily Rate Calendar & Surge Price Extractor",
        "daily-rate-calendar",
        "M2"
      ],
      [
        "Cleaning Fee & Extra Charges Discloser",
        "cleaning-fee-discloser",
        "M2"
      ],
      [
        "Guest Sentiment & Rating Breakdown Extractor",
        "guest-sentiment-breakdown",
        "M2"
      ],
      [
        "Availability Matrix & Minimum Stay Detector",
        "availability-minimum-stay",
        "M2"
      ],
      [
        "Flight Route & Dynamic Fare Extractor",
        "flight-fare-extractor",
        "M2"
      ],
      [
        "Cabin Class & Baggage Fee Discloser",
        "cabin-baggage-fees",
        "M2"
      ],
      [
        "Venue Seating Tier & VIP Pass Extractor",
        "venue-seating-tiers",
        "M2"
      ],
      [
        "Early Bird & Discount Code Extractor",
        "early-bird-discounts",
        "M2"
      ],
      [
        "Table Booking Availability Slot Extractor",
        "table-booking-slots",
        "M2"
      ],
      [
        "Cancellation Policy & Refund Terms Extractor",
        "cancellation-terms",
        "M2"
      ]
    ],
    "targets": [
      [
        "Booking.com Lodging",
        "booking.com",
        "global"
      ],
      [
        "Airbnb Stays",
        "airbnb.com",
        "global"
      ],
      [
        "TripAdvisor Experiences",
        "tripadvisor.com",
        "global"
      ],
      [
        "Skyscanner Fares",
        "skyscanner.com",
        "global"
      ],
      [
        "Eventbrite Events",
        "eventbrite.com",
        "global"
      ],
      [
        "Ticketmaster Tiers",
        "ticketmaster.com",
        "us"
      ],
      [
        "OpenTable Dining",
        "opentable.com",
        "us"
      ],
      [
        "Expedia Travel",
        "expedia.com",
        "global"
      ],
      [
        "Kayak Travel Search",
        "kayak.com",
        "global"
      ],
      [
        "Resy Restaurant Reservations",
        "resy.com",
        "us"
      ]
    ]
  },
  {
    "id": "7",
    "code": "C07",
    "name": "AI Agent Context, RAG & Knowledge Bases",
    "engine": "M3",
    "ppeRange": [
      2,
      4
    ],
    "dpRange": [
      9.99,
      14.99
    ],
    "category": "ai_developer_tools",
    "deliverableType": "standalone_cli",
    "mechanism": "Parser HTML a Markdown nativo ultra-r\xE1pido, eliminaci\xF3n heur\xEDstica de boilerplate y chunking determinista",
    "icp": "AI engineers, LLM app developers, RAG pipeline architects, knowledge managers",
    "subsectors": [
      "ArXiv & Research Paper Clean Markdown Extractor",
      "GitHub Documentation & API Reference Chunker",
      "Notion Public Pages to Structured Vector Chunks",
      "Substack Newsletter Archive & Digest Parser",
      "ReadTheDocs Technical Manuals Markdown Scraper",
      "GitBook Knowledge Base Semantic Chunker",
      "Confluence Public Space Documentation Parser",
      "Medium & Dev.to Technical Article Cleaner",
      "StackOverflow & Forum Discussion Thread Digest",
      "Whitepaper & PDF-to-Markdown Clean Pipeline"
    ],
    "intentions": [
      [
        "Clean Markdown Article Extractor",
        "clean-markdown-extractor",
        "M3"
      ],
      [
        "Heading-Preserved Semantic Chunker",
        "semantic-chunker",
        "M3"
      ],
      [
        "Code Snippet & Syntax Block Extractor",
        "code-syntax-extractor",
        "M3"
      ],
      [
        "Table & Mathematical Formula Formatter",
        "math-table-formatter",
        "M3"
      ],
      [
        "Metadata & Citation Reference Extractor",
        "citation-metadata",
        "M3"
      ],
      [
        "Boilerplate & Navigation Stripper",
        "boilerplate-stripper",
        "M3"
      ],
      [
        "Token Count & Cost Estimator",
        "token-cost-estimator",
        "M3"
      ],
      [
        "Hierarchical Section Tree Extractor",
        "section-tree-extractor",
        "M3"
      ],
      [
        "Image Caption & Context Extractor",
        "image-caption-context",
        "M3"
      ],
      [
        "Cross-Link & Footnote Resolver",
        "crosslink-resolver",
        "M3"
      ]
    ],
    "targets": [
      [
        "ArXiv Repository",
        "arxiv.org",
        "global"
      ],
      [
        "GitHub Documentation",
        "github.com",
        "global"
      ],
      [
        "Notion Public Pages",
        "notion.site",
        "global"
      ],
      [
        "Substack Publications",
        "substack.com",
        "global"
      ],
      [
        "ReadTheDocs Sites",
        "readthedocs.io",
        "global"
      ],
      [
        "GitBook Public Spaces",
        "gitbook.io",
        "global"
      ],
      [
        "Confluence Documentation",
        "atlassian.net",
        "global"
      ],
      [
        "Dev.to Technical Community",
        "dev.to",
        "global"
      ],
      [
        "Medium Publications",
        "medium.com",
        "global"
      ],
      [
        "StackOverflow Tech Threads",
        "stackoverflow.com",
        "global"
      ]
    ]
  },
  {
    "id": "8",
    "code": "C08",
    "name": "Technical SEO, Web Health & Compliance",
    "engine": "M5",
    "ppeRange": [
      1.5,
      3.5
    ],
    "dpRange": [
      9.99,
      14.99
    ],
    "category": "seo_compliance",
    "deliverableType": "standalone_cli",
    "mechanism": "Socket TLS nativo para certificados X.509 y HTTP est\xE1tico para .well-known/security.txt sin dependencias externas pesadas",
    "icp": "Technical SEO consultants, web performance engineers, privacy compliance leads",
    "subsectors": [
      "SSL/TLS Certificate Expiry & Cipher Strength",
      "Security.txt Vulnerability Policy Validator",
      "Robots.txt Directives & Bot Rules Checker",
      "OpenGraph & Social Preview Tag Validator",
      "Canonical Tag & Hreflang Loop Auditor",
      "Cookie Banner Consent & Privacy Compliance",
      "Core Web Vitals Static Resource Health",
      "DNSSEC, DMARC & SPF Email Security Audit",
      "HTTP Security Headers (CSP, HSTS, X-Frame)",
      "Broken Links & Redirect Chain Fast Analyzer"
    ],
    "intentions": [
      [
        "SSL Expiry Date & Certificate Authority Probe",
        "ssl-expiry-ca-probe",
        "M5"
      ],
      [
        "Security.txt Vulnerability Policy Validator",
        "security-txt-validator",
        "M5"
      ],
      [
        "Robots.txt Directives & Bot Rules Checker",
        "robots-txt-checker",
        "M5"
      ],
      [
        "OpenGraph & Social Preview Tag Validator",
        "opengraph-preview-check",
        "M5"
      ],
      [
        "Canonical Tag & Hreflang Loop Auditor",
        "canonical-hreflang-audit",
        "M5"
      ],
      [
        "Cookie Consent Banner Compliance Auditor",
        "cookie-banner-compliance",
        "M5"
      ],
      [
        "DNS MX, SPF & DMARC Posture Inspector",
        "dns-dmarc-spf-posture",
        "M5"
      ],
      [
        "Security Response Headers (CSP/HSTS) Check",
        "security-headers-check",
        "M5"
      ],
      [
        "HTTP-to-HTTPS Redirect Chain Auditor",
        "https-redirect-audit",
        "M5"
      ],
      [
        "Broken Resource & 404 Status Scanner",
        "broken-resource-scanner",
        "M5"
      ]
    ],
    "targets": [
      [
        "E-Commerce Portals",
        "web-retail.org",
        "us"
      ],
      [
        "SaaS Web Apps",
        "saas-scanner.io",
        "global"
      ],
      [
        "Financial Web Platforms",
        "fin-audit.net",
        "us"
      ],
      [
        "News & Media Outlets",
        "media-scan.org",
        "global"
      ],
      [
        "Healthcare Websites",
        "health-web.org",
        "us"
      ],
      [
        "Higher Education Domains",
        "edu-health.org",
        "us"
      ],
      [
        "Gov & Public Sector Domains",
        "public-audit.gov",
        "us"
      ],
      [
        "European Union Web Properties",
        "eu-compliance.eu",
        "eu"
      ],
      [
        "US Enterprise Domains",
        "us-enterprise.com",
        "us"
      ],
      [
        "Global Top 10k Sites",
        "global-web.net",
        "global"
      ]
    ]
  },
  {
    "id": "9",
    "code": "C09",
    "name": "Local Verticals, Health & Pro Directories",
    "engine": "M4",
    "ppeRange": [
      3,
      6.5
    ],
    "dpRange": [
      12.99,
      16.99
    ],
    "category": "b2b_leads",
    "deliverableType": "standalone_cli",
    "mechanism": "Mapeo de microdatos LocalBusiness (direcci\xF3n, tel\xE9fono, geo) y regex de contacto en pie de p\xE1gina",
    "icp": "Local business consultants, directory aggregators, lead brokers, market researchers",
    "subsectors": [
      "Dental Clinics & Orthodontists Directory",
      "Medical Specialists & Healthcare Providers",
      "Legal Services, Attorneys & Law Firms",
      "Accounting, CPA & Tax Advisory Firms",
      "Home Improvement, Plumbers & Electricians",
      "Auto Repair Shops & Mechanic Garages",
      "Veterinary Clinics & Pet Care Centers",
      "Real Estate Agencies & Brokerage Offices",
      "Fitness Studios, Gyms & Wellness Centers",
      "Digital Agencies & IT Consulting Firms"
    ],
    "intentions": [
      [
        "Business Name, Phone & Address Extractor",
        "name-phone-address",
        "M4"
      ],
      [
        "Business Hours & Holiday Schedule Extractor",
        "hours-schedule-extractor",
        "M4"
      ],
      [
        "Professional License & Verification Checker",
        "license-verification",
        "M4"
      ],
      [
        "Insurance In-Network Acceptance Extractor",
        "insurance-acceptance",
        "M4"
      ],
      [
        "Service Menu & Hourly Rate Benchmark",
        "service-hourly-rates",
        "M4"
      ],
      [
        "Customer Review Sentiment & Star Rating",
        "customer-review-stars",
        "M4"
      ],
      [
        "Geo Coordinates & Service Area Radius",
        "geo-coordinates-radius",
        "M4"
      ],
      [
        "Appointment Booking Link Extractor",
        "booking-link-extractor",
        "M4"
      ],
      [
        "Multiple Practitioner Staff Roster Extractor",
        "practitioner-roster",
        "M4"
      ],
      [
        "Direct Email & Contact Form Finder",
        "direct-email-finder",
        "M4"
      ]
    ],
    "targets": [
      [
        "Yelp Directory",
        "yelp.com",
        "us"
      ],
      [
        "Google Business Profiles",
        "google.com/maps",
        "global"
      ],
      [
        "YellowPages Local",
        "yellowpages.com",
        "us"
      ],
      [
        "ZocDoc Medical",
        "zocdoc.com",
        "us"
      ],
      [
        "Avvo Legal Directory",
        "avvo.com",
        "us"
      ],
      [
        "Clutch.co Agency Ratings",
        "clutch.co",
        "global"
      ],
      [
        "Angi Home Services",
        "angi.com",
        "us"
      ],
      [
        "Thumbtack Local Pros",
        "thumbtack.com",
        "us"
      ],
      [
        "Healthgrades Doctors",
        "healthgrades.com",
        "us"
      ],
      [
        "Martindale Legal Hub",
        "martindale.com",
        "us"
      ]
    ]
  },
  {
    "id": "10",
    "code": "C10",
    "name": "Public Tenders, Grants & Procurement",
    "engine": "M3",
    "ppeRange": [
      5,
      8
    ],
    "dpRange": [
      16.99,
      19.99
    ],
    "category": "finance_osint",
    "deliverableType": "standalone_cli",
    "mechanism": "Ingesti\xF3n de feeds XML/HTML gubernamentales y conversi\xF3n de pliegos a Markdown estructurado con presupuestos normalizados",
    "icp": "GovTech consultants, bid writers, grant proposal teams, public procurement specialists",
    "subsectors": [
      "SAM.gov Federal Contract Awards & Solicitations",
      "TED Europa EU Public Procurement Notices",
      "Spanish Sector P\xFAblico Tender Pliegos & Budgets",
      "UN Global Marketplace Procurement Feed Ingester",
      "World Bank & Inter-American Dev Grants",
      "State & Municipal Infrastructure Bidding Feeds",
      "Defense & Aerospace Procurement Solicitations",
      "Public Healthcare & Pharmaceutical Supply Bids",
      "Green Energy & Climate Infrastructure Tenders",
      "Smart City & GovTech Innovation Challenges"
    ],
    "intentions": [
      [
        "Tender Notice & Solicitation Details Extractor",
        "tender-solicitation-details",
        "M3"
      ],
      [
        "Submission Deadline & Time-to-Close Validator",
        "submission-deadline-validator",
        "M3"
      ],
      [
        "Estimated Budget & Maximum Ceiling Extractor",
        "budget-ceiling-extractor",
        "M3"
      ],
      [
        "CPV Code & Procurement Classification Parser",
        "cpv-classification-parser",
        "M3"
      ],
      [
        "Technical Specifications to Markdown",
        "tech-spec-markdown",
        "M3"
      ],
      [
        "Issuing Authority & Contracting Officer Finder",
        "contracting-officer-finder",
        "M3"
      ],
      [
        "Mandatory Pre-Qualification Criteria Parser",
        "prequalification-criteria",
        "M3"
      ],
      [
        "Awarded Contract Value & Winner Extractor",
        "awarded-winner-extractor",
        "M3"
      ],
      [
        "Amendment & Clarification Addenda Parser",
        "amendment-addenda-parser",
        "M3"
      ],
      [
        "Direct Bid Submission Portal Link Extractor",
        "bid-portal-link-extractor",
        "M3"
      ]
    ],
    "targets": [
      [
        "SAM.gov Federal Contracts",
        "sam.gov",
        "us"
      ],
      [
        "TED Europa Tenders",
        "ted.europa.eu",
        "eu"
      ],
      [
        "Contrataci\xF3n del Estado Spain",
        "contrataciondelestado.es",
        "es"
      ],
      [
        "UN Global Marketplace",
        "ungm.org",
        "global"
      ],
      [
        "World Bank Procurement",
        "worldbank.org",
        "global"
      ],
      [
        "UK Contracts Finder",
        "gov.uk/contracts-finder",
        "uk"
      ],
      [
        "Canada Buys Tender Feed",
        "canadabuys.canada.ca",
        "ca"
      ],
      [
        "Australia AusTender",
        "tenders.gov.au",
        "au"
      ],
      [
        "ChileCompra Public Tenders",
        "mercadopublico.cl",
        "latam"
      ],
      [
        "European Development Bank",
        "ebrd.com",
        "eu"
      ]
    ]
  }
];
var SUBSECTOR_CLEAN_MAP = {
  "Consumer Electronics & Gadgets Arbitrage": "Consumer Electronics",
  "Fashion & Apparel Price Catalog Snapshot": "Fashion & Apparel",
  "Home Goods & Kitchenware Catalog Snapshot": "Home & Kitchen",
  "Grocery & Supermarket Price Extractor": "Grocery & Supermarket",
  "Beauty, Cosmetics & Personal Care": "Beauty & Personal Care",
  "Automotive Parts & Accessories Catalog Scanner": "Automotive Parts",
  "Sporting Goods & Fitness Equipment Auditor": "Sporting Goods",
  "Toys, Hobbies & Collectibles Arbitrage": "Toys & Collectibles",
  "Luxury Goods & High-End Watches Inspector": "Luxury Goods",
  "Books, Media & Video Games Price Validator": "Books & Media",
  "Shopify D2C Apparel & Footwear Stores": "Apparel & Footwear",
  "WooCommerce Artisanal & Craft Storefronts": "Artisanal & Crafts",
  "BigCommerce Consumer Electronics Channels": "Consumer Electronics",
  "Magento Enterprise B2B Distributor Catalogs": "B2B Distributor Catalogs",
  "Tiendanube LatAm D2C Multi-Vendor Brands": "D2C Multi-Vendor",
  "PrestaShop European Retail Product Feeds": "Retail Product Feeds",
  "Wix Stores Boutique Decor & Furnishings": "Decor & Furnishings",
  "Squarespace Designer Lifestyle Collections": "Lifestyle Collections",
  "Ecwid Embedded Fast-Checkout Storefronts": "Fast-Checkout Stores",
  "Custom Headless Commerce API Storefronts": "Headless Storefronts",
  "SaaS Enterprise Cloud Infrastructure Stack": "SaaS & Cloud",
  "Fintech & Payment Gateway Detection Scanner": "Fintech & Payments",
  "MarTech & Customer Analytics Stack Tracker": "MarTech & Analytics",
  "CyberSecurity & Zero-Trust Tooling Audit": "Cybersecurity & Zero-Trust",
  "Developer Tooling & CI/CD Pipeline Discovery": "DevTools & CI/CD",
  "HealthTech & Telemedicine Tech Compliance": "HealthTech & Medical",
  "EdTech & Remote Learning Platform Signals": "EdTech & Learning",
  "PropTech & Construction Tech Stack Signals": "PropTech & Real Estate",
  "Logistics & Supply Chain Automation Signals": "Logistics & Supply Chain",
  "AI & Machine Learning Infrastructure Signals": "AI & Machine Learning",
  "Residential Single-Family Home Cap Rate": "Residential Homes",
  "Multi-Family Apartment Rental Yield Scanner": "Multi-Family Apartments",
  "Commercial Office & Retail Space Lease Auditor": "Commercial Office & Retail",
  "Industrial Warehouses & Logistics Hubs": "Industrial & Logistics",
  "Vacation Rentals & Short-Term Stay Properties": "Vacation & Short-Term Rentals",
  "Distressed Assets & Foreclosure Auction Inspector": "Distressed & Foreclosure Assets",
  "Land Parcels & Agricultural Real Estate": "Land & Agricultural",
  "Student Housing & Co-Living Space Analyzer": "Student Housing & Co-Living",
  "Luxury Penthouses & Waterfront Estates": "Luxury & Waterfront",
  "New Construction & Development Project Launches": "New Construction Projects",
  "Technology & Software Enterprise Filings": "Tech & Software",
  "Financial Services & Banking Filings": "Banking & Financials",
  "Healthcare & Pharmaceutical Filings": "Pharma & Healthcare",
  "Consumer Goods & Retail Enterprise Filings": "Retail & Consumer Goods",
  "Industrial Manufacturing & Aerospace Filings": "Industrial & Aerospace",
  "Energy, Oil & Renewable Utilities Filings": "Energy & Utilities",
  "Telecommunications & Digital Media Filings": "Telecom & Media",
  "Automotive & Electric Mobility Filings": "Automotive & EV",
  "Real Estate Investment Trusts & REIT Filings": "REIT & Real Estate",
  "Materials, Mining & Chemicals Corporate Filings": "Materials & Mining Filings",
  "Hotel Room Rates & Calendar Availability": "Hotel Room Rates",
  "Short-Term Rental Cleaning Fees & Taxes": "Short-Term Rentals",
  "Flight Routes & Dynamic Airfare Trackers": "Flight Routes & Airfare",
  "Cruise Line Cabin Pricing & Itineraries": "Cruise Cabins & Itineraries",
  "Car Rental Fleet Rates & Airport Surcharges": "Car Rental Fleets",
  "Live Concert & Music Festival Ticket Tiers": "Live Concerts & Festivals",
  "Sports League Stadium Seat & Pass Pricing": "Sports Stadiums & Passes",
  "Conference & Expo Attendee Passes Scanner": "Conferences & Expos",
  "Restaurant Reservation Slots & Tasting Menus": "Restaurant Reservations",
  "Theme Park Daily Passes & Fast-Track Rates": "Theme Parks & Passes",
  "ArXiv & Research Paper Clean Markdown Extractor": "ArXiv Research Papers",
  "GitHub Documentation & API Reference Chunker": "GitHub API Documentation",
  "Notion Public Pages to Structured Vector Chunks": "Notion Public Pages",
  "Substack Newsletter Archive & Digest Parser": "Substack Newsletters",
  "ReadTheDocs Technical Manuals Markdown Scraper": "ReadTheDocs Manuals",
  "GitBook Knowledge Base Semantic Chunker": "GitBook Knowledge Bases",
  "Confluence Public Space Documentation Parser": "Confluence Spaces",
  "Medium & Dev.to Technical Article Cleaner": "Technical Articles",
  "StackOverflow & Forum Discussion Thread Digest": "Developer Forums",
  "Whitepaper & PDF-to-Markdown Clean Pipeline": "Whitepaper PDFs",
  "SSL/TLS Certificate Expiry & Cipher Strength": "SSL/TLS Certificates",
  "Security.txt Vulnerability Policy Validator": "Security.txt Policies",
  "Robots.txt Directives & Bot Rules Checker": "Robots.txt Directives",
  "OpenGraph & Social Preview Tag Validator": "OpenGraph & Social Tags",
  "Canonical Tag & Hreflang Loop Auditor": "Canonical & Hreflang",
  "Cookie Banner Consent & Privacy Compliance": "Cookie Consent & Privacy",
  "Core Web Vitals Static Resource Health": "Core Web Vitals",
  "DNSSEC, DMARC & SPF Email Security Audit": "DNSSEC & Email Security",
  "HTTP Security Headers (CSP, HSTS, X-Frame)": "HTTP Security Headers",
  "Broken Links & Redirect Chain Fast Analyzer": "Broken Links & Redirects",
  "Dental Clinics & Orthodontists Directory": "Dental & Orthodontics",
  "Medical Specialists & Healthcare Providers": "Medical & Healthcare",
  "Legal Services, Attorneys & Law Firms": "Legal & Law Firms",
  "Accounting, CPA & Tax Advisory Firms": "Accounting & CPA Firms",
  "Home Improvement, Plumbers & Electricians": "Home Improvement & Trades",
  "Auto Repair Shops & Mechanic Garages": "Auto Repair & Mechanics",
  "Veterinary Clinics & Pet Care Centers": "Veterinary & Pet Care",
  "Real Estate Agencies & Brokerage Offices": "Real Estate Brokerages",
  "Fitness Studios, Gyms & Wellness Centers": "Fitness & Gym Studios",
  "Digital Agencies & IT Consulting Firms": "Digital & IT Agencies",
  "SAM.gov Federal Contract Awards & Solicitations": "Federal Contract Solicitations",
  "TED Europa EU Public Procurement Notices": "EU Public Procurement Notices",
  "Spanish Sector P\xFAblico Tender Pliegos & Budgets": "Spanish Public Tenders",
  "UN Global Marketplace Procurement Feed Ingester": "UN Global Procurement",
  "World Bank & Inter-American Dev Grants": "World Bank & IADB Grants",
  "State & Municipal Infrastructure Bidding Feeds": "Municipal Infrastructure Bids",
  "Defense & Aerospace Procurement Solicitations": "Defense & Aerospace Bids",
  "Public Healthcare & Pharmaceutical Supply Bids": "Healthcare & Pharma Bids",
  "Green Energy & Climate Infrastructure Tenders": "Green Energy Tenders",
  "Smart City & GovTech Innovation Challenges": "Smart City & GovTech Bids"
};
var TARGET_CLEAN_MAP = {
  "Best Buy Electronics": "Best Buy",
  "eBay Completed Listings": "eBay Marketplace",
  "Otto GmbH Europe": "Otto GmbH",
  "SEC EDGAR": "SEC EDGAR",
  "SEC EDGAR US": "SEC EDGAR",
  "Companies House UK": "Companies House UK",
  "SEDAR+ Canada": "SEDAR+ Canada",
  "ASX Australia": "ASX Australia",
  "ASX Announcements Australia": "ASX Australia",
  "CNMV Spain": "CNMV Spain",
  "CNMV Registros Spain": "CNMV Spain",
  "AMF France": "AMF France",
  "AMF Regulated Info France": "AMF France",
  "Unternehmensregister Germany": "Unternehmensregister Germany",
  "BaFin Unternehmensregister Germany": "Unternehmensregister Germany",
  "B3 Brazil": "B3 Brazil",
  "B3 Divulga\xE7\xF5es Brazil": "B3 Brazil",
  "Bolsa Mexicana BMV": "Bolsa Mexicana BMV",
  "SGX Singapore": "SGX Singapore",
  "SGX FastAnnounce Singapore": "SGX Singapore",
  "Booking.com Lodging": "Booking.com",
  "Airbnb Vacation Homes": "Airbnb",
  "Expedia Travel Deals": "Expedia",
  "Tripadvisor Reviews": "Tripadvisor",
  "Hotels.com Inventory": "Hotels.com",
  "Kayak Fare Aggregator": "Kayak",
  "Skyscanner Flight Feeds": "Skyscanner",
  "Ticketmaster Events": "Ticketmaster",
  "StubHub Resale Tiers": "StubHub",
  "Viator Tour Bookings": "Viator",
  "ArXiv Repository": "ArXiv",
  "GitHub Docs": "GitHub Docs",
  "Notion Public Docs": "Notion Public",
  "Substack Feeds": "Substack",
  "ReadTheDocs Portals": "ReadTheDocs",
  "GitBook Spaces": "GitBook",
  "Confluence Wikis": "Confluence",
  "Medium Publications": "Medium",
  "StackOverflow Q&A": "StackOverflow",
  "Whitepaper Archives": "Whitepapers",
  "E-Commerce Portals": "E-Commerce",
  "SaaS Web Applications": "SaaS Applications",
  "Fintech Service Portals": "Fintech Portals",
  "Healthcare Platforms": "Healthcare Platforms",
  "News & Media Outlets": "News & Media",
  "Education Portals": "Education Portals",
  "Public Sector Domains": "Public Sector Domains",
  "Real Estate Platforms": "Real Estate Platforms",
  "Travel Booking Portals": "Travel Portals",
  "High-Traffic Web Apps": "High-Traffic Web Apps",
  "Contrataci\xF3n del Estado Spain": "Contrataci\xF3n Estado Spain",
  "Canada Buys Tender Feed": "Canada Buys",
  "ChileCompra Public Tenders": "ChileCompra",
  "Australia AusTender": "AusTender Australia"
};
function formatMicroAppName(tgtName, subsector, intName) {
  const cleanTgt = TARGET_CLEAN_MAP[tgtName.trim()] || tgtName.trim();
  const cleanSub = SUBSECTOR_CLEAN_MAP[subsector] || subsector;
  const raw = `${cleanTgt} ${cleanSub} ${intName}`;
  const words = raw.split(/\s+/);
  const resultWords = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev2 = resultWords.length > 0 ? resultWords[resultWords.length - 1] : "";
    if (prev2.toLowerCase() === w.toLowerCase()) {
      continue;
    }
    resultWords.push(w);
  }
  let finalName = resultWords.join(" ");
  finalName = finalName.replace(/\b(\w+)\s+\1\b/gi, "$1").trim();
  if (finalName.length > 115) {
    finalName = finalName.slice(0, 115).trim();
  }
  return finalName;
}
function generateAllCompactDescriptors() {
  const list = [];
  let skuIndex = 1;
  for (let cIdx = 0; cIdx < MACRO_CLUSTERS_DATA.length; cIdx++) {
    const cluster = MACRO_CLUSTERS_DATA[cIdx];
    for (let sIdx = 0; sIdx < cluster.subsectors.length; sIdx++) {
      const batchNum = cIdx * 10 + sIdx + 1;
      const subsector = cluster.subsectors[sIdx];
      for (let intIdx = 0; intIdx < cluster.intentions.length; intIdx++) {
        const [intName, intSlug, intEngine] = cluster.intentions[intIdx];
        for (let tgtIdx = 0; tgtIdx < cluster.targets.length; tgtIdx++) {
          const [tgtName, tgtDomain, tgtRegion] = cluster.targets[tgtIdx];
          const i = skuIndex++;
          const ppeRatio = (tgtIdx * 7 + intIdx * 11 + sIdx * 13) % 100 / 100;
          const dpRatio = (tgtIdx * 11 + intIdx * 7 + sIdx * 17) % 100 / 100;
          const ppe = Number((cluster.ppeRange[0] + ppeRatio * (cluster.ppeRange[1] - cluster.ppeRange[0])).toFixed(2));
          const dp = Number((cluster.dpRange[0] + dpRatio * (cluster.dpRange[1] - cluster.dpRange[0])).toFixed(2));
          const skuPadded = String(i).padStart(5, "0");
          const name = formatMicroAppName(tgtName, subsector, intName);
          const permalink = `ecc-prod-${skuPadded}-${tgtRegion}-${intSlug}`.toLowerCase();
          const uvp = `Extracci\xF3n local automatizada de ${intName.toLowerCase()} para ${tgtName} en ${subsector} sin cuotas ni browser headless.`;
          const tags = [
            cluster.category,
            intEngine.toLowerCase(),
            tgtRegion,
            "automation",
            "data-extraction"
          ];
          list.push({
            i,
            b: batchNum,
            n: name,
            p: permalink,
            e: intEngine,
            ppe,
            dp,
            c: cluster.category,
            dt: cluster.deliverableType,
            t: tgtDomain,
            u: uvp,
            tg: tags
          });
        }
      }
    }
  }
  return list;
}
var COMPACT_CATALOG_10000 = generateAllCompactDescriptors();
function getTargetAudienceForCluster(batchNumber) {
  const clusterIndex = Math.ceil(batchNumber / 10);
  switch (clusterIndex) {
    case 1:
      return "E-commerce retailers, Amazon/Walmart arbitrageurs, pricing intelligence teams";
    case 2:
      return "Shopify/WooCommerce brand owners, D2C marketers, dropshipping aggregators";
    case 3:
      return "B2B SDRs, sales operations, recruiters, technographic intelligence analysts";
    case 4:
      return "Real estate investors, property managers, cap-rate analysts, proptech founders";
    case 5:
      return "Financial analysts, equity research associates, compliance officers, forensic accountants";
    case 6:
      return "Hospitality revenue managers, event organizers, travel deal aggregators";
    case 7:
      return "AI engineers, LLM app developers, RAG pipeline architects, knowledge managers";
    case 8:
      return "Technical SEO consultants, web performance engineers, privacy compliance leads";
    case 9:
      return "Local business consultants, directory aggregators, lead brokers, market researchers";
    case 10:
      return "GovTech consultants, bid writers, grant proposal teams, public procurement specialists";
    default:
      return "Business automation and data engineering specialists";
  }
}
function generateStandardDescription(d, sku) {
  return `# \u26A1 ${d.n}

Extractor local desatendido optimizado para ${d.t}. Sin cuotas mensuales ni dependencia de browser headless.

### \u{1F680} Caracter\xEDsticas Principales:
- **Motor:** ${d.e} (ejecuci\xF3n directa en Node.js nativo sin browser headless)
- **Target:** ${d.t}
- **UVP:** ${d.u}
- **Entregable:** ${d.dt} aut\xF3nomo

### \u{1F381} Contenido del Paquete:
1. Bundle completo listo para ejecuci\xF3n (` + sku + `.zip).
2. Gu\xEDa de Inicio R\xE1pido (QUICKSTART.md).
3. Licencia comercial de uso ilimitado local.`;
}
function expandMicroApp(d) {
  const sku = `ECC-PROD-${String(d.i).padStart(5, "0")}`;
  const priceCents = Math.round(d.dp * 100);
  return {
    id: String(d.i).padStart(5, "0"),
    sku,
    batch: d.b,
    name: d.n.length > 120 ? d.n.slice(0, 120).trim() : d.n,
    price: d.dp,
    priceCents,
    currency: "usd",
    permalink: d.p,
    category: d.c,
    summary: `${d.n}. Extractor local desatendido con motor ${d.e} de ejecuci\xF3n directa en Node.js.`.slice(0, 250),
    description: generateStandardDescription(d, sku),
    tags: d.tg,
    deliverableType: d.dt,
    targetAudience: getTargetAudienceForCluster(d.b),
    uvp: d.u,
    deliverableConfig: {
      sourceDir: "packages/core",
      bundleZipName: `${sku}.zip`,
      entryPoint: "dist/runner.js",
      instructionsFile: "QUICKSTART.md",
      sheetsCopyUrl: d.dt === "sheets_template" ? `https://docs.google.com/spreadsheets/d/placeholder-${sku}/copy` : void 0
    },
    gumroadConfig: {
      taxonomyId: 266,
      refundPeriod: "none",
      refundFinePrint: "Software digital de ejecuci\xF3n local con entrega inmediata de c\xF3digo fuente.",
      requireShipping: false,
      payWhatYouWant: false,
      draft: false
    }
  };
}
function getProduct10000BySku(sku) {
  const match = sku.match(/^ECC-PROD-(\d{5})$/);
  if (!match)
    return void 0;
  const index2 = parseInt(match[1], 10);
  if (index2 < 1 || index2 > COMPACT_CATALOG_10000.length)
    return void 0;
  return expandMicroApp(COMPACT_CATALOG_10000[index2 - 1]);
}

// ../../packages/core/dist/runner/universal-runner.js
function getSkuIndices(sku) {
  const match = sku.match(/^ECC-PROD-(\d{5})$/);
  if (!match)
    return { cIdx: 0, sIdx: 0, intIdx: 0, tgtIdx: 0 };
  const index2 = parseInt(match[1], 10);
  const cIdx = Math.floor((index2 - 1) / 1e3);
  const sIdx = Math.floor((index2 - 1) % 1e3 / 100);
  const intIdx = Math.floor((index2 - 1) % 100 / 10);
  const tgtIdx = (index2 - 1) % 10;
  return { cIdx, sIdx, intIdx, tgtIdx };
}
function resolveEngineForSku(sku) {
  const { cIdx } = getSkuIndices(sku);
  const clusterEngines = [
    "M1",
    // C01: Retail E-Commerce
    "M1",
    // C02: D2C Storefronts
    "M4",
    // C03: B2B Leads
    "M2",
    // C04: Real Estate
    "M3",
    // C05: Corporate Filings
    "M2",
    // C06: Travel & Hospitality
    "M3",
    // C07: AI Agent Context
    "M5",
    // C08: Technical SEO
    "M4",
    // C09: Local Verticals
    "M3"
    // C10: Public Tenders
  ];
  return clusterEngines[cIdx] || "M1";
}
async function runUniversal(targetUrl, configInput = "./config.json") {
  const config = typeof configInput === "string" ? JSON.parse(import_node_fs2.default.readFileSync(import_node_path.default.resolve(configInput), "utf8")) : configInput;
  if (config.sku && config.sku.startsWith("ECC-PROD-")) {
    try {
      const product = getProduct10000BySku(config.sku);
      if (product && (!config.name || config.name === "Universal Runner CLI")) {
        config.name = product.name;
      }
    } catch {
    }
    if (!config.engine || config.engine === "M1") {
      config.engine = resolveEngineForSku(config.sku);
    }
  }
  if (!config.silent) {
    console.log(`[Imperial Runner] Ejecutando SKU ${config.sku} - ${config.name} (${config.engine})`);
  }
  let localHtml = config.defaultOptions?.html;
  if (!localHtml) {
    let potentialFile = targetUrl;
    if (potentialFile.startsWith("file://")) {
      potentialFile = potentialFile.slice(7);
    }
    try {
      const resolvedPath = import_node_path.default.resolve(potentialFile);
      if (import_node_fs2.default.existsSync(resolvedPath) && import_node_fs2.default.statSync(resolvedPath).isFile()) {
        localHtml = import_node_fs2.default.readFileSync(resolvedPath, "utf8");
      }
    } catch {
    }
  }
  const engineOptions = {
    url: targetUrl,
    ...config.defaultOptions,
    ...localHtml ? { html: localHtml } : {}
  };
  const { intIdx } = getSkuIndices(config.sku);
  let res;
  switch (config.engine) {
    case "M1": {
      const engine = new EcommerceJsonLdEngine();
      res = await engine.extract(targetUrl, engineOptions);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const p = res.data[0];
        switch (intIdx) {
          case 0:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, url: p.url }];
            break;
          case 1:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, availability: p.availability, url: p.url }];
            break;
          case 2:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, price: p.price, currency: p.currency, availability: p.availability, url: p.url }];
            break;
          case 3: {
            const discount = p.originalPrice && p.price ? Math.round((p.originalPrice - p.price) / p.originalPrice * 100) : 0;
            res.data = [{ id: p.id, sku: p.sku, name: p.name, price: p.price, originalPrice: p.originalPrice, discountPercent: discount, currency: p.currency }];
            break;
          }
          case 4:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, rating: p.rating || { value: 0, count: 0 } }];
            break;
          case 5:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, reviewCount: p.rating?.count || 0 }];
            break;
          case 6:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, brand: p.brand }];
            break;
          case 7:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, images: p.images }];
            break;
          case 8:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, variants: p.variants || [] }];
            break;
          case 9:
            res.data = [{ id: p.id, sku: p.sku, name: p.name, description: p.description, url: p.url }];
            break;
        }
      }
      break;
    }
    case "M2": {
      const engine = new SSRHydrationEngine();
      res = await engine.extract(targetUrl, engineOptions);
      break;
    }
    case "M3": {
      const engine = new AIMarkdownEngine();
      const m3Options = {
        ...engineOptions,
        includeFrontmatter: intIdx === 9,
        cleanBoilerplate: intIdx !== 0,
        preserveLinks: intIdx === 7,
        chunking: intIdx === 4 ? { enabled: true, maxChunkSize: 1e3, chunkOverlap: 100 } : void 0,
        targetSectionPattern: engineOptions?.targetSectionPattern || (intIdx === 5 ? /Management.*Discussion|MD&A|Risk.*Factors|Financial.*Statements/i : void 0)
      };
      res = await engine.extract(targetUrl, m3Options);
      if (res.success && res.data) {
        const d = res.data;
        switch (intIdx) {
          case 0:
            res.data = { title: d.title, markdown: d.markdown, charCount: d.charCount };
            break;
          case 1: {
            const tableLines = d.markdown.split("\n").filter((l) => l.startsWith("|"));
            res.data = { tablesMarkdown: tableLines.join("\n") };
            break;
          }
          case 2:
            res.data = { headings: d.headings };
            break;
          case 3:
            res.data = { title: d.title, wordCount: d.wordCount, tokenEstimate: d.tokenEstimate, charCount: d.charCount, metadata: d.metadata };
            break;
          case 4:
            res.data = { chunks: d.chunks || [], tokenEstimate: d.tokenEstimate };
            break;
          case 5:
            res.data = d.selectedSection || { title: "Regulatory Section", content: d.markdown.slice(0, 500) };
            break;
          case 6:
            res.data = { cleanMarkdown: d.markdown, charCount: d.charCount };
            break;
          case 7: {
            const linkMatches = d.markdown.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
            res.data = { links: linkMatches, count: linkMatches.length };
            break;
          }
          case 8: {
            const tableLines = d.markdown.split("\n").filter((l) => l.startsWith("|"));
            res.data = { scheduleTables: tableLines.join("\n") };
            break;
          }
          case 9:
            res.data = { frontmatter: d.markdown.startsWith("---") ? d.markdown.split("---")[1].trim() : "", fullDocument: d.markdown };
            break;
        }
      }
      break;
    }
    case "M4": {
      const engine = new B2BEnricherEngine();
      res = await engine.extract(targetUrl, engineOptions);
      break;
    }
    case "M5": {
      const engine = new TechnicalAuditorEngine();
      res = await engine.extract(targetUrl, engineOptions);
      break;
    }
    default:
      throw new Error(`Motor desconocido: ${config.engine}`);
  }
  return {
    sku: config.sku,
    name: config.name,
    engine: config.engine,
    target: targetUrl,
    success: res.success,
    status: res.success ? "success" : "error",
    extractedAt: (/* @__PURE__ */ new Date()).toISOString(),
    durationMs: res.durationMs,
    itemsCount: Array.isArray(res.data) ? res.data.length : res.data ? 1 : 0,
    data: res.data,
    error: res.error ? res.error.message : void 0
  };
}
if (process.argv[1] && (process.argv[1].endsWith("universal-runner.js") || process.argv[1].endsWith("universal-runner.ts") || process.argv[1].endsWith("runner.js"))) {
  const args = process.argv.slice(2);
  let target = "";
  let engine = "M1";
  let sku = "ECC-PROD-UNIVERSAL";
  let htmlFilePath = "";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--target" && args[i + 1])
      target = args[i + 1];
    if (args[i] === "--engine" && args[i + 1])
      engine = args[i + 1];
    if (args[i] === "--sku" && args[i + 1])
      sku = args[i + 1];
    if (args[i] === "--html" && args[i + 1])
      htmlFilePath = args[i + 1];
  }
  if (!args.includes("--engine") && sku !== "ECC-PROD-UNIVERSAL") {
    engine = resolveEngineForSku(sku);
  }
  if (!target) {
    console.log(`[Universal Runner CLI] Uso: node universal-runner.js --target <url|file> [--engine M1..M5] [--sku <sku>] [--html <file>]`);
    process.exit(0);
  }
  let appConfig = { sku, name: "Universal Runner CLI", engine };
  if (htmlFilePath && import_node_fs2.default.existsSync(import_node_path.default.resolve(htmlFilePath))) {
    appConfig.defaultOptions = { ...appConfig.defaultOptions, html: import_node_fs2.default.readFileSync(import_node_path.default.resolve(htmlFilePath), "utf8") };
  }
  const localConfigPath = import_node_path.default.resolve("./config.json");
  if (import_node_fs2.default.existsSync(localConfigPath)) {
    try {
      const rawConfig = JSON.parse(import_node_fs2.default.readFileSync(localConfigPath, "utf8"));
      appConfig = { ...appConfig, ...rawConfig };
      if (args.includes("--engine"))
        appConfig.engine = engine;
      if (args.includes("--sku"))
        appConfig.sku = sku;
    } catch {
    }
  }
  runUniversal(target, appConfig).then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.success ? 0 : 1);
  }).catch((err) => {
    console.error("Error de ejecuci\xF3n:", err);
    process.exit(1);
  });
}

// ../../packages/core/dist/commercial/product-catalog.schema.js
var PRODUCT_CATALOG_ITEM_JSON_SCHEMA = {
  type: "object",
  required: [
    "id",
    "sku",
    "batch",
    "name",
    "price",
    "priceCents",
    "currency",
    "permalink",
    "category",
    "summary",
    "description",
    "tags",
    "deliverableType",
    "targetAudience",
    "uvp",
    "deliverableConfig",
    "gumroadConfig"
  ],
  properties: {
    id: { type: "string", pattern: "^\\d{3,5}$" },
    sku: { type: "string", pattern: "^ECC-PROD-\\d{3,5}$" },
    batch: { type: "integer", minimum: 1, maximum: 100 },
    name: { type: "string", minLength: 5, maxLength: 120 },
    price: { type: "number", minimum: 7.99, maximum: 29 },
    priceCents: { type: "integer", minimum: 799, maximum: 2900 },
    currency: { type: "string", enum: ["usd", "eur"] },
    permalink: { type: "string", pattern: "^[a-z0-9-]+$" },
    category: {
      type: "string",
      enum: [
        "ecommerce",
        "b2b_leads",
        "real_estate",
        "ai_developer_tools",
        "seo_compliance",
        "finance_osint",
        "other"
      ]
    },
    summary: { type: "string", minLength: 10, maxLength: 255 },
    description: { type: "string", minLength: 50 },
    tags: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 10
    },
    deliverableType: {
      type: "string",
      enum: [
        "sheets_template",
        "standalone_cli",
        "chrome_extension_script",
        "dataset_extractor",
        "mcp_bundle"
      ]
    },
    targetAudience: { type: "string", minLength: 5 },
    uvp: { type: "string", minLength: 10 },
    deliverableConfig: {
      type: "object",
      required: ["sourceDir", "bundleZipName"],
      properties: {
        sourceDir: { type: "string" },
        bundleZipName: { type: "string" },
        sheetsCopyUrl: { type: "string" },
        entryPoint: { type: "string" },
        instructionsFile: { type: "string" }
      }
    },
    gumroadConfig: {
      type: "object",
      required: ["taxonomyId", "refundPeriod", "requireShipping", "payWhatYouWant", "draft"],
      properties: {
        taxonomyId: { type: "integer" },
        refundPeriod: { type: "string", enum: ["none", "7", "14", "30"] },
        refundFinePrint: { type: "string" },
        requireShipping: { type: "boolean" },
        payWhatYouWant: { type: "boolean" },
        draft: { type: "boolean" }
      }
    }
  }
};
var validateProductCatalogItem = createSchemaValidator(PRODUCT_CATALOG_ITEM_JSON_SCHEMA);

// ../../packages/core/dist/commercial/catalog-data.js
var MASTER_CATALOG = [
  {
    "id": "001",
    "sku": "ECC-PROD-001",
    "batch": 1,
    "name": "Universal E-commerce Product & Price Extractor (Schema.org)",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "sheets-scraper",
    "category": "ecommerce",
    "summary": "Extract and automate Universal E-commerce Product & Price Extractor (Schema.org) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Universal E-commerce Product & Price Extractor (Schema.org)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Parses application/ld+json (Product/Offer) and OpenGraph fallback across any online store.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-001.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "universal",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant Universal E-commerce Product & Price Extractor (Schema.org) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/001-universal-ecommerce-product-extractor",
      "bundleZipName": "ECC-PROD-001.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-001/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "002",
    "sku": "ECC-PROD-002",
    "batch": 1,
    "name": "Shopify Public Catalog and Variant Exporter",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "shopify-catalog-scraper",
    "category": "ecommerce",
    "summary": "Export publicly available Shopify product variants and collections with a standalone Node.js command-line tool.",
    "description": "# Shopify Catalog Exporter\n\nExport publicly available Shopify catalog data without a headless browser.\n\n- **Mechanism:** Requests the public /products.json and /collections.json endpoints, with pagination.\n- **Format:** Standalone Node.js 18+ CLI with JSON and CSV export; no npm dependencies. CSV contains product and variant rows; JSON also includes collections.\n- **Availability:** Stores may restrict their endpoints or omit inventory values; private inventory cannot be retrieved.\n\n### Included\n1. Standalone CLI (`ECC-PROD-002.zip`).\n2. Quick Start guide and offline sample.\n3. Commercial-use license notice.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "shopify",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Export accessible Shopify products and variants to JSON or CSV without npm dependencies.",
    "deliverableConfig": {
      "sourceDir": "commercial-products/ECC-PROD-002",
      "bundleZipName": "ECC-PROD-002.zip",
      "entryPoint": "shopify-catalog.cjs",
      "instructionsFile": "QUICKSTART.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "003",
    "sku": "ECC-PROD-003",
    "batch": 1,
    "name": "Tiendanube / Nuvemshop Store Catalog & Price Monitor",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "tiendanube-nuvemshop-catalog-monitor",
    "category": "ecommerce",
    "summary": "Extract and automate Tiendanube / Nuvemshop Store Catalog & Price Monitor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Tiendanube / Nuvemshop Store Catalog & Price Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Crawls store /sitemap.xml and extracts standardized LS.product state and Schema.org JSON-LD.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-003.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "tiendanube",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant Tiendanube / Nuvemshop Store Catalog & Price Monitor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/003-tiendanube-nuvemshop-catalog-monitor",
      "bundleZipName": "ECC-PROD-003.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "004",
    "sku": "ECC-PROD-004",
    "batch": 1,
    "name": "Mercado Libre Product, Seller & Price Intelligence (LatAm)",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "mercadolibre-product-seller-intelligence",
    "category": "ecommerce",
    "summary": "Extract and automate Mercado Libre Product, Seller & Price Intelligence (LatAm) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Mercado Libre Product, Seller & Price Intelligence (LatAm)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts SSR __PRELOADED_STATE__ and JSON-LD product entities across AR, MX, BR, CL, CO, UY.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-004.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "mercadolibre",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant Mercado Libre Product, Seller & Price Intelligence (LatAm) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/004-mercadolibre-product-seller-intelligence",
      "bundleZipName": "ECC-PROD-004.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "005",
    "sku": "ECC-PROD-005",
    "batch": 1,
    "name": "WooCommerce Public Store API & Product Catalog Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "woocommerce-store-api-extractor",
    "category": "ecommerce",
    "summary": "Extract and automate WooCommerce Public Store API & Product Catalog Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 WooCommerce Public Store API & Product Catalog Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries native public REST API /wp-json/wc/store/v1/products enabled by default on WooCommerce.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-005.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "woocommerce",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant WooCommerce Public Store API & Product Catalog Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/005-woocommerce-store-api-extractor",
      "bundleZipName": "ECC-PROD-005.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-005/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "006",
    "sku": "ECC-PROD-006",
    "batch": 1,
    "name": "VTEX E-commerce Catalog & Regional Price Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "vtex-ecommerce-catalog-price-scraper",
    "category": "ecommerce",
    "summary": "Extract and automate VTEX E-commerce Catalog & Regional Price Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 VTEX E-commerce Catalog & Regional Price Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes VTEX public catalog search API (/api/catalog_system/pub/products/search).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-006.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "vtex",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant VTEX E-commerce Catalog & Regional Price Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/006-vtex-ecommerce-catalog-price-scraper",
      "bundleZipName": "ECC-PROD-006.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "007",
    "sku": "ECC-PROD-007",
    "batch": 1,
    "name": "Magento / Adobe Commerce GraphQL Product Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "magento-graphql-product-extractor",
    "category": "ecommerce",
    "summary": "Extract and automate Magento / Adobe Commerce GraphQL Product Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Magento / Adobe Commerce GraphQL Product Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Executes lightweight HTTP queries against native /graphql endpoints and XML sitemaps on Magento 2 stores.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-007.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "magento",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant Magento / Adobe Commerce GraphQL Product Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/007-magento-graphql-product-extractor",
      "bundleZipName": "ECC-PROD-007.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "008",
    "sku": "ECC-PROD-008",
    "batch": 1,
    "name": "BigCommerce Storefront Catalog & SKU Monitor",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "bigcommerce-storefront-sku-monitor",
    "category": "ecommerce",
    "summary": "Extract and automate BigCommerce Storefront Catalog & SKU Monitor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 BigCommerce Storefront Catalog & SKU Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts product catalogs via XML sitemaps, BCData state objects, and Schema.org.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-008.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "bigcommerce",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant BigCommerce Storefront Catalog & SKU Monitor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/008-bigcommerce-storefront-sku-monitor",
      "bundleZipName": "ECC-PROD-008.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "009",
    "sku": "ECC-PROD-009",
    "batch": 1,
    "name": "PrestaShop Product & Stock Feed Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "prestashop-product-stock-extractor",
    "category": "ecommerce",
    "summary": "Extract and automate PrestaShop Product & Stock Feed Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 PrestaShop Product & Stock Feed Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Parses HTML5 microdata (itemprop) and standard JSON-LD across PrestaShop storefronts.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-009.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "prestashop",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant PrestaShop Product & Stock Feed Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/009-prestashop-product-stock-extractor",
      "bundleZipName": "ECC-PROD-009.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-009/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "010",
    "sku": "ECC-PROD-010",
    "batch": 1,
    "name": "Wix Stores Catalog & Pricing Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "wix-stores-catalog-pricing-extractor",
    "category": "ecommerce",
    "summary": "Extract and automate Wix Stores Catalog & Pricing Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Wix Stores Catalog & Pricing Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts embedded JSON inside #wix-warmup-data from Wix eCommerce storefronts.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-010.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "wix",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "E-commerce store owners, Amazon/Shopify sellers, drop shippers",
    "uvp": "Instant Wix Stores Catalog & Pricing Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/010-wix-stores-catalog-pricing-extractor",
      "bundleZipName": "ECC-PROD-010.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-010/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "011",
    "sku": "ECC-PROD-011",
    "batch": 2,
    "name": "Squarespace Commerce Product JSON Scraper",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "squarespace-commerce-json-scraper",
    "category": "ecommerce",
    "summary": "Extract and automate Squarespace Commerce Product JSON Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Squarespace Commerce Product JSON Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Uses native ?format=json-pretty query parameter supported across all Squarespace Commerce URLs.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-011.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "squarespace",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Squarespace Commerce Product JSON Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/011-squarespace-commerce-json-scraper",
      "bundleZipName": "ECC-PROD-011.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "012",
    "sku": "ECC-PROD-012",
    "batch": 2,
    "name": "Mercado Libre Official Stores & Brand Catalog Auditor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "mercadolibre-official-stores-auditor",
    "category": "ecommerce",
    "summary": "Extract and automate Mercado Libre Official Stores & Brand Catalog Auditor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Mercado Libre Official Stores & Brand Catalog Auditor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Filters and audits official brand stores (tienda.mercadolibre) for authorized distributor compliance.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-012.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "mercadolibre",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Mercado Libre Official Stores & Brand Catalog Auditor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/012-mercadolibre-official-stores-auditor",
      "bundleZipName": "ECC-PROD-012.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "013",
    "sku": "ECC-PROD-013",
    "batch": 2,
    "name": "Store Stock Availability & Back-in-Stock Alert Monitor for Shopify & VTEX",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "store-stock-availability-monitor",
    "category": "ecommerce",
    "summary": "Extract and automate Store Stock Availability & Back-in-Stock Alert Monitor for Shopify & VTEX with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Store Stock Availability & Back-in-Stock Alert Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** High-speed verification of Schema.org availability (InStock vs OutOfStock) across 10k+ product URLs.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-013.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "ecommerce",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Store Stock Availability & Back-in-Stock Alert Monitor for Shopify & VTEX without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/013-ecommerce-stock-availability-monitor",
      "bundleZipName": "ECC-PROD-013.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "014",
    "sku": "ECC-PROD-014",
    "batch": 2,
    "name": "Google Merchant Center & Shopping XML Feed Parser",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "google-merchant-shopping-xml-parser",
    "category": "ecommerce",
    "summary": "Extract and automate Google Merchant Center & Shopping XML Feed Parser with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Google Merchant Center & Shopping XML Feed Parser\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Downloads, validates, and converts public Google Shopping XML/RSS feeds into clean JSON datasets.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-014.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "google",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Google Merchant Center & Shopping XML Feed Parser without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/014-google-merchant-shopping-xml-parser",
      "bundleZipName": "ECC-PROD-014.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "015",
    "sku": "ECC-PROD-015",
    "batch": 2,
    "name": "Multi-Store SKU Price Comparison & MAP Violation Tracker",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "multi-store-sku-map-violation-tracker",
    "category": "ecommerce",
    "summary": "Extract and automate Multi-Store SKU Price Comparison & MAP Violation Tracker with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Multi-Store SKU Price Comparison & MAP Violation Tracker\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Cross-references EAN/UPC/SKU codes against multiple store URLs to detect Minimum Advertised Price violations.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-015.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "multi",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Multi-Store SKU Price Comparison & MAP Violation Tracker without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/015-multi-store-sku-map-violation-tracker",
      "bundleZipName": "ECC-PROD-015.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "016",
    "sku": "ECC-PROD-016",
    "batch": 2,
    "name": "Trustpilot Public Business Reviews & Rating Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "trustpilot-business-reviews-extractor",
    "category": "ecommerce",
    "summary": "Extract and automate Trustpilot Public Business Reviews & Rating Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Trustpilot Public Business Reviews & Rating Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts reviews, star ratings, and company responses from __NEXT_DATA__ state on public profiles.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-016.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "trustpilot",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Trustpilot Public Business Reviews & Rating Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/016-trustpilot-business-reviews-extractor",
      "bundleZipName": "ECC-PROD-016.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "017",
    "sku": "ECC-PROD-017",
    "batch": 2,
    "name": "Judge.me & Loox Shopify Product Reviews Extractor",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "judgeme-loox-shopify-reviews-extractor",
    "category": "ecommerce",
    "summary": "Extract and automate Judge.me & Loox Shopify Product Reviews Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Judge.me & Loox Shopify Product Reviews Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes public review widget endpoints installed on Shopify stores for product sentiment analysis.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-017.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "judgeme",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Judge.me & Loox Shopify Product Reviews Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/017-judgeme-loox-shopify-reviews-extractor",
      "bundleZipName": "ECC-PROD-017.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "018",
    "sku": "ECC-PROD-018",
    "batch": 2,
    "name": "AppSumo & SaaS Marketplace Deal Tracker",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "appsumo-saas-marketplace-deal-tracker",
    "category": "ecommerce",
    "summary": "Extract and automate AppSumo & SaaS Marketplace Deal Tracker with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 AppSumo & SaaS Marketplace Deal Tracker\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts software launches, lifetime deal pricing, review counts, and license tiers.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-018.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "appsumo",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant AppSumo & SaaS Marketplace Deal Tracker without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/018-appsumo-saas-marketplace-deal-tracker",
      "bundleZipName": "ECC-PROD-018.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "019",
    "sku": "ECC-PROD-019",
    "batch": 2,
    "name": "Supermarket & Grocery Daily Price Inflation Tracker (LatAm/ES)",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "supermarket-grocery-inflation-tracker",
    "category": "ecommerce",
    "summary": "Extract and automate Supermarket & Grocery Daily Price Inflation Tracker (LatAm/ES) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Supermarket & Grocery Daily Price Inflation Tracker (LatAm/ES)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts daily grocery prices across major supermarket chains using VTEX APIs and JSON-LD.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-019.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "supermarket",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Supermarket & Grocery Daily Price Inflation Tracker (LatAm/ES) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/019-supermarket-grocery-inflation-tracker",
      "bundleZipName": "ECC-PROD-019.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "020",
    "sku": "ECC-PROD-020",
    "batch": 2,
    "name": "Pharmacy & Beauty Retail Price Monitor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "pharmacy-beauty-retail-price-monitor",
    "category": "ecommerce",
    "summary": "Extract and automate Pharmacy & Beauty Retail Price Monitor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Pharmacy & Beauty Retail Price Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts catalog pricing and promotions across pharmacy and cosmetics retail chains.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-020.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ecommerce",
      "data-extraction",
      "automation",
      "pharmacy",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Pricing analysts, retail arbitragers, market researchers",
    "uvp": "Instant Pharmacy & Beauty Retail Price Monitor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/020-pharmacy-beauty-retail-price-monitor",
      "bundleZipName": "ECC-PROD-020.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "021",
    "sku": "ECC-PROD-021",
    "batch": 3,
    "name": "B2B Website Contact, Email, WhatsApp & Social Enricher",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "b2b-website-contact-whatsapp-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate B2B Website Contact, Email, WhatsApp & Social Enricher with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 B2B Website Contact, Email, WhatsApp & Social Enricher\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Crawls home, /contact, and /about pages to extract verified emails, wa.me links, phones, and social profiles.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-021.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "b2b",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant B2B Website Contact, Email, WhatsApp & Social Enricher without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/021-b2b-website-contact-whatsapp-enricher",
      "bundleZipName": "ECC-PROD-021.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-021/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "022",
    "sku": "ECC-PROD-022",
    "batch": 3,
    "name": "Website Tech Stack, Pixel & E-commerce Platform Detector",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "website-tech-stack-pixel-detector",
    "category": "b2b_leads",
    "summary": "Extract and automate Website Tech Stack, Pixel & E-commerce Platform Detector with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Website Tech Stack, Pixel & E-commerce Platform Detector\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Analyzes HTTP headers, cookies, and script signatures (Meta Pixel, GTM, GA4, Stripe, HubSpot, Shopify).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-022.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "website",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant Website Tech Stack, Pixel & E-commerce Platform Detector without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/022-website-tech-stack-pixel-detector",
      "bundleZipName": "ECC-PROD-022.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "023",
    "sku": "ECC-PROD-023",
    "batch": 3,
    "name": "B2B Company Careers Page & Active Hiring Signal Detector",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "b2b-company-careers-hiring-detector",
    "category": "b2b_leads",
    "summary": "Extract and automate B2B Company Careers Page & Active Hiring Signal Detector with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 B2B Company Careers Page & Active Hiring Signal Detector\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Detects /careers and /jobs links and counts open positions as an active B2B buying signal.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-023.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "b2b",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant B2B Company Careers Page & Active Hiring Signal Detector without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/023-b2b-company-careers-hiring-detector",
      "bundleZipName": "ECC-PROD-023.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "024",
    "sku": "ECC-PROD-024",
    "batch": 3,
    "name": "Greenhouse & Lever ATS Public Job Board Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "greenhouse-lever-ats-job-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Greenhouse & Lever ATS Public Job Board Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Greenhouse & Lever ATS Public Job Board Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes public JSON APIs (boards-api.greenhouse.io and api.lever.co) across tech companies.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-024.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "greenhouse",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant Greenhouse & Lever ATS Public Job Board Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/024-greenhouse-lever-ats-job-scraper",
      "bundleZipName": "ECC-PROD-024.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "025",
    "sku": "ECC-PROD-025",
    "batch": 3,
    "name": "Workable & Ashby HQ Public Jobs & Company Enricher",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "workable-ashby-public-jobs-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate Workable & Ashby HQ Public Jobs & Company Enricher with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Workable & Ashby HQ Public Jobs & Company Enricher\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts job openings, departments, and locations from public Workable and Ashby endpoints.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-025.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "workable",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant Workable & Ashby HQ Public Jobs & Company Enricher without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/025-workable-ashby-public-jobs-enricher",
      "bundleZipName": "ECC-PROD-025.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "026",
    "sku": "ECC-PROD-026",
    "batch": 3,
    "name": "Email Deliverability, MX Record & Catch-All Bulk Verifier",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "email-dns-mx-dmarc-bulk-verifier",
    "category": "b2b_leads",
    "summary": "Extract and automate Email Deliverability, MX Record & Catch-All Bulk Verifier with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Email Deliverability, MX Record & Catch-All Bulk Verifier\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries DNS records (MX, SPF, DMARC) and syntax validation to clean B2B lead lists.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-026.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "email",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant Email Deliverability, MX Record & Catch-All Bulk Verifier without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/026-email-dns-mx-dmarc-bulk-verifier",
      "bundleZipName": "ECC-PROD-026.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "027",
    "sku": "ECC-PROD-027",
    "batch": 3,
    "name": "Shopify Merchant Lead Enricher (Contact, Theme & Apps)",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "shopify-merchant-b2b-lead-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate Shopify Merchant Lead Enricher (Contact, Theme & Apps) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Shopify Merchant Lead Enricher (Contact, Theme & Apps)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Enriches Shopify domains with legal company name, social links, currency, theme name, and detected apps.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-027.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "shopify",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant Shopify Merchant Lead Enricher (Contact, Theme & Apps) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/027-shopify-merchant-b2b-lead-enricher",
      "bundleZipName": "ECC-PROD-027.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-027/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "028",
    "sku": "ECC-PROD-028",
    "batch": 3,
    "name": "Clutch & B2B Agency Directory Profile Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "clutch-b2b-agency-directory-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate Clutch & B2B Agency Directory Profile Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Clutch & B2B Agency Directory Profile Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts agency profiles, hourly rates, team size, and official website URLs from B2B directories.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-028.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "clutch",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant Clutch & B2B Agency Directory Profile Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/028-clutch-b2b-agency-directory-extractor",
      "bundleZipName": "ECC-PROD-028.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "029",
    "sku": "ECC-PROD-029",
    "batch": 3,
    "name": "G2 & Capterra SaaS Category Metadata Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "g2-capterra-saas-metadata-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate G2 & Capterra SaaS Category Metadata Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 G2 & Capterra SaaS Category Metadata Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts software listings, ratings, and vendor websites from public Schema.org JSON-LD.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-029.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "g2",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant G2 & Capterra SaaS Category Metadata Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/029-g2-capterra-saas-metadata-extractor",
      "bundleZipName": "ECC-PROD-029.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "030",
    "sku": "ECC-PROD-030",
    "batch": 3,
    "name": "GitHub Organization & Developer Contributor Enricher",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "github-org-developer-lead-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate GitHub Organization & Developer Contributor Enricher with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 GitHub Organization & Developer Contributor Enricher\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries public GitHub APIs for organization repos, tech stack, websites, and public commit emails.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-030.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "github",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "B2B sales teams, SDRs, recruitment agencies, growth marketers",
    "uvp": "Instant GitHub Organization & Developer Contributor Enricher without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/030-github-org-developer-lead-enricher",
      "bundleZipName": "ECC-PROD-030.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "031",
    "sku": "ECC-PROD-031",
    "batch": 4,
    "name": "NPM & PyPI Package Maintainer & Repository Lead Finder",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "npm-pypi-package-maintainer-finder",
    "category": "b2b_leads",
    "summary": "Extract and automate NPM & PyPI Package Maintainer & Repository Lead Finder with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 NPM & PyPI Package Maintainer & Repository Lead Finder\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries registry.npmjs.org and pypi.org JSON endpoints to extract package maintainers and repos.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-031.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "npm",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant NPM & PyPI Package Maintainer & Repository Lead Finder without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/031-npm-pypi-package-maintainer-finder",
      "bundleZipName": "ECC-PROD-031.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "032",
    "sku": "ECC-PROD-032",
    "batch": 4,
    "name": "WordPress Plugin & Theme Directory Author Enricher",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "wordpress-plugin-author-lead-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate WordPress Plugin & Theme Directory Author Enricher with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 WordPress Plugin & Theme Directory Author Enricher\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes api.wordpress.org to extract active installs, support stats, and commercial author websites.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-032.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "wordpress",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant WordPress Plugin & Theme Directory Author Enricher without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/032-wordpress-plugin-author-lead-enricher",
      "bundleZipName": "ECC-PROD-032.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "033",
    "sku": "ECC-PROD-033",
    "batch": 4,
    "name": "Chrome Web Store Extension Metadata & Publisher Tracker",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "chrome-web-store-publisher-tracker",
    "category": "b2b_leads",
    "summary": "Extract and automate Chrome Web Store Extension Metadata & Publisher Tracker with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Chrome Web Store Extension Metadata & Publisher Tracker\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts active users, version, update date, rating, and support email from Chrome extensions.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-033.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "chrome",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Chrome Web Store Extension Metadata & Publisher Tracker without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/033-chrome-web-store-publisher-tracker",
      "bundleZipName": "ECC-PROD-033.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "034",
    "sku": "ECC-PROD-034",
    "batch": 4,
    "name": "Google Play Store App Developer & Contact Enricher",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "google-play-app-developer-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate Google Play Store App Developer & Contact Enricher with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Google Play Store App Developer & Contact Enricher\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts mandatory developer email, physical address, website, and install metrics from Android apps.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-034.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "google",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Google Play Store App Developer & Contact Enricher without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/034-google-play-app-developer-enricher",
      "bundleZipName": "ECC-PROD-034.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "035",
    "sku": "ECC-PROD-035",
    "batch": 4,
    "name": "Apple App Store iOS App & Publisher Metadata Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "apple-app-store-publisher-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Apple App Store iOS App & Publisher Metadata Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Apple App Store iOS App & Publisher Metadata Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries official iTunes Search API to return clean iOS developer metadata and ratings.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-035.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "apple",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Apple App Store iOS App & Publisher Metadata Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/035-apple-app-store-publisher-scraper",
      "bundleZipName": "ECC-PROD-035.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "036",
    "sku": "ECC-PROD-036",
    "batch": 4,
    "name": "Substack & Beehiiv Newsletter Directory & Author Finder",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "substack-beehiiv-newsletter-finder",
    "category": "b2b_leads",
    "summary": "Extract and automate Substack & Beehiiv Newsletter Directory & Author Finder with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Substack & Beehiiv Newsletter Directory & Author Finder\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Identifies active B2B newsletters, publishing frequency, social links, and author domains.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-036.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "substack",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Substack & Beehiiv Newsletter Directory & Author Finder without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/036-substack-beehiiv-newsletter-finder",
      "bundleZipName": "ECC-PROD-036.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "037",
    "sku": "ECC-PROD-037",
    "batch": 4,
    "name": "Podcast RSS Feed & Host Contact Email Extractor",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "podcast-rss-host-email-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate Podcast RSS Feed & Host Contact Email Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Podcast RSS Feed & Host Contact Email Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Parses public podcast RSS feeds where producer email (<itunes:email>) is embedded by standard.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-037.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "podcast",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Podcast RSS Feed & Host Contact Email Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/037-podcast-rss-host-email-extractor",
      "bundleZipName": "ECC-PROD-037.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "038",
    "sku": "ECC-PROD-038",
    "batch": 4,
    "name": "Eventbrite & Luma Public Tech Events & Organizer Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "eventbrite-luma-tech-events-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Eventbrite & Luma Public Tech Events & Organizer Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Eventbrite & Luma Public Tech Events & Organizer Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts business events, webinars, and organizer profiles from Schema.org/Event ld+json blocks.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-038.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "eventbrite",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Eventbrite & Luma Public Tech Events & Organizer Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/038-eventbrite-luma-tech-events-scraper",
      "bundleZipName": "ECC-PROD-038.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "039",
    "sku": "ECC-PROD-039",
    "batch": 4,
    "name": "B2B Privacy Policy & Legal Entity Name Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "b2b-privacy-legal-entity-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate B2B Privacy Policy & Legal Entity Name Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 B2B Privacy Policy & Legal Entity Name Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Scans /privacy and /terms pages to extract registered legal entity names (LLC, Inc., S.A., S.R.L.) and addresses.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-039.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "b2b",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant B2B Privacy Policy & Legal Entity Name Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/039-b2b-privacy-legal-entity-extractor",
      "bundleZipName": "ECC-PROD-039.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "040",
    "sku": "ECC-PROD-040",
    "batch": 4,
    "name": "Local Chamber of Commerce & Industrial Park Directory Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "chamber-of-commerce-directory-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Local Chamber of Commerce & Industrial Park Directory Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Local Chamber of Commerce & Industrial Park Directory Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts member companies, industries, and contact links from business association directories.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-040.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "chamber",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Developer tool marketers, newsletter sponsors, influencer agencies",
    "uvp": "Instant Local Chamber of Commerce & Industrial Park Directory Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/040-chamber-of-commerce-directory-scraper",
      "bundleZipName": "ECC-PROD-040.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "041",
    "sku": "ECC-PROD-041",
    "batch": 5,
    "name": "Real Estate Portal Universal Extractor (LatAm & Spain SSR)",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "real-estate-portal-universal-extractor",
    "category": "real_estate",
    "summary": "Extract and automate Real Estate Portal Universal Extractor (LatAm & Spain SSR) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Real Estate Portal Universal Extractor (LatAm & Spain SSR)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts property price, area (m2), coordinates, and agency from SSR state and RealEstateListing Schema.org.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-041.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "real",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Real Estate Portal Universal Extractor (LatAm & Spain SSR) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/041-real-estate-portal-universal-extractor",
      "bundleZipName": "ECC-PROD-041.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "042",
    "sku": "ECC-PROD-042",
    "batch": 5,
    "name": "Mercado Libre Inmuebles & Veh\xEDculos Extractor (LatAm)",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "mercadolibre-inmuebles-vehiculos-scraper",
    "category": "real_estate",
    "summary": "Extract and automate Mercado Libre Inmuebles & Veh\xEDculos Extractor (LatAm) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Mercado Libre Inmuebles & Veh\xEDculos Extractor (LatAm)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts classified real estate and automotive listings with dealership/broker metadata across LatAm.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-042.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "mercadolibre",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Mercado Libre Inmuebles & Veh\xEDculos Extractor (LatAm) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/042-mercadolibre-inmuebles-vehiculos-scraper",
      "bundleZipName": "ECC-PROD-042.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "043",
    "sku": "ECC-PROD-043",
    "batch": 5,
    "name": "Zonaprop & Inmuebles24 Property & Price per M2 Scraper",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "zonaprop-inmuebles24-price-m2-scraper",
    "category": "real_estate",
    "summary": "Extract and automate Zonaprop & Inmuebles24 Property & Price per M2 Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Zonaprop & Inmuebles24 Property & Price per M2 Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Parses initial SSR hydration state and automatically computes price per covered and total square meter.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-043.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "zonaprop",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Zonaprop & Inmuebles24 Property & Price per M2 Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/043-zonaprop-inmuebles24-price-m2-scraper",
      "bundleZipName": "ECC-PROD-043.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "044",
    "sku": "ECC-PROD-044",
    "batch": 5,
    "name": "Argenprop & Properati Real Estate Listings Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "argenprop-properati-listings-extractor",
    "category": "real_estate",
    "summary": "Extract and automate Argenprop & Properati Real Estate Listings Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Argenprop & Properati Real Estate Listings Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Direct HTTP extraction of JSON-LD and structured property attributes.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-044.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "argenprop",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Argenprop & Properati Real Estate Listings Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/044-argenprop-properati-listings-extractor",
      "bundleZipName": "ECC-PROD-044.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "045",
    "sku": "ECC-PROD-045",
    "batch": 5,
    "name": "InfoCasas (Uruguay, Paraguay, Bolivia) Real Estate Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "infocasas-real-estate-scraper",
    "category": "real_estate",
    "summary": "Extract and automate InfoCasas (Uruguay, Paraguay, Bolivia) Real Estate Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 InfoCasas (Uruguay, Paraguay, Bolivia) Real Estate Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes Next.js __NEXT_DATA__ and GraphQL state from InfoCasas portals.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-045.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "infocasas",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant InfoCasas (Uruguay, Paraguay, Bolivia) Real Estate Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/045-infocasas-real-estate-scraper",
      "bundleZipName": "ECC-PROD-045.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "046",
    "sku": "ECC-PROD-046",
    "batch": 5,
    "name": "Portal Inmobiliario & TocToc (Chile) Property Monitor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "portalinmobiliario-toctoc-chile-monitor",
    "category": "real_estate",
    "summary": "Extract and automate Portal Inmobiliario & TocToc (Chile) Property Monitor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Portal Inmobiliario & TocToc (Chile) Property Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts new developments and used properties with pricing normalized in UF and CLP.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-046.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "portalinmobiliario",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Portal Inmobiliario & TocToc (Chile) Property Monitor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/046-portalinmobiliario-toctoc-chile-monitor",
      "bundleZipName": "ECC-PROD-046.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "047",
    "sku": "ECC-PROD-047",
    "batch": 5,
    "name": "Metrocuadrado & Fincara\xEDz (Colombia) Real Estate Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "metrocuadrado-fincaraiz-colombia-extractor",
    "category": "real_estate",
    "summary": "Extract and automate Metrocuadrado & Fincara\xEDz (Colombia) Real Estate Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Metrocuadrado & Fincara\xEDz (Colombia) Real Estate Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Reads __NEXT_DATA__ JSON payloads with full technical specs, stratum, and property age.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-047.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "metrocuadrado",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Metrocuadrado & Fincara\xEDz (Colombia) Real Estate Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/047-metrocuadrado-fincaraiz-colombia-extractor",
      "bundleZipName": "ECC-PROD-047.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "048",
    "sku": "ECC-PROD-048",
    "batch": 5,
    "name": "Fotocasa & Pisos.com (Spain) Real Estate Data Scraper",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "fotocasa-pisos-spain-real-estate-scraper",
    "category": "real_estate",
    "summary": "Extract and automate Fotocasa & Pisos.com (Spain) Real Estate Data Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Fotocasa & Pisos.com (Spain) Real Estate Data Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts rental and sale property listings across Spain via pre-rendered SSR state objects.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-048.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "fotocasa",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Fotocasa & Pisos.com (Spain) Real Estate Data Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/048-fotocasa-pisos-spain-real-estate-scraper",
      "bundleZipName": "ECC-PROD-048.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "049",
    "sku": "ECC-PROD-049",
    "batch": 5,
    "name": "Real Estate Price Drop & Distressed Property Detector",
    "price": 24.99,
    "priceCents": 2499,
    "currency": "usd",
    "permalink": "real-estate-price-drop-detector",
    "category": "real_estate",
    "summary": "Extract and automate Real Estate Price Drop & Distressed Property Detector with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Real Estate Price Drop & Distressed Property Detector\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Compares current property runs against previous dataset state to flag price reductions.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-049.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "real",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Real Estate Price Drop & Distressed Property Detector without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/049-real-estate-price-drop-detector",
      "bundleZipName": "ECC-PROD-049.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-049/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "050",
    "sku": "ECC-PROD-050",
    "batch": 5,
    "name": "Real Estate Agency & Broker Contact Directory Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "real-estate-agency-broker-directory",
    "category": "real_estate",
    "summary": "Extract and automate Real Estate Agency & Broker Contact Directory Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Real Estate Agency & Broker Contact Directory Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts real estate agencies, license numbers, phone numbers, and active listing counts.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-050.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "real-estate",
      "data-extraction",
      "automation",
      "real",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Real estate investors, proptech startups, brokers, appraisal firms",
    "uvp": "Instant Real Estate Agency & Broker Contact Directory Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/050-real-estate-agency-broker-directory",
      "bundleZipName": "ECC-PROD-050.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "051",
    "sku": "ECC-PROD-051",
    "batch": 6,
    "name": "Used Car Dealership Inventory & Price Extractor (LatAm)",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "used-car-dealership-inventory-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate Used Car Dealership Inventory & Price Extractor (LatAm) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Used Car Dealership Inventory & Price Extractor (LatAm)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts make, model, year, mileage, and price from automotive portals (Autocosmos, Kavak, DeMotores).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-051.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "used",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Used Car Dealership Inventory & Price Extractor (LatAm) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/051-used-car-dealership-inventory-extractor",
      "bundleZipName": "ECC-PROD-051.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "052",
    "sku": "ECC-PROD-052",
    "batch": 6,
    "name": "Heavy Machinery, Agro & Industrial Equipment Listing Scraper",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "heavy-machinery-agro-equipment-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Heavy Machinery, Agro & Industrial Equipment Listing Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Heavy Machinery, Agro & Industrial Equipment Listing Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Targets agricultural and industrial machinery classifieds (Agrofy and regional portals).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-052.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "heavy",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Heavy Machinery, Agro & Industrial Equipment Listing Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/052-heavy-machinery-agro-equipment-scraper",
      "bundleZipName": "ECC-PROD-052.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "053",
    "sku": "ECC-PROD-053",
    "batch": 6,
    "name": "Coworking Spaces & Commercial Offices Directory Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "coworking-commercial-offices-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Coworking Spaces & Commercial Offices Directory Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Coworking Spaces & Commercial Offices Directory Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts flexible office rates, locations, and amenities for commercial real estate teams.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-053.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "coworking",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Coworking Spaces & Commercial Offices Directory Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/053-coworking-commercial-offices-scraper",
      "bundleZipName": "ECC-PROD-053.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "054",
    "sku": "ECC-PROD-054",
    "batch": 6,
    "name": "Vacation Rentals & Direct Booking Sites Rate Monitor",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "vacation-rentals-direct-booking-monitor",
    "category": "b2b_leads",
    "summary": "Extract and automate Vacation Rentals & Direct Booking Sites Rate Monitor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Vacation Rentals & Direct Booking Sites Rate Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts nightly rates and availability across standard booking engines (Lodgify, Cloudbeds).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-054.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "vacation",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Vacation Rentals & Direct Booking Sites Rate Monitor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/054-vacation-rentals-direct-booking-monitor",
      "bundleZipName": "ECC-PROD-054.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "055",
    "sku": "ECC-PROD-055",
    "batch": 6,
    "name": "Medical, Dental & Health Clinics Local Directory Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "medical-dental-clinics-directory-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate Medical, Dental & Health Clinics Local Directory Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Medical, Dental & Health Clinics Local Directory Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts healthcare directories, specialties, accepted insurance, and clinic contact details.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-055.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "medical",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Medical, Dental & Health Clinics Local Directory Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/055-medical-dental-clinics-directory-extractor",
      "bundleZipName": "ECC-PROD-055.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "056",
    "sku": "ECC-PROD-056",
    "batch": 6,
    "name": "Law Firms, Notaries & Accounting Studios Directory Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "law-firms-accounting-studios-scraper",
    "category": "b2b_leads",
    "summary": "Extract and automate Law Firms, Notaries & Accounting Studios Directory Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Law Firms, Notaries & Accounting Studios Directory Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts professional registries and directories of legal and accounting firms.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-056.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "law",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Law Firms, Notaries & Accounting Studios Directory Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/056-law-firms-accounting-studios-scraper",
      "bundleZipName": "ECC-PROD-056.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "057",
    "sku": "ECC-PROD-057",
    "batch": 6,
    "name": "Architecture, Construction & Engineering Firms Enricher",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "architecture-construction-firms-enricher",
    "category": "b2b_leads",
    "summary": "Extract and automate Architecture, Construction & Engineering Firms Enricher with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Architecture, Construction & Engineering Firms Enricher\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts construction companies and architectural studios from industry catalogs.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-057.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "architecture",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Architecture, Construction & Engineering Firms Enricher without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/057-architecture-construction-firms-enricher",
      "bundleZipName": "ECC-PROD-057.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "058",
    "sku": "ECC-PROD-058",
    "batch": 6,
    "name": "Private Schools, Universities & Training Centers Directory",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "private-schools-universities-directory",
    "category": "b2b_leads",
    "summary": "Extract and automate Private Schools, Universities & Training Centers Directory with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Private Schools, Universities & Training Centers Directory\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts academic programs, institutional contacts, and locations of educational centers.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-058.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "private",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Private Schools, Universities & Training Centers Directory without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/058-private-schools-universities-directory",
      "bundleZipName": "ECC-PROD-058.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "059",
    "sku": "ECC-PROD-059",
    "batch": 6,
    "name": "Veterinary Clinics & Pet Shops B2B Lead Extractor",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "veterinary-clinics-petshops-lead-extractor",
    "category": "b2b_leads",
    "summary": "Extract and automate Veterinary Clinics & Pet Shops B2B Lead Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Veterinary Clinics & Pet Shops B2B Lead Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts veterinary clinics and pet retail stores for B2B wholesale distributors.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-059.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "veterinary",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Veterinary Clinics & Pet Shops B2B Lead Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/059-veterinary-clinics-petshops-lead-extractor",
      "bundleZipName": "ECC-PROD-059.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "060",
    "sku": "ECC-PROD-060",
    "batch": 6,
    "name": "Hardware Stores, Ferreter\xEDas & Building Supply Directory",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "hardware-stores-ferreterias-directory",
    "category": "b2b_leads",
    "summary": "Extract and automate Hardware Stores, Ferreter\xEDas & Building Supply Directory with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Hardware Stores, Ferreter\xEDas & Building Supply Directory\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts hardware stores and industrial supply distributors for B2B manufacturers.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-060.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "b2b-leads",
      "data-extraction",
      "automation",
      "hardware",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Local lead generation agencies, trade contractors, B2B vendors",
    "uvp": "Instant Hardware Stores, Ferreter\xEDas & Building Supply Directory without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/060-hardware-stores-ferreterias-directory",
      "bundleZipName": "ECC-PROD-060.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "061",
    "sku": "ECC-PROD-061",
    "batch": 7,
    "name": "Sitemap to Clean Markdown Extractor for AI Agents & RAG",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "sitemap-to-clean-markdown-rag-extractor",
    "category": "ai_developer_tools",
    "summary": "Extract and automate Sitemap to Clean Markdown Extractor for AI Agents & RAG with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Sitemap to Clean Markdown Extractor for AI Agents & RAG\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Downloads /sitemap.xml, strips boilerplate via Readability, and outputs clean Markdown with token counts.\n- **Format:** Model Context Protocol (MCP) Server for Claude & Cursor\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-061.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "sitemap",
      "productivity"
    ],
    "deliverableType": "mcp_bundle",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant Sitemap to Clean Markdown Extractor for AI Agents & RAG without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/061-sitemap-to-clean-markdown-rag-extractor",
      "bundleZipName": "ECC-PROD-061.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "062",
    "sku": "ECC-PROD-062",
    "batch": 7,
    "name": "Competitor Pricing Page & SaaS Plan Monitor (AI-Ready)",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "competitor-pricing-page-saas-monitor",
    "category": "ai_developer_tools",
    "summary": "Extract and automate Competitor Pricing Page & SaaS Plan Monitor (AI-Ready) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Competitor Pricing Page & SaaS Plan Monitor (AI-Ready)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts pricing tiers, feature matrices, and billing intervals from /pricing URLs into structured JSON/Markdown.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-062.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "competitor",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant Competitor Pricing Page & SaaS Plan Monitor (AI-Ready) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/062-competitor-pricing-page-saas-monitor",
      "bundleZipName": "ECC-PROD-062.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "063",
    "sku": "ECC-PROD-063",
    "batch": 7,
    "name": "Documentation Sites (GitBook, Docusaurus, Mintlify) to RAG Chunks",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "docs-gitbook-docusaurus-to-rag-chunks",
    "category": "ai_developer_tools",
    "summary": "Extract and automate Documentation Sites (GitBook, Docusaurus, Mintlify) to RAG Chunks with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Documentation Sites (GitBook, Docusaurus, Mintlify) to RAG Chunks\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Detects technical documentation frameworks and outputs semantic Markdown chunks with hierarchy metadata.\n- **Format:** Model Context Protocol (MCP) Server for Claude & Cursor\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-063.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "docs",
      "productivity"
    ],
    "deliverableType": "mcp_bundle",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant Documentation Sites (GitBook, Docusaurus, Mintlify) to RAG Chunks without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/063-docs-gitbook-docusaurus-to-rag-chunks",
      "bundleZipName": "ECC-PROD-063.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "064",
    "sku": "ECC-PROD-064",
    "batch": 7,
    "name": "llms.txt & AI-Ready Website Context Generator",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "llmstxt-website-context-generator",
    "category": "ai_developer_tools",
    "summary": "Extract and automate llms.txt & AI-Ready Website Context Generator with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 llms.txt & AI-Ready Website Context Generator\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Crawls a domain and generates standardized /llms.txt and /llms-full.txt index files for AI agents.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-064.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "llmstxt",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant llms.txt & AI-Ready Website Context Generator without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/064-llmstxt-website-context-generator",
      "bundleZipName": "ECC-PROD-064.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "065",
    "sku": "ECC-PROD-065",
    "batch": 7,
    "name": "HackerNews & Lobsters Tech Discussions & Sentiment Scraper",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "hackernews-lobsters-tech-sentiment-scraper",
    "category": "ai_developer_tools",
    "summary": "Extract and automate HackerNews & Lobsters Tech Discussions & Sentiment Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 HackerNews & Lobsters Tech Discussions & Sentiment Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes official Algolia/Firebase HackerNews APIs returning nested discussion trees for LLM analysis.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-065.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "hackernews",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant HackerNews & Lobsters Tech Discussions & Sentiment Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/065-hackernews-lobsters-tech-sentiment-scraper",
      "bundleZipName": "ECC-PROD-065.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "066",
    "sku": "ECC-PROD-066",
    "batch": 7,
    "name": "Wikipedia & MediaWiki Clean Knowledge Graph Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "wikipedia-mediawiki-clean-rag-extractor",
    "category": "ai_developer_tools",
    "summary": "Extract and automate Wikipedia & MediaWiki Clean Knowledge Graph Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Wikipedia & MediaWiki Clean Knowledge Graph Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes MediaWiki action=query APIs to output clean plain text and Markdown without wiki markup.\n- **Format:** Model Context Protocol (MCP) Server for Claude & Cursor\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-066.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "wikipedia",
      "productivity"
    ],
    "deliverableType": "mcp_bundle",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant Wikipedia & MediaWiki Clean Knowledge Graph Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/066-wikipedia-mediawiki-clean-rag-extractor",
      "bundleZipName": "ECC-PROD-066.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "067",
    "sku": "ECC-PROD-067",
    "batch": 7,
    "name": "ArXiv & Semantic Scholar AI Research Paper Extractor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "arxiv-semantic-scholar-paper-extractor",
    "category": "ai_developer_tools",
    "summary": "Extract and automate ArXiv & Semantic Scholar AI Research Paper Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 ArXiv & Semantic Scholar AI Research Paper Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries open ArXiv and Semantic Scholar APIs returning abstracts, authors, citations, and PDF links.\n- **Format:** Model Context Protocol (MCP) Server for Claude & Cursor\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-067.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "arxiv",
      "productivity"
    ],
    "deliverableType": "mcp_bundle",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant ArXiv & Semantic Scholar AI Research Paper Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/067-arxiv-semantic-scholar-paper-extractor",
      "bundleZipName": "ECC-PROD-067.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "068",
    "sku": "ECC-PROD-068",
    "batch": 7,
    "name": "Discourse Forum Public Threads & Q&A Knowledge Scraper",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "discourse-forum-threads-qa-scraper",
    "category": "ai_developer_tools",
    "summary": "Extract and automate Discourse Forum Public Threads & Q&A Knowledge Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Discourse Forum Public Threads & Q&A Knowledge Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Appends .json to any Discourse forum topic or category URL to extract structured community Q&A.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-068.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "discourse",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant Discourse Forum Public Threads & Q&A Knowledge Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/068-discourse-forum-threads-qa-scraper",
      "bundleZipName": "ECC-PROD-068.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "069",
    "sku": "ECC-PROD-069",
    "batch": 7,
    "name": "StackExchange / StackOverflow Tag & Accepted Answers Scraper",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "stackexchange-accepted-answers-scraper",
    "category": "ai_developer_tools",
    "summary": "Extract and automate StackExchange / StackOverflow Tag & Accepted Answers Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 StackExchange / StackOverflow Tag & Accepted Answers Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Uses public StackExchange API to extract technical questions and accepted answers in Markdown.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-069.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "stackexchange",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant StackExchange / StackOverflow Tag & Accepted Answers Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/069-stackexchange-accepted-answers-scraper",
      "bundleZipName": "ECC-PROD-069.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "070",
    "sku": "ECC-PROD-070",
    "batch": 7,
    "name": "Dev.to, Hashnode & Medium RSS Technical Articles Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "devto-hashnode-technical-articles-extractor",
    "category": "ai_developer_tools",
    "summary": "Extract and automate Dev.to, Hashnode & Medium RSS Technical Articles Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Dev.to, Hashnode & Medium RSS Technical Articles Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes Forem REST APIs, Hashnode GraphQL, and RSS feeds for technical content curation.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-070.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "ai-developer-tools",
      "data-extraction",
      "automation",
      "devto",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "AI engineers, LLM app developers, RAG pipeline architects",
    "uvp": "Instant Dev.to, Hashnode & Medium RSS Technical Articles Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/070-devto-hashnode-technical-articles-extractor",
      "bundleZipName": "ECC-PROD-070.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "071",
    "sku": "ECC-PROD-071",
    "batch": 8,
    "name": "SaaS Changelog & Release Notes Tracker (MCP Tool)",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "saas-changelog-release-notes-tracker",
    "category": "other",
    "summary": "Extract and automate SaaS Changelog & Release Notes Tracker (MCP Tool) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 SaaS Changelog & Release Notes Tracker (MCP Tool)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Monitors /changelog and /releases pages or Atom feeds to summarize competitor product updates.\n- **Format:** Model Context Protocol (MCP) Server for Claude & Cursor\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-071.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "saas",
      "productivity"
    ],
    "deliverableType": "mcp_bundle",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant SaaS Changelog & Release Notes Tracker (MCP Tool) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/071-saas-changelog-release-notes-tracker",
      "bundleZipName": "ECC-PROD-071.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "072",
    "sku": "ECC-PROD-072",
    "batch": 8,
    "name": "HTML Tables to Clean JSON / CSV Bulk Converter",
    "price": 7.99,
    "priceCents": 799,
    "currency": "usd",
    "permalink": "html-tables-to-json-csv-converter",
    "category": "other",
    "summary": "Extract and automate HTML Tables to Clean JSON / CSV Bulk Converter with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 HTML Tables to Clean JSON / CSV Bulk Converter\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Parses any HTML <table> across target URLs into strictly typed JSON arrays with normalized headers.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-072.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "html",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant HTML Tables to Clean JSON / CSV Bulk Converter without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/072-html-tables-to-json-csv-converter",
      "bundleZipName": "ECC-PROD-072.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-072/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "073",
    "sku": "ECC-PROD-073",
    "batch": 8,
    "name": "Public PDF & Whitepaper URL to Structured Markdown Parser",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "public-pdf-whitepaper-to-markdown-parser",
    "category": "other",
    "summary": "Extract and automate Public PDF & Whitepaper URL to Structured Markdown Parser with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Public PDF & Whitepaper URL to Structured Markdown Parser\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Downloads public PDF URLs and extracts paginated text with heading hierarchy for RAG pipelines.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-073.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "public",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant Public PDF & Whitepaper URL to Structured Markdown Parser without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/073-public-pdf-whitepaper-to-markdown-parser",
      "bundleZipName": "ECC-PROD-073.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "074",
    "sku": "ECC-PROD-074",
    "batch": 8,
    "name": "OpenAPI / Swagger Specification Finder & Endpoint Parser",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "openapi-swagger-spec-endpoint-parser",
    "category": "other",
    "summary": "Extract and automate OpenAPI / Swagger Specification Finder & Endpoint Parser with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 OpenAPI / Swagger Specification Finder & Endpoint Parser\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Discovers and parses public openapi.json or swagger.yaml specifications into compact LLM tool definitions.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-074.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "openapi",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant OpenAPI / Swagger Specification Finder & Endpoint Parser without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/074-openapi-swagger-spec-endpoint-parser",
      "bundleZipName": "ECC-PROD-074.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "075",
    "sku": "ECC-PROD-075",
    "batch": 8,
    "name": "SEC EDGAR & Public Financial Filings Clean Text Extractor",
    "price": 24.99,
    "priceCents": 2499,
    "currency": "usd",
    "permalink": "sec-edgar-financial-filings-extractor",
    "category": "other",
    "summary": "Extract and automate SEC EDGAR & Public Financial Filings Clean Text Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 SEC EDGAR & Public Financial Filings Clean Text Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Consumes official data.sec.gov JSON APIs to deliver clean 10-K and 10-Q sections to financial AI agents.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-075.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "sec",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant SEC EDGAR & Public Financial Filings Clean Text Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/075-sec-edgar-financial-filings-extractor",
      "bundleZipName": "ECC-PROD-075.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "076",
    "sku": "ECC-PROD-076",
    "batch": 8,
    "name": "FAQ & Help Center (Zendesk, Intercom, Freshdesk) Scraper",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "help-center-zendesk-intercom-scraper",
    "category": "other",
    "summary": "Extract and automate FAQ & Help Center (Zendesk, Intercom, Freshdesk) Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 FAQ & Help Center (Zendesk, Intercom, Freshdesk) Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts public knowledge base articles (/hc/en-us/articles.json) to train customer support AI agents.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-076.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "help",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant FAQ & Help Center (Zendesk, Intercom, Freshdesk) Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/076-help-center-zendesk-intercom-scraper",
      "bundleZipName": "ECC-PROD-076.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "077",
    "sku": "ECC-PROD-077",
    "batch": 8,
    "name": "Multi-URL Fast Metadata & Summary Card Extractor for MCP",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "multi-url-fast-metadata-mcp-extractor",
    "category": "other",
    "summary": "Extract and automate Multi-URL Fast Metadata & Summary Card Extractor for MCP with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Multi-URL Fast Metadata & Summary Card Extractor for MCP\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Ultra-low-latency batch fetcher returning title, description, author, date, and main body for MCP tool calls.\n- **Format:** Model Context Protocol (MCP) Server for Claude & Cursor\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-077.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "multi",
      "productivity"
    ],
    "deliverableType": "mcp_bundle",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant Multi-URL Fast Metadata & Summary Card Extractor for MCP without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/077-multi-url-fast-metadata-mcp-extractor",
      "bundleZipName": "ECC-PROD-077.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "078",
    "sku": "ECC-PROD-078",
    "batch": 8,
    "name": "Press Release & Newsroom (PRNewswire, GlobeNewswire) Scraper",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "press-release-newsroom-jsonld-scraper",
    "category": "other",
    "summary": "Extract and automate Press Release & Newsroom (PRNewswire, GlobeNewswire) Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Press Release & Newsroom (PRNewswire, GlobeNewswire) Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts corporate press releases via RSS and Schema.org/NewsArticle JSON-LD blocks.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-078.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "press",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant Press Release & Newsroom (PRNewswire, GlobeNewswire) Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/078-press-release-newsroom-jsonld-scraper",
      "bundleZipName": "ECC-PROD-078.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "079",
    "sku": "ECC-PROD-079",
    "batch": 8,
    "name": "Recipe & Nutritional Schema.org Universal Extractor",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "recipe-nutritional-schema-extractor",
    "category": "other",
    "summary": "Extract and automate Recipe & Nutritional Schema.org Universal Extractor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Recipe & Nutritional Schema.org Universal Extractor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts ingredients, instructions, prep time, and macros from Schema.org/Recipe implementations.\n- **Format:** Google Sheets Native Template + Custom Formula\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-079.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "recipe",
      "productivity"
    ],
    "deliverableType": "sheets_template",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant Recipe & Nutritional Schema.org Universal Extractor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/079-recipe-nutritional-schema-extractor",
      "bundleZipName": "ECC-PROD-079.zip",
      "sheetsCopyUrl": "https://docs.google.com/spreadsheets/d/placeholder-079/copy",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "080",
    "sku": "ECC-PROD-080",
    "batch": 8,
    "name": "Course Catalog & Syllabus Extractor (EdTech Standard)",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "course-catalog-syllabus-schema-extractor",
    "category": "other",
    "summary": "Extract and automate Course Catalog & Syllabus Extractor (EdTech Standard) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Course Catalog & Syllabus Extractor (EdTech Standard)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts syllabus, pricing, and instructor metadata from pages implementing Schema.org/Course.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-080.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "other",
      "data-extraction",
      "automation",
      "course",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Financial analysts, enterprise researchers, compliance officers",
    "uvp": "Instant Course Catalog & Syllabus Extractor (EdTech Standard) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/080-course-catalog-syllabus-schema-extractor",
      "bundleZipName": "ECC-PROD-080.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "081",
    "sku": "ECC-PROD-081",
    "batch": 9,
    "name": "SEO & OpenGraph Bulk Technical Auditor",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "seo-opengraph-bulk-technical-auditor",
    "category": "seo_compliance",
    "summary": "Extract and automate SEO & OpenGraph Bulk Technical Auditor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 SEO & OpenGraph Bulk Technical Auditor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Audits HTTP status, title, meta description, H1-H3 hierarchy, canonicals, robots, and missing alt attributes.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-081.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "seo",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant SEO & OpenGraph Bulk Technical Auditor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/081-seo-opengraph-bulk-technical-auditor",
      "bundleZipName": "ECC-PROD-081.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "082",
    "sku": "ECC-PROD-082",
    "batch": 9,
    "name": "Broken Link, Redirect Chain & 404 Bulk Finder",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "broken-link-redirect-chain-bulk-finder",
    "category": "seo_compliance",
    "summary": "Extract and automate Broken Link, Redirect Chain & 404 Bulk Finder with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Broken Link, Redirect Chain & 404 Bulk Finder\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Performs high-concurrency HEAD/GET checks to detect 404/500 dead links and 301/302 redirect hops.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-082.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "broken",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Broken Link, Redirect Chain & 404 Bulk Finder without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/082-broken-link-redirect-chain-bulk-finder",
      "bundleZipName": "ECC-PROD-082.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "083",
    "sku": "ECC-PROD-083",
    "batch": 9,
    "name": "Schema.org & Rich Snippets Bulk Validator",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "schema-org-rich-snippets-validator",
    "category": "seo_compliance",
    "summary": "Extract and automate Schema.org & Rich Snippets Bulk Validator with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Schema.org & Rich Snippets Bulk Validator\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Audits web pages to verify JSON-LD blocks against mandatory Google Rich Result properties.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-083.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "schema",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Schema.org & Rich Snippets Bulk Validator without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/083-schema-org-rich-snippets-validator",
      "bundleZipName": "ECC-PROD-083.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "084",
    "sku": "ECC-PROD-084",
    "batch": 9,
    "name": "Website Security Headers, SSL Certificate & CORS Auditor",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "website-security-headers-ssl-auditor",
    "category": "seo_compliance",
    "summary": "Extract and automate Website Security Headers, SSL Certificate & CORS Auditor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Website Security Headers, SSL Certificate & CORS Auditor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Inspects HSTS, CSP, X-Frame-Options, TLS/SSL expiration dates, and /.well-known/security.txt.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-084.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "website",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Website Security Headers, SSL Certificate & CORS Auditor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/084-website-security-headers-ssl-auditor",
      "bundleZipName": "ECC-PROD-084.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "085",
    "sku": "ECC-PROD-085",
    "batch": 9,
    "name": "GDPR, Cookie Banner & Tracking Pixel Compliance Checker",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "gdpr-cookie-banner-pixel-compliance",
    "category": "seo_compliance",
    "summary": "Extract and automate GDPR, Cookie Banner & Tracking Pixel Compliance Checker with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 GDPR, Cookie Banner & Tracking Pixel Compliance Checker\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Audits initial cookies and third-party tracking scripts loaded prior to user consent.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-085.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "gdpr",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant GDPR, Cookie Banner & Tracking Pixel Compliance Checker without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/085-gdpr-cookie-banner-pixel-compliance",
      "bundleZipName": "ECC-PROD-085.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "086",
    "sku": "ECC-PROD-086",
    "batch": 9,
    "name": "WCAG Web Accessibility Bulk Automated Auditor",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "wcag-web-accessibility-bulk-auditor",
    "category": "seo_compliance",
    "summary": "Extract and automate WCAG Web Accessibility Bulk Automated Auditor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 WCAG Web Accessibility Bulk Automated Auditor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Evaluates DOM structure for WCAG compliance issues (form labels, ARIA roles, heading order, contrast).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-086.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "wcag",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant WCAG Web Accessibility Bulk Automated Auditor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/086-wcag-web-accessibility-bulk-auditor",
      "bundleZipName": "ECC-PROD-086.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "087",
    "sku": "ECC-PROD-087",
    "batch": 9,
    "name": "Hreflang & Multi-Language SEO Internationalization Checker",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "hreflang-multilanguage-seo-checker",
    "category": "seo_compliance",
    "summary": "Extract and automate Hreflang & Multi-Language SEO Internationalization Checker with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": '# \u26A1 Hreflang & Multi-Language SEO Internationalization Checker\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Validates bidirectional return tags across rel="alternate" hreflang annotations.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-087.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.',
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "hreflang",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Hreflang & Multi-Language SEO Internationalization Checker without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/087-hreflang-multilanguage-seo-checker",
      "bundleZipName": "ECC-PROD-087.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "088",
    "sku": "ECC-PROD-088",
    "batch": 9,
    "name": "Robots.txt, AI Bot Blocker & Sitemap Health Analyzer",
    "price": 9.99,
    "priceCents": 999,
    "currency": "usd",
    "permalink": "robotstxt-ai-bot-blocker-analyzer",
    "category": "seo_compliance",
    "summary": "Extract and automate Robots.txt, AI Bot Blocker & Sitemap Health Analyzer with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Robots.txt, AI Bot Blocker & Sitemap Health Analyzer\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Checks whether domains block or allow GPTBot, ClaudeBot, PerplexityBot, and validates XML sitemaps.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-088.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "robotstxt",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Robots.txt, AI Bot Blocker & Sitemap Health Analyzer without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/088-robotstxt-ai-bot-blocker-analyzer",
      "bundleZipName": "ECC-PROD-088.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "089",
    "sku": "ECC-PROD-089",
    "batch": 9,
    "name": "Ads.txt & App-Ads.txt Programmatic Advertising Validator",
    "price": 12.99,
    "priceCents": 1299,
    "currency": "usd",
    "permalink": "adstxt-appadstxt-programmatic-validator",
    "category": "seo_compliance",
    "summary": "Extract and automate Ads.txt & App-Ads.txt Programmatic Advertising Validator with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Ads.txt & App-Ads.txt Programmatic Advertising Validator\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Parses and validates /ads.txt and /app-ads.txt authorized digital seller files for ad-tech agencies.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-089.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "adstxt",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Ads.txt & App-Ads.txt Programmatic Advertising Validator without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/089-adstxt-appadstxt-programmatic-validator",
      "bundleZipName": "ECC-PROD-089.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "090",
    "sku": "ECC-PROD-090",
    "batch": 9,
    "name": "Domain Expiration, RDAP & DNS Infrastructure Bulk Lookup",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "domain-expiration-rdap-dns-lookup",
    "category": "seo_compliance",
    "summary": "Extract and automate Domain Expiration, RDAP & DNS Infrastructure Bulk Lookup with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Domain Expiration, RDAP & DNS Infrastructure Bulk Lookup\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries official JSON RDAP registries (modern WHOIS replacement) and DNS records in bulk.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-090.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "seo-compliance",
      "data-extraction",
      "automation",
      "domain",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "SEO agencies, web development studios, privacy auditors",
    "uvp": "Instant Domain Expiration, RDAP & DNS Infrastructure Bulk Lookup without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/090-domain-expiration-rdap-dns-lookup",
      "bundleZipName": "ECC-PROD-090.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "091",
    "sku": "ECC-PROD-091",
    "batch": 10,
    "name": "Google PageSpeed & Core Web Vitals Bulk API Runner",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "google-pagespeed-cwv-bulk-runner",
    "category": "finance_osint",
    "summary": "Extract and automate Google PageSpeed & Core Web Vitals Bulk API Runner with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Google PageSpeed & Core Web Vitals Bulk API Runner\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Orchestrates batch calls to Google PageSpeed Insights API returning tabular LCP, CLS, and INP metrics.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-091.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "google",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Google PageSpeed & Core Web Vitals Bulk API Runner without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/091-google-pagespeed-cwv-bulk-runner",
      "bundleZipName": "ECC-PROD-091.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "092",
    "sku": "ECC-PROD-092",
    "batch": 10,
    "name": "Wayback Machine (Internet Archive) Historical URL Snapshots",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "wayback-machine-cdx-snapshot-finder",
    "category": "finance_osint",
    "summary": "Extract and automate Wayback Machine (Internet Archive) Historical URL Snapshots with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Wayback Machine (Internet Archive) Historical URL Snapshots\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries Archive.org CDX JSON API to list historical captures and URL changes over time.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-092.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "wayback",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Wayback Machine (Internet Archive) Historical URL Snapshots without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/092-wayback-machine-cdx-snapshot-finder",
      "bundleZipName": "ECC-PROD-092.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "093",
    "sku": "ECC-PROD-093",
    "batch": 10,
    "name": "Certificate Transparency (crt.sh) Subdomain Discovery Tool",
    "price": 14.99,
    "priceCents": 1499,
    "currency": "usd",
    "permalink": "crtsh-ssl-subdomain-discovery-tool",
    "category": "finance_osint",
    "summary": "Extract and automate Certificate Transparency (crt.sh) Subdomain Discovery Tool with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Certificate Transparency (crt.sh) Subdomain Discovery Tool\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Queries public Certificate Transparency JSON logs to discover active subdomains for any organization.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-093.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "crtsh",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Certificate Transparency (crt.sh) Subdomain Discovery Tool without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/093-crtsh-ssl-subdomain-discovery-tool",
      "bundleZipName": "ECC-PROD-093.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "094",
    "sku": "ECC-PROD-094",
    "batch": 10,
    "name": "Public Government Tenders & Procurement Extractor (LatAm/ES)",
    "price": 24.99,
    "priceCents": 2499,
    "currency": "usd",
    "permalink": "public-government-tenders-extractor",
    "category": "finance_osint",
    "summary": "Extract and automate Public Government Tenders & Procurement Extractor (LatAm/ES) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Public Government Tenders & Procurement Extractor (LatAm/ES)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts public procurement tenders and contract awards from open government portals (OCDS standard).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-094.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "public",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Public Government Tenders & Procurement Extractor (LatAm/ES) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/094-public-government-tenders-extractor",
      "bundleZipName": "ECC-PROD-094.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "095",
    "sku": "ECC-PROD-095",
    "batch": 10,
    "name": "Central Bank & Regional Currency Exchange Rates API Aggregator",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "central-bank-exchange-rates-aggregator",
    "category": "finance_osint",
    "summary": "Extract and automate Central Bank & Regional Currency Exchange Rates API Aggregator with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Central Bank & Regional Currency Exchange Rates API Aggregator\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Normalizes official and financial exchange rates from central bank APIs (BCRA, BCB, Banxico, ECB).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-095.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "central",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Central Bank & Regional Currency Exchange Rates API Aggregator without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/095-central-bank-exchange-rates-aggregator",
      "bundleZipName": "ECC-PROD-095.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "096",
    "sku": "ECC-PROD-096",
    "batch": 10,
    "name": "Official Gazette (Bolet\xEDn Oficial) Corporate Announcements Scraper",
    "price": 24.99,
    "priceCents": 2499,
    "currency": "usd",
    "permalink": "official-gazette-corporate-announcements",
    "category": "finance_osint",
    "summary": "Extract and automate Official Gazette (Bolet\xEDn Oficial) Corporate Announcements Scraper with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Official Gazette (Bolet\xEDn Oficial) Corporate Announcements Scraper\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts newly registered companies, corporate filings, and legal notices from public official gazettes.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-096.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "official",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Official Gazette (Bolet\xEDn Oficial) Corporate Announcements Scraper without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/096-official-gazette-corporate-announcements",
      "bundleZipName": "ECC-PROD-096.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "097",
    "sku": "ECC-PROD-097",
    "batch": 10,
    "name": "Trademark & Patent Public Bulletin Monitor",
    "price": 24.99,
    "priceCents": 2499,
    "currency": "usd",
    "permalink": "trademark-patent-bulletin-monitor",
    "category": "finance_osint",
    "summary": "Extract and automate Trademark & Patent Public Bulletin Monitor with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Trademark & Patent Public Bulletin Monitor\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Monitors public intellectual property bulletins for new trademark applications and oppositions.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-097.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "trademark",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Trademark & Patent Public Bulletin Monitor without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/097-trademark-patent-bulletin-monitor",
      "bundleZipName": "ECC-PROD-097.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "098",
    "sku": "ECC-PROD-098",
    "batch": 10,
    "name": "Import / Export Customs Tariff & HS Code Lookup Tool",
    "price": 19,
    "priceCents": 1900,
    "currency": "usd",
    "permalink": "customs-tariff-hs-code-lookup",
    "category": "finance_osint",
    "summary": "Extract and automate Import / Export Customs Tariff & HS Code Lookup Tool with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 Import / Export Customs Tariff & HS Code Lookup Tool\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Extracts harmonized system (HS/NCM) tariff codes, import duties, and trade regulations.\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-098.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "customs",
      "productivity"
    ],
    "deliverableType": "dataset_extractor",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant Import / Export Customs Tariff & HS Code Lookup Tool without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/098-customs-tariff-hs-code-lookup",
      "bundleZipName": "ECC-PROD-098.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "099",
    "sku": "ECC-PROD-099",
    "batch": 10,
    "name": "B2B Lead Waterfall Pipeline (Search -> Scrape -> Enrich)",
    "price": 29,
    "priceCents": 2900,
    "currency": "usd",
    "permalink": "b2b-lead-waterfall-enrichment-pipeline",
    "category": "finance_osint",
    "summary": "Extract and automate B2B Lead Waterfall Pipeline (Search -> Scrape -> Enrich) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 B2B Lead Waterfall Pipeline (Search -> Scrape -> Enrich)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Flagship B2B orchestrator combining domain discovery, contact enrichment (#021), and tech stack detection (#022).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-099.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "b2b",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant B2B Lead Waterfall Pipeline (Search -> Scrape -> Enrich) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/099-b2b-lead-waterfall-enrichment-pipeline",
      "bundleZipName": "ECC-PROD-099.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  },
  {
    "id": "100",
    "sku": "ECC-PROD-100",
    "batch": 10,
    "name": "E-commerce Competitor Full Audit Pipeline (Catalog + Tech + SEO)",
    "price": 29,
    "priceCents": 2900,
    "currency": "usd",
    "permalink": "ecommerce-competitor-full-audit-pipeline",
    "category": "finance_osint",
    "summary": "Extract and automate E-commerce Competitor Full Audit Pipeline (Catalog + Tech + SEO) with zero code and zero monthly fees. Ready-to-run package with instant download.",
    "description": "# \u26A1 E-commerce Competitor Full Audit Pipeline (Catalog + Tech + SEO)\n\nStop paying $50-$100/mo for complex scraping tools or wasting hours on manual copy-pasting.\n\n### \u{1F680} What this tool delivers:\n- **Mechanism:** Flagship E-commerce orchestrator combining catalog extraction (#001), pixel detection (#022), and SEO audit (#081).\n- **Format:** Standalone zero-dependency Node.js CLI with JSON/CSV export\n- **Privacy:** 100% local or native Google Cloud execution. No third-party data tracking.\n\n### \u{1F381} Included in your download:\n1. Complete standalone code and runtime bundle (`ECC-PROD-100.zip`).\n2. Step-by-step Quick Start Guide (up and running in <3 minutes).\n3. Sample datasets and test fixtures.\n4. Lifetime updates and commercial use rights.",
    "tags": [
      "finance-osint",
      "data-extraction",
      "automation",
      "ecommerce",
      "productivity"
    ],
    "deliverableType": "standalone_cli",
    "targetAudience": "Government contractors, investigative researchers, macro analysts",
    "uvp": "Instant E-commerce Competitor Full Audit Pipeline (Catalog + Tech + SEO) without recurring subscriptions or coding prerequisites.",
    "deliverableConfig": {
      "sourceDir": "actors/100-ecommerce-competitor-full-audit-pipeline",
      "bundleZipName": "ECC-PROD-100.zip",
      "entryPoint": "dist/index.js",
      "instructionsFile": "README.md"
    },
    "gumroadConfig": {
      "taxonomyId": 266,
      "refundPeriod": "none",
      "refundFinePrint": "Digital download. All sales final once accessed.",
      "requireShipping": false,
      "payWhatYouWant": false,
      "draft": false
    }
  }
];
var BATCH_DEFINITIONS = [
  {
    batchNumber: 1,
    batchTitle: "E-Commerce Sheets & Standalone Tools",
    theme: "Direct store extractors & Google Sheets integrations",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B01",
    bundlePriceUsd: 69,
    targetAudience: "E-commerce store owners, Amazon/Shopify sellers, drop shippers"
  },
  {
    batchNumber: 2,
    batchTitle: "Retail Price Intelligence, Deals & Reviews",
    theme: "Marketplace arbitrage, deal alerts, and customer review mining",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B02",
    bundlePriceUsd: 89,
    targetAudience: "Pricing analysts, retail arbitragers, market researchers"
  },
  {
    batchNumber: 3,
    batchTitle: "B2B Leads & Contact Enrichers",
    theme: "Corporate decision maker discovery and hiring signal detection",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B03",
    bundlePriceUsd: 99,
    targetAudience: "B2B sales teams, SDRs, recruitment agencies, growth marketers"
  },
  {
    batchNumber: 4,
    batchTitle: "Developer Ecosystem & Creator Directory Finders",
    theme: "Mobile app stores, developer packages, and creator discovery",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B04",
    bundlePriceUsd: 89,
    targetAudience: "Developer tool marketers, newsletter sponsors, influencer agencies"
  },
  {
    batchNumber: 5,
    batchTitle: "Real Estate Intelligence & Property Arbitrage",
    theme: "Property portals, distressed listings, and price per m2 scrapers",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B05",
    bundlePriceUsd: 119,
    targetAudience: "Real estate investors, proptech startups, brokers, appraisal firms"
  },
  {
    batchNumber: 6,
    batchTitle: "High-Ticket Local Verticals & Directory Extractors",
    theme: "Automotive, industrial, medical, legal, and local services",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B06",
    bundlePriceUsd: 99,
    targetAudience: "Local lead generation agencies, trade contractors, B2B vendors"
  },
  {
    batchNumber: 7,
    batchTitle: "AI Agent Toolkits, RAG Ingestion & Developer Crawlers",
    theme: "Clean markdown extraction, doc chunking, and AI-ready feeds",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B07",
    bundlePriceUsd: 89,
    targetAudience: "AI engineers, LLM app developers, RAG pipeline architects"
  },
  {
    batchNumber: 8,
    batchTitle: "Structured Document, Financial & Enterprise Parsers",
    theme: "SEC filings, public PDFs, changelogs, and tabular converters",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B08",
    bundlePriceUsd: 99,
    targetAudience: "Financial analysts, enterprise researchers, compliance officers"
  },
  {
    batchNumber: 9,
    batchTitle: "Technical SEO, Compliance & Web Health Auditors",
    theme: "Automated SEO, accessibility, security headers, and GDPR checks",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B09",
    bundlePriceUsd: 99,
    targetAudience: "SEO agencies, web development studios, privacy auditors"
  },
  {
    batchNumber: 10,
    batchTitle: "Advanced OSINT, Government Tenders & Mega-Pipelines",
    theme: "Public procurement, gazettes, exchange rates, and end-to-end pipelines",
    productsCount: 10,
    bundleSku: "ECC-BUNDLE-B10",
    bundlePriceUsd: 149,
    targetAudience: "Government contractors, investigative researchers, macro analysts"
  }
];
var CATALOG_BATCHES = BATCH_DEFINITIONS.map((b) => ({
  ...b,
  products: MASTER_CATALOG.filter((p) => p.batch === b.batchNumber)
}));

// src/auditor-service.ts
async function runAuditService(inputs, options) {
  const startTime = Date.now();
  let isProUnlocked = false;
  if (inputs.licenseKey && inputs.licenseKey.trim().length > 0) {
    try {
      const pubKey = options?.publicKeyPem || process.env.ZABREUIT_LICENSE_PUBLIC_KEY || DEFAULT_ED25519_PUBLIC_KEY_PEM;
      const verification = await verifyLicenseToken(inputs.licenseKey, pubKey);
      if (verification.valid && verification.payload && (verification.payload.tier === "PRO" || verification.payload.tier === "ENTERPRISE")) {
        isProUnlocked = true;
      }
    } catch {
      isProUnlocked = false;
    }
  }
  const engine = new TechnicalAuditorEngine();
  const engineOptions = {
    html: options?.mockHtml,
    timeoutMs: options?.timeoutMs ?? 5e3,
    checkOpenGraph: inputs.auditPreset === "seo-opengraph" || inputs.auditPreset === "seo-audit" || inputs.auditPreset === "full-technical",
    checkSsl: inputs.auditPreset === "seo-audit" || inputs.auditPreset === "security-audit" || inputs.auditPreset === "full-technical",
    checkRobotsTxt: inputs.auditPreset === "seo-audit" || inputs.auditPreset === "full-technical",
    checkSecurityTxt: inputs.auditPreset === "security-audit" || inputs.auditPreset === "full-technical",
    checkRdap: isProUnlocked && (inputs.auditPreset === "security-audit" || inputs.auditPreset === "full-technical")
  };
  const result = await engine.extract(inputs.url, engineOptions);
  if (!result.success || !result.data) {
    const errorFinding = {
      severity: "ERROR",
      code: result.error?.code || "AUDIT_EXECUTION_FAILED",
      message: result.error?.message || "Technical audit execution failed",
      recommendation: "Check that target URL is reachable and well-formed."
    };
    return {
      url: inputs.url,
      score: 0,
      preset: inputs.auditPreset,
      durationMs: Date.now() - startTime,
      isProUnlocked,
      findings: [errorFinding],
      details: {}
    };
  }
  const report = result.data;
  const findings = report.issues.map((iss) => ({
    severity: iss.severity,
    code: iss.code,
    message: iss.message,
    recommendation: getRecommendation(iss.code)
  }));
  const securityHeadersPresent = [];
  if (report.ssl?.valid) securityHeadersPresent.push("TLS/HTTPS");
  if (report.securityTxt?.found) securityHeadersPresent.push("security.txt");
  return {
    url: inputs.url,
    score: report.complianceScore,
    preset: inputs.auditPreset,
    durationMs: Date.now() - startTime,
    isProUnlocked,
    findings,
    details: {
      sslValid: report.ssl?.valid,
      sslDaysRemaining: report.ssl?.daysRemaining,
      openGraphValid: report.openGraph?.valid,
      securityTxtFound: report.securityTxt?.found,
      robotsTxtFound: report.robotsTxt?.found,
      securityHeadersPresent
    }
  };
}
function getRecommendation(code) {
  switch (code) {
    case "OG_INCOMPLETE":
      return "Add required og:title, og:description, and og:image tags in <head>.";
    case "SSL_INVALID":
      return "Verify domain TLS certificate validity and CA chain.";
    case "SSL_EXPIRING_SOON":
      return "Renew SSL certificate before expiration to prevent browser warnings.";
    case "SECURITY_TXT_NOT_FOUND":
      return "Publish a standard security.txt file under /.well-known/security.txt.";
    case "ROBOTS_DISALLOW_ALL":
      return "Ensure robots.txt does not inadvertently block search engine crawlers with Disallow: /";
    case "HTTP_ERROR_STATUS":
      return "Fix web server configuration to return HTTP 200 OK.";
    default:
      return "Review detected issue according to web standards.";
  }
}

// src/summary-formatter.ts
function formatStepSummary(result) {
  const statusEmoji = result.score >= 80 ? "\u{1F7E2}" : result.score >= 60 ? "\u{1F7E1}" : "\u{1F534}";
  const proBadge = result.isProUnlocked ? "\u{1F6E1}\uFE0F **Pro Unlocked**" : "\u{1F331} **Community Tier**";
  const rows = [
    `# ${statusEmoji} Zabreuit Technical Audit Summary`,
    "",
    "| Metric | Value |",
    "| :--- | :--- |",
    `| **Target URL** | \`${result.url}\` |`,
    `| **Preset** | \`${result.preset}\` |`,
    `| **Score** | **${result.score} / 100** |`,
    `| **License Tier** | ${proBadge} |`,
    `| **Duration** | \`${result.durationMs}ms\` |`,
    "",
    `### \u{1F4CB} Audit Findings (${result.findings.length})`,
    ""
  ];
  if (result.findings.length === 0) {
    rows.push("\u2728 *No issues detected! All technical checks passed.*");
  } else {
    rows.push("| Severity | Code | Description | Recommendation |");
    rows.push("| :--- | :--- | :--- | :--- |");
    for (const f of result.findings) {
      const sevBadge = f.severity === "ERROR" ? "\u{1F534} ERROR" : f.severity === "WARN" ? "\u{1F7E1} WARN" : "\u2139\uFE0F INFO";
      rows.push(`| ${sevBadge} | \`${f.code}\` | ${f.message} | ${f.recommendation || "-"} |`);
    }
  }
  rows.push("");
  rows.push("### \u{1F50D} Technical Checks Breakdown");
  if (result.details.sslValid !== void 0) {
    rows.push(
      `- **SSL/TLS**: ${result.details.sslValid ? "\u2705 Valid" : "\u274C Invalid"} (${result.details.sslDaysRemaining ?? 0} days remaining)`
    );
  }
  if (result.details.openGraphValid !== void 0) {
    rows.push(
      `- **OpenGraph**: ${result.details.openGraphValid ? "\u2705 Complete" : "\u26A0\uFE0F Missing Tags"}`
    );
  }
  if (result.details.securityTxtFound !== void 0) {
    rows.push(
      `- **security.txt**: ${result.details.securityTxtFound ? "\u2705 Present" : "\u2139\uFE0F Not Found"}`
    );
  }
  if (result.details.robotsTxtFound !== void 0) {
    rows.push(
      `- **robots.txt**: ${result.details.robotsTxtFound ? "\u2705 Present" : "\u2139\uFE0F Not Found"}`
    );
  }
  rows.push("");
  rows.push("---");
  rows.push("*Generated with zero infrastructure cost by [Zabreuit Technical Auditor](https://github.com/Argenzolano1988).*");
  return rows.join("\n");
}

// src/index.ts
async function run() {
  try {
    const url = getInput("url", { required: true });
    const auditPreset = getInput("audit_preset") || "seo-opengraph";
    const licenseKey = getInput("license_key") || void 0;
    const failOnCritical = getInput("fail_on_critical").toLowerCase() === "true";
    const minScoreStr = getInput("min_score") || "70";
    const minScore = parseInt(minScoreStr, 10) || 70;
    const inputs = {
      url,
      auditPreset,
      licenseKey,
      failOnCritical,
      minScore
    };
    logInfo(`Starting Zabreuit Technical Audit on ${url} (preset: ${auditPreset})...`);
    const result = await runAuditService(inputs);
    const summary = formatStepSummary(result);
    setOutput("audit_score", String(result.score));
    setOutput("findings_json", JSON.stringify(result.findings));
    setOutput("markdown_summary", summary);
    addStepSummary(summary);
    logInfo(`Audit completed with score ${result.score}/100 in ${result.durationMs}ms.`);
    const hasCritical = result.findings.some((f) => f.severity === "ERROR");
    const isBelowMinScore = result.score < minScore;
    if (failOnCritical && (hasCritical || isBelowMinScore)) {
      const reasons = [];
      if (hasCritical) reasons.push("Critical ERROR findings detected");
      if (isBelowMinScore) reasons.push(`Score ${result.score} is below threshold ${minScore}`);
      setFailed(`Audit failed: ${reasons.join(", ")}.`);
    } else if (isBelowMinScore) {
      logWarning(`Audit score ${result.score} is below configured min_score ${minScore}.`);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    setFailed(`Fatal execution error: ${errorMsg}`);
  }
}
if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
  void run();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
