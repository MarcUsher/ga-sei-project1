
// NOTES:

// Initial notes

// Hover state to show possible moves for a piece
// Click & drop or drag & drop for moves; 
// Click to select piece to push/be pushed - click again to deselect?
// Rules for whether or not a piece can be pushed (anchor = NO, blocked by rails at the top/bottom = NO, if falling off the board (have invisible squares there?) then there's a little animation of the piece falling off


// First steps/notes

// Empty grid
// Objects on top
// Container is min width
// Object move logic is done by %?
// Draw a line to follow the mouse & snap to grid
//   - Click once to draw a line, click again to confirm teh move/press a button to cancel the move/
// Local storage = storage your move or the game state? Or you click reset game that's the only way? Also save scores?


// First phase

// Get start pages & grid set up 
// Create the Pieces on top that you can move one step at time


// Useful jQuery things:
// DRAGGABLE

// add class "highlight"
// https://api.jqueryui.com/draggable/#option-classes

// helper
// https://api.jqueryui.com/draggable/#option-helper

// opacity
// https://api.jqueryui.com/draggable/#option-opacity

// scope
// https://api.jqueryui.com/draggable/#option-scope

// revert

// DROPPABLE
// grid needs 'accept' condition

// https://api.jqueryui.com/droppable/

// Day 2 Notes:

// START GAME button
// Click to place pieces. White goes first (all 5), then brown (all 5), then it's white's go.

// START GAME FUNCTION
// White place, 2x circle, 3x square (potentially tracker to count how many clicks/counters on the board?)
// can only go GRID LEFT

// THEN 
// Brown place, 2x circle, 3x square (again tracker to count them)

// THEN goes into turn function.

// Essentially daisy chain functions - Start > Move (white move, brown move), > PUSH (victory conditions checked with each push: if no push possible then other player wins; if pieces remaining on board = 4 then person with 5 wins) > Move > Push > Move > Push > Move > Push etc.

// Problems to solve:
// - Empty grids, if a piece is moved onto there then -1 to the counter score and 'fade away' the piece
// - Don't allow moves onto empty space during MOVE action
// - Don't allow moves through other pieces during MOVE action
// - Push needs to push all of the ones in a specific direction


// TODAY
// - Nail initial board set up
// - Work on Daisy Chaining move functions & conditions, and SKIPPING A MOVE
// - Work out how to not allow moves on empty grids, and not to allow moves on other game pieces
// - ADD THE PROMPTS AT EACH STAGE eg. "White, add your pieces to the left of the board" ** Brown; "White, it's your go! Move up to 2 of your pieces, or click the 'Skip' button to skip your moves"; "White, choose a square piece and a direction to push all the pieces in a line 1 square in that direction."
//     - If you can't push, have a Forfeit button?




// WORKING JS CODE:

// Start Game

$('.button.skip p').html("<b>Start Game</b>")

$('.button.skip').click(function() {
    whiteStart();
})


$('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});


// Adding player tokens

function whiteStart() {
    $('.game-prompt p').html("<b>White</b>, place your tokens!");
    
    for (let whiteCircle = 0; whiteCircle < 2; whiteCircle ++) {
        $('.game-board').append("<div class='white circle'></div>");
        $('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});
    }
    for (let whiteSquare = 0; whiteSquare < 3; whiteSquare ++) {
        $('.game-board').append("<div class='white square'></div>");
        $('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});
    }
}



// $('.game-board').append("<div class='white circle'></div>")
// $('.game-board').append("<div class='brown square'></div>")

$('.grid').droppable({accept: ".brown", accept: ".white"})

$('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});

// $('.brown').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});




// Rules button Clicks

$('.button.rules').click(function() {
    $('.pop-up').toggle();
    // $('body').toggleClass('overlay');
})

$('.pop-up').click(function() {
    $('.pop-up').toggle();
})





// Player initial player scores
let whiteScore = 0;
$('#white-score').append("<p> " + whiteScore + " </p>")

let brownScore = 0;
$('#brown-score').append("<p> " + brownScore + " </p>")




// Player Turn Rules

let playerCount = 2;
let whiteMoves = 0;
let brownMoves = 0;

// if (playerCount % 2 !=0) {
//     whiteTurn();
// } else {
//     brownTurn();
// }

// This isn't quite working yet!

function whiteTurn() {
    $('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});
    playerCount ++;
    console.log(playerCount);
    console.log("White goes");
}

function brownTurn() {
    $('.brown').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});
    playerCount ++;
    console.log(playerCount);
    console.log("Brown goes");
}

function whiteMove() {
    ('.white').click(function() {
        whiteMoves ++;
        console.log("White moves: " + $(whiteMoves))
    })
}

function brownMove() {
    ('.brown').click(function() {
        brownMoves = brownMoves += 1;
        console.log("Brown moves: " + $(brownMoves))
    })
}

