var BudgetController=(function(){
	
	//create function constructor for Expense and income seperately
	//It will help to create lot of objects for income and expenses
	//It can track the expense and income individually
var Expense=function(id,description,value){
	
	this.id=id;
	this.description=description;
	this.value=value;
	this.percentage;
	
};

//create a function prototype for expense so that all other function extends Expense can use that percentage function
Expense.prototype.percentagecalculate=function(totalIncome){
	
  this.percentage=Math.round((this.value/this.totalIncome)*100);


};
Expense.prototype.getPercentage=function(){

	return this.percentage;
};





var Income=function(id,description,value){
	
	this.id=id;
	this.description=description;
	this.value=value;
	
};
	
var addTotalbyType=function(type){
	var sum=0;
	data.allItems[type].forEach(function(current){
		
		
		sum=sum+current.value;
		
	});
	data.totals[type]=sum;
	
	
};
	

  //data object is going to store the expenses and income into an array and also store total value
var data={
	
	allItems:{
		exp:[],
		inc:[]
		
	},
	totals:{
		exp:0,
		inc:0
	},
	budget:0,
	percentage:0
	
	
	
};	

return{
addItem:function(type,des,value){
	
	var newitem,ID;
	//It takes last element of the array and find the id and increment by 1
	if(data.allItems[type].length>0){
	ID=data.allItems[type][data.allItems[type].length-1].id+1;
	}
	else{
		ID=0;
	}
	if(type==='exp'){
		newitem=new Expense(ID,des,value);
		}
	else{
		newitem=new Income(ID,des,value);
		}
	
	//push items to our datastructure
	data.allItems[type].push(newitem);
	//return a new item
	return newitem;	
		
},
	calculateBudget:function(){
	
	
 //it calculates total income and Expenses
   
addTotalbyType("exp");
addTotalbyType("inc");


//calculates the budget =income - expenses
data.budget=data.totals.inc-data.totals.exp;
// calculates the percentage of income which are expenses
if(data.totals.inc>0){
data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
}
else{
	data.percentage=-1;
}	
	
	
},
calculatePercentage=function(){

	data.allItems.exp.forEach(function(current){
		current.calculatePercentage();



	});


},
getPercentage=function(){
	var getallPercentage=data.allItems.exp.map(function(current){
      return current.getPercentage();

	});
	return getallPercentage;
	


},



getBudget:function(){

return{
budget:data.budget,
totalInc:data.totals.inc,
totalExp:data.totals.exp,
percentage:data.percentage




}


},
deleteBudget:function(type,id){
var ids,index;
ids=data.allItems[type].map(function(current){
return current.id;
});
index=ids.indexOf(id);
if(index!==-1){
	data.allItems[type].splice(index,1);
}

},
testing: function() {
	console.log(data);
}


		
		
};
	
	
	
	
	
	
	
	
	
	
	
	
	
})();






