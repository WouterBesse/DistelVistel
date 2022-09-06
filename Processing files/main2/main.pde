import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

void setup() {
  size(400,400);
  frameRate(25);
  /* start oscP5, listening for incoming messages at port 12000 */
  oscP5 = new OscP5(this,7000);
  
  /* myRemoteLocation is a NetAddress. a NetAddress takes 2 parameters,
   * an ip address and a port number. myRemoteLocation is used as parameter in
   * oscP5.send() when sending osc packets to another computer, device, 
   * application. usage see below. for testing purposes the listening port
   * and the port of the remote location address are the same, hence you will
   * send messages back to this sketch.
   */
  myRemoteLocation = new NetAddress("127.0.0.1",7000);
}

void draw() {
  background(0);  
}


void oscEvent(OscMessage msg) {
  /* check if theOscMessage has the address pattern we are looking for. */
  //print(msg.addrPattern());
  if(msg.checkAddrPattern("/wFrequency")==true) {
    /* check if the typetag is the right one. */
    println(" typetag: "+msg.typetag());
    if(msg.checkTypetag("ifs")) {
      /* parse theOscMessage and extract the values from the osc message arguments. */
    //   int firstValue = theOscMessage.get(0).intValue();  
    //   float secondValue = theOscMessage.get(1).floatValue();
    //   String thirdValue = theOscMessage.get(2).stringValue();
    //   print("### received an osc message /test with typetag ifs.");
    //   println(" values: "+firstValue+", "+secondValue+", "+thirdValue);
    //   return;
    }  
  } 
}
