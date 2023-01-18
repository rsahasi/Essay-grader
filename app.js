const express = require("express");
const bodyParser = require("body-parser")
var errors=[];

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
  
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
  
app.post("/", function(req, res) {
  var name = (req.body.name);
  var essay = (req.body.essay);
    
  var result = "Essay:"+ essay;
  var grade = grader(essay);
  if(grade<-200)
  	grade=-200;
  var errorExplanation = explain();

  var str="Grade: "+grade+"%"+"<br>";
  str+="Errors: "+"<br>";
  for(let i=0; i<errorExplanation.length; i++){
  	str+=errorExplanation[i]+"<br>";
  	
  }
  res.send(str);
});
  
app.listen(2020, function(){
  console.log("server is running on port 2020");
})

function grader(essay){
	var tempErr =[];
	errors=tempErr;
	var grade=100;
	let essayArr = essay.split(/ |-|,|'/);
	let size = essayArr.length;
	if(size<500 || size>1000){
		grade-=50;
		errors.push("Your essay doesn't meet the word limit requirement, it is this many words: ", size, "-50%");
	}
	
	const preps = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so'];
	for(let i=0; i<size; i++){
		for(let b=0; b<essayArr[i].length; b++){
			//console.log(essayArr[i]+essayArr[i].length); 
			if(essayArr[i].charAt(b)=='.'){
				essayArr[i]=essayArr[i].substring(0,b);
				
				for(let j=0; j<preps.length; j++){

					if(essayArr[i]==preps[j]){
						grade-=5;
						errors.push('Do not end sentences with the preposition: ', essayArr[i], ' -5%');
						break;
					}
				}
				break;
			}
			
		}

	}
	var wordList = require('word-list-json');
	let found = false;
	for(let i=0; i<essayArr.length; i++){
		for(let j=0; j<wordList.length; j++){
			if(essayArr[i]==wordList[j]){
				found = true;
				break;
			}
		}
		if(found==false){
			grade--;
			errors.push('Incorrectly spelled word: ', essayArr[i], '-1%');
		}
	}

	const nastyNoNos = ['very', 'really', 'got', 'gotten', 'get', 'good', 'bad'];
	
	for(let i=0; i<size; i++){
		for(let j=0; j<nastyNoNos.length; j++){
			if(nastyNoNos[j]==essayArr[i]){
				grade--;
				errors.push('NastyNoNo Used: ', nastyNoNos[j], " -1%");
			}
		}
	}

	return grade;
}

function explain(){
	return errors;
}