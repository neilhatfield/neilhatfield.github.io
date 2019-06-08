function moveDivisor(i1){
	var divise = "divisor" + i1;
	var slide = "slider" + i1;
	var divisor = document.getElementById(divise);
	var slider = document.getElementById(slide);
	divisor.style.width = slider.value+"%";
}
