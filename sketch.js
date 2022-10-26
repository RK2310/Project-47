var backgroundImage
//PC
var player, playerImage
//NPC
var zombie, zombieImage, zombiesGroup, zombieFrequency=100, zombieLeft=-2, zombieRight=2
//to fire
var bullet1, bullet2, bulletGroup
//life count
var lives=3, heart, brokenHeart

var explosion

var comic, comicImage

var mainTheme, gunshot, explosionSound

var score=0, scoreCount, scoreCountImage

var gameState=0

var bulletCount=10, bulletDisplay, bulletCountImage

var bombCount=0, bombDisplay, bombCountImage

//collect items
var bullets, bulletsImage, bomb, bombImage, bulletsGroup, bombsGroup

function preload(){
    backgroundImage=loadImage("assets/background.png")

    playerImage=loadImage("assets/Player.png")

    zombieImage=loadImage("assets/Zombie.png")

    heart=loadImage("assets/Heart.png")

    brokenHeart=loadImage("assets/Heartbroken.png")

    bulletsImage=loadImage("assets/ammo.png")

    bombImage=loadImage("assets/dynamite.png")

    comicImage=loadImage("assets/comic.jpeg")

    explosion=loadImage("assets/explosion.png")

    scoreCountImage=loadImage("assets/scoreImage.png")
    
    bulletCountImage=loadImage("assets/bulletCountFoto.png")

    bombCountImage=loadImage("assets/bombCountFoto.png")

    explosionSound=loadSound("assets/explosion.mp3")
    
    gunshot=loadSound("assets/gunshot.wav")
   
    mainTheme=loadSound("assets/mainTheme.mp3")
}

function setup(){
    //To size canvas as window dimensions
    createCanvas(windowWidth, windowHeight)

    player=createSprite(width/2, height/2)
    player.addImage(playerImage)
    player.scale=0.25

    player.visible=false

    comic=createSprite(width/2, height/2)
    comic.addImage(comicImage)
    comic.scale=0.6
    comic.visible=true

    bulletGroup=createGroup()

    zombiesGroup=createGroup()

    bulletsGroup=createGroup()

    bombsGroup=createGroup()
}

