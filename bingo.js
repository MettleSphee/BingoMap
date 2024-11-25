function imgToCanv(canvID, mapData, scoreID){
	let canvas = document.getElementById(canvID),ctx = canvas.getContext('2d');
	var image = new Image();
	var imgURL = mapData.map;
	image.onload = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(image, -33, -107,365,441);
		mapValues = initMapLoad(mapData);
		drawLines(ctx,mapValues.lines);
		drawPoints(ctx,mapValues.points);
		postScore(scoreID,mapData.date,mapValues.points,mapValues.lines);
	};
	image.src = imgURL;
}

const circle = 2 * Math.PI;

const diag1 = [0,0,300,300], diag2 = [300,0,0,300];
const L_R1 = [0,30,300,30], L_R2 = [0,90,300,90], L_R3 = [0,150,300,150], L_R4 = [0,210,300,210], L_R5 = [0,270,300,270];
const U_D1 = [30,0,30,300], U_D2 = [90,0,90,300], U_D3 = [150,0,150,300], U_D4 = [210,0,210,300], U_D5 = [270,0,270,300];
const P11 = [30,30],   P12 = [90,30],   P13 = [150,30],  P14 = [210,30],  P15 = [270,30];
const P21 = [30, 90],  P22 = [90, 90],  P23 = [150,90],  P24 = [210,90],  P25 = [270,90];
const P31 = [30, 150], P32 = [90, 150], P33 = [150,150], P34 = [210,150], P35 = [270,150];
const P41 = [30, 210], P42 = [90, 210], P43 = [150,210], P44 = [210,210], P45 = [270,210];
const P51 = [30, 270], P52 = [90, 270], P53 = [150,270], P54 = [210,270], P55 = [270,270];
const allPoints = [P11,P12,P13,P14,P15,P21,P22,P23,P24,P25,P31,P32,P33,P34,P35,P41,P42,P43,P44,P45,P51,P52,P53,P54,P55];

function postScore(scoreID,date,points,lines){
	document.getElementById(scoreID).innerHTML+="<center>Date: "+date+"</center>";
	document.getElementById(scoreID).innerHTML+="<center>Points: "+points.length+"/25</center>";
	document.getElementById(scoreID).innerHTML+="<center>Lines: "+lines.length+"/12</center>";
	document.getElementById(scoreID).innerHTML+="<center>Rating: "+((lines.length*25/3) + (points.length*4))/2+"%</center>";
	var score = Math.floor(((lines.length*25/3) + (points.length*4))/20);
	switch (score){
		case 0:
			if (points.length == 0){
				document.getElementById(scoreID).innerHTML+="<center>Coming soon!</center>";
			}
		case 1:
			if (points.length != 0){
				document.getElementById(scoreID).innerHTML+="<center>Someone's had a good day!</center>";
			}
			break;
		case 2:
		case 3:
			document.getElementById(scoreID).innerHTML+="<center>You guys were chill today...</center>";
			break;
		case 4:
		case 5:
		case 6:
			document.getElementById(scoreID).innerHTML+="<center>The usual, Master Bruce?</center>";
			break;
		case 7:
		case 8:
		case 9:
			document.getElementById(scoreID).innerHTML+="<center>Someone's had a very bad day.</center>";
			break;
		case 10:
			document.getElementById(scoreID).innerHTML+="<center>Wow! A perfect score! Someone's on a roll...</center>";
			break;
		default:
			break;
	}
}

function convertScores(mapScores){
	var j=0;
	var newMapScores = [];
	for (var i = 0; i < 25; i++){ //assume score is array of 25 values of 0 and 1
		if (mapScores[i] == 1) {
			newMapScores[j] = allPoints[i];
			j++;
		}
	}
	return newMapScores;
}

function getLines(mapScores){
	var newLines = [], i=0;
	///first and second diagonal
	if (mapScores[0]&&mapScores[6]&&mapScores[12]&&mapScores[18]&&mapScores[24]){
		newLines[i] = diag1;
		i++;
	}
	if (mapScores[4]&&mapScores[8]&&mapScores[12]&&mapScores[16]&&mapScores[20]){
		newLines[i] = diag2;
		i++;
	}
	for (var j=0; j<5; j++){ //columns
		if (mapScores[j]&&mapScores[j+5]&&mapScores[j+10]&&mapScores[j+15]&&mapScores[j+20]){
			eval("newLines[i] = U_D" + (j+1));
			i++;
		}
	}
	for (var j=0; j<25; j+=5){ //lines
		if (mapScores[j]&&mapScores[j+1]&&mapScores[j+2]&&mapScores[j+3]&&mapScores[j+4]){
			eval("newLines[i] = L_R" + (j/5+1) );
			//console.log("line "+(k));
			i++;
		}
	}
	return newLines;
}

function initMapLoad(singleMapData){
	var points=[],lines=[];
	points = convertScores(singleMapData.result);
	lines = getLines(singleMapData.result);
	return {"lines":lines,"points":points};
}

function drawLine(arrayCoords,ctx){
	ctx.beginPath();
	ctx.moveTo(arrayCoords[0], arrayCoords[1]);
	ctx.lineTo(arrayCoords[2], arrayCoords[3]);
	ctx.strokeStyle = "red";
	ctx.stroke();
}

function drawLines(ctx,lines){
	for(let i=0; i<lines.length; i++){
		drawLine(lines[i],ctx);
	}
}

function drawPoint(arrayCoords,ctx){
	ctx.beginPath();
	ctx.arc(arrayCoords[0],
			arrayCoords[1],
			30,	0, circle);
	ctx.strokeStyle = "green";
	ctx.stroke();
}

function drawPoints(ctx,points){
	for(let i=0; i<points.length; i++){
		drawPoint(points[i],ctx);
	}
}

function load_function_one(){
	var i=1;
	for (var i = 0; i <=5; i++){
		if (mapDataArray[i] != undefined && mapDataArray[i] != null){
			imgToCanv("canv"+(i+1), mapDataArray[i],"score"+(i+1));
		}
	}
}