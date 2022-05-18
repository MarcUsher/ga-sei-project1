
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


// Game object knows all
// droppable drop method checks game status and updates grid classes
// droppable activate method checks game status and updates grid classes

// WORKING JS CODE:

let game = {
    status: "setup", // all options are: setup, whitemove, whitepush, brownmove, brownpush, end
    // grid: {
    //     row1: [-1, -1, 0, 0, 0, 0, 0, -1],
    //     row2: [0, 0, 0, 0, 0, 0, 0, 0],
    //     row3: [0, 0, 0, 0, 0, 0, 0, 0],
    //     row4: [-1, 0, 0, 0, 0, 0, -1, -1],
    // },
}

// -1 = not allowed; 0 = empty; 1 = white circle; 2 = white square; 3 = black circle; 4 = black square
// have a second array at the point where someone grabs hold of something and work out from that one where they can or can't move to




// Make each row here an object within the object
// Include the counters and all game info in here eg. white move, brown move etc.

// Function that fires every time someone interacts with the board and checks the game object, and this function decides what it can call and what someone can do. --UNNECESSARY?

// Start button asks the game object what status are you in, and what should I do?
// So if game hasn't started then start the game
// If it has started then go on to the white move




// Each move, update object from 0 to 1
// on alternate turns, don't allow player to move other player's divs



// START GAME

// So because all the droppable methods apply when "accepted draggable" elements are moved 
// we can't go about enabling/disabling droppables, because they won't trigger the logic they need to 
// when their token gets moved again. I've has tried utilising snap as a way to disable user placing 2 tokens
// on the same square but to no avail. scope is also a no go as anything outside of a scope isn't an
// "accepted draggable". This leads me to believe some form of game object IS necessary. Perhaps the draggable
// start function is the correct trigger for updating this game object (as it triggers upon picking up a token).
// Likewise stop (draggable) could be used in the same way.


$('.button.skip p').html("<b>Start Game</b>");

// when the game starts destroy all the logic from init()
// https://api.jqueryui.com/droppable/#method-destroy

