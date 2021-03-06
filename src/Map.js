class Map {
    #mapDisplayer;
    #positionManager;
    #nbCells;
    #nbObstacles;
    #listCells;
    #curListIndex = 0;
    #width;
    #height;
    #currentPlayer;
    #players;

    constructor(width, height, nbObstacles) {
        this.#mapDisplayer = new MapDisplayer(width, height, this);
        this.#listCells = [];
        this.#positionManager = new PositionManager(this.#listCells, width, height);
        this.#nbCells = width * height;
        this.#nbObstacles = nbObstacles;
        this.#width = width;
        this.#height = height;
    }

    clearTurn (){
        this.removeMoveCells();
        this.#mapDisplayer.drawMap(this.#listCells);
    }

    setNextTurn() {
        this.#currentPlayer = this.#currentPlayer.typePlayer === PLAYER_TYPE.PLAYER1 ? this.#players[1] : this.#players[0];
    }

    addCell (x, y, type) {
        this.#listCells[this.#curListIndex] = {
            type,
            x,
            y,
        };
        this.#curListIndex++;
    }

    initBoard () {
        this.#mapDisplayer.drawBackground();
        let x = 0;
        let y = 0;

        for (let i = 0; i < this.#nbCells; i++) {
            this.addCell(x, y, CELL_TYPES.EMPTYCELL);
            this.#mapDisplayer.drawBorder(x, y);
            x++;
            if (x === this.#width) {
                x = 0;
                y++;
            }
            // passer a la ligne suivante
        }
    }

    initObstacles () {
        for (let i = 0; i < this.#nbObstacles; i++){
            const newObstacle = new Obstacle(this.#positionManager)
            this.#listCells[(newObstacle.y * this.#width) + newObstacle.x] = newObstacle;
            this.#mapDisplayer.drawObstacle(newObstacle);
        }
    }

    initPlayer (typePlayer) {
        const newPlayer = new Player(this.#positionManager, typePlayer)
        this.#listCells[(newPlayer.y * this.#width) + newPlayer.x] = newPlayer;
        this.#mapDisplayer.drawPlayer(newPlayer);
        return newPlayer;
    }

    initWeapon (typeWeapon) {
        const newWeapon = new Weapon(this.#positionManager, typeWeapon)
        this.#listCells[(newWeapon.y * this.#width) + newWeapon.x] = newWeapon;
        this.#mapDisplayer.drawWeapon(newWeapon);
    }

    initMoves (player) {
        for(let i = 1; i <= 3; i++) {
            if (player.y - i < 0){
                break;
            }
            const newMove = new Move(player.x, player.y - i)
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.EMPTYCELL)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x] = newMove;
                this.#mapDisplayer.drawMove(newMove);
            }
            // si la case est vide je peux me deplacer dessus
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.WEAPON)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x].makePickable();
                this.#mapDisplayer.drawMove(newMove);
                this.#mapDisplayer.drawWeapon(this.#listCells[(newMove.y * this.#width) + newMove.x]);
            }
            // si la case posede une arme je peux me deplacer dessus et la ramasser
            if(this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.OBSTACLE
                || this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.PLAYER)
            {
                break;
            }
            // si il y a un obstacle ou un joueur je sors de la boucle
        }
        for(let i = 1; i <= 3; i++) {
            if (player.y + i >= this.#height){
                break;
            }
            const newMove = new Move(player.x, player.y + i)
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.EMPTYCELL)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x] = newMove;
                this.#mapDisplayer.drawMove(newMove);
            }
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.WEAPON)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x].makePickable();
                this.#mapDisplayer.drawMove(newMove);
                this.#mapDisplayer.drawWeapon(this.#listCells[(newMove.y * this.#width) + newMove.x]);
            }
            if(this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.OBSTACLE
                || this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.PLAYER)            {
                break;
            }
        }
        for(let i = 1; i <= 3; i++) {
            if (player.x - i < 0){
                break;
            }
            const newMove = new Move(player.x - i, player.y)
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.EMPTYCELL)
            {
                    this.#listCells[(newMove.y * this.#width) + newMove.x] = newMove;
                    this.#mapDisplayer.drawMove(newMove);
            }
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.WEAPON)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x].makePickable();
                this.#mapDisplayer.drawMove(newMove);
                this.#mapDisplayer.drawWeapon(this.#listCells[(newMove.y * this.#width) + newMove.x]);
            }
            if(this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.OBSTACLE
                || this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.PLAYER)            {
                break;
            }
        }
        for(let i = 1; i <= 3; i++) {
            if (player.x + i >= this.#width){
                break;
            }
            const newMove = new Move(player.x + i, player.y)
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.EMPTYCELL)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x] = newMove;
                this.#mapDisplayer.drawMove(newMove);
            }
            if (this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.WEAPON)
            {
                this.#listCells[(newMove.y * this.#width) + newMove.x].makePickable();
                this.#mapDisplayer.drawMove(newMove);
                this.#mapDisplayer.drawWeapon(this.#listCells[(newMove.y * this.#width) + newMove.x]);
            }
            if(this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.OBSTACLE
                || this.#listCells[(newMove.y * this.#width) + newMove.x].type === CELL_TYPES.PLAYER)            {
                break;
            }
        }
    }

    moveCurrentPlayer (x, y) {
        const oldX = this.#currentPlayer.x;
        const oldY = this.#currentPlayer.y;

        // si c'est une case  type move (orange)
        if (!this.#currentPlayer.canMoveTo(x, y)){
            return false;
        }

        // si currentPlayer possede une ancienne arme il va la deposer a la old position du joueur & remettre la
        // old weapon du joueur a null
        if (this.#currentPlayer.oldWeapon) {
            this.#listCells[(oldY * this.#width) + oldX] = this.#currentPlayer.oldWeapon;
            this.#currentPlayer.clearOldWeapon();
        } else {
            // si il n'a pas dancienne arme, on va mettre une case vide
            this.#listCells[(oldY * this.#width) + oldX] = {
                type: CELL_TYPES.EMPTYCELL,
                x: oldX,
                y: oldY,
            };
        }

        // on va verifier si la case ou on a cliquer est du type weapon
        if (this.#currentPlayer.canPickUp(x, y)){
            // on va changer d'arme
            this.#currentPlayer.changeWeapon(this.#listCells[y * this.#width + x])
            this.#mapDisplayer.updatePlayerInfos(this.#currentPlayer);
        }

        this.#currentPlayer.move(x, y);
        this.#listCells[(y * this.#width) + x] = this.#currentPlayer;
        if (this.#positionManager.isPlayerAroundMe(x, y)){
            this.clearTurn();
            this.startFightMode();
            return;
        }
        // si un joueur est a cote , je lance le combat
        this.clearTurn();
        this.setNextTurn();
        this.#mapDisplayer.drawMap(this.#listCells);
        this.initMoves(this.#currentPlayer);
    }

    startFightMode(){
        document.getElementById('attack').style.display = 'flex';
        document.getElementById('defense').style.display = 'flex';
        document.getElementById("attack").addEventListener('click', function(e) {
            document.getElementById("song").play();
        });
        document.getElementById('attack').addEventListener('click', this.attack.bind(this), false);
        document.getElementById('defense').addEventListener('click', this.defense.bind(this), false);
    }

    attack (){
        const victim = this.#players[0].typePlayer === this.#currentPlayer.typePlayer ? this.#players[1] : this.#players[0];
        // on detecte quel joueur est la victime
        this.#currentPlayer.fight(victim);
        this.#mapDisplayer.updatePlayerInfos(victim);
        // on met a jour les infos du joueur au fur et a mesure
        // si la vie du joueur arrive a 0 je stop le jeu
        if(victim.lifePoint === 0){
            // execution au prochain tour de priorite car sinon l'alert s'active avant laffichage des points de vies
            const intervalId = setInterval(() => {
                alert('Bravo, tu as gagné contre ton adversaire ! Clique sur OK pour relancer une partie.')
                window.clearInterval(intervalId);
                window.location.reload();
            })
        }
        this.setNextTurn();
    }

    defense (){
        this.#currentPlayer.defend();
        this.setNextTurn();
    }

    removeMoveCells(){
        for(let i = 0; i < this.#listCells.length; i++){
            if (this.#listCells[i].type === CELL_TYPES.MOVE){
                this.#listCells[i] = {
                    type: CELL_TYPES.EMPTYCELL,
                    x: this.#listCells[i].x,
                    y: this.#listCells[i].y,
                };
            }
        }
    }

    createMap() {
        this.initBoard()
        // j'affiche le plateau
        this.initObstacles();
        // j'affiche les obstacles
        this.#players = [this.initPlayer(PLAYER_TYPE.PLAYER1), this.initPlayer(PLAYER_TYPE.PLAYER2)];
        this.#currentPlayer = this.#players[0];
        // joeur par defaut numero 1
        this.initWeapon(WEAPON_TYPE.WEAPON1);
        this.initWeapon(WEAPON_TYPE.WEAPON2);
        this.initWeapon(WEAPON_TYPE.WEAPON3);
        // j'affiche les armes
        this.initMoves(this.#currentPlayer);
        // deplacement
        this.#mapDisplayer.updatePlayerInfos(this.#players[0]);
        this.#mapDisplayer.updatePlayerInfos(this.#players[1]);
        // j'actualise les infos du joueur
    }
}
