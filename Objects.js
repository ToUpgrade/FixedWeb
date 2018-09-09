//js面对对象的格式探究：
	//最原始的模式：
		//new 做了什么：
		//如：
			//function base(){...}
			//new base();
		//1.建立一个对象   
			//var obj={};
		// 2.将构造函数中的内容向对象执行（构造函数中this指代新建的对象） 
			//base.call(obj);
		// 3.将类（构造函数）的原型对象（prototype）引用给新建对象的__proto__（对象原型指针）
			//每一个对象都有__proto__成员，而protiotype只有function有
			//__proto__被赋值时，proto的特性：__proto__中的的内容直接指向宿主对象，仍然保留。
			//obj.__proto__=base.prototype;
			//这样就相当于prototype的成员直接指向了obj
		//4.返回该对象

			//现在 我们用new 和function 就能实现对象的（复用）继承了

			function base(){
				this.lay=0;
				this.arry=new Array();
			}
			base.prototype.remvoe=function(){}
			function lay1(){}
			lay1.prototype=new base();
			//新建一个 对象 回调base构造函数，再添加指向base.prototype的指针，再返回给lay1.prototype
			// 此时相当于lay1.prototype已添加了lay，arry两个属性变量，同时可以调用prototype.rmove()
			var ele1=new lay1();
			//再做此操作，lay1 就会将prototype中的属性变量引用给ele1
			ele1.lay=1；
			var ele2=new lay1();
			cosnole.log(ele2.lay);// 0
			//再给属性变量赋值时，并不会改变lay1的值，而是会新建一个属性变量给该对象
			//若一个对象有一个引用变量和一个实体变量同名了，那么会优先读取实体变量 
			ele1.arry.push("obj");
			console.log(ele2.arry); //obj
			//但是 对于引用变量，切调用了自己的方法，作用的是该对象，所以lay1中的被引用量自身做了修改，导致引用此变量的子类全部更新了该变量，产生了"回溯"
			//但是这种回溯是错误的所以应该把它改进掉
	//模式二：可继承的构造函数
		//我们知道只有在给引用类型的属性变量改值时才会出现非正确的“回溯“，而主要原因就是属性变量在prototype中，调用的形式为引用
		//所以我们只需要让lay1不再引用父级的属性变量，但仍然会继承
		//所以想到了通过构造函数继承来实现，每次往下级衍生时，属性变量会被赋予一个新值，而根据优先级此值会覆盖掉引用。
			//实现在代码中，只需在构造函数中添加 fater.call(this);回调父亲的构造函数,如：
			function lay1(){
				base.call(this);
			}
	//



 