var UIController=(function(){
	
	var Domstring={
		
	intputDes:".add__description",
	inputNumber:".add__value",
	inputType:".add__type",
	inputAddbutton:".add__btn",
	expenseContainer:".expenses__list",
	incomeContainer:".income__list",
	BudgetValue:".budget__value",
	IncomeValue:".budget__income--value",
	ExpenseLabel:".budget__expenses--value",
	percentageLabel:".budget__expenses--percentage",
	container: ".container"
	
	};
	
return {
	getValue: function(){
		  return{
		
		type: document.querySelector(Domstring.inputType).value,
		description:document.querySelector(Domstring.intputDes).value,
		number:parseFloat(document.querySelector(Domstring.inputNumber).value)
		  };
		
	},
	
	addListItems:function(obj,type){
		var Html,newHtml,element;
		//create a placeholder Text
		
		if(type==="inc")
		{   element=Domstring.incomeContainer;
			Html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%descrpition%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			
		}
		else{
			element=Domstring.expenseContainer;
			Html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%descrpition%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
		
		
		
		//Replace placholder contains with actual object
		newHtml=Html.replace('%id%',obj.id);
		newHtml=newHtml.replace('%descrpition%',obj.description);
		newHtml=newHtml.replace('%value%',obj.value);
		//insert html into DOM
		document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);	
	},
	
	getDomstring:function(){
	
	return Domstring;
},
	
	//return getInput();
	//
	//This function will clear the input field
	clrInput:function(){
	//var Dom=uiCtrl.getDomstring();
		var fields,filedsArray
		fields=document.querySelectorAll(Domstring.intputDes+','+Domstring.inputNumber);
	//slice method conver list type to array like objects
		filedsArray=Array.prototype.slice.call(fields);
		
		filedsArray.forEach(function(item,index,arr){
			item.value="";
			arr[0].focus();
			
		});
		
		
		//document.querySelector(Domstring.intputDes).value="";
		//document.querySelector(Domstring.inputNumber).value="";
	},

	deleteListItem:function(id){
		var element=document.getElementById(id);
        element.parentNode.removeChild(element);

	}
	
};
	
	
})();


var Controller=(function(budgetCtrl,uiCtrl){
	
	var ctlrAdditem=function(){
		var input,newItem;
		
	//Get filed input data
	input=uiCtrl.getValue();
		if(input.description !=="" && !isNaN(input.number)){
	//add item to budget controller
	newItem=budgetCtrl.addItem(input.type,input.description,input.number);	
	//add Item to UI
		
	UIController.addListItems(newItem,input.type);
		
	//Clear the UI after getting the data
	uiCtrl.clrInput();
	//Update the budget by calling updateBudget	
	updateBudget();
		}
	
};



var ctrlDeletebutton=function(event){
	var Itemid,splitid,type,id;
	Itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
	splitid=Itemid.split("-");
	type=splitid[0];
	id=parseInt(splitid[1]);

	//delete item from data structure
   budgetCtrl.deleteBudget(type,id);
	//delete item from user Interface
	uiCtrl.deleteListItem(Itemid);
	//update and show new status or new budget
	updateBudget();


};






	
	
	
	
	var updateBudget=function(){
		
		//Calculate budget
		budgetCtrl.calculateBudget();
		//Return Budget
		var getBudgetfromController=BudgetController.getBudget();
		console.log(getBudgetfromController);
		//display budget to UI	
		
		document.querySelector(uiCtrl.getDomstring().BudgetValue).textContent=getBudgetfromController.budget;
		
		document.querySelector(uiCtrl.getDomstring().IncomeValue).textContent=getBudgetfromController.totalInc;
		
		document.querySelector(uiCtrl.getDomstring().ExpenseLabel).textContent=getBudgetfromController.totalExp;

		document.querySelector(uiCtrl.getDomstring().percentageLabel).textContent=getBudgetfromController.percentage+"%";
		
	
	}
	
	
	
	
	
	
	var setUpEventListener=function(){
	 var Dom=uiCtrl.getDomstring();

	document.querySelector(Dom.BudgetValue).textContent=0;
		
	document.querySelector(Dom.IncomeValue).textContent=0;
		
	document.querySelector(Dom.ExpenseLabel).textContent=0;
	document.querySelector(uiCtrl.getDomstring().percentageLabel).textContent=0;
		
	document.querySelector(Dom.inputAddbutton).addEventListener('click',ctlrAdditem);
	document.querySelector(Dom.container).addEventListener('click',ctrlDeletebutton);
	
	document.addEventListener('keypress',function(e){
		if(e.keyCode===13){
			//console.log("something happened");
			ctlrAdditem();
			//uiCtrl.clrInput();
			
		}
		
		});

   
  };

  

	
	return{
		
		 init: function(){
		setUpEventListener();
		
	}
		
	}
	
	
	
	
	
	
	
})(BudgetController,UIController); 

Controller.init();