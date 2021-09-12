const DERECHA   =   10;
const IZQUIERDA =   20;
const ARRIBA    =   30;
const ABAJO     =   40;

const TECLA_DERECHA   =   "39";
const TECLA_IZQUIERDA =   "37";
const TECLA_ARRIBA    =   "38";
const TECLA_ABAJO      =   "40";
      
const CARGA    =  100;
const RECARGA  =  200;      
const INICIO   =  300;      
$(document).ready(function(){
     

   function JuegoSerpiente(){
 
      //SE OBTIENE EL CANVAS Y SU CONTEXTO
      this.canvas = null;
      this.ctx = null;
      this.w = 0;
      this.h = 0;  
      //VARIABLE PARA ALMACENAR LA SERPIENTE
      this.serpiente=null;
      this.comida=null;
      this.score=0;
      this.escala=0.03;
      this.cw = 0;

      //Comida
      this.imgComidaAleatoria = 0;
      
      this.estado=CARGA;
      
      var objeto=this;
      

      this.crearSerpiente = function(){
         var tamanio_inicial = 5;
         this.serpiente = []; 
         for(var i = tamanio_inicial-1; i>=0; i--){
            //SE GUARDAN AL FINAL DEL ARREGLO TOPE [0,0][1,0][2,0][3,0][4,0] 
            
            this.serpiente.push({x: i, y:0});
         }
      }  
       
      this.crearComida = function(){
         this.comida = {
            x: Math.round(Math.random()*(this.w-this.cw)/this.cw), 
            y: Math.round(Math.random()*(this.h-this.cw)/this.cw), 
         };
         this.imgComidaAleatoria = Math.floor(Math.random() * (5 - 0)) + 0;
      }
 
      this.dibujar = function(){

         var nx,ny,celda_nueva,i,c;
         //SE BORRA EL CANVAS
         var imagenFondo = new Image();

         if (objeto.canvas.width > 1280) {
            imagenFondo.src = "img/jungle.jpg";
         } else if (objeto.canvas.width > 990) {
            imagenFondo.src = "img/jungle2.jpg";
         } else {
            imagenFondo.src = "img/jungle3.jpg";
         }
         objeto.ctx.drawImage(imagenFondo,0, 0, objeto.w, objeto.h);


         //SE TOMA EL ELEMENTO EN EL TOPE/INICIO DEL ARREGLO			
         nx = objeto.serpiente[0].x;
         ny = objeto.serpiente[0].y;
	
         switch(objeto.sentido){
            case DERECHA:
               nx++;
               break;
            case IZQUIERDA:
               nx--;
               break;
            case ARRIBA:
               ny--;
               break;
            case ABAJO:
               ny++;
               break;
         }
         //SE REINICIA EL JUEGO	
         if(nx < 0 || nx*objeto.cw > objeto.w || ny < 0 || ny*objeto.cw > objeto.h || objeto.detectaColision(nx, ny, objeto.serpiente)){
           
            objeto.estado=RECARGA;
            
            return;
         }
         //SI LA COMIDA ESTA EN EL CAMINO DE LA SERPIENTE, ENTONCES SE CREA UNA
         //NUEVA CELDA PARA LA SERPIENTE Y SE CREA UNA NUEVA COMIDA
         if(nx == objeto.comida.x && ny == objeto.comida.y){
            celda_nueva = {x: nx, y: ny};
            objeto.score++;
            objeto.crearComida();
         }else{
         //SI LA COMIDA NO ESTA EN EL CAMINO DE LA SERPIENTE, SE QUITA EL ELEMENTO 
         //EN EL TOPE (COLA DE LA SERPIENTE) Y SE AGREGA UN ELEMENTO EN LA CABEZA
         
            celda_nueva = objeto.serpiente.pop(); 
            celda_nueva.x = nx; 
            celda_nueva.y = ny;
         }
         //SE AGREGA AL INICIO DEL ARREGLO (CABEZA)			
         objeto.serpiente.unshift(celda_nueva);
         
         //SE DIBUJA CADA CELDA DE LA SERPIENTE DE LA SERPIENTE
         for(i = 0; i < objeto.serpiente.length; i++){
            c = objeto.serpiente[i];
            objeto.dibujaCelda(c.x, c.y);
         }
         //console.log(objeto.serpiente.length+" ["+"("+objeto.serpiente[0].x+","+objeto.serpiente[0].y+"),"+"("+objeto.serpiente[1].x+","+objeto.serpiente[1].y+"),"+ "("+objeto.serpiente[2].x+","+objeto.serpiente[2].y+"),"+ "("+objeto.serpiente[3].x+","+objeto.serpiente[3].y+"),"+ "("+objeto.serpiente[4].x+","+objeto.serpiente[4].y+")"+"]"          );
		
         //SE DIBUJA LA COMIDA
         objeto.dibujaCeldaComida(objeto.comida.x,objeto.comida.y);
		
         //SE DIBUJA EL SCORE
         var score_text = "Score: " + objeto.score;
         objeto.ctx.font=objeto.h*objeto.escala+"px Arial";
         objeto.ctx.fillText(score_text, objeto.h*objeto.escala, objeto.h-5);
      }
 
      this.dibujaCelda = function(x, y){
         var imagenSerpiente = new Image();

         if (x == this.serpiente[0].x && y == this.serpiente[0].y) {
            imagenSerpiente.src = "img/yoshi.png";
            this.ctx.drawImage(imagenSerpiente,x*this.cw, y*this.cw, this.cw, this.cw);
            // this.ctx.fillStyle = "transparent";
            // this.ctx.fillRect(x*this.cw, y*this.cw, this.cw, this.cw);
         } else {
            imagenSerpiente.src = "img/huevo.png";
            this.ctx.drawImage(imagenSerpiente,x*this.cw, y*this.cw, this.cw*.7, this.cw);
         }
      }

      this.dibujaCeldaComida = function(x, y){
         var imagenComida = new Image();
         imagenComida.src = "img/fruta" + this.imgComidaAleatoria + ".png";
         this.ctx.drawImage( imagenComida, x*this.cw, y*this.cw, this.cw, this.cw);
      }

      this.detectaColision = function(nx, ny, serpiente){
         var i;
         for(i = 0; i < serpiente.length; i++){
            if(serpiente[i].x == nx && serpiente[i].y == ny)
               return true;
         }
         return false;
      }        


      this.resizeCanvas = function() {
      
         objeto.canvas.width = window.innerWidth;
         objeto.canvas.height = window.innerHeight;

         objeto.w = $("#canvas").width();
         objeto.h = $("#canvas").height(); 
       
         objeto.cw = objeto.h*objeto.escala;
         objeto.ctx.font=objeto.h*objeto.escala+"px Arial";
        
      }

       

       //SE CAPTURAN LO EVENTO DEL TECLADO
       $(document).keydown(function(e){
          var tecla = e.which;
		          
          if(tecla == TECLA_IZQUIERDA && objeto.sentido != DERECHA) 
             objeto.sentido = IZQUIERDA;
          else 
             if(tecla == TECLA_ARRIBA && objeto.sentido != ABAJO) 
                objeto.sentido = ARRIBA;
             else 
                if(tecla == TECLA_DERECHA && objeto.sentido != IZQUIERDA) 
                   objeto.sentido = DERECHA;
	else 
                   if(tecla == TECLA_ABAJO && objeto.sentido != ARRIBA) 
                      objeto.sentido = ABAJO;
                      
       ;})   

      let areaTouch = document.getElementById('canvas');
      let mc = new Hammer(areaTouch);
      mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

      mc.on("panleft panright panup pandown tap press", function(ev) {
         let tecla=ev.type;
         if(tecla == "panleft" && objeto.sentido != DERECHA) 
            objeto.sentido = IZQUIERDA;
         else 
            if(tecla == "panup" && objeto.sentido != ABAJO) 
               objeto.sentido = ARRIBA;
            else 
               if(tecla == "panright" && objeto.sentido != IZQUIERDA) 
                  objeto.sentido = DERECHA;
               else 
                  if(tecla == "pandown" && objeto.sentido != ARRIBA) 
                     objeto.sentido = ABAJO;
            
         });
       
       //SE AGREGAN LO EVENTOS PARA CUANDO CAMBIA EL TAMANIO DE LA VENTANA             
       $(window).resize(function(e){
              objeto.resizeCanvas();
              
       ;}) 
       
       this.inicializa = function(){
     

           this.canvas = $("#canvas")[0];
           this.canvas.width = window.innerWidth;
           this.canvas.height = window.innerHeight;             
           this.ctx = canvas.getContext("2d");
           this.w = $("#canvas").width();
           this.h = $("#canvas").height(); 
           this.cw = this.h*this.escala;
           this.ctx.font=this.h*this.escala+"px Arial";   
       } 
       
      this.maquinaDeEstados = function(){
   
         if(objeto.estado==CARGA){
            objeto.inicializa(); 
            objeto.sentido = DERECHA; 
            objeto.crearSerpiente();
            objeto.crearComida(); 
            objeto.score = 0;
            objeto.estado=INICIO;
            setInterval(objeto.maquinaDeEstados, 80); 
         }else{
            if(objeto.estado==RECARGA){
               
               objeto.sentido = DERECHA; 
               objeto.crearSerpiente();
               objeto.crearComida(); 
               objeto.score = 0;
               objeto.estado=INICIO;
            }else{
                objeto.dibujar();
            
            }                
         }              
      }
  }

   s = new JuegoSerpiente();
   s.maquinaDeEstados();
})



