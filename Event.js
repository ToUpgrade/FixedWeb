
		//人机交互事件
		//键盘事件
		var downFunctions=new Array();
		var upFunctions=new Array();
			//toggle——第一层
			$.fn.setHalfKey=function(id,keyCode,fun1,fun2){
				var _this=$(this);
				_this.setKeyDown(id,keyCode,function(){fun1();_this.removeKeyDown(id);});
				_this.setKeyUp(id,keyCode,function(){fun2();_this.setKeyDown(id,keyCode,function(){fun1();_this.removeKeyDown(id);});});
			}
			$.fn.removeHalfKey=function(id){
				$(this).removeKeyDown(id+"hk");
				$(this).removeKeyUp(id+"hk");
			}
			// 第二层toggle:keyup;
			// 第三层
			
			//绑定/删除指定按键事件
			$.fn.setKeyDown=function(id,keyCode,fun){
				downFunctions[id]=function(e){
					if(e.keyCode==keyCode){fun();}
				}
				$(this).keydown(downFunctions[id]);
			}
			$.fn.removeKeyDown=function(id){
				if(downFunctions[id]){
					$(this).unbind("keydown",downFunctions[id]);
				}
				
			}
			$.fn.setKeyUp=function(id,keyCode,fun){
				upFunctions[id]=function(e){
					if(e.keyCode==keyCode){fun();}
				}
				$(this).keyup(upFunctions[id]);
			}
			$.fn.removeKeyUp=function(id){
				if(upFunctions[id]){
					$(this).unbind("keyup",upFunctions[id]);
				}
			}
				//绑定任务型组合按键（以任务为单位删除或添加热键）------主要用于：用户调用写好的功能
				//得到按键事件单；
				getKeyList=function(){
					var list=[downFunctions,upFunctions];
					return list;
				}
				//综合  以事件为主的 热键控制
				types=new Array();
				hotKeys=new Array();
				//
				types[0]="tog";
				types[1]="cons";
				
				//
				$.fn.setHotKey=function(key){
					var _this=this;
					if(!(key.type&&key.code&&key.name)){
						console.log("erro:jq-plug-my.js:keySetter.setHotKey({must!(string/num/string/bollean)avilable(/fun/fun)})");
						return;
					}
					if(typeof key.type!="string"||typeof key.name!="string"){
						console.log("erro:jq-plug-my.js:keySetter.setHotKey({string/num/string/fun/fun})");
						return;
					}//组合键
					if(typeof key.code=="object"){
						var state=new Array();
						hotKeys[key.name]=key.code;
						_this.setHalfKey(
							key.name+"_0",
							key.code[0],
							function(){
								state[0]=1;
							},
							function(){
								state[0]=0;
								
							}
						);
						_this.setHalfKey(
							key.name+"_1",
							key.code[1],
							function(){
								if(state[0]==1){if(key.down){key.down(_this);}}
							},
							function(){
								if(state[0]==1){if(key.up){key.up(_this);};}
							}
						);
						
						//单键
					}else{$(types).each(function(i,val){
						if(val==key.type){
							hotKeys[key.name]=key.code
							switch(i){
								case 0:
									_this.setHalfKey(
										key.name,
										key.code,
										function(){
											if(key.down){key.down({_this,key});}
										},
										function(){
											if(key.up){key.up({_this,key});}
										}
									);
									break;
								case 1:
								
									break;
							}
							
						}
					});}
					
				}
				$.fn.removeHotKey=function(name){
					var _this=this;
					if(name){
						_this.removeKeyDown(name+"_0");
						_this.removeKeyUp(name+"_0");
						_this.removeKeyUp(name+"_1");
						_this.removeKeyDown(name+"_1");
						_this.removeKeyDown(name);
						_this.removeKeyUp(name);
					}else{
						_this.unbind("keydown");
						_this.unbind("keyup");
					}
				}
			//鼠标事件
			
			//拖动事件
			
			// 内部交互事件
			
			// 感应框2d（确定交互对象）
				// setCollideLine(div);//传入div对象
				// setMornitors(collide_Line,x);//x为检测强度即检测距离；
				// drawCollideLine([,],[,]);//起始/结束坐标；  由管理器统一管理；
				// getBorder(div);//得到div的逻辑框
				// 碰撞交互
				
					// 获取检测线
					$.fn.getStickyLine=function (){
						var x1=10;
						this.getRBorder();
						this.stickyLeft=[this.rLeft-x1,this.rLeft+x1];
						this.stickyRight=[this.rRight-x1,this.rRight+x1];
						this.stickyTop=[this.rTop-x1,this.rTop+x1];
						this.stickyBelow=[this.rBelow-x1,this.rBelow+x1];
					}
					//画出检测线
					$.fn.drawStickyLine=function(pen){
						p=this.parent();
						this.getBorder();
						p.getBorder();
						pen.moveTo(this.left-1,p.top);pen.lineTo(this.left-1,p.below);	
						pen.moveTo(this.right+1,p.top);pen.lineTo(this.right+1,p.below);
						pen.moveTo(p.left,this.top-1);pen.lineTo(p.right,this.top-1);
						pen.moveTo(p.left,this.below+1);pen.lineTo(p.right,this.below+1);//1坐标放大效果	
						pen.stroke();
					}
				
			
		// 画板扩充
		// 创建画布对象：
			// 创建指定大小的画布并初始化笔的参数：
			newCanvas=function(a,h,w,l){
				// create canvas
				var rightPass =true;
				var canvas = $("<canvas/>",{
				}).appendTo($("body"));
				// set canvas
				canvas.css("position","fixed");
				canvas.css("z-index",-100);
				if(l){
					canvas.css("z-index",l);
				}
				if(a&&h&&w){
					canvas.attr("width",w);
					canvas.attr("height",h);
					canvas.css("top",a[1]);
					canvas.css("left",a[0]);
				}else if(!a&&!h&&!w){
					canvas.attr("width",$(document).outerWidth(true));
					canvas.attr("height",$(document).outerHeight(true));
					canvas.css("top",0);
					canvas.css("left",0);
				}else{
					console.log("erro:$.newCanvas([x,y],height,width,(layer))/()");
					rightPass=false;
				}
				canvas.clean=function(){
					canvas[0].height=canvas[0].height;
				} 
				// set pen
				canvas.pen=canvas[0].getContext("2d");
				canvas.pen.draw=function (a,b){
					canvas.pen.moveTo(a[0],a[1]);
					canvas.pen.lineTo(b[0],b[1]);
					canvas.pen.stroke();
					
				}
				canvas.pen.strokeDiv=function(div){
					div.getBorder();
					canvas.pen.rect(div.left,div.top,div.outerWidth(true),div.outerHeight(true));
					canvas.pen.strokeStyle="rgba(0,256,0,1)";
					canvas.pen.stroke();
				}
				if(rightPass){
					return canvas;
				}
			};
			
			var canvas=newCanvas();
			var pen=canvas.pen;
			
		//鼠标事件
			//定义以任务为对象的事件管理
			//通过 绑定 事物id 和 事件name 来绑定  即对此元素绑定此事件
		var mouseUpFuns=new Array();
		var mouseMoveFuns=new Array();
		var mouseOverFuns=new Array();
		var mouseOutFuns=new Array();
			$.fn.setMouseDown=function(id,fun){
				if(!this.data("mouseDownFuns")){
					this.data("mouseDownFuns",new Array);
				}
				if(id){this.data("mouseDownFuns")[id]=fun;}
				this.bind("mousedown",this.data("mouseDownFuns")[id]);
			};
			$.fn.removeMouseDown=function(id){
				if(this.data("mouseDownFuns")){
					if(this.data("mouseDownFuns")[id]){
						this.unbind("mousedown",this.data("mouseDownFuns")[id]);
					}
				}
			}
			$.fn.setMouseUp=function(id,fun){
				if(!this.data("mouseUpFuns")){
					this.data("mouseUpFuns",new Array);
				}
				if(id){this.data("mouseUpFuns")[id]=fun;}
				this.bind("mouseup",this.data("mouseUpFuns")[id]);
			};
			$.fn.removeMouseUp=function(id){
				if(this.data("mouseUpFuns")){
					if(this.data("mouseUpFuns")[id]){
						this.unbind("mouseup",this.data("mouseUpFuns")[id]);
					}
				}
			}
			$.fn.setMouseMove=function(id,fun){
				if(!this.data("mouseMoveFuns")){
					this.data("mouseMoveFuns",new Array);
				}
				if(id){this.data("mouseMoveFuns")[id]=fun;}
				this.bind("mousemove",this.data("mouseMoveFuns")[id]);
			};
			$.fn.removeMouseMove=function(id){
				if(this.data("mouseMoveFuns")){
					if(this.data("mouseMoveFuns")[id]){
						this.unbind("mousemove",this.data("mouseMoveFuns")[id]);
					}
				}
			}
			$.fn.setMouseOver=function(id,fun){
				if(!this.data("mouseOverFuns")){
					this.data("mouseOverFuns",new Array);
				}
				if(id){this.data("mouseOverFuns")[id]=fun;}
				this.bind("mouseover",this.data("mouseOverFuns")[id]);
			}
			$.fn.removeMouseOver=function(id){
				if(this.data("mouseOverFuns")){
					if(this.data("mouseOverFuns")[id]){
						this.unbind("mouseover",this.data("mouseOverFuns")[id]);
					}
				}
			}
			$.fn.setMouseOut=function(id,fun){
				if(!this.data("mouseOutFuns")){
					this.data("mouseOutFuns",new Array);
				}
				if(id){this.data("mouseOutFuns")[id]=fun;}
				this.bind("mouseout",this.data("mouseOutFuns")[id]);
			}
			$.fn.removeMouseOut=function(id){
				if(this.data("mouseOutFuns")){
					if(this.data("mouseOutFuns")[id]){
						this.unbind("mouseout",this.data("mouseOutFuns")[id]);
					}
				}
			}
			$.fn.removeMouse=function(id){
				this.removeMouseDown(id);
				this.removeMouseMove(id);
				this.removeMouseOut(id);
				this.removeMouseOver(id);
				this.removeClick(id);
			};
		
			
			//综合
		$.fn.setMouse=function(id,mouse){
			_this=this;
			if(mouse.down){
				setMouseDown(id,mouse.down);
			}else if(mouse.up){
				setMouseUp(id,mouse.up);
			}else if(mouse.over){
				setMouseOver(id,mouse.over);
			}else if(mouse.out){
				setMouseOut(id,mouse.out);
			}else if(mouse.move){
				setMouseMove(id,mouse.move);
			}else if(mouse){
				
			}else if(mouse){
				
			}
		};
		//hover事件模板
			$.fn.Hover=function(id,ev){
				var _this=this;
				this.setMouseOver(id,function(){
					if(ev.over){ev.over();}
				});
				this.setMouseOut(id,function(){
					if(ev.out){ev.out();}
				});
			}
		//click&&dbclick
		var dt=null;
			$.fn.click=function(fun){
				var _this=$(this);
				_this.setMouseUp("click",function(){
					
					if(fun){
						if(_this.hasEvent("dblClick")){
							clearTimeout(dt);
							dt=setTimeout(function(){
								fun();
							},200);
						}else{
							fun();
						}
						
					}

				});
					
				
			}
			$.fn.dblClick=function(fun){
				$(this).dblclick(function(){
					if(fun){
						clearTimeout(dt);
						fun();
					}
				});
			}
			$.fn.removeClick=function(sel){
				var _this=$(this);
				if(sel=="dblClick"){
					_this.unbind("dblclick");
				}else if(sel=="click"){
					_this.unbind("click");
				}else{
					_this.unbind("dblclick");
					_this.unbind("click");
				}
			}
		
		//拖拽事件模板
				var onX;
				var lx;
				var ly;
				var toX=true;
				var toY=true;
				
			$.fn.drag=function(id,fun){
				var _this=this;
				var start=true;
				var e=e||window.event;
				this.setMouseDown(id,function(e){
					if(e.which==1){
						var run=true;
						_this.removeMouseMove("before"+id);//debug strait drag
						_this.clickX=e.clientX;
						_this.clickY=e.clientY;
						_this.startX=e.clientX-_this.offset().left;
						_this.startY=e.clientY-_this.offset().top;
						_this.FX=_this.offset().left;
						_this.FY=_this.offset().top;
							//获取 限制范围
						if(fun.lim){
							var lim=fun.lim;
							var lr,ll,lu,ld;
							if(lim instanceof jQuery){
								lr=lim.width();
								ll=lim.offset().left;
								ld=lim.height();
								lu=lim.offset().top;
							}else{
								console.log("ok");
								lr=lim.lr;
								ll=lim.ll;
								ld=lim.ld;
								lu=lim.lu;
							}
						}
						if(fun.down){fun.down();}
						if(fun.beforeMove){
							start=false;
							_this.setMouseMove("before"+id,function(e){
								fun.beforeMove();
								_this.x=e.clientX-_this.startX;
								_this.y=e.clientY-_this.startY;
								_this.ry=Math.abs(_this.y-_this.offset().top);
								_this.rx=Math.abs(_this.x-_this.offset().left);
								if(_this.rx>=8||_this.ry>=8){fun.beforeMove();start=true;_this.removeMouseMove("before"+id);}	
							});
							
						}
					
						
						$(document).setMouseMove(id,function(e){
							_this.p=[e.clientX,e.clientY];
							_this.x=e.clientX-_this.startX;
							_this.y=e.clientY-_this.startY;
							_this.ry=Math.abs(_this.y-_this.offset().top);
							_this.rx=Math.abs(_this.x-_this.offset().left);
							_this.right=_this.x+_this.width();
							_this.below=_this.y+_this.height();
							if(fun.lim){
								lx=false;
								ly=false;
								if(_this.right>=lr){
									lx=true;
									_this.offset({left:lr-_this.width()});
									_this.x=_this.offset().left;
								}
								if(_this.x<=ll){
									lx=true;
									_this.offset({left:ll});
									_this.x=_this.offset().left;
								}
								if(_this.below>=ld){
									ly=true;
									_this.offset({top:ld-_this.height()});
									_this.y=_this.offset().top;
								}
								if(_this.y<=lu){
									ly=true;
									_this.offset({top:lu});
									_this.y=_this.offset().top;
								}
							}
							if(fun.move&&start){fun.move();}
						});
						$(document).bind("mouseup",function(){
							$(document).unbind("mousemove");;
							$(document).unbind("mouseup");																		////////////////////////////////////////
							if(fun.up){fun.up();}
						});
						return false;
					}
						
				});
			};
		//resize
			var rStraitOn=false;
			var equalRatio=false;
			$(window).setHotKey({
				type:"tog",
				code:17,
				name:"equalRatio",
				down:function(){equalRatio=true;},
				up:function(){equalRatio=false;}
			});
			$(window).setHotKey({
				type:"tog",
				code:17,
				name:"rStrait",
				down:function(){rStraitOn=true;},
				up:function(){rStraitOn=false;}
			});
			$.fn.resize=function(canvas){
				var _this=this;
				//hotKeys
				
				//添加模块
				this.getBorder();
				var vd=$("<div/>",{
					id:"resize",
					width:20,
					height:20,
				}).appendTo(this);
				//设置模块
				vd.css("position","absolute");
				vd.css("top",_this.height()-vd.height());
				vd.css("left",_this.width()-vd.width());
				vd.css("backgroundColor","rgb(0,256,0)");
				vd.css("z-index",100);
				//绑定事件
				vd.hover(function(){vd.css("cursor","nw-resize");});
				vd.drag("resize",{
					down:function(){
						_this.fLeft=_this.offset().left;
						_this.fTop=_this.offset().top;
						_this.k=_this.height()/_this.width();
						_this.b=_this.fTop-_this.k*_this.fLeft;
					},
					move:function(){
						// canvas.clean();
						// canvas.pen.strokeDiv(_this);
						if(equalRatio){
							vd.fy=_this.k*(vd.x+vd.width())+_this.b;
							vd.offset({top:vd.fy-vd.width(),left:vd.x});
							_this.width(vd.x+vd.width()-_this.offset().left);
							_this.height(vd.fy-_this.offset().top);
							//
							if(_this.fLeft-(vd.x+vd.width())>=0){_this.width(_this.fLeft-(vd.x+vd.width()));_this.offset({left:vd.x+vd.width()});}
							if(_this.fTop-vd.fy>=0){_this.height(_this.fTop-(	vd.fy));_this.offset({top:vd.fy});}
						}else{
							vd.offset({top:vd.y,left:vd.x});
							_this.width(vd.x+vd.width()-_this.offset().left);
							_this.height(vd.y+vd.height()-_this.offset().top);
							if(_this.fLeft-(vd.x)>=0){_this.width(_this.fLeft+vd.width()-vd.x);_this.offset({left:vd.x});}
							if(_this.fTop-(vd.y)>=0){_this.height(_this.fTop+vd.height()-vd.y);_this.offset({top:vd.y});}
						}
						
						
					},
					up:function(){
							vd.css("top",_this.height()-vd.height());
							vd.css("left",_this.width()-vd.width());

						// canvas.clean();
					},
					lim:$("html")
				});
			}
			
			
		//drag:
		
		
		
		
		var stickyOn=false;
		$(window).setHotKey({
			name:"sticky",
			code:[67,83],
			type:"tog",
			down:function(){if(stickyOn){stickyOn=false;}else{stickyOn=true;}}
		});
		var preDragDiv=null;
		$.fn.draggable=function(limtation){
			var _this=this;
			this.drag("draggable",{
				down:function(){
					preDragDiv=_this;
					toX=true;
					toY=true;
				},
				beforeMove:function(){
					if(_this.rx>_this.ry){onX = true;}else{onX=false;}
				},
				move:function(){
					if(rStraitOn){
						if(onX){_this.offset({left:_this.x});}else{
						_this.offset({top:_this.y});
						}
					}else if(stickyOn){
						if(toX){_this.offset({left:_this.x})}
						if(toY){_this.offset({top:_this.y})}
						
					}else if(rotating){
						
					}else{
						_this.offset({left:_this.x});
						_this.offset({top:_this.y});
					}
				},
				up:function(){
					preDragDiv=null;
					canvas.clean();
				},
				lim:limtation
			});
		}
		//
		
	var rotating=false;
	$(window).setHotKey({
		type:"tog",
		name:"rotate",
		code:82,
		down:function(){
			$("div1").css("cursor","pointer");
			rotating=true;
		},
		up:function(){
			rotating=false;
		}
	});
	$.fn.rotateDrag=function(){
		var _this=this;
		var c;
		var twise;
		var addAgl=0;
		var referPoint;
		var startAgl;
		_this[0].style.transform="rotate(0deg)";
		_this.drag("rotateDrag",{
			down:function(){
				startAgl=_this.rotation();
				console.log(startAgl);
				referPoint=[_this.clickX,_this.clickY];
				c=[_this.FX+_this.width()/2,_this.FY+_this.height()/2];
				addAgl=0;
				// console.log(myMath.angle([1,1],[0,0],[1,1]));
			},
			move:function(){
				if(rotating){
					var crossPd=myMath.crossPd(referPoint,c,_this.p);
					if(crossPd>0){twise=1}else{twise=-1}
					var veAgl=twise*myMath.veAgl(referPoint,c,_this.p);
					// console.log(veAgl  +"" +lastAgl);
					// console.log(lastAgl)
					if(Math.abs(veAgl)>150){
						console.log("ok");
						referPoint=_this.p;
						addAgl+=veAgl;
						veAgl=0;
					}
					var workAgl=addAgl+veAgl+startAgl;
					console.log(workAgl);
					_this[0].style.transform="rotate("+workAgl+"deg)";
				}
			},
			up:function(){}
		});
		
	}
	
	
	
		var mulSel=false;
		$(window).setHotKey({
			type:"tog",
			name:"multipleSelect",
			code:17,
			down:function(){mulSel=true;},
			up:function(){mulSel=false;}
		});
		$.fn.pick=function(){
			var _this=this;
			this.setMouseDown("pick",function(){
				if(!mulSel){
					$(".selected").each(function(a,ele){
						$(ele).removeClass("selected");
					});
				}
					_this.addClass("selected");
			});
		}
		
		
		
		//virtual sticky line
		var vslHandler=new Array();
		$.fn.getVsl=function(){
			var info=new Object();
			this.margin=parseInt(this.css("margin-Left"));
			info.x=new Array();
			info.y=new Array();
			info.x[this.attr("id")]=[this.offset().left-this.margin,this.offset().left+this.outerWidth()];
			info.y[this.attr("id")]=[this.offset().top-this.margin,this.offset().top+this.outerHeight()];
			vslHandler[this.attr("id")]=info;
		}
		////
		//自定义事件
			//线程 : 写时注意：它的复杂程度取绝于语句行数。
			
			var thread_handler=new Object;
			thread_handler.threads=new Array();
			thread_handler.rate=100;
			newThread=function(id,fun){
				(function f(){
					thread_handler.threads[id]=setTimeout(function(){f();fun();},thread_handler.rate);
				})();
			};
			$.fn.newThread=function(id,fun){
				var _this=this;
				var func;
				if(!_this.data("threads")){
					_this.data("threads",new Array);
				}
				if(fun){func=fun;}else{func=thread_handler.threads[id]}
				(function f(){
					// console.log(_this.data("threads").length);
					if(_this.data("threads")){
						_this.data("threads")[id]=setTimeout(function(){f();func(_this);},thread_handler.rate);
					}
				})();
				_this.addClass(id);
			}
			$.fn.removeThread=function(id){
				var _this=this;
				if(_this.data("threads")){
					clearTimeout(this.data("threads")[id]);
				}	
			}
			removeThread=function(id){
				clearTimeout(thread_handler.threads[id]);
			};
		
			var stickyStrenth=20;
			thread_handler.threads["sticky"]=function(_this){
				if(preDragDiv&&stickyOn){
					if(preDragDiv.attr("id")!=_this.attr("id")){
						_this.getBorder();
						preDragDiv.getBorder();
						if(Math.abs(_this.left-preDragDiv.x)<=stickyStrenth){
							// console.log(preDragDiv.left);
							if(!_this.sticky0){
								toX=false;
								toY=true;
								preDragDiv.offset({left:_this.left});
								_this.sticky0=true;
							}
						}else if(_this.sticky0){toX=true;_this.sticky0=false;}
						if(Math.abs(_this.right-preDragDiv.x)<=stickyStrenth){
							if(!_this.sticky1){
								toX=false;
								toY=true;
								preDragDiv.offset({left:_this.right});
								_this.sticky1=true;
							}
						}else if(_this.sticky1){toX=true;_this.sticky1=false;}
						
						if(Math.abs(_this.left-(preDragDiv.x+preDragDiv.width()))<=stickyStrenth){
							if(!_this.sticky2){
								toX=false;
								toY=true;
								preDragDiv.offset({left:_this.left-preDragDiv.outerWidth(true)});
								_this.sticky2=true;
							}
						}else if(_this.sticky2){toX=true;_this.sticky2=false;}
						if(Math.abs(_this.right-(preDragDiv.x+preDragDiv.width()))<=stickyStrenth){
							if(!_this.sticky3){
								toX=false;
								toY=true;
								preDragDiv.offset({left:_this.right-preDragDiv.outerWidth(true)});
								_this.sticky3=true;
							}
						}else if(_this.sticky3){toX=true;_this.sticky3=false;}
						
						// if(Math.abs(_this.top-preDragDiv.top)<=stickyStrenth){
							// _this.sticky4=true;
							// preDragDiv.offset({top:_this.top});
						// }
						// if(Math.abs(_this.top-preDragDiv.below)<=stickyStrenth){
							// _this.sticky5=true;
							// preDragDiv.offset({top:_this.top-preDragDiv.outerHeight(true)});
						// }
						// if(Math.abs(_this.below-preDragDiv.top)<=stickyStrenth){
							// _this.sticky6=true;
							// preDragDiv.offset({top:_this.below});
						// }
						// if(Math.abs(_this.below-preDragDiv.below)<=stickyStrenth){
							// _this.sticky7=true;
							// preDragDiv.offset({top:_this.below-preDragDiv.outerHeight(true)});
						// }
					}
				}
				
			}
			//定点创造检测区域：
			$.fn.newLine=function (id,a,b){
				var _this=this;
				pen.draw(a,b);
				var line=new Object;
				line.k=(b[1]-a[1])/(b[0]-a[0]);
				line.b=b[1]-line.k*b[0];
				line.y=function(x){return line.k*x+line.b;};
				_this.Line=line;
				// newTrigger("line"+id,function{
					// if(e.clientX>a[0]&&e.clientX<b[0]){
						// line.fy=line.k*e.clientX+line.b;
						// if(e.clientY>line.fy){
							// console.log("in");
						// }
					// }
				// });
				_this.setMouseDown(id,function(e){
					if(e.clientY<line.y(e.clientX)){
						console.log(id+"up");
					}else{
						console.log(id+"down");
					}
				});
				// newThread("line"+id,function(){
					
				// });
			}
			//多次画连续的线形成区域
			$.fn.newArea=function (id,points){
				var _this=this;
				$(points).each(function(i,e){
					if(i==points.length-1){
						_this.newLine(id+i,e,points[0]);
					}else{
						_this.newLine(id+i,e,points[i+1]);
					}
					
				});
			}
			// $("body").newArea("test",[[300,300],[400,300],[500,200]]);
			// $("body").newLine("1",[300,300],[500,500]);
			// $("body").newLine("2",[300,300],[500,300]);
			// $("body").newLine("3",[500,300],[500,500]);
			//手动画检测区域
				var adminPercition=20;
				$.fn.createArea=function(){
					var _this=this;
					 _this.Area=new Array();
					_this.drag("createArea",{
						down:function(){
							//添加下一个points
							var points=new Array();
							points[0]=[_this.clickX,_this.clickY];
							_this.Area[_this.Area.length]=points;
						},
						move:function(){
							//points读取数据
							var points=_this.Area[_this.Area.length-1];//被指针复制变为指针
							var dx=_this.p[0]-points[points.length-1][0];
							var dy=_this.p[1]-points[points.length-1][1];//自动依次添加Ararry的方法
							//points添加数据  
							if(Math.sqrt(dx*dx+dy*dy)>adminPercition){
								points[points.length]=_this.p;
								pen.draw(points[points.length-2],points[points.length-1]);
							}
						},
						up:function(){
							//补全画线
							var points=_this.Area[_this.Area.length-1];
							pen.draw(points[points.length-1],points[0]);
							//setArea
							var mlp=[100000,0];
							var mlpi;
							$(points).each(function(i,e){
								if(e[0]<mlp[0]){mlp=e;mlpi=i;}
							});
							var Lpoints=new Array();
							var Lines=new Array();
							var a;
							for(var i =0;i<points.length+1;i++){											
								if(i+mlpi>points.length-1){a=i-(points.length-1-mlpi)-1}else{a=i+mlpi;}
								Lpoints[i]=points[a];	
							}
							$(Lpoints).each(function(i,e){
								console.log(e[0]);
							});
								//setLines
							for(var i=0;i<Lpoints.length-1;i++){
								var line=new Object;
								line.k=(Lpoints[i+1][1]-Lpoints[i][1])/(Lpoints[i+1][0]-Lpoints[i][0]);
								line.b=Lpoints[i][1]-line.k*Lpoints[i][0];
								line.y=function(x){return this.k*x+this.b;};
								if(Lpoints[i][0]<Lpoints[i+1][0]){
									line.up=false;
									Lines[Lines.length]=line;
								}else{
									line.up=true;
									Lines[Lines.length]=line;
								}
							}
							_this.Area[_this.Area.length-1]=Lines;
							_this.areaEvent(function(){console.log("in");});
							_this.removeMouse("createArea");
						}
					});
				}
			//启用area事件
			//顺时针全凸图形 且k值不能等于无穷大
			$.fn.areaEvent=function(fun){
				var _this=this;
				$(_this.Area).each(function(i,ls){
						_this.setMouseDown("areaDown"+i,function(eve){
							$(ls).each(function(i,l){
								console.log(l.k+" "+i+" "+l.up+" "+l.y(eve.clientX));
								if(
									(eve.clientY>l.y(eve.clientX)&&!l.up)||
									(eve.clientY<l.y(eve.clientX)&&l.up)
									){ls.in=true;
									console.log("ok");
								} else{ls.in=false;return false;}
							});
							if(ls.in){
								fun();
							}
						});
				});
			}
		//事件调用综合
		var Events=["draggable","copyDrag","click","dblClick","resize","pick","rotateDrag"];
		$.fn.addEvent=function(id){
			var _this=this;
			if(!$.isArray(id)){	
				id=[id];
			}
			$(id).each(function(i,e){
				if(e.indexOf("(")+1){}else{e=e+"()";}
				if(e!="()"){
					var rp=false;
					if(_this.hasEvent(e)){console.log(e+" is already added")}else
					if(!Events.has(e.remove("("))){}else{rp=true}
					if(rp){
						
						eval("_this."+e);
						_this.addAttr("Events",e);
					}
				}
			});
		}
		$.fn.hasEvent=function(ev){
			var hasEvent=false;
			if(this.attr("Events")){
				$(this.attr("Events").split(" ")).each(function(i,e){
					if(ev.remove("(")==e.remove("(")){hasEvent=true;return false;}
				});
			}
			return hasEvent;
		}
		$.fn.removeEvent=function(id){
			var _this=this;
			if(id.indexOf("(")+1){}else{id.remove("(")}
			this.removeMouse(id);
			if(id=="resize"){
				this.children("#resize").remove();
			}
			$(this.attr("Events").split(" ")).each(function(i,e){
				if(e.remove("(")==id){_this.decreAttr("Events",e)}
			});
			// this.decreAttr("Events",id);
		}
		
		//算法
		
		//对象管理算法
		//判断为第几层元素
		
		//自定义属性
		$.fn.addAttr=function(attr,val){
			var _this=this;
			if(!$.isArray(val)){val=[val]};
			$(val).each(function(i,e){
				var oldAttr=$(_this).attr(attr);
				if(!oldAttr){oldAttr="";}
				$(_this).attr(attr,oldAttr+" "+e);
			});
		}
		$.fn.decreAttr=function(attr,val){
			var oldAttr=$(this).attr(attr);
			$(this).attr(attr,oldAttr.replace(" "+val,""));
		}
		//关联子节点的transform
		$.fn.trfLink=function(){
			var _this=this;
			this.children().each(function(i,e){
				e=$(e);
				e.getRBorder();
				e.css("width",e.width()/_this.width()*100+"%");
				e.css("height",e.height()/_this.height()*100+"%");
				e.css("left",e.rLeft/_this.width()*100+"%");
				e.css("top",e.rTop/_this.height()*100+"%");
			});
		}
		//元素克隆
		
		//添加上本元素没有的功能
		$.fn.cloneEvents=function(obj){
			var _this=this;
			if(_this.attr("Events")){
				$(obj.attr("Events").split(" ")).each(function(a,ev){
					
					_this.attr("Events").split(" ").each(function(i,e){
						if(e==ev){_this.removeEvent(ev);return false;}
					});
				});
				_this.addEvent(obj.attr("Events").split(" "));
			}else{
				this.addEvent(obj.attr("Events").split(" "));
			}
		}
		//克隆此jq元素的指定attr
		$.fn.cloneAttr=function(obj,attr){
			var _this=this;
			if(!$.isArray(attr)){
				attr=[attr];
			}
			attr.each(function(i,e){
				if(obj.attr(e)){
					_this.attr(e,obj.attr(e));
				}
			});
		}
		//全克隆一个元素 events attr (class→style) 可选择不要children或不要某个child
		$.fn.Clone=function(lim){
			var clone=this.clone();
			if(lim){
				switch(typeof(lim.noChild)){
					case "string":
						clone.find(lim.nochild).remove();
					case "boolean":
						clone.children().remove();
				}
			}
			clone.removeAttr("Events");
			clone.cloneEvents(this);
			return clone;
		}
		
		//切割字符串
		//spilt();
		//给元素排序：
			//
		$.fn.sortByNum=function(){
			var temp;
			var arr = new Array();
			for(i=0;i<this.length-1;i++){
				for(j=this.length-1;j>i;j--){
					if(getNum($(this[j]).text())<getNum($(this[j-1]).text())){
						temp=this[j-1];
						this[j-1]=this[j];
						this[j]=temp;
					}
				}
			}
			return arr=this;
			
		}
		
		function getNum(val){
			 var num = val.replace(/[^0-9]/ig,"");
			 return num;
		}
		//获取角度属性值
		$.fn.rotation=function(){
			var _this=this;
			var trf;
			if((trf=_this.css("transform"))!="none"){
				return eval("get"+trf);
			}
			
		}
		//获取角度
		 function getmatrix(a,b,c,d,e,f){  
			var aa=Math.round(180*Math.asin(a)/ Math.PI);  
			var bb=Math.round(180*Math.acos(b)/ Math.PI);  
			var cc=Math.round(180*Math.asin(c)/ Math.PI);  
			var dd=Math.round(180*Math.acos(d)/ Math.PI);  
			var deg=0;  
			if(aa==bb||-aa==bb){  
				deg=dd;  
			}else if(-aa+bb==180){  
				deg=180+cc;  
			}else if(aa+bb==180){  
				deg=360-cc||360-dd;  
			}  
			return deg>=360?0:deg;  
			//return (aa+','+bb+','+cc+','+dd);  
		}  
		//得到div的先知逻辑框
		$.fn.getRForeBorder=function(e){
			p=this.parent();
			p.getBorder();
			this.getBorder();
			this.foreLeft=e.clientX-(p.left+p.border+p.margin)-this.startX;
			this.foreTop=e.clientY-(p.top+p.border+p.margin)-this.startY;
			this.foreRight=this.foreLeft+this.outerWidth(true);
			this.foreBelow=this.foreTop+this.outerHeight(true);
		}
		// 得到div的逻辑框
		$.fn.getBorder=function(){
			this.border=parseInt(this.css("border-left-width"));
			this.margin=parseInt(this.css("margin-Left"));
			this.left=this.offset().left-this.margin;
			this.top=this.offset().top-this.margin;
			this.right=this.left+this.outerWidth(true);
			this.below=this.top+this.outerHeight(true);
		}  
		// 相对父级的逻辑框
		$.fn.getRBorder=function(){
			var p = this.parent();
			if(p){
				p.getBorder();
				this.border=parseInt(this.css("border-left-width"));
				this.margin=parseInt(this.css("margin-Left"));
				this.rLeft = this.offset().left-this.margin-(p.border+p.offset().left);
				this.rTop = this.offset().top-this.margin-(p.border+p.offset().top);
				this.rRight = this.rLeft+this.outerWidth(true);
				this.rBelow = this.rTop+this.outerHeight(true);
				
			}else{
				console.log("$.fn.getRBorder() no parent");
				return false;
			}
		}
		
		Array.prototype.has=function(c){
			var bol=false;
			$(this).each(function(i,e){
				if(e==c){bol=true;return false;}
			});
			return bol;
		}
		//从字串中删除指定字串返回新的字符串
		function removeText(str,txt){
			var i;
			if(i=str.indexOf(txt)){
				str.splice(i,txt.length);
				return str;
			};
		}
		String.prototype.remove=function(st,en){
			var a;var b;
			var _this=this;
			a=_this.indexOf(st);
			b=_this.indexOf(en);
			if(!en){
				b=_this.length-1;
			}else if(!st){
				a=0;
			};
			if(a==-1){a=_this.length}
			return _this.slice(0,a)+_this.slice(b+1,_this.length);
		}
		//Math
		
		var myMath={
			//计算两点距离
			dp:function(a,b){
				var dx=a[0]-b[0];
				var dy=a[1]-b[1];
				return Math.sqrt(dx*dx+dy*dy);
			},
			k:function(a,b){
				return (b[1]-a[1])/(b[0]-a[0]);
			},
			dotPd:function(a,b){
				var rs=a[0]*b[0]+a[1]*b[1];
				return rs;
			},
			veAgl:function(a,c,b){
				var ra=[a[0]-c[0],a[1]-c[1]];
				var rb=[b[0]-c[0],b[1]-c[1]];
				var dpd=myMath.dotPd(ra,rb);
				var absPd=myMath.dp(a,c)*myMath.dp(b,c);
				var cosTheta=dpd/absPd;
				var rs=Math.round(Math.acos(cosTheta)*180/Math.PI);
				return rs;
			},
			crossPd:function(a,c,b){
				return (a[0]-c[0])*(b[1]-c[1])-(a[1]-c[1])*(b[0]-c[0]);
			}
			//实质是（a,b,a+b,0）的点面积
			//a×b<0,>0,=0   a在b逆时针方向，顺时针，同向或者反向。  
		}

		
	//数据管理 就是 id 和class 管理
	