function init() {

    $('.token').draggable({
        containment: '.game-area',
        revert: 'invalid',
        start: function( event, ui ) {
            var $token = $(this);
            updateGameSetup($token);
        },
    });

    $('.grid--unoccupied').droppable({
        accept: '.token',
        tolerance: 'pointer',
        drop: function(ev, ui) {
            var token = ui.draggable;
            var $droppedOn = $(this);
            dropBehaviour(token, $droppedOn, 'white');
        },
    });

    // $('.grid.left').droppable({
    //     accept: '.token--white',
    //     tolerance: 'pointer',
    //     drop: function(ev, ui) {
    //         var token = ui.draggable;
    //         var $droppedOn = $(this);
    //         dropBehaviour(token, $droppedOn, 'white');
    //     },
    //     out: function(ev, ui) {
    //         var $draggedFrom = $(this);
    //         outBehaviour($draggedFrom, 'white');
    //     },
    // });

    // $('.grid.right').droppable({
    //     accept: '.token--brown',
    //     tolerance: 'pointer',        
    //     drop: function(ev, ui) {
    //         var token = ui.draggable;
    //         var $droppedOn = $(this);
    //         dropBehaviour(token, $droppedOn, 'brown');
    //     },
    //     out: function(ev, ui) {
    //         var $draggedFrom = $(this);
    //         outBehaviour($draggedFrom, 'brown');
    //     },
    // });

    // Token dropped successfully
    function dropBehaviour(token, $droppedOn, team) {
        if(!token || !$droppedOn || !team) {
            console.log('dropBehaviour isnt being passed all the parameters it needs.');
            return;
        }
        // console.log($droppedOn.position());
        var droppedTop = $droppedOn.position().top;
        var droppedLeft = $droppedOn.position().left;        
        var droppedPosition = $droppedOn.attr('data-position');
        console.log(droppedPosition, 'pos');

        $(token).attr('data-position', droppedPosition);
        $(token).detach().css({position: 'absolute', top: droppedTop, left: droppedLeft}).appendTo($droppedOn);
        $(token).addClass('token--placed');
        $droppedOn.removeClass('grid--unoccupied');
        $droppedOn.addClass('grid--occupied');

        // $droppedOn.addClass('grid--occupied grid--occupied-' + team);
        // Loop through gridItems and update (need to make up a way to connect token placed to grid item)
        // disableDroppables($droppedOn);
    }

    // Token picked up and moved
    // function outBehaviour($draggedFrom, team) {
    //     // console.log($draggedFrom, 'draggedFrom');
    //     if(!$draggedFrom || !team) {
    //         console.log('dropBehaviour isnt being passed all the parameters it needs.');
    //         return;
    //     }
    //     $draggedFrom.addClass('grid--unoccupied');
    //     $draggedFrom.removeClass('grid--occupied');

    //     // $draggedFrom.removeClass('grid--occupied grid--occupied-' + team);
    //     // enableDroppables($draggedFrom);
    // }

    function disableDroppables($elements) {
        if (!$elements) {return;}
        $elements.droppable("disable");
    }

    function enableDroppables($elements) {
        if (!$elements) {return;}
        $elements.droppable("enable");
    }

    function updateGameSetup($token) {
        var $gridItems = $('.grid');
        $gridItems.each(function(index, value) {
            var gridOccupied = false;
            var gridLeft = Math.round($(value).position().left);
            var gridTop = Math.round($(value).position().top);

            var $tokens = $('.token');
            $tokens.each(function(index, value) {
                var tokenLeft = Math.round($(value).position().left);
                var tokenTop = Math.round($(value).position().top);
                if (tokenLeft === gridLeft && tokenTop === gridTop) {
                    gridOccupied = true;
                } 
            });

            if (gridOccupied) {
                $(value).addClass('grid--occupied');
                $(value).removeClass('grid--unoccupied');
                disableDroppables($(value));
            } else {
                $(value).removeClass('grid--occupied');
                $(value).addClass('grid--unoccupied');
                enableDroppables($(value));
            }

            // Check for game logic, where can this token move etc?

            if ($token.attr('data-position') === $(value).attr('data-position')) {
                $(value).removeClass('grid--occupied');
                $(value).addClass('grid--unoccupied');
                enableDroppables($(value));
            }

            // TODO: What about when it gets reverted?!

        });
    }



}

init();

// function startGame() {
//     $('.button.skip').click(function() {
//         whiteStart();
//     })
// }

// startGame();


// function whiteStart() {
//     $('.game-prompt p').html("<b>White</b>, place your tokens on the left-hand side of the board!");
//     $('.button.skip').off("click"); 
//      $('.button.skip p').html("<b>Empty button</b>");
//     $('.grid').each(function () {
//         $(this).children("div").on("mouseenter", (function () {
//             $(this).addClass('white');
//             console.log("mouse enter")
//         }))
//         $(this).children("div").on("mouseleave", (function () {
//             $(this).removeClass('white')
//             console.log("mouse leave")
//         }))
//         $(this).children("div").on("click", (function () {
//             $(this).off('mouseleave')
//         }))
//     })
//     }



// function whiteStart() {
//     $('.game-prompt p').html("<b>White</b>, place your tokens on the left-hand side of the board!");
//     $('.button.skip').off("click");
//     $('.button.skip p').html("<b>Empty button</b>");
//     let whiteTiles = 0;
//     $('.grid.left').each(function () {
//         $(this).on("mouseenter", (function () {
//             $(this).children("div").addClass('white');
//             // console.log("mouse enter")
//         }))
//         $(this).on("mouseleave", (function () {
//             $(this).children("div").removeClass('white')
//             // console.log("mouse leave")
//         }))
//         $(this).children("div").on("click", (function () {
//             $(this).addClass("white");
//             $(this).parent().off('mouseleave');
//             whiteTiles ++;
//             console.log(whiteTiles);
//             // console.log("mouse click");
//             if (whiteTiles === 3) {
//                 $('.grid.left').each(function () {
//                     $(this).on("mouseenter", (function () {
//                         $(this).children("div").addClass('circle');
//                         // console.log("mouse enter")
//                     }))
//                     $(this).on("mouseleave", (function () {
//                         $(this).children("div").removeClass('circle')
//                         // console.log("mouse leave")
//                     }))
//                     $(this).children("div").on("click", (function () {
//                         $(this).addClass("circle");
//                         $(this).parent().off('mouseleave');
//                         whiteTiles ++;
//                         if (whiteTiles === 5) {
//                             console.log("YOU DID IT");
//                             brownStart();
//                         }return false;
//                     }))
//                 })
//             }
//         }))
//     })
// }

