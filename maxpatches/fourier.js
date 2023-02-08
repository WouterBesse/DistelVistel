

var v=0;
var w=.0075;

if (jsarguments.length>1)
	t = jsarguments[1];

function bang()
{
	outlet(0,v);
}

function msg_int(t)
{
	//post("received int " + v + "\n");
	v = 4/Math.PI *(Math.sin(w*t)+1/3*Math.sin(3*w*t)+1/5*Math.sin(5*w*t)+
	1/7*Math.sin(7*w*t)+1/9*Math.sin(9*w*t)+1/11*Math.sin(11*w*t)+1/13*Math.sin(13*w*t)+1/15*Math.sin(15*w*t));
	bang();
	
}