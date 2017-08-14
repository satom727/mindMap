$(document).ready(function () {
var contentCnt = 0,
    lineCnt = 0,
    dragFlg = false,
    lineFlg = false,
    area = document.getElementById('area'),
    canvas = document.getElementById('screen'),
    ctx = canvas.getContext('2d'),
    btn = document.getElementById('btn'),
    // areaX = chkNum(removePX(area.style.left)),
    areaX = area.offsetLeft,
    // areaY = chkNum(removePX(area.style.top)),
    areaY = area.offsetTop,
    content,
    contentX,
    contentY,
    mousedownX,
    mousedownY,
    lineArr = [],
    contentArr = [],
    contentIdMap = {};



//content object
var ContentObj = function(){
	this.lineBgnX = 0;
	this.lineBgnY = 0;
	this.lineEndX = 0;
	this.lineEndY = 0;
	this.lineBgnArr = [];
	this.lineEndArr = [];
	this.bgnObjCnt = 0;
	this.endObjCnt = 0;
	this.contentDOM;
};

ContentObj.prototype = {
	init:function(){
		var objX = chkNum(this.contentDOM.offsetLeft);
		// var objX = chkNum(removePX(this.contentDOM.style.left));
		var objY = chkNum(this.contentDOM.offsetTop);
		// var objY = chkNum(removePX(this.contentDOM.style.top));
		this.lineBgnX = objX + 108;
		this.lineBgnY = objY + 80;
		this.lineEndX = objX + 8;
		this.lineEndY = objY + 80;
	},
	setBgnLine:function(obj){
		this.lineBgnArr[this.bgnObjCnt] = obj;
		this.lineBgnArr[this.bgnObjCnt].setContentBgnPoint(this.lineBgnX,this.lineBgnY);
		this.bgnObjCnt++;
	},
	setEndLine:function(obj){
		this.lineEndArr[this.endObjCnt] = obj;
		this.lineEndArr[this.endObjCnt].setContentEndPoint(this.lineEndX,this.lineEndY);
		this.endObjCnt++;
	},
	setBgnObj:function(){
		for(var i=0;i < this.bgnObjCnt;i++){
			this.lineBgnArr[i].setContentBgnPoint(this.lineBgnX,this.lineBgnY);
		}
	},
	setEndObj:function(){
		for(var i=0;i < this.endObjCnt;i++){
			this.lineEndArr[i].setContentEndPoint(this.lineEndX,this.lineEndY);
		}
	},
	childLineDraw:function(){
		for(var i=0;i < this.endObjCnt;i++){
			this.lineEndArr[i].draw();
		}
	},
	refresh:function(obj){
                //始点終点の設定
                this.init();
                //始点登録オブジェクトの始点更新
                this.setBgnObj();
                //終点登録オブジェクトの終点更新
                this.setEndObj();
            }
        };
//line object
var ContentLine = function(){
	this.bgnX = 0;
	this.bgnY = 0;
	this.endX = null;
	this.endY = null;
};
ContentLine.prototype = {
	draw:function(){
		ctx.beginPath();
		ctx.fillStyle = '#FFFFFF';
		ctx.moveTo((this.bgnX-areaX),(this.bgnY-areaY));
		ctx.lineTo(this.endX-areaX,this.endY-areaY);
		ctx.stroke();
	},
	setContentBgnPoint:function(x,y){
		this.bgnX = x;
		this.bgnY = y;
              //  lineFlg = true;
          },
          setContentEndPoint:function(x,y){
          	this.endX = x;
          	this.endY = y;
                //lineFlg = false;
            }
     };
//add event
btn.addEventListener('click',function(){
	var tag = document.createElement('div');
	tag.setAttribute('id','tag_'+contentCnt);
	tag.setAttribute('class','tags');
	tag.style.top = '0px';
	tag.style.left= '0px';
	tag.addEventListener('mousemove',function(e){
		console.log('move');
		if(dragFlg){
			contentArr[contentIdMap[this.id]].refresh();
			this.style.left = contentX +(chkNum(e.clientX)-chkNum(mousedownX)) + 'px';
			this.style.top =  contentY+(chkNum(e.clientY)-chkNum(mousedownY)) + 'px';
			ctx.clearRect(0, 0, 500, 500);
			for(var i=0;i<lineCnt;i++){
				lineArr[i].draw();
			}
		}
	},false);
	tag.addEventListener('mouseleave',function(e){
		console.log('leave');
			dragFlg = false;
		if(dragFlg){
		}
	},false);
	tag.addEventListener('mousedown',function(e){
		console.log('down');
		dragFlg = true;
		mousedownX = e.clientX;
		mousedownY = e.clientY;
		content = this;
		// contentX = chkNum(removePX(content.style.left));
		contentX = content.offsetLeft;
		// contentY = chkNum(removePX(content.style.top));
		contentY = content.offsetTop;
	},false);
	tag.addEventListener('mouseup',function(){
		console.log('up');
		dragFlg = false;
	},false);
	tag.addEventListener('dblclick',function(e){
		console.log('dbl');
		dragFlg = false;
		if(!lineFlg){
			lineArr[lineCnt] = new ContentLine();
			contentArr[contentIdMap[this.id]].setBgnLine( lineArr[lineCnt]);
			lineFlg = true;
            tag.classList.add('selected');
		}else{
			contentArr[contentIdMap[this.id]].setEndLine(lineArr[lineCnt]);
			contentArr[contentIdMap[this.id]].childLineDraw();
			lineCnt ++;
			lineFlg = false;
            removeClass('selected');
		}
	},false);
	contentArr[contentCnt] = new ContentObj();
	contentArr[contentCnt].contentDOM = tag;
	contentIdMap[tag.id] = contentCnt;
	area.appendChild(contentArr[contentCnt].contentDOM);
	contentArr[contentCnt].init();
	contentCnt++;
},false);
//util
function removePX(txt) {
	return txt.replace('px','');
}
function chkNum(txt){
	var n = parseInt(txt);
	return isNaN(n) ? 0 : n;
}
function removeClass(nm){
    var list = document.getElementsByClassName(nm);
    var listlen = list.length;
    for(var i = 0;i<listlen;i++){
        list[i].classList.remove(nm);
    }
}
});