// function brownStart() {
//     $('.game-prompt p').html("<b>Brown</b>, place your tokens on the left-hand side of the board!");
//     $('.button.skip').off("click");
//     let brownTiles = 0;
//     $('.grid.right').each(function () {
//         $(this).on("mouseenter", (function () {
//             $(this).children("div").addClass('brown');
//             // console.log("mouse enter")
//         }))
//         $(this).on("mouseleave", (function () {
//             $(this).children("div").removeClass('brown')
//             // console.log("mouse leave")
//         }))
//         $(this).children("div").on("click", (function () {
//             $(this).addClass("brown");
//             $(this).parent().off('mouseleave');
//             brownTiles ++;
//             console.log(brownTiles);
//             // console.log("mouse click");
//             if (brownTiles === 3) {
//                 $('.grid.right').each(function () {
//                     $(this).on("mouseenter", (function () {
//                         $(this).children("div").addClass('circle');
//                         // console.log("mouse enter")
//                     }))
//                     $(this).on("mouseleave", (function () {
//                         $(this).children("div").removeClass('circle')
//                         // console.log("mouse leave")
//                     }))
//                     $(this).children("div").on("click", (function () {
//                         $(this).addClass("circle");
//                         $(this).parent().off('mouseleave');
//                         brownTiles ++;
//                         if (brownTiles === 5) {
//                             console.log("YOU DID IT");
//                             return false;
//                         }return false;
//                     }))
//                 })
//             }
//         }))
//     })
// }

// function emptyFunction(){
//     console.log("Crowe")
// }


// ADDING PLAYER TOKENS



// Via Draggable - adds the right number but how to check if they're 'set'?

// function whiteStart() {
//     $('.game-prompt p').html("<b>White</b>, place your tokens on the left-hand side of the board!");
//     $('.button.skip').off("click");
//     $('.button.skip p').html("<b>Empty button</b>");
//     for (let whiteCircle = 0; whiteCircle < 2; whiteCircle ++) {
//         $('.game-board').append("<div class='white circle'></div>");
//         $('.white.circle').draggable({ containment: ".game-board", snapMode: "inner", scroll: false, snap: ".left", snapTolerance: 100, opacity: 0.5});
//         $('.left').droppable({accept: ".white.circle"});
//     }
//     for (let whiteSquare = 0; whiteSquare < 3; whiteSquare ++) {
//         $('.game-board').append("<div class='white square'></div>");
//         $('.white.square').draggable({ containment: ".game-board", snapMode: "inner", scroll: false, snap: ".grid.left", snapTolerance: 100, opacity: 0.5});
//         $('.grid.left').droppable({accept: ".white.square"});
//     }
// }

// function revert () {
//     return true;
// }


// function brownStart () {
//     $('.game-prompt p').html("<b>Brown</b>, place your tokens on the left-hand side of the board!");
//     $('.button.skip').off("click");
//     for (let whiteCircle = 0; whiteCircle < 2; whiteCircle ++) {
//         $('.game-board').append("<div class='white circle'></div>");
//         $('.white').draggable({ containment: ".game-board", snapMode: "inner", scroll: false, snap: ".grid.left", revert: "invalid", snapTolerance: 100, opacity: 0.5});
//     }
//     for (let whiteSquare = 0; whiteSquare < 3; whiteSquare ++) {
//         $('.game-board').append("<div class='white square'></div>");
//         $('.white').draggable({ containment: ".game-board", snapMode: "inner", scroll: false, snap: ".grid.left", revert: "invalid", snapTolerance: 100, opacity: 0.5});
//     }
// }




