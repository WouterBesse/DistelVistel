var v=0;
var s = 5;
var f = 0.05;
var a = 6;


if (jsarguments.length>1)
	t = jsarguments[1]; 

function bang()
{
	outlet(0,v);
}

function msg_int(t)
{
	//post("received int " + v + "\n");
	v = a/(Math.pow(Math.abs(s), s*Math.sin(f*t))+1);
	bang();
	
}