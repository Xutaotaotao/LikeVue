function LikeVue (options) {
  this._data = options.data;
  this._el = options.el;
  this.$el = this._templateDOM = document.querySelector(this._el);
  this._parent = this._templateDOM.parentNode;
  this.render();
}

// traverse node replace valuse
function compiler (template, data) {
  // Regular match{{}}
  const bracketReg = /\{\{(.+?)\}\}/g;
  let childNodes  = template.childNodes;
  // loop nodes
  for(let i = 0; i < childNodes.length; i++){
    let  type = childNodes[i].nodeType;
    // text  node
    if(type === 3){
      let txt = childNodes[i].nodeValue;

      txt = txt.replace(bracketReg, function (_, g) {
        let path = g.trim();
        let value = getValueByPath(data, path);
        return value;
      });

      childNodes[i].nodeValue = txt;
    } else if(type === 1) { // element
      compiler(childNodes[i], data);
    }
  }
}

function getValueByPath (obj, path) {
  let paths = path.split('.');
  let res = obj;
  let prop = paths.shift();
  while (prop){
    res = res[prop];
    prop = paths.shift();
  }
  return res;
}

// function createGetValueByPath (path) {
//   let paths = path.split('.');
//   return function getValueByPath (obj) {
//     let res = obj;
//     let prop = paths.shift();
//     while (prop){
//       res = res[prop];
//       prop = paths.shift();
//     }
//     return res;
//   };
// }
LikeVue.prototype.render = function () {
  this.compiler();
};

LikeVue.prototype.compiler = function () {
  // get the real node
  let realHTMLDOM = this._templateDOM.cloneNode(true);
  compiler(realHTMLDOM,this._data);
  this.update(realHTMLDOM);
};

LikeVue.prototype.update = function (real) {
  // replace
  this._parent.replaceChild(real,document.querySelector('#root'));
};

