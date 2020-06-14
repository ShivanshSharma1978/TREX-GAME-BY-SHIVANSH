var trex,trex_running,trex_collided,invisibleGround,ground,ground_image,cloud_image,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,ObstaclesGroup,CloudsGroup,CrowsGroup;
var count;
var gameOver,g_img,restart,r_img,bird,dino_duck;

//define the gameStates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  g_img = loadImage("gameOver.png");
  r_img = loadImage("restart.png");
  bird = loadImage("Bird.png");
  dino_duck = loadAnimation("Dino.png");
}

function setup() {
  createCanvas(600, 300);
  
  //create a trex sprite
  trex = createSprite(50,245,10,10); 
  trex.addAnimation("trex_running",trex_running);
  trex.addImage("trex_collided",trex_collided);
  trex.addAnimation("duck",dino_duck);
  trex.scale = 0.4;
  
  //create a ground
  ground = createSprite(300,265,600,10);
  ground.addImage("ground2",ground_image);
  ground.x = ground.width/2;
  
  //create an invisible ground
  invisibleGround = createSprite(300,275,600,10);
  invisibleGround.visible = false;
  
  //create the groups
   ObstaclesGroup = new Group();
   CloudsGroup = new Group();
   CrowsGroup = new Group();
  
  //define the count
  count = 0;
  
  //create the gamOver and the restart signs
  gameOver = createSprite(300,100,10,10);
  gameOver.addImage(g_img);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,140,10,10);
  restart.addImage(r_img);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(180);
  
  //display the count
  fill(0);
  textSize(25);
  text(count,550,50);
  
  //stop the trex from falling
  trex.collide(invisibleGround);
  
  if(gameState === PLAY){
    
  //define the count  
  count = count + Math.round(getFrameRate()/60);
  
  //move and restore the ground
  ground.velocityX = -(6 + 3*(count/100));
  if(ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //make the trex jump
  if((keyDown("space") || keyDown(UP_ARROW)) && trex.y >= 245){//
  trex.velocityY = -12;
}
  
  //add gravity
  trex.velocityY = trex.velocityY + 1;
  
  if(keyWentDown(DOWN_ARROW)){
   trex.changeAnimation("duck"); 
  trex.scale = 0.175;
  }
  if(keyWentUp(DOWN_ARROW)){
    trex.changeAnimation("trex_running");
    trex.scale = 0.5;  
  }
  
  //spawn the clouds and the obstacles here
  spawnClouds();
  if(count > 0 && count % 1000 > 0 && count % 1000 < 500){
    spawnObstacles();
  }
  if(count > 0 && count % 1000 > 500 && count % 1000 < 999){
  spawnCrows();
  }
  
  //end the game when the trex touches the obstacles
  if(ObstaclesGroup.isTouching(trex) || CrowsGroup.isTouching(trex)){
    gameState = END;
  }
  
  }else {
    
    if(gameState === END){
      ground.velocityX = 0;
      CrowsGroup.setVelocityXEach(0);
      CrowsGroup.setLifetimeEach(-1);
      ObstaclesGroup.setVelocityXEach(0);
      ObstaclesGroup.setLifetimeEach(-1);
      CloudsGroup.setVelocityXEach(0);
      CloudsGroup.setLifetimeEach(-1);
      count = 0;
      trex.velocityY = 0;
      trex.changeImage("trex_collided");
      gameOver.visible = true;
      restart.visible = true;
      
      //restart the game
      if(mousePressedOver(restart)){
        reset();
    }
  }
}
  drawSprites();
}

//spawn the clouds here
function spawnClouds(){
  if(frameCount % 60 === 0){
    var cloud = createSprite(600,200,10,10);
    cloud.addImage("cloud_image",cloud_image);
    cloud.y = Math.round(random(100,200));
    cloud.velocityX = -6;
    cloud.scale = 0.5;
    trex.depth = cloud.depth + 1;
    
    //assign a lifetime
    cloud.lifetime = 100;
    
    //add the cloud to the group
    cloud.addToGroup(CloudsGroup);
  }
}

//spawn the obstacles here
function spawnObstacles(){
  if(frameCount % 70 === 0){
    var obstacle = createSprite(600,245,10,10);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
      break;
      case 2:obstacle.addImage(obstacle2);
      break;
      case 3:obstacle.addImage(obstacle3);
      break;
      case 4:obstacle.addImage(obstacle4);
      break;
      case 5:obstacle.addImage(obstacle5);
      break;
      case 6:obstacle.addImage(obstacle6);
      break;
      default:break;
    }
    obstacle.velocityX = -(6 + 3*(count/100));  
    obstacle.scale = 0.5;
    
    //assign a lifetime
    obstacle.lifetime = 100;
    
    //add teh obstacles to the group
    obstacle.addToGroup(ObstaclesGroup);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  CrowsGroup.destroyEach();
  trex.changeAnimation("trex_running");
}
function spawnCrows(){
  if(frameCount % 80 === 0){
    var crow = createSprite(600,100,10,10);
    crow.addImage(bird);
    crow.y = random(150,220);
    crow.scale = 0.1;
    crow.velocityX = -(6 + 3*(count/100));
    
    crow.lifetime = 100;
    
    crow.addToGroup(CrowsGroup);
  }
}