// Via Mouseenter/Mouseleave/Click
    

// function whiteStart() {
//     $('.game-prompt p').html("<b>White</b>, place your tokens!");
//     $('.button.skip').off("click");
//     let whiteCircle = 0;
//     if (whiteCircle === 2) {
//         console.log("White Done!")
//     } else {
//         $('game-board').on("click", (function () {
//             $(this).append("<div class='white circle'></div>");
//             whiteCircle ++;
//             console.log(whiteCircle);
//         }))
//         $('.white.circle').on("click", (function () {
//              $(this).remove(".white.circle")
//              whiteCircle --;
//              console.log(whiteCircle);
//              console.log("click two");
//         }))
//         $('.white.circle').on("dblclick", (function () {
//             $(".white.circle").off("click");
//             console.log("click!");
//             console.log(whiteCircle);
//         }))
//     }
    
// }




// Hover Method - NOT WORKING


// function whiteStart() {
//     $('.game-prompt p').html("<b>White</b>, place your tokens on the left-hand side of the board!");
//     $('.button.skip').off("click");
//     let whiteCircle = 0;
//     if (whiteCircle === 2) {
//         console.log("White Done!");
//     } else {
//         $('grid-left').hover(function() {
//             $(this).append("<div class='white circle'></div>");
//             whiteCircle ++;
//             console.log(whiteCircle)
//         }, function (){
//             $(this).remove(".white.circle")
//             whiteCircle --;
//             console.log(whiteCircle);
//             console.log("Mouse leave")
//         })
//     }
// }





// GENERAL PLAYER TOKENS TESTING

// $('.game-board').append("<div class='white circle'></div>")
// $('.game-board').append("<div class='brown square'></div>")

// $('.grid').droppable({accept: ".brown", accept: ".white"})

// $('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});

// $('.brown').draggable({ containment: ".game-board", scroll: false, snap: ".grid", snapTolerance: 100, opacity: 0.5});




// RULES BUTTON POP-UP

$('.button.rules').click(function() {
    $('.pop-up').toggle();
    // $('body').toggleClass('overlay');
})

$('.pop-up').click(function() {
    $('.pop-up').toggle();
})





// PLAYER SCORES

// let whiteScore = 0;
// $('#white-score').append("<p> " + whiteScore + " </p>")

// let brownScore = 0;
// $('#brown-score').append("<p> " + brownScore + " </p>")




// PLAYER TURN RULES

// let playerCount = 2;
// let whiteMoves = 0;
// let brownMoves = 0;

// if (playerCount % 2 !=0) {
//     whiteTurn();
// } else {
//     brownTurn();
// }





// This isn't quite working yet!

// function whiteTurn() {
//     console.log(playerCount);
//     console.log("White goes");
//     // Needs to throw to whiteMove, which then throws to whitePush, which then throws to brownMove, which then throws to brownPush, and so on.
// }

// function brownTurn() {
//     console.log(playerCount);
//     console.log("Brown goes");
//     // Needs to throw to brownMove, which then throws to brownPush, which then throws to whiteMove, which then throws to whitePush, and so on.
// }

// function whiteMove() {
//     ('.white').click(function() {
//         whiteMoves ++;
//         console.log("White moves: " + $(whiteMoves))
//     })
//     // Needs something that SETS the move, and actually adds one at that set
//     // Needs something to allow to SKIP the move
// }

// function brownMove() {
//     ('.brown').click(function() {
//         brownMoves = brownMoves += 1;
//         console.log("Brown moves: " + $(brownMoves))
//     })
//     // Needs something that SETS the move, and actually adds one at that set
//     // Needs something to allow to SKIP the move
// }