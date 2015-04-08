define(["../lib/createjs"], function(){
    var VERTICAL_VELOCITY = 150;

    var Bar = function(color){
        if(!color){
            color = "black";
        }

        this.init(color);
    }

    Bar.prototype = new createjs.Shape();
    Bar.prototype.init = function(color) {
        this.initialize();

        this.width = 10;
        this.height = 30;
        this.graphics.beginFill(color).drawRect(0, 0, this.width, this.height);
    };

    Bar.prototype.reset = function(){
        this.y = this.parent.height/2 - this.height/2;
    }

    Bar.prototype.tick = function(event){
        deltaTime = event.delta;
        deltaY = (deltaTime/1000) * VERTICAL_VELOCITY * event.directionFactor;

        topBound = this.y + deltaY;
        bottomBound = this.y + this.height + deltaY;

        if(topBound <= 0){
            this.y = 0;
        }else if(bottomBound >= this.parent.height){
            this.y = this.parent.height - this.height;
        }else{
            this.y += deltaY;
        }
    }

    return Bar;
});