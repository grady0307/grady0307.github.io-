var board = new Array();
var score = 0;

var startx=0;
var starty=0;
var endx=0;
var endy=0;
$(document).ready(function () {
	prepareForMobile();
	newgame();

});

function prepareForMobile(){
	if(documentWidth>500){
		gridContainerWidth=500;
		cellSpace=20;
		cellSideLength=100;
	}

	$("#grid-container").css("width",gridContainerWidth- 2*cellSpace);
	$("#grid-container").css("height",gridContainerWidth- 2*cellSpace);
	$("#grid-container").css("padding",cellSpace);
	$("#grid-container").css("border-radius",0.02*gridContainerWidth);

	$(".grid-cell").css("width",cellSideLength);
	$(".grid-cell").css("height",cellSideLength);
	$(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame() {
	//初始化棋盘格
	init();
	//随机生成两个2或4的数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}

	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		for (var j = 0; j < 4; j++)
			board[i][j] = 0;
	}
	updataBoardView();
	score=0;
	updataScore(score);
}

function updataBoardView() {
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
			var theNumbercell = $('#number-cell-' + i + '-' + j);
			if (board[i][j] == 0) {
				theNumbercell.css('width', '0px');
				theNumbercell.css('heigth', '0px');
				theNumbercell.css('top', getPosTop(i, j) + cellSideLength/2);
				theNumbercell.css('left', getPosLeft(i, j) + cellSideLength/2);
			}
			else {
				theNumbercell.css('width', cellSideLength);
				theNumbercell.css('heigth', cellSideLength);
				theNumbercell.css('top', getPosTop(i, j));
				theNumbercell.css('left', getPosLeft(i, j));
				theNumbercell.css("background-color", getNumberBackgroundColor(board[i][j]));
				theNumbercell.css("color", getNumberColor(board[i][j]));
				theNumbercell.text(board[i][j]);
			}
		}
	$(".number-cell").css("line-height",cellSideLength+"px");
	$(".number-cell").css("font-size",0.6*cellSideLength+'px');
}

function generateOneNumber() {
	if (nospace(board))
		return false;
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	var times=0;
	while (times<50) {
		if (board[randx][randy] == 0)
			break;
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
		times++;
	}
	if(times==50){
		for(var i=0;i<4;i++)
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;
				}
			}
	}
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);
	return true;
}

$(document).keydown(function (event) {
	switch (event.keyCode) {
		case 37://left
		event.preventDefault();
			if (moveLeft()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38://up
		event.preventDefault();
			if (moveTop()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39://right
		event.preventDefault();
			if (moveRight()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40://down
		event.preventDefault();
			if (moveBottom()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
})

document.addEventListener('touchstart' ,  function (event) {
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
})

document.addEventListener("touchmove",function(event){
	event.preventDefault();
})
document.addEventListener('touchend' ,  function (event) {
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;

	var deltax =endx -startx;
	var deltay =endy-starty;

	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth){
		return ;
	}
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){
			if (moveRight()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
		}
		else{
			if (moveLeft()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
		}
	}
	else{
		if(deltay>0){
			if (moveBottom()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
		}
		else{
			if (moveTop()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()",300);
			}
		}
	}
});

function moveLeft() {
	if (!canMoveLeft(board)) {
		return false;
	}
	for (var i = 0; i < 4; i++) {
		var hasCombin = [false, false, false, false];
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, i, k);//注意是i,j,i,k而不是  i,j,k
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && !hasCombin[k] && noBlockHorizontal(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] = board[i][k] + board[i][j];
						board[i][j] = 0;
						score+=board[i][k];
						updataScore(score);
						hasCombin[k] = true;
						continue;
					}
				}

			}
		}
	}
	setTimeout("updataBoardView()", 200);
	return true;
}

function moveRight() {
	if (!canMoveRight(board)) {
		return false;
	}
	for (var i = 0; i < 4; i++) {
		var hasCombin = [false, false, false, false];
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && !hasCombin[k] && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][k] + board[i][j];
						board[i][j] = 0;
						score+=board[i][k];
						updataScore(score);
						hasCombin[k] = true;
						continue;
					}
				}

			}
		}
	}
	setTimeout("updataBoardView()", 200);
	return true;
}

function moveTop() {
	if (!canMoveTop(board)) {
		return false;
	}
	for (var i = 0; i < 4; i++) {
		var hasCombin = [false, false, false, false];
		for (var j = 1; j < 4; j++) {
			if (board[j][i] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[k][i] == 0 && noBlockVertical(i, k, j, board)) {
						showMoveAnimation(j, i, k, i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}
					else if (board[k][i] == board[j][i] && !hasCombin[k] && noBlockVertical(i, k, j, board)) {
						showMoveAnimation(j, i, k, i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score+=board[k][i];
						updataScore(score);
						hasCombin[k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updataBoardView()", 200);
	return true;
}

function moveBottom() {
	if (!canMoveBottom(board)) {
		return false;
	}
	for (var j = 0; j < 4; j++) {
		var hasCombin = [false, false, false, false];
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && !hasCombin[k] && noBlockVertical(j, i, k, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score+=board[k][i];
						updataScore(score);
						hasCombin[k] = true;
						continue;
					}
				}

			}
		}
	}
	setTimeout("updataBoardView()", 200);
	return true;
}

function isgameover() {
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}

function gameover(){
	alert("gameover!");
}