function draw(){
    //loading image as background
    background(backgroundImage)

    //place holder text
    if(gameState===0){
        

        if(keyDown("space")){
            gameState=1
        }
    }

    if(gameState===1){
        //play the main theme
        if(!mainTheme.isPlaying()){
            mainTheme.play()

        }
        //show player
        player.visible=true

        //hide the comic
        comic.visible=false
       

        //movement of the players
        if(keyDown("w")){
        player.y-=5
    }

        if(keyDown("s")){
        player.y+=5
    }

        if(keyDown("a")){
        player.x-=5
    }

        if(keyDown("d")){
        player.x+=5
    }

    //Aiming for the player
        if(keyDown(RIGHT_ARROW)){
            player.rotation=90
        }

        if(keyDown(LEFT_ARROW)){
            player.rotation=270
        }

        if(keyDown(UP_ARROW)){
            player.rotation=0
        }

        if(keyDown(DOWN_ARROW)){
            player.rotation=180
        }

        //To make player shoot bullets
        if(keyDown("space")&&bulletCount>0){
            //To create a frequency of bullets
            if(frameCount % 10 ===0){
                if(!gunshot.isPlaying()){
                    gunshot.play()
                }

                bulletCount-=1

                //Depending on which side the player is facing
                if(player.rotation===0){
                    bullet1=createSprite(player.x+30, player.y, 5, 10)
                    bullet1.velocityY=-20
                    bullet1.depth=player.depth-1
                    bullet1.shapeColor="yellow"

                    bullet2=createSprite(player.x-30, player.y, 5, 10)
                    bullet2.velocityY=-20
                    bullet2.depth=player.depth-1
                    bullet2.shapeColor="yellow"

                    bulletGroup.add(bullet1)
                    bulletGroup.add(bullet2)

                    bullet1.lifetime=200
                    bullet2.lifetime=200
            }

                if(player.rotation===90){
                    bullet1=createSprite(player.x, player.y+30, 10, 5)
                    bullet1.velocityX=+20
                    bullet1.depth=player.depth-1
                    bullet1.shapeColor="yellow"

                    bullet2=createSprite(player.x, player.y-30, 10, 5)
                    bullet2.velocityX=+20
                    bullet2.depth=player.depth-1
                    bullet2.shapeColor="yellow"

                    bulletGroup.add(bullet1)
                    bulletGroup.add(bullet2)

                    bullet1.lifetime=200
                    bullet2.lifetime=200
                }

                if(player.rotation===180){
                    bullet1=createSprite(player.x-30, player.y, 5, 10)
                    bullet1.velocityY=+20
                    bullet1.depth=player.depth-1
                    bullet1.shapeColor="yellow"

                    bullet2=createSprite(player.x+30, player.y, 5, 10)
                    bullet2.velocityY=+20
                    bullet2.depth=player.depth-1
                    bullet2.shapeColor="yellow"

                    bulletGroup.add(bullet1)
                    bulletGroup.add(bullet2)

                    bullet1.lifetime=200
                    bullet2.lifetime=200
                }

                if(player.rotation===270){
                 bullet1=createSprite(player.x, player.y-30, 10, 5)
                 bullet1.velocityX=-20
                 bullet1.depth=player.depth-1
                 bullet1.shapeColor="yellow"

                 bullet2=createSprite(player.x, player.y+30, 10, 5)
                 bullet2.velocityX=-20
                 bullet2.depth=player.depth-1
                 bullet2.shapeColor="yellow"

                 bulletGroup.add(bullet1)
                 bulletGroup.add(bullet2)

                 bullet1.lifetime=75
                 bullet2.lifetime=75
                }
        }

    }

    bulletGroup.overlap(zombiesGroup,(bullet1, zombie1)=>{
        bullet1.destroy()
        zombie1.destroy()

        score+=1
        zombieFrequency-=1
        zombieLeft-=0.05
        zombieRight+=0.05
    })

    player.overlap(bulletsGroup,(player1, bullets1)=>{
        bullets1.destroy()

        bulletCount+=5
    })

    player.overlap(bombsGroup,(player1, bombs1)=>{
        bombs1.destroy()

        bombCount+=1
    })

    zombiesGroup.overlap(player,(zombie1, player1)=>{
        player.y+=30
        zombie1.destroy()
        
        lives-=1
    })

    //if(bombCount>0){
    //     image(explosion, mouseX, mouseY)
    // }

    //spawning zombies
    spawnZombies()

    //spawn bullets
    spawnBullets()

    //spawn bombs
    spawnBombs()
    
    textSize(20)
    fill("red")
    scoreCount=createSprite(30, 25)
    scoreCount.addImage(scoreCountImage)
    scoreCount.scale=0.1
    
    text("x"+score,60, 30)

    bulletDisplay=createSprite(120, 25)
    bulletDisplay.addImage(bulletCountImage)
    bulletDisplay.scale=0.1
    text("x"+bulletCount, 150, 30)

    bombDisplay=createSprite(210, 25)
    bombDisplay.addImage(bombCountImage)
    bombDisplay.scale=0.1
    text("bombs="+bombCount, 240, 30)

    text('lives='+lives, width-150, 110)
    }

    drawSprites()
}

function spawnZombies(){
//to maintain frequency
    if(frameCount % zombieFrequency === 0){
        zombie=createSprite(random([0,width]),Math.round(random(0, height)))
        zombie.addImage(zombieImage)
        zombie.scale=0.25
        
        zombie.lifetime=600

        zombiesGroup.add(zombie)
        
        if(zombie.position.x<=width/2){
            zombie.velocityX =zombieRight
            zombie.rotation=90
        }  
        else{
            zombie.velocityX =zombieLeft
            zombie.rotation=270
        }
    }
}

function spawnBullets(){
    if(frameCount % 500 === 0){
        bullets=createSprite(Math.round(random(0, width)), Math.round(random(0, height)))
        bullets.addImage(bulletsImage)
        bullets.scale=0.2
        bulletsGroup.add(bullets)
    }
}

function spawnBombs(){
    if(frameCount % 1000 === 0){
        bomb=createSprite(Math.round(random(0, width)), Math.round(random(0, height)))
        bomb.addImage(bombImage)
        bomb.scale=0.1
        bombsGroup.add(bomb)
    }
}
