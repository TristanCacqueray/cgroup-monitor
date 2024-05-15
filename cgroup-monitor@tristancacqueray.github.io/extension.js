// output/Clutter.Actor/foreign.js
var unsafe_add_child = (actor) => (child) => () => actor.add_child(child);
var unsafe_destroy = (actor) => () => actor.destroy();
var unsafe_onButtonPressEvent = (actor) => (cb) => () => actor.connect("button-press-event", (actor2, event) => cb(actor2)(event)());
var unsafe_set_y_align = (actor) => (a) => () => actor.set_y_align(a);

// output/Clutter.Actor/index.js
var set_y_align = function() {
  return unsafe_set_y_align;
};
var onButtonPressEvent = function() {
  return unsafe_onButtonPressEvent;
};
var destroy = function() {
  return unsafe_destroy;
};
var add_child = function() {
  return function() {
    return unsafe_add_child;
  };
};

// output/Clutter.ActorAlign/foreign.js
import Clutter from "gi://Clutter";
var ActorAlign = Clutter.ActorAlign;
var fill = ActorAlign.FILL;
var start = ActorAlign.START;
var center = ActorAlign.CENTER;
var end = ActorAlign.END;

// output/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0; i < l; i++) {
      var f = fs[i];
      for (var j = 0; j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Data.Unit/foreign.js
var unit = void 0;

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var functorArray = {
  map: arrayMap
};

// output/Control.Apply/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var applyArray = {
  apply: arrayApply,
  Functor0: function() {
    return functorArray;
  }
};
var apply = function(dict) {
  return dict.apply;
};
var applySecond = function(dictApply) {
  var apply1 = apply(dictApply);
  var map6 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map6($$const(identity2))(a))(b);
    };
  };
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var liftA1 = function(dictApplicative) {
  var apply2 = apply(dictApplicative.Apply0());
  var pure12 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply2(pure12(f))(a);
    };
  };
};

// output/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output/Control.Bind/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var discard = function(dict) {
  return dict.discard;
};
var bindArray = {
  bind: arrayBind,
  Apply0: function() {
    return applyArray;
  }
};
var bind = function(dict) {
  return dict.bind;
};
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
};
var join = function(dictBind) {
  var bind1 = bind(dictBind);
  return function(m) {
    return bind1(m)(identity3);
  };
};

// output/Data.Array/foreign.js
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0; i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head) {
    return function(tail) {
      return new Cons(head, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr2, xs) {
    return listToArray(foldr2(curryCons)(emptyList)(xs));
  };
}();
var length = function(xs) {
  return xs.length;
};
var unconsImpl = function(empty2, next, xs) {
  return xs.length === 0 ? empty2({}) : next(xs[0])(xs.slice(1));
};
var indexImpl = function(just, nothing, xs, i) {
  return i < 0 || i >= xs.length ? nothing : just(xs[i]);
};
var sortByImpl = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from2 + (to - from2 >> 1);
    if (mid - from2 > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from2;
    j = mid;
    k = from2;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2, fromOrdering, xs) {
    var out;
    if (xs.length < 2)
      return xs;
    out = xs.slice(0);
    mergeFromTo(compare2, fromOrdering, out, xs.slice(0), 0, xs.length);
    return out;
  };
}();
var sliceImpl = function(s, e, l) {
  return l.slice(s, e);
};

// output/Data.Semigroup/index.js
var semigroupUnit = {
  append: function(v) {
    return function(v1) {
      return unit;
    };
  }
};
var append = function(dict) {
  return dict.append;
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind4 = bind(dictMonad.Bind1());
  var pure5 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind4(f)(function(f$prime) {
        return bind4(a)(function(a$prime) {
          return pure5(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.Bounded/foreign.js
var topInt = 2147483647;
var bottomInt = -2147483648;
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq2) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq2 : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;

// output/Data.Eq/index.js
var eqInt = {
  eq: eqIntImpl
};

// output/Data.Ordering/index.js
var LT = /* @__PURE__ */ function() {
  function LT2() {
  }
  ;
  LT2.value = new LT2();
  return LT2;
}();
var GT = /* @__PURE__ */ function() {
  function GT2() {
  }
  ;
  GT2.value = new GT2();
  return GT2;
}();
var EQ = /* @__PURE__ */ function() {
  function EQ2() {
  }
  ;
  EQ2.value = new EQ2();
  return EQ2;
}();

// output/Data.Ord/index.js
var ordInt = /* @__PURE__ */ function() {
  return {
    compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqInt;
    }
  };
}();
var compare = function(dict) {
  return dict.compare;
};
var max = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(x) {
    return function(y) {
      var v = compare3(x)(y);
      if (v instanceof LT) {
        return y;
      }
      ;
      if (v instanceof EQ) {
        return x;
      }
      ;
      if (v instanceof GT) {
        return x;
      }
      ;
      throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v.constructor.name]);
    };
  };
};
var min = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(x) {
    return function(y) {
      var v = compare3(x)(y);
      if (v instanceof LT) {
        return x;
      }
      ;
      if (v instanceof EQ) {
        return x;
      }
      ;
      if (v instanceof GT) {
        return y;
      }
      ;
      throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [v.constructor.name]);
    };
  };
};
var clamp = function(dictOrd) {
  var min1 = min(dictOrd);
  var max1 = max(dictOrd);
  return function(low) {
    return function(hi) {
      return function(x) {
        return min1(hi)(max1(low)(x));
      };
    };
  };
};

