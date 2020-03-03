function LikeVue (options) {
  this._data = options.data;
  this._el = options.el
  this.$el = this._templateDOM = document.querySelector(this._el);
  this._parent = this._templateDOM.parentNode;
  this.render()
}

// 递归遍历节点替换值
function compiler (template, data) {
  // 正则匹配{{}}
  const bracketReg = /\{\{(.+?)\}\}/g;
  let childNodes  = template.childNodes; 
  // 循环节点
  for(let i = 0; i < childNodes.length; i++){
    let  type = childNodes[i].nodeType;
    // 文本节点
    if(type === 3){
      let txt = childNodes[i].nodeValue;

      txt = txt.replace(bracketReg, function (_, g) {
        let key = g.trim();
        let value = data[key];
        return value;
      })

      childNodes[i].nodeValue = txt
    } else if(type === 1) { // 元素
      compiler(childNodes[i], data);
    }
  }
}

LikeVue.prototype.render = function () {
  this.compiler();
}

LikeVue.prototype.compiler = function () {
  // 获得真正的节点
  let realHTMLDOM = this._templateDOM.cloneNode(true);
  compiler(realHTMLDOM,this._data);
  this.update(realHTMLDOM)
}

LikeVue.prototype.update = function (real) {
  // 替换
  this._parent.replaceChild(real,document.querySelector('#root'))
}

let app = new LikeVue({
  el:'#root',
  data: {
    name:'Taotao',
    message:'Hello'
  }
})