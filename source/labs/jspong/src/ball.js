define(["bar", "../lib/createjs"], function(){
    var HORIZONTAL_VELOCITY = 100;
    var VERTICAL_VELOCITY = 100;
    var RADIUS = 5;
    var DEFAULT_COLOR = "black";

    var Ball = function(leftBar, rightBar, color){
        if(!color){
            color = DEFAULT_COLOR;
        }

        this.init(leftBar, rightBar, color);
    }

    Ball.prototype = new createjs.Shape();
    Ball.prototype.init = function(leftBar, rightBar, color) {
        this.initialize();

        this.radius = RADIUS;
        this.leftBar = leftBar;
        this.rightBar = rightBar;

        this.graphics.beginFill(color).drawCircle(0, 0, this.radius);

        this.loadSounds();
    };

    Ball.prototype.loadSounds = function(){
        createjs.Sound.registerSound({id:"hit1", src:"snd/hit1.mp3|snd/hit1.ogg"});
        createjs.Sound.registerSound({id:"hit2", src:"snd/hit2.mp3|snd/hit2.ogg"});
    }

    Ball.prototype.reset = function(){
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;

        verticalDirectionFactor = Math.cos(Math.random(180) * Math.PI) > 0 ? 1 : -1;
        horizontalDirectionFactor = Math.cos(Math.random(180) * Math.PI) > 0 ? 1 : -1;

        this.verticalVelocity = VERTICAL_VELOCITY * verticalDirectionFactor;
        this.horizontalVelocity = HORIZONTAL_VELOCITY * horizontalDirectionFactor;
    }

    Ball.prototype.tick = function(event){
        delta = event.delta;
        diameter = this.radius / 2;

        topBound = this.y - diameter + this.getDeltaY(delta);
        bottomBound = this.y + diameter + this.getDeltaY(delta);
        leftBound = this.x - diameter + this.getDeltaX(delta);
        rightBound = this.x + diameter + this.getDeltaX(delta);

        if(rightBound < 0 || leftBound > this.parent.width){
            escapedFromLeftSide = rightBound < 0;
            this.outOfBounds(escapedFromLeftSide);
            return;
        }else{
            if(bottomBound >= this.parent.height || topBound <= 0){
                this.verticalVelocity *= -1;
                createjs.Sound.play("hit1");
            }

            ballAndLeftBarOnSameVerticalPoint = (bottomBound >= this.leftBar.y) && (topBound <= this.leftBar.y + this.leftBar.height);
            ballAndLeftBarOnSameHorizontalPoint = (rightBound >= this.leftBar.x) && (leftBound <= this.leftBar.x + this.leftBar.width);
            ballIsHittingLeftBar = ballAndLeftBarOnSameVerticalPoint && ballAndLeftBarOnSameHorizontalPoint;

            ballAndRightBarOnSameVerticalPoint = (bottomBound >= this.rightBar.y) && (topBound <= this.rightBar.y + this.rightBar.height);
            ballAndRightBarOnSameHorizontalPoint = (rightBound >= this.rightBar.x) && (leftBound <= this.rightBar.x + this.rightBar.width);
            ballIsHittingRightBar = ballAndRightBarOnSameVerticalPoint && ballAndRightBarOnSameHorizontalPoint;

            if(ballIsHittingLeftBar || ballIsHittingRightBar){
                this.horizontalVelocity *= -1;
                createjs.Sound.play("hit2");
            }

            this.x += this.getDeltaX(delta);;
            this.y += this.getDeltaY(delta);
        }
    }

    Ball.prototype.getDeltaX = function(deltaTime){
        return (deltaTime/1000) * this.horizontalVelocity;
    }

    Ball.prototype.getDeltaY = function(deltaTime){
        return (deltaTime/1000) * this.verticalVelocity;
    }

    Ball.prototype.outOfBounds = function(isLeftSide) {
        event = new createjs.Event("outOfBounds");
        event.isLeftSide = isLeftSide;
        this.dispatchEvent(event);
    };

    return Ball;
});