// output/Data.Bounded/index.js
var top = function(dict) {
  return dict.top;
};
var boundedInt = {
  top: topInt,
  bottom: bottomInt,
  Ord0: function() {
    return ordInt;
  }
};
var bottom = function(dict) {
  return dict.bottom;
};

// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};

// output/Data.Show/index.js
var showInt = {
  show: showIntImpl
};
var show = function(dict) {
  return dict.show;
};

// output/Data.Maybe/index.js
var identity4 = /* @__PURE__ */ identity(categoryFn);
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var functorMaybe = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Just) {
        return new Just(v(v1.value0));
      }
      ;
      return Nothing.value;
    };
  }
};
var map2 = /* @__PURE__ */ map(functorMaybe);
var fromMaybe = function(a) {
  return maybe(a)(identity4);
};
var applyMaybe = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return map2(v.value0)(v1);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};
var bindMaybe = {
  bind: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return v1(v.value0);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Apply0: function() {
    return applyMaybe;
  }
};
var applicativeMaybe = /* @__PURE__ */ function() {
  return {
    pure: Just.create,
    Apply0: function() {
      return applyMaybe;
    }
  };
}();
var altMaybe = {
  alt: function(v) {
    return function(v1) {
      if (v instanceof Nothing) {
        return v1;
      }
      ;
      return v;
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};
var plusMaybe = /* @__PURE__ */ function() {
  return {
    empty: Nothing.value,
    Alt0: function() {
      return altMaybe;
    }
  };
}();
var alternativeMaybe = {
  Applicative0: function() {
    return applicativeMaybe;
  },
  Plus1: function() {
    return plusMaybe;
  }
};

// output/Data.Either/index.js
var Left = /* @__PURE__ */ function() {
  function Left2(value0) {
    this.value0 = value0;
  }
  ;
  Left2.create = function(value0) {
    return new Left2(value0);
  };
  return Left2;
}();
var Right = /* @__PURE__ */ function() {
  function Right2(value0) {
    this.value0 = value0;
  }
  ;
  Right2.create = function(value0) {
    return new Right2(value0);
  };
  return Right2;
}();
var functorEither = {
  map: function(f) {
    return function(m) {
      if (m instanceof Left) {
        return new Left(m.value0);
      }
      ;
      if (m instanceof Right) {
        return new Right(f(m.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
    };
  }
};
var map3 = /* @__PURE__ */ map(functorEither);
var fromLeft = function(v) {
  return function(v1) {
    if (v1 instanceof Left) {
      return v1.value0;
    }
    ;
    return v;
  };
};
var either = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Left) {
        return v(v2.value0);
      }
      ;
      if (v2 instanceof Right) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var applyEither = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Left) {
        return new Left(v.value0);
      }
      ;
      if (v instanceof Right) {
        return map3(v.value0)(v1);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorEither;
  }
};
var bindEither = {
  bind: /* @__PURE__ */ either(function(e) {
    return function(v) {
      return new Left(e);
    };
  })(function(a) {
    return function(f) {
      return f(a);
    };
  }),
  Apply0: function() {
    return applyEither;
  }
};
var applicativeEither = /* @__PURE__ */ function() {
  return {
    pure: Right.create,
    Apply0: function() {
      return applyEither;
    }
  };
}();
var monadEither = {
  Applicative0: function() {
    return applicativeEither;
  },
  Bind1: function() {
    return bindEither;
  }
};

// output/Data.Monoid/index.js
var monoidUnit = {
  mempty: unit,
  Semigroup0: function() {
    return semigroupUnit;
  }
};
var mempty = function(dict) {
  return dict.mempty;
};

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name2, moduleName, init2) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init2();
    state2 = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

// output/Data.Array.ST/foreign.js
var sortByImpl2 = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from2 + (to - from2 >> 1);
    if (mid - from2 > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from2;
    j = mid;
    k = from2;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2, fromOrdering, xs) {
    if (xs.length < 2)
      return xs;
    mergeFromTo(compare2, fromOrdering, xs, xs.slice(0), 0, xs.length);
    return xs;
  };
}();

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Control.Plus/index.js
var empty = function(dict) {
  return dict.empty;
};

// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
};

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure5 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr2 = foldr(dictFoldable);
    return function(f) {
      return foldr2(function($454) {
        return applySecond2(f($454));
      })(pure5(unit));
    };
  };
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr2 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append2 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(f) {
      return foldr2(function(x) {
        return function(acc) {
          return append2(f(x))(acc);
        };
      })(mempty4);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};

// output/Data.Function.Uncurried/foreign.js
var runFn3 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
};
var runFn4 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat2(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply2) {
    return function(map6) {
      return function(pure5) {
        return function(f) {
          return function(array) {
            function go(bot, top3) {
              switch (top3 - bot) {
                case 0:
                  return pure5([]);
                case 1:
                  return map6(array1)(f(array[bot]));
                case 2:
                  return apply2(map6(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply2(apply2(map6(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                  return apply2(map6(concat2)(go(bot, pivot)))(go(pivot, top3));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Array/index.js
var slice = /* @__PURE__ */ runFn3(sliceImpl);
var take = function(n) {
  return function(xs) {
    var $152 = n < 1;
    if ($152) {
      return [];
    }
    ;
    return slice(0)(n)(xs);
  };
};
var singleton2 = function(a) {
  return [a];
};
var index = /* @__PURE__ */ function() {
  return runFn4(indexImpl)(Just.create)(Nothing.value);
}();
var last = function(xs) {
  return index(xs)(length(xs) - 1 | 0);
};
var foldM = function(dictMonad) {
  var pure12 = pure(dictMonad.Applicative0());
  var bind1 = bind(dictMonad.Bind1());
  return function(f) {
    return function(b) {
      return runFn3(unconsImpl)(function(v) {
        return pure12(b);
      })(function(a) {
        return function(as) {
          return bind1(f(b)(a))(function(b$prime) {
            return foldM(dictMonad)(f)(b$prime)(as);
          });
        };
      });
    };
  };
};
var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
var mapMaybe = function(f) {
  return concatMap(function() {
    var $189 = maybe([])(singleton2);
    return function($190) {
      return $189(f($190));
    };
  }());
};

// output/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};

// output/Data.Number/foreign.js
var isFiniteImpl = isFinite;
function fromStringImpl(str, isFinite2, just, nothing) {
  var num = parseFloat(str);
  if (isFinite2(num)) {
    return just(num);
  } else {
    return nothing;
  }
}
var round = Math.round;

// output/Data.Number/index.js
var fromString = function(str) {
  return fromStringImpl(str, isFiniteImpl, Just.create, Nothing.value);
};

// output/Data.Int/index.js
var top2 = /* @__PURE__ */ top(boundedInt);
var bottom2 = /* @__PURE__ */ bottom(boundedInt);
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();
var unsafeClamp = function(x) {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  ;
  if (x >= toNumber(top2)) {
    return top2;
  }
  ;
  if (x <= toNumber(bottom2)) {
    return bottom2;
  }
  ;
  if (otherwise) {
    return fromMaybe(0)(fromNumber(x));
  }
  ;
  throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
};
var round2 = function($37) {
  return unsafeClamp(round($37));
};

// output/Data.String.Utils/foreign.js
function endsWithImpl(searchString, s) {
  return s.endsWith(searchString);
}
function linesImpl(str) {
  return str.split(/\r\n|[\n\v\f\r\u0085\u2028\u2029]/);
}
function wordsImpl(s) {
  return s.split(/[\u000a-\u000d\u0085\u2028\u2029\u0009\u0020\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]+/);
}

// output/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";

// output/Control.Alternative/index.js
var guard = function(dictAlternative) {
  var pure5 = pure(dictAlternative.Applicative0());
  var empty2 = empty(dictAlternative.Plus1());
  return function(v) {
    if (v) {
      return pure5(unit);
    }
    ;
    if (!v) {
      return empty2;
    }
    ;
    throw new Error("Failed pattern match at Control.Alternative (line 48, column 1 - line 48, column 54): " + [v.constructor.name]);
  };
};

// output/Data.String.Common/foreign.js
var split = function(sep) {
  return function(s) {
    return s.split(sep);
  };
};

// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f) {
  return f();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Data.String.Utils/index.js
var words = function(s) {
  return wordsImpl(s);
};
var lines = function(s) {
  return linesImpl(s);
};
var endsWith = function(searchString) {
  return function(s) {
    return endsWithImpl(searchString, s);
  };
};

// output/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler2(error2) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error2) {
      setTimeout(function() {
        throw error2;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error2) {
      return left(error2);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error2) {
      k(left(error2))();
      return nonCanceler2;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size !== 0) {
        size--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size) % limit] = cb;
        size++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error2) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step = aff;
    var fail = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run4(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail = util.left(e);
              step = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail = step;
              step = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step = util.fromRight(step);
            }
            break;
          case CONTINUE:
            switch (step.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step._2;
                status = CONTINUE;
                step = step._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step = util.right(step._1);
                } else {
                  status = STEP_BIND;
                  step = step._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step = runSync(util.left, util.right, step._1);
                break;
              case ASYNC:
                status = PENDING;
                step = runAsync(util.left, step._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step = result2;
                      run4(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail = util.left(step._1);
                step = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step._1) {
                  tmp.run();
                }
                step = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step = sequential2(util, supervisor, step._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step = interrupt || fail || step;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail) {
                    status = CONTINUE;
                    step = attempt._2(util.fromLeft(fail));
                    fail = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step = util.fromRight(step);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail === null) {
                    result = util.fromRight(step);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail) {
                    step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                  } else {
                    step = attempt._1.completed(util.fromRight(step))(attempt._2);
                  }
                  fail = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  step = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step = attempt._1;
                  fail = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            if (interrupt && fail) {
              setTimeout(function() {
                throw util.fromLeft(fail);
              }, 0);
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join4) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join4.rethrow;
          join4.handler(step)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join4;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error2, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error2);
            status = COMPLETED;
            step = interrupt;
            run4(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error2);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step(error2)), attempts, interrupt);
              }
              status = RETURN;
              step = null;
              fail = null;
              run4(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error2);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step = null;
              fail = null;
            }
        }
        return canceler;
      };
    }
    function join3(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run4(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join: join3,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run4(runTick);
            });
          } else {
            run4(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error2, par2, cb2) {
      var step = par2;
      var head = null;
      var tail = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step.tag) {
            case FORKED:
              if (step._3 === EMPTY) {
                tmp = fibers[step._1];
                kills2[count++] = tmp.kill(error2, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head === null) {
                break loop;
              }
              step = head._2;
              if (tail === null) {
                head = null;
              } else {
                head = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step = step._2;
              break;
            case APPLY:
            case ALT:
              if (head) {
                tail = new Aff2(CONS, head, tail);
              }
              head = step;
              step = step._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join3(result, head, tail) {
      var fail, step, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail = result;
        step = null;
      } else {
        step = result;
        fail = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head === null) {
            cb(fail || step)();
            return;
          }
          if (head._3 !== EMPTY) {
            return;
          }
          switch (head.tag) {
            case MAP:
              if (fail === null) {
                head._3 = util.right(head._1(util.fromRight(step)));
                step = head._3;
              } else {
                head._3 = fail;
              }
              break;
            case APPLY:
              lhs = head._1._3;
              rhs = head._2._3;
              if (fail) {
                head._3 = fail;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join3(fail, null, null);
                    } else {
                      join3(fail, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head._3 = step;
              }
              break;
            case ALT:
              lhs = head._1._3;
              rhs = head._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail = step === lhs ? rhs : lhs;
                step = null;
                head._3 = fail;
              } else {
                head._3 = step;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join3(step, null, null);
                    } else {
                      join3(step, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
    }
    function resolve(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join3(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run4() {
      var status = CONTINUE;
      var step = par;
      var head = null;
      var tail = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step.tag) {
                case MAP:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(MAP, step._1, EMPTY, EMPTY);
                  step = step._2;
                  break;
                case APPLY:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(APPLY, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                case ALT:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(ALT, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step;
                  step = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head === null) {
                break loop;
              }
              if (head._1 === EMPTY) {
                head._1 = step;
                status = CONTINUE;
                step = head._2;
                head._2 = EMPTY;
              } else {
                head._2 = step;
                step = head;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
      root = step;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error2, cb2) {
      interrupt = util.left(error2);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error2, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler2;
          };
        });
      };
    }
    run4();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential2(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler2;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
function _parAffMap(f) {
  return function(aff) {
    return Aff.ParMap(f, aff);
  };
}
function _parAffApply(aff1) {
  return function(aff2) {
    return Aff.ParApply(aff1, aff2);
  };
}
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output/Effect.Exception/foreign.js
function error(msg) {
  return new Error(msg);
}

// output/Effect.Class/index.js
var monadEffectEffect = {
  liftEffect: /* @__PURE__ */ identity(categoryFn),
  Monad0: function() {
    return monadEffect;
  }
};
var liftEffect = function(dict) {
  return dict.liftEffect;
};

// output/Control.Parallel.Class/index.js
var sequential = function(dict) {
  return dict.sequential;
};
var parallel = function(dict) {
  return dict.parallel;
};

// output/Control.Parallel/index.js
var identity5 = /* @__PURE__ */ identity(categoryFn);
var parTraverse_ = function(dictParallel) {
  var sequential2 = sequential(dictParallel);
  var parallel3 = parallel(dictParallel);
  return function(dictApplicative) {
    var traverse_3 = traverse_(dictApplicative);
    return function(dictFoldable) {
      var traverse_1 = traverse_3(dictFoldable);
      return function(f) {
        var $51 = traverse_1(function($53) {
          return parallel3(f($53));
        });
        return function($52) {
          return sequential2($51($52));
        };
      };
    };
  };
};
var parSequence_ = function(dictParallel) {
  var parTraverse_1 = parTraverse_(dictParallel);
  return function(dictApplicative) {
    var parTraverse_2 = parTraverse_1(dictApplicative);
    return function(dictFoldable) {
      return parTraverse_2(dictFoldable)(identity5);
    };
  };
};

// output/Effect.Aff/index.js
var $runtime_lazy2 = function(name2, moduleName, init2) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init2();
    state2 = 2;
    return val;
  };
};
var $$void2 = /* @__PURE__ */ $$void(functorEffect);
var functorParAff = {
  map: _parAffMap
};
var functorAff = {
  map: _map
};
var ffiUtil = /* @__PURE__ */ function() {
  var unsafeFromRight = function(v) {
    if (v instanceof Right) {
      return v.value0;
    }
    ;
    if (v instanceof Left) {
      return unsafeCrashWith("unsafeFromRight: Left");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
  };
  var unsafeFromLeft = function(v) {
    if (v instanceof Left) {
      return v.value0;
    }
    ;
    if (v instanceof Right) {
      return unsafeCrashWith("unsafeFromLeft: Right");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
  };
  var isLeft = function(v) {
    if (v instanceof Left) {
      return true;
    }
    ;
    if (v instanceof Right) {
      return false;
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
  };
  return {
    isLeft,
    fromLeft: unsafeFromLeft,
    fromRight: unsafeFromRight,
    left: Left.create,
    right: Right.create
  };
}();
var makeFiber = function(aff) {
  return _makeFiber(ffiUtil, aff);
};
var launchAff = function(aff) {
  return function __do() {
    var fiber = makeFiber(aff)();
    fiber.run();
    return fiber;
  };
};
var launchAff_ = function($75) {
  return $$void2(launchAff($75));
};
var applyParAff = {
  apply: _parAffApply,
  Functor0: function() {
    return functorParAff;
  }
};
var monadAff = {
  Applicative0: function() {
    return applicativeAff;
  },
  Bind1: function() {
    return bindAff;
  }
};
var bindAff = {
  bind: _bind,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var applicativeAff = {
  pure: _pure,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
  return {
    apply: ap(monadAff),
    Functor0: function() {
      return functorAff;
    }
  };
});
var applyAff = /* @__PURE__ */ $lazy_applyAff(73);
var pure2 = /* @__PURE__ */ pure(applicativeAff);
var parallelAff = {
  parallel: unsafeCoerce2,
  sequential: _sequential,
  Apply0: function() {
    return applyAff;
  },
  Apply1: function() {
    return applyParAff;
  }
};
var parallel2 = /* @__PURE__ */ parallel(parallelAff);
var applicativeParAff = {
  pure: function($76) {
    return parallel2(pure2($76));
  },
  Apply0: function() {
    return applyParAff;
  }
};
var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableArray);
var semigroupCanceler = {
  append: function(v) {
    return function(v1) {
      return function(err) {
        return parSequence_2([v(err), v1(err)]);
      };
    };
  }
};
var monadEffectAff = {
  liftEffect: _liftEffect,
  Monad0: function() {
    return monadAff;
  }
};
var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure2(unit));
var monoidCanceler = {
  mempty: nonCanceler,
  Semigroup0: function() {
    return semigroupCanceler;
  }
};

// output/GJS/foreign.js
var argv = ARGV;
var log2 = (msg) => () => console.log(msg);

// output/GLib/foreign.js
import GLib from "gi://GLib";
var timeoutAdd = (interval) => (cb) => () => GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, cb);
var sourceRemove = (source2) => () => GLib.source_remove(source2);

// output/Data.Nullable/foreign.js
var nullImpl = null;
function notNull(x) {
  return x;
}

// output/Data.Nullable/index.js
var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);

// output/GLib.MainLoop/foreign.js
import GLib2 from "gi://GLib";
var new_ = () => GLib2.MainLoop.new(null, false);
var run3 = (loop) => () => loop.run();
var quit = (loop) => () => loop.quit();

// output/Gio.Async/foreign.js
import GLib3 from "gi://GLib";

// output/GLib.MainLoop/index.js
var $$new2 = new_;

// output/Gio.Raw.File/foreign.js
import Gio from "gi://Gio";
var File = Gio.File;
var ByteArray = imports.byteArray;
var new_for_path = (path) => () => File.new_for_path(path);
var load_contents_async_impl = (file) => (cancellable) => (cb) => () => file.load_contents_async(
  cancellable,
  (obj, result) => cb(obj)(result)()
);
var load_contents_finish_impl = (mkTuple) => (file) => (res) => () => {
  let [ok, contents, etag_out] = file.load_contents_finish(res);
  return mkTuple(ok)(contents)(etag_out);
};
var contentsToString = (arr) => ByteArray.toString(arr);

// output/Data.Tuple.Nested/index.js
var tuple3 = function(a) {
  return function(b) {
    return function(c) {
      return new Tuple(a, new Tuple(b, new Tuple(c, unit)));
    };
  };
};

// output/Gio.Raw.File/index.js
var load_contents_finish = /* @__PURE__ */ load_contents_finish_impl(tuple3);
var load_contents_async = function(file) {
  return function(cancellable) {
    return function(cb) {
      return load_contents_async_impl(file)(toNullable(cancellable))(cb);
    };
  };
};

// output/Gio.File/index.js
var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectEffect);
var mempty2 = /* @__PURE__ */ mempty(monoidCanceler);
var readFile = function(path) {
  var runEffect = function(done) {
    var cb = function(obj) {
      return function(res) {
        return function __do() {
          var v = load_contents_finish(obj)(res)();
          if (v.value0) {
            return done(new Right(contentsToString(v.value1.value0)))();
          }
          ;
          return done(new Left(error("Oops")))();
        };
      };
    };
    return function __do() {
      var file = liftEffect2(new_for_path(path))();
      liftEffect2(load_contents_async(file)(Nothing.value)(cb))();
      return mempty2;
    };
  };
  return makeAff(runEffect);
};

// output/Gnome.UI.Main.Panel/foreign.js
import * as Main from "resource:///org/gnome/shell/ui/main.js";
var addToStatusArea = (role) => (indicator) => () => Main.panel.addToStatusArea(role, indicator);

// output/Gnome.UI.PanelMenu/foreign.js
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as BoxPointer from "resource:///org/gnome/shell/ui/boxpointer.js";
var newButton = (alignment) => (name2) => (dontCreateMenu) => () => new PanelMenu.Button(alignment, name2, dontCreateMenu);

// output/St.BoxLayout/foreign.js
import St from "gi://St";
var new_2 = () => St.BoxLayout.new();

// output/St.BoxLayout/index.js
var $$new3 = new_2;

// output/St.Label/foreign.js
import St2 from "gi://St";
var new_3 = (txt) => () => St2.Label.new(txt);
var set_text = (label) => (txt) => () => label.set_text(txt);

// output/St.Label/index.js
var $$new4 = new_3;

// output/Data.Number.Format/foreign.js
function wrap2(method) {
  return function(d) {
    return function(num) {
      return method.apply(num, [d]);
    };
  };
}
var toPrecisionNative = wrap2(Number.prototype.toPrecision);
var toFixedNative = wrap2(Number.prototype.toFixed);
var toExponentialNative = wrap2(Number.prototype.toExponential);
function toString(num) {
  return num.toString();
}

// output/Data.Number.Format/index.js
var clamp2 = /* @__PURE__ */ clamp(ordInt);
var Precision = /* @__PURE__ */ function() {
  function Precision2(value0) {
    this.value0 = value0;
  }
  ;
  Precision2.create = function(value0) {
    return new Precision2(value0);
  };
  return Precision2;
}();
var Fixed = /* @__PURE__ */ function() {
  function Fixed2(value0) {
    this.value0 = value0;
  }
  ;
  Fixed2.create = function(value0) {
    return new Fixed2(value0);
  };
  return Fixed2;
}();
var Exponential = /* @__PURE__ */ function() {
  function Exponential2(value0) {
    this.value0 = value0;
  }
  ;
  Exponential2.create = function(value0) {
    return new Exponential2(value0);
  };
  return Exponential2;
}();
var toStringWith = function(v) {
  if (v instanceof Precision) {
    return toPrecisionNative(v.value0);
  }
  ;
  if (v instanceof Fixed) {
    return toFixedNative(v.value0);
  }
  ;
  if (v instanceof Exponential) {
    return toExponentialNative(v.value0);
  }
  ;
  throw new Error("Failed pattern match at Data.Number.Format (line 59, column 1 - line 59, column 43): " + [v.constructor.name]);
};
var fixed = /* @__PURE__ */ function() {
  var $9 = clamp2(0)(20);
  return function($10) {
    return Fixed.create($9($10));
  };
}();

// output/CgroupMetric/index.js
var foldM2 = /* @__PURE__ */ foldM(monadEither);
var prettyTasks = function(tasks) {
  return toString(tasks) + " tasks";
};
var prettyMem = function(mem) {
  var units = [{
    name: "MB",
    sz: 1024
  }, {
    name: "GB",
    sz: 1024
  }, {
    name: "max",
    sz: 0
  }];
  var go = function(acc) {
    return function(nextUnit) {
      if (nextUnit.sz === 0 || acc.value < nextUnit.sz) {
        return new Left(toStringWith(fixed(3))(acc.value) + (" " + acc.unit));
      }
      ;
      if (otherwise) {
        return new Right({
          value: acc.value / nextUnit.sz,
          unit: nextUnit.name
        });
      }
      ;
      throw new Error("Failed pattern match at CgroupMetric (line 37, column 3 - line 37, column 133): " + [acc.constructor.name, nextUnit.constructor.name]);
    };
  };
  return fromLeft("N/A")(foldM2(go)({
    value: mem / 1024,
    unit: "KB"
  })(units));
};
var prettyCpuTime = function(cpu) {
  var units = [{
    name: "msec",
    sz: 1e3
  }, {
    name: "sec",
    sz: 1e3
  }, {
    name: "min",
    sz: 60
  }, {
    name: "hour",
    sz: 60
  }, {
    name: "max",
    sz: 0
  }];
  var go = function(acc) {
    return function(nextUnit) {
      if (nextUnit.sz === 0 || acc.value < nextUnit.sz) {
        return new Left(toStringWith(fixed(3))(acc.value) + (" " + acc.unit));
      }
      ;
      if (otherwise) {
        return new Right({
          value: acc.value / nextUnit.sz,
          unit: nextUnit.name
        });
      }
      ;
      throw new Error("Failed pattern match at CgroupMetric (line 23, column 3 - line 23, column 133): " + [acc.constructor.name, nextUnit.constructor.name]);
    };
  };
  return fromLeft("N/A")(foldM2(go)({
    value: cpu,
    unit: "usec"
  })(units));
};

// output/Gio.Raw.Subprocess/foreign.js
import Gio2 from "gi://Gio";
var Subprocess = Gio2.Subprocess;
var new_4 = (argv2) => (flags) => () => Subprocess.new(argv2, flags);
var communicate_utf8_async_impl = (proc) => (stdin) => (cancellable) => (cb) => () => proc.communicate_utf8_async(
  stdin,
  cancellable,
  (obj, result) => cb(obj)(result)()
);
var communicate_utf8_finish_impl = (mkTuple) => (proc) => (res) => () => {
  let [ok, stdout, stderr] = proc.communicate_utf8_finish(res);
  return mkTuple(ok)(stdout)(stderr);
};

// output/Gio.Raw.Subprocess/index.js
var $$new5 = new_4;
var communicate_utf8_finish = /* @__PURE__ */ communicate_utf8_finish_impl(tuple3);
var communicate_utf8_async = function(proc) {
  return function(stdin) {
    return function(cancellable) {
      return function(cb) {
        return communicate_utf8_async_impl(proc)(toNullable(stdin))(toNullable(cancellable))(cb);
      };
    };
  };
};

// output/Gio.Raw.SubprocessFlags/foreign.js
import Gio3 from "gi://Gio";
var SubprocessFlags = Gio3.SubprocessFlags;
var none = SubprocessFlags.NONE;
var stdin_pipe = SubprocessFlags.STDIN_PIPE;
var stdout_pipe = SubprocessFlags.STDOUT_PIPE;

// output/Gio.Subprocess/index.js
var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectEffect);
var mempty3 = /* @__PURE__ */ mempty(monoidCanceler);
var cmd = function(argv2) {
  var runEffect = function(done) {
    var cb = function(obj) {
      return function(res) {
        return function __do() {
          var v = communicate_utf8_finish(obj)(res)();
          if (v.value0) {
            return done(new Right(v.value1.value0))();
          }
          ;
          return done(new Left(error("Oops")))();
        };
      };
    };
    return function __do() {
      var proc = liftEffect3($$new5(argv2)(stdout_pipe))();
      liftEffect3(communicate_utf8_async(proc)(Nothing.value)(Nothing.value)(cb))();
      return mempty3;
    };
  };
  return makeAff(runEffect);
};

// output/SystemdTop/index.js
var map4 = /* @__PURE__ */ map(functorAff);
var join2 = /* @__PURE__ */ join(bindMaybe);
var map1 = /* @__PURE__ */ map(functorMaybe);
var bind2 = /* @__PURE__ */ bind(bindMaybe);
var discard2 = /* @__PURE__ */ discard(discardUnit)(bindMaybe);
var guard2 = /* @__PURE__ */ guard(alternativeMaybe);
var pure3 = /* @__PURE__ */ pure(applicativeMaybe);
var Cpu = /* @__PURE__ */ function() {
  function Cpu2() {
  }
  ;
  Cpu2.value = new Cpu2();
  return Cpu2;
}();
var Memory = /* @__PURE__ */ function() {
  function Memory2() {
  }
  ;
  Memory2.value = new Memory2();
  return Memory2;
}();
var runCgTop = function(order) {
  var orderArg = function() {
    if (order instanceof Cpu) {
      return "--order=cpu";
    }
    ;
    if (order instanceof Memory) {
      return "--order=memory";
    }
    ;
    throw new Error("Failed pattern match at SystemdTop (line 23, column 14 - line 25, column 31): " + [order.constructor.name]);
  }();
  var cmd2 = cmd(["systemd-cgtop", orderArg, "--cpu=time", "-1", "--depth=10", "-P", "--raw"]);
  return map4(lines)(cmd2);
};
var prettyCgroupInfo = function(cg) {
  return cg.name + (": " + (prettyTasks(cg.tasks) + (" " + (prettyCpuTime(cg.cpu) + (" " + prettyMem(cg.mem))))));
};
var getNumber = function(arr) {
  return function(pos) {
    return join2(map1(fromString)(index(arr)(pos)));
  };
};
var parse = /* @__PURE__ */ function() {
  var pretty = function(path) {
    return last(split("/")(path));
  };
  var isGlobalScope = function(path) {
    return endsWith(".slice")(path) || (endsWith("/container")(path) || endsWith("user@1000.service")(path));
  };
  var go = function(xs) {
    return bind2(index(xs)(0))(function(path) {
      return bind2(getNumber(xs)(1))(function(tasks) {
        return bind2(getNumber(xs)(2))(function(cpu) {
          return bind2(getNumber(xs)(3))(function(mem) {
            return discard2(guard2(!isGlobalScope(path)))(function() {
              return bind2(pretty(path))(function(name2) {
                return pure3({
                  name: name2,
                  tasks,
                  cpu,
                  mem
                });
              });
            });
          });
        });
      });
    });
  };
  return mapMaybe(function($13) {
    return go(words($13));
  });
}();

// output/CgroupMonitor/index.js
var bind3 = /* @__PURE__ */ bind(bindAff);
var map5 = /* @__PURE__ */ map(functorAff);
var pure4 = /* @__PURE__ */ pure(applicativeAff);
var map12 = /* @__PURE__ */ map(functorMaybe);
var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
var pure1 = /* @__PURE__ */ pure(applicativeEffect);
var show2 = /* @__PURE__ */ show(showInt);
var add_child2 = /* @__PURE__ */ add_child()();
var set_y_align2 = /* @__PURE__ */ set_y_align();
var $$void3 = /* @__PURE__ */ $$void(functorEffect);
var onButtonPressEvent2 = /* @__PURE__ */ onButtonPressEvent();
var destroy2 = /* @__PURE__ */ destroy();
var getAvailableMemory = /* @__PURE__ */ function() {
  var toGB = function(n) {
    return n / (1024 * 1024);
  };
  return bind3(map5(words)(readFile("/proc/meminfo")))(function(meminfo) {
    return pure4(map12(function($29) {
      return round2(toGB($29));
    })(getNumber(meminfo)(7)));
  });
}();
var main = /* @__PURE__ */ function() {
  if (argv.length === 1 && argv[0] === "--run") {
    var go = function(loop) {
      return bind3(map5(fromMaybe(0))(getAvailableMemory))(function(availMem) {
        return bind3(map5(parse)(runCgTop(Memory.value)))(function(cgTop) {
          return liftEffect4(function __do() {
            log2(availMem)();
            traverse_2(function($30) {
              return log2(prettyCgroupInfo($30));
            })(take(10)(cgTop))();
            return quit(loop)();
          });
        });
      });
    };
    return function __do() {
      var loop = $$new2();
      launchAff_(go(loop))();
      return run3(loop)();
    };
  }
  ;
  return pure1(mempty(monoidUnit));
}();
var worker = function(label) {
  return function __do() {
    log2("running...")();
    launchAff_(bind3(getAvailableMemory)(function(avail) {
      return liftEffect4(function() {
        if (avail instanceof Just) {
          return set_text(label)(show2(avail.value0) + " GB");
        }
        ;
        if (avail instanceof Nothing) {
          return set_text(label)("N/A GB");
        }
        ;
        throw new Error("Failed pattern match at CgroupMonitor (line 39, column 18 - line 41, column 47): " + [avail.constructor.name]);
      }());
    }))();
    return true;
  };
};
var extension = /* @__PURE__ */ function() {
  var onClick = function __do() {
    log2("clicked!")();
    return true;
  };
  var extension_enable = function __do() {
    var button = newButton(0)("CgroupMonitor")(false)();
    var box = $$new3();
    var label = $$new4("test")();
    add_child2(box)(label)();
    add_child2(button)(box)();
    set_y_align2(label)(center)();
    addToStatusArea("CgroupMonitor")(button)();
    $$void3(onButtonPressEvent2(button)(function(v) {
      return function(v1) {
        return onClick;
      };
    }))();
    $$void3(worker(label))();
    var timer = timeoutAdd(5e3)(worker(label))();
    return {
      button,
      timer
    };
  };
  var extension_disable = function(env) {
    return function __do() {
      destroy2(env.button)();
      return sourceRemove(env.timer)();
    };
  };
  return {
    extension_enable,
    extension_disable
  };
}();

// necessary footer to transform a spago build into a valid gnome extension
let CgroupMonitorEnv = null;
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
export default class CgroupMonitor extends Extension {
  enable() { CgroupMonitorEnv = extension.extension_enable(); }
  disable() { extension.extension_disable(CgroupMonitorEnv)(); }
}
