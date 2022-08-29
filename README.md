# Distel Visualiser (Codename: DistelVistel) #

DistelVistel is een visualiser die draait op een server gemaakt in Node.js. Het is een lokale webserver waarop je webpagina's kan draaien. Daarnaast heeft het functies voor Open Sound Control, te gebruiken in combinatie met P5.js. 

## Installatie ##
* Clone alle bestanden van deze [github](https://github.com/WouterBesse/DistelVistel)..
* Download node.js via [https://nodejs.org/en/download/](https://nodejs.org/en/download/) en installeer dit.
* Ga in de terminal naar de map waarin je de DistelVistel bestanden hebt gezet en typ hier: 
`npm install`  

* Typ nu `node oscServer.js` of `npm start`.
* Ga in de browser naar `localhost:8001/Nvg_visualiser2/`


## Gebruik ##
We gebruiken deze node-js server in eerste instantie als lokale webserver voor het weergeven van html-bestanden in de browser. Hiermee kunnen we p5js projecten bekijken. Een exrtra functie: OSC-communicatie komt later aan bod.

* Zodra je in de terminal `node oscServer.js` intypt start de node-js server en verschijnt er de volgende mededeling: `De server staat aan! Je kunt deze via localhost:8001 bereiken`.
* Dit betekent dat er nu een lokale webserver draait die luistert naar de poort 8001.
* Je kunt nu in jouw favoriete webbrowser naar localhost:8001 gaat zal er een tijdelijke website verschijnen.
* Ga nu in de browser naar `localhost:8001/Nvg_visualiser2/` en je zult hier de visualiser zien.
* Start nu de Max for Live patch `NVG Knopkes New` op in Ableton of in de standalone Max applicatie.
* Als je nu geluid in de Max patch stuurt zou hij hier op moeten reageren en hiervan data door moeten sturen naar de visualiser
* Happy visualising :)

## OSC ##
Naast dat het programma oscServer.js dient als webserver om P5js-projecten in je browser te laten zien wordt het ook gebruikt als Open Sound Control (OSC)-server. Met OSC kan je aansturingsberichten via een netwerk sturen naar andere applicaties die dit protocol ondersteunen. Voorbeelden hiervan zijn Max, Pure Data, Supercollider, Reaper, Live en Logic. Je kunt OSC enigszins vergelijken met midi. Met als groot voordeel dat je niet gelimiteerd bent tot een range van 128 waardes.  
Een OSC-bericht bestaat uit twee onderdelen. Een adres en een waarde. Het adres is opgebouwd uit een of meer delen, elk gescheiden door een `/`. Bijvoorbeeld: `/synth/oscillator1/pitch` of `/x`. De waarde kan van alles zijn, een integer, floating point getal of een stukje tekst. Een compleet OSC-bericht kan er dus als volgt uitzien: `/synth/filter/cutoff 500` of `/synth/filter/mode lpf` of `/synth/amplitude 0.5`.
