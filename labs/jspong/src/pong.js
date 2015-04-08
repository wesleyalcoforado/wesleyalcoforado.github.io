define(["ball", "bar", "../lib/createjs"], function(Ball, Bar){
    var KEYCODE_UP = 38;
    var KEYCODE_DOWN = 40;
    var DIRECTION_UP = -1;
    var DIRECTION_DOWN = 1;
    var PLAYABLEAREA_WIDTH = 400;
    var INFOAREA_WIDTH = 100;
    var HEIGHT = 200;
    var MARGIN = 8;

    var Pong = function(canvasId){
        canvas = document.getElementById(canvasId);
        canvas.width = PLAYABLEAREA_WIDTH + INFOAREA_WIDTH + MARGIN;
        canvas.height = HEIGHT;

        this.initialize(canvasId);
    };

    Pong.prototype = new createjs.Stage;
    Pong.prototype.super_initialize = Pong.prototype.initialize;

    Pong.prototype.initialize = function(canvasId){
        this.super_initialize(canvasId);

        this.createPlayableArea();
        this.createInfoArea();
        this.applyClippingMask();

        //attaching event handlers
        var that = this;
        document.onkeydown = function(e){ that.handleKeyDown(e); };
        document.onkeyup = function(e){ that.handleKeyUp(e); };

        this.ball.addEventListener("outOfBounds", function(event){ that.outOfBoundsHandler(event); });

    }

    Pong.prototype.createPlayableArea = function(){
        this.playableArea = new createjs.Container();
        this.playableArea.width = PLAYABLEAREA_WIDTH;
        this.playableArea.height = this.canvas.height;

        background = new createjs.Shape();
        background.graphics.beginStroke("black").drawRect(0, 0, this.playableArea.width, this.playableArea.height);
        this.leftBar = new Bar("red");
        this.rightBar = new Bar("blue");
        this.ball = new Ball(this.leftBar, this.rightBar);

        //adding elements onto the scene
        this.addChild(this.playableArea);
        this.playableArea.addChild(background);
        this.playableArea.addChild(this.ball);
        this.playableArea.addChild(this.leftBar);
        this.playableArea.addChild(this.rightBar);

        //customizing right bar position
        this.rightBar.x = this.playableArea.width - this.rightBar.width;
    }

    Pong.prototype.createInfoArea = function(){
        this.infoArea = new createjs.Container();
        this.infoArea.width = INFOAREA_WIDTH;
        this.infoArea.height = this.canvas.height;
        this.infoArea.x = this.playableArea.width + MARGIN;

        background = new createjs.Shape();
        background.graphics.beginStroke("black").drawRect(0, 0, this.infoArea.width, this.infoArea.height);

        labelRed = new createjs.Text("Red", "bold 10px Tahoma", "red");
        labelRed.x = 5;
        labelRed.y = 5;

        labelBlue = new createjs.Text("Blue", "bold 10px Tahoma", "blue");
        labelBlue.x = this.infoArea.width - labelBlue.getMeasuredWidth() - 5;
        labelBlue.y = 5;

        this.leftPointsLabel = new createjs.Text("0");
        this.leftPointsLabel.x = labelRed.x;
        this.leftPointsLabel.y = labelRed.y + 10;

        this.rightPointsLabel = new createjs.Text("0");
        this.rightPointsLabel.x = labelBlue.x;
        this.rightPointsLabel.y = labelBlue.y + 10;

        this.addChild(this.infoArea);
        this.infoArea.addChild(background);
        this.infoArea.addChild(labelRed);
        this.infoArea.addChild(labelBlue);
        this.infoArea.addChild(this.rightPointsLabel);
        this.infoArea.addChild(this.leftPointsLabel);
    }

    Pong.prototype.applyClippingMask = function(){
        mask = new createjs.Shape();
        mask.graphics.drawRect(0, 0, this.playableArea.width, this.playableArea.height);
        mask.graphics.drawRect(this.infoArea.x, 0, this.infoArea.width, this.infoArea.height);

        this.mask = mask;
    }


    Pong.prototype.start = function(){
        this.rightPoints = 0;
        this.leftPoints = 0;

        var that = this;
        createjs.Ticker.addEventListener("tick", function(event){ that.tick(event); });
        createjs.Ticker.setFPS(60);
        this.reset();
    }

    Pong.prototype.reset = function(){
        this.leftBar.reset();
        this.rightBar.reset();
        this.ball.reset();

        this.areBarsStill = true;
        this.barDirection = DIRECTION_UP;

        createjs.Ticker.setPaused(false);
    }

    Pong.prototype.tick = function(event){
        if(!createjs.Ticker.getPaused()){
            event.directionFactor = this.barDirection;

            if(!this.areBarsStill){
                this.leftBar.tick(event);
                this.rightBar.tick(event);
            }

            this.ball.tick(event);
            this.update();
        }
    }

    Pong.prototype.handleKeyDown = function(event){
        if(!event) event = window.event;

        switch(event.keyCode){
            case KEYCODE_UP:
                this.areBarsStill = false;
                this.barDirection = DIRECTION_UP;
                break;
            case KEYCODE_DOWN:
                this.areBarsStill = false;
                this.barDirection = DIRECTION_DOWN;
                break;
        }
    }

    Pong.prototype.handleKeyUp = function(event){
        this.areBarsStill = true;
    }

    Pong.prototype.outOfBoundsHandler = function(event) {
        if(event.isLeftSide){
            this.rightPoints++;
        }else{
            this.leftPoints++;
        }

        this.updateInfo();
        this.ball.reset();
    };

    Pong.prototype.updateInfo = function(){
        this.leftPointsLabel.text = this.leftPoints;
        this.rightPointsLabel.text = this.rightPoints;

        this.update();
    }

    return Pong;
})