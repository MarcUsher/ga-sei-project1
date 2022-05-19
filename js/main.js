

// Game Object

let game = {
    status: "start", // all options are: start, setup, whitemove, whitepush, greenmove, greenpush, end
    // grid: {
    //     row1: [-1, -1, 0, 0, 0, 0, 0, -1],
    //     row2: [0, 0, 0, 0, 0, 0, 0, 0],
    //     row3: [0, 0, 0, 0, 0, 0, 0, 0],
    //     row4: [-1, 0, 0, 0, 0, 0, -1, -1],
    // },
}

// -1 = not allowed; 0 = empty; 1 = white circle; 2 = white square; 3 = black circle; 4 = black square
// have a second array at the point where someone grabs hold of something and work out from that one where they can or can't move to






// Constant game functions & variables

let currentGridItem = false;
let setupDraggables = false;
let setupDroppables = false;





// Audio effects

function playSoundDrop() {
    var soundfile = new Audio();
    function playSoundbite(file){
        soundfile = new Audio(file);
        soundfile.play();
    }
    playSoundbite(`audio/drop.wav`);
}

function playSoundPickup() {
    var soundfile = new Audio();
    function playSoundbite(file){
        soundfile = new Audio(file);
        soundfile.play();
    }
    playSoundbite(`audio/pickup.wav`);
}




// POP-UPS

// RULES POP-UP
$('.button.rules').click(function() {
    $('.rules.pop-up').toggle();
})

$('.rules.pop-up').click(function() {
    $('.rules.pop-up').toggle();
})



// TOKEN DROPPED SUCCESSFULLY
// Token drops on a grid square. The Function gets the position of the grid square where the token is being dropped and gives that token the same top & left position as the grid square, detaches the token from its previous parent and attaches it to this grid square, and updates the classes on both elements.

function tokenDrop(token, $droppedOn, tokenTeam) {
    if(!token || !$droppedOn || !tokenTeam) {
        console.log('tokenDrop isnt being passed all the parameters it needs.');
        return;
    }
    currentGridItem = $droppedOn;
    // console.log($droppedOn.position());
    var droppedTop = $droppedOn.position().top;
    var droppedLeft = $droppedOn.position().left;        
    var droppedRow = $droppedOn.attr('data-row');
    var droppedColumn = $droppedOn.attr('data-column');
    // console.log(droppedPosition, 'pos');

    $(token).attr('data-row', droppedRow);
    $(token).attr('data-column', droppedColumn);
    $(token).detach().css({position: 'absolute', top: droppedTop, left: droppedLeft}).appendTo($droppedOn);
    $(token).addClass('token--placed');
    $droppedOn.removeClass('grid--unoccupied');
    $droppedOn.addClass('grid--occupied grid--' + tokenTeam);
}

// TOKEN DROPPED & PUSHING SUCCESSFULLY
// Token drops on an allowed grid square, namely an adjacent square that already has another token in it. 

function tokenPush(token, $droppedOn, tokenTeam) {
    if(!token || !$droppedOn || !tokenTeam) {
        console.log('tokenPush isnt being passed all the parameters it needs.');
        return;
    }
    currentGridItem = $droppedOn;
    // console.log($droppedOn.position());
    var droppedTop = $droppedOn.position().top;
    var droppedLeft = $droppedOn.position().left;        
    var droppedRow = $droppedOn.attr('data-row');
    var droppedColumn = $droppedOn.attr('data-column');
    // console.log(droppedPosition, 'pos');

    // Here you need to know which direction the token came from, so compare token original data-row data-column with droppedOn data-row data-column, if row + 1 then check the rest row +1, if row-1 then check the rest of row-1, if column +1 ** if column -1 **
    // DROPPED token data-row & data-column AND droppedTop droppedLeft need to be updated to match droppedOn
    // if droppedOn now has 2 children, droppedOn first child needs to move in the same direction and so on and so on, each of these updating their data-row & data-column AND their position.

    $(token).attr('data-row', droppedRow);
    $(token).attr('data-column', droppedColumn);
    $(token).detach().css({position: 'absolute', top: droppedTop, left: droppedLeft}).appendTo($droppedOn);
    $(token).addClass('token--placed');
    $droppedOn.removeClass('grid--unoccupied');
    $droppedOn.addClass('grid--occupied grid--' + tokenTeam);
}



// ENABLE/DISABLE DROPPABLE
// Functions that will enable or disable the 'droppable' jQuery method of a specific grid square when called.

function disableDroppables($elements) {
    if (!$elements) {return;}
    $elements.droppable("disable");
}

function enableDroppables($elements) {
    if (!$elements) {return;}
    $elements.droppable("enable");
}






// ON TOKEN PICKUP, this function runs to check the game board for which grid items have tokens already, and stops players from placing their tokens there. The main game logic happens here on the PICKUP of a token.

function updateGame($token) {
    var $gridItems = $('.grid');
    
    $gridItems.each(function(index, value) {
        var $theGridSquare = $(value);
        var gridOccupied = false;
        var gridRow = $theGridSquare.attr('data-row');
        var gridColumn = $theGridSquare.attr('data-column');

        // Loop over tokens
        var $tokens = $('.token');
        $tokens.each(function(index, value) {
            var $theToken = $(value);
            var tokenRow = $theToken.attr('data-row');
            var tokenColumn = $theToken.attr('data-column');
            if (tokenRow === gridRow && tokenColumn === gridColumn) {
                gridOccupied = true;
            } 
        });
        // End loop over tokens
    
        if (game.status !== "whitepush" || game.status !== "greenpush") {
            if (gridOccupied) {
                $theGridSquare.addClass('grid--occupied');
                $theGridSquare.removeClass('grid--unoccupied');
                disableDroppables($theGridSquare);
            } else {
                $theGridSquare.removeClass('grid--occupied');
                $theGridSquare.addClass('grid--unoccupied');
                enableDroppables($theGridSquare);
            }

            // Enable grid item that token has just been picked up from.
            if (($token.attr('data-row') === $theGridSquare.attr('data-row')) && ($token.attr('data-column') === $theGridSquare.attr('data-column'))) {
                $theGridSquare.removeClass('grid--occupied');
                $theGridSquare.addClass('grid--unoccupied');
                enableDroppables($theGridSquare);
            }

            // If in setup mode, only allow tokens to be placed on their corresponding sides.
            if (game.status === "setup") {
                if ($token.hasClass('token--white')) {
                    if ($theGridSquare.hasClass('right')) {
                        $theGridSquare.addClass('grid--occupied');
                        $theGridSquare.removeClass('grid--unoccupied');
                        disableDroppables($theGridSquare)
                    }
                }
                if ($token.hasClass('token--green')) {
                    if ($theGridSquare.hasClass('left')) {
                        $theGridSquare.addClass('grid--occupied');
                        $theGridSquare.removeClass('grid--unoccupied');
                        disableDroppables($theGridSquare)
                    }
                }
            }
         }


        // GAME LOGIC FOR MOVE TURNS
        // if (game.status === "whitemove") {
        //     // PICK UP SQUARE
        //     // CHECK ALL ELEMENTS ON ROW
        //     // WE'RE IN OUR GRID LOOP HERE, 
        //     // $(value) = current grid item in the loop;
        //     // $token is the token that's picked up/being dragged
        //     // all tokens have data position = to their grid square
        //     // As part of this loop, we need to retrieve the data positions of all the occupied squares eg. 4-3 (dragged token), 1-4 2-4 3-4 4-4 (other whites), 1-5 2-5 3-5 4-5 1-6 (greens)
        //     // ALREADY can't drop on somewhere with an existing element
        //     // if $(value) has class ui-droppable-hover && grid--occupied then can it IMMEDIATELY revert? can you interrupt a drag (drag: functionality for draggable?)
        //     // or set it so it can't move within a certain distance of an object?
        // }
    
        if (game.status === "whitepush" || game.status === "greenpush") {
            if (gridOccupied) { // && adjacent
                $theGridSquare.addClass('grid--occupied');
                $theGridSquare.removeClass('grid--unoccupied');
                // enableDroppables($theGridSquare);
            } else {
                $theGridSquare.removeClass('grid--occupied');
                $theGridSquare.addClass('grid--unoccupied');
                // disableDroppables($theGridSquare);
            }

            disableDroppables($theGridSquare);
            // Make sure our current square is enabled
            if (($token.attr('data-row') === $theGridSquare.attr('data-row')) && ($token.attr('data-column') === $theGridSquare.attr('data-column'))) {
                $theGridSquare.removeClass('grid--occupied');
                $theGridSquare.addClass('grid--unoccupied');
                enableDroppables($theGridSquare);
            }
    
            // loop through grid to find all grid occupied? or
            // variables for picked up token data-row & data-column;
            // if data-row+-1 or data-column +-1 has.Class(grid--occupied) THEN ONLY ALLOW THOSE AS DROPPABLE IN THIS MOVE SET
            // on dropping on one of those, execute new generic push function
            // PICK UP token from check the ones NEWS by +-1 to the row/column positions and check if token is in one of them, if yes then ENABLE the space (else disable it), 
            // then need to add to the drop function if dropping onto occupied space then fire a new function (pass in to that function what direction we care about ie. row/column, + or -) and then for the rest of the ones in that row it shimmies them along
        }
        
    });


    if (game.status === "whitepush" || game.status === "greenpush") {

        var grabbedTokenRow = Number($token.attr('data-row'));
        var grabbedTokenColumn = Number($token.attr('data-column'));
        var gridSquareAbove = $('.grid[data-row="' + String(grabbedTokenRow-1) + '"][data-column="' + String(grabbedTokenColumn) + '"]');
        var gridSquareBelow = $('.grid[data-row="' + String(grabbedTokenRow+1) + '"][data-column="' + String(grabbedTokenColumn) + '"]');
        var gridSquareLeft = $('.grid[data-row="' + String(grabbedTokenRow) + '"][data-column="' + String(grabbedTokenColumn-1) + '"]');
        var gridSquareRight = $('.grid[data-row="' + String(grabbedTokenRow) + '"][data-column="' + String(grabbedTokenColumn+1) + '"]');

        if (gridSquareAbove.hasClass('grid--occupied')) {
            enableDroppables(gridSquareAbove);
        } 
        if (gridSquareBelow.hasClass('grid--occupied')) {
            enableDroppables(gridSquareBelow);
        } 
        if (gridSquareLeft.hasClass('grid--occupied')) {
            enableDroppables(gridSquareLeft);
        } 
        if (gridSquareRight.hasClass('grid--occupied')) {
            enableDroppables(gridSquareRight);
        }
        // console.log(grabbedTokenRow, "TOKEN ROW");
        // console.log(grabbedTokenColumn, "TOKEN COLUMN");
        // console.log(gridSquareAbove, "SQUARE ABOVE");
        // console.log(gridSquareBelow, "SQUARE BELOW");
        // console.log(gridSquareLeft, "SQUARE LEFT");
        // console.log(gridSquareRight, "SQUARE RIGHT");
        
        // SEPARATE FUNCTION tokenPush() called on DROP when it's whitepush or greenpush which needs to shunt all the adjacent tokens across one in that same direction AND updates each token pushed data row and data column
    }
}




// START GAME
// Initial function to set up teh tokens, update the prompt at the top of the screen and allow you to click the Start Game button.

function init() {

    game.status = "start";

    $('#green-score').append('<div class="token token--green token--square"></div><div class="token token--green token--square"></div><div class="token token--green token--square"></div><div class="token token--green token--circle"></div><div class="token token--green token--circle"></div>')

    $('#white-score').append('<div class="token token--white token--square"></div><div class="token token--white token--square"></div><div class="token token--white token--square"></div><div class="token token--white token--circle"></div><div class="token token--white token--circle"></div>')

    $('.game-prompt p').html("Welcome to <b>Push Fight</b>, a game of skill and surprise! Two players battle on a game board as the white team plays the green team.  The goal is for a player to push ONE of their opponent's game tokens off the board at either end. <b>Click the button to start the game</b>.");

    $('.button.skip p').html("<b>Start Game</b>");

    $('.button.skip').click(function() {
        setup();   
    })
}

init()




// GAME TURN FUNCTIONS

// GAME SETUP
// Button click clears the element taking the draggable property and updates it before calling the function for the next turn, whiteMove().

// This function also allows both players to position their pieces on the game board, with rules governing which can be picked up/placed governed by the individual turn functions and the updateGame() function.
// Calls the updateGame() function each time a token is picked up, which is where the main game logic functionality is stored.

function setup() {
    game.status = "setup"; 

    $('.game-prompt p').html("<b>Players, set up your tokens!</b>. White can only be placed on the left of the board, and Green on the right. Click the button when you're ready to play.");

    $('.button.skip p').html("<b>Finish set up</b>");
    $('.button.skip').off("click"); 
    $('.button.skip').click(function() {
        setupDraggables.draggable( "option", "cancel", ".token--green" ) 
        whiteMove();
    })

    setupDraggables = $('.token').draggable({
        containment: '.game-area',
        revert: function(is_valid) {
            if (is_valid) {
                // do nothing
            } else {
                currentGridItem.addClass('grid--occupied');
                currentGridItem.removeClass('grid--unoccupied');
                disableDroppables(currentGridItem);
                return true;
            }
        },
        start: function( event, ui ) {
            var $token = $(this);
            playSoundPickup();
            updateGame($token);
        },
    });
    
    setupDroppables = $('.grid--unoccupied').droppable({
        accept: '.token',
        tolerance: 'pointer',
        drop: function(ev, ui) {
            var token = ui.draggable;
            var $droppedOn = $(this);
            var tokenTeam = "white";
            if (token.hasClass("token--green")) {
                tokenTeam = "green";
            };
            if (game.status !== "whitepush" || game.status !== "greenpush") {
                tokenDrop(token, $droppedOn, tokenTeam);
            } else {
                tokenPush(token, $droppedOn, tokenTeam);
            };
            playSoundDrop();
        },
    });

    }


// FIRST PHASE - WHITE MOVE
// Updates the game prompt, while the rest of the functionality stays the same as in the setup() function.
// Button click clears the element taking the draggable property before calling the function for the next turn, whitePush().

function whiteMove () {
    game.status = "whitemove";
    $('.game-prompt p').html("<b>White, move your tokens!</b>. You can move up to two of your tokens to an empty space on the board, as long as you can get there by moving unimpeded in horizontal and vertical moves. Click the button when you've completed the moves you wanted to make.");

    $('.button.skip p').html("<b>Finish white move</b>");
    $('.button.skip').off("click");
    $('.button.skip').click(function() {
        setupDraggables.draggable( "option", "cancel", "" )
        setupDraggables.draggable( "option", "cancel", ".token--circle, .token--green")
        whitePush();
        
    })

    forfeit();
}

// SECOND PHASE - WHITE PUSH
// Updates the game prompt, while the rest of the functionality stays the same as in the setup() function.
// Button click clears the element taking the draggable property before calling the function for the next turn, greenMove().


function whitePush () {
    game.status = "whitepush";
    $('.game-prompt p').html("<b>White, use one of your square tokens to push ONE space!</b>");

    $('.button.skip p').html("<b>Finish white push</b>");
    $('.button.skip').off("click");
    $('.button.skip').click(function() {
        setupDraggables.draggable( "option", "cancel", "" )
        setupDraggables.draggable( "option", "cancel", ".token--white" )
        greenMove();
    })

    forfeit();
}


// THIRD PHASE - GREEN MOVE
// Updates the game prompt, while the rest of the functionality stays the same as in the setup() function.
// Button click clears the element taking the draggable property before calling the function for the next turn, greenPush().

function greenMove () {
    game.status = "greenmove";
   
    $('.game-prompt p').html("<b>Green, move your tokens!</b>. You can move up to two of your tokens to an empty space on the board, as long as you can get there by moving unimpeded in horizontal and vertical moves. Click the button when you've completed the moves you wanted to make.");

    $('.button.skip p').html("<b>Finish green move</b>");
    $('.button.skip').off("click");
    $('.button.skip').click(function() {
        setupDraggables.draggable( "option", "cancel", "" );
        setupDraggables.draggable( "option", "cancel", ".token--circle, .token--white");
        greenPush();
    })

    forfeit();
}


// FOURTH PHASE - GREEN PUSH
// Updates the game prompt, while the rest of the functionality stays the same as in the setup() function.
// Button click clears the element taking the draggable property before calling the function for the next turn, going back to whiteMove(). This loops until somebody wins or forfeits the game.


function greenPush () {
    game.status = "greenpush";
    $('.game-prompt p').html("<b>Green, use one of your square tokens to push ONE space!</b>");

    $('.button.skip p').html("<b>Finish green push</b>");
    $('.button.skip').off("click");
    $('.button.skip').click(function() {
        setupDraggables.draggable( "option", "cancel", "" );
        setupDraggables.draggable( "option", "cancel", ".token--green" );
        whiteMove();
    })

    forfeit();
}



// FORFEIT POP-UP
// Logic to show the forfeit pop-up during Push turns for both players, in case they're unable to push and need to forfeit the game.

function forfeit() {
    if (game.status === "whitepush") {
        $('.button.forfeit').show();
        $('.button.forfeit').click(function() {
            game.status = "end";
            $('.button.rules').after("<div class='forfeit pop-up'><p>Looks like <b>White</b> has forfeited as they can't push any tokens! Better luck next time!<br><br>Refresh the page to reset the game.</p></div>");
           
            $('forfeit.pop-up').toggle();
    
            // $('.forfeit.pop-up').click(function() {
            //     reset();
            // })
        })
    } else if (game.status === "greenpush") {
        $('.button.forfeit').show();
        $('.button.forfeit').click(function() {
            game.status = "end";
            $('.button.rules').after("<div class='forfeit pop-up'><p>Looks like <b>Green</b> has forfeited as they can't push any tokens! Better luck next time!<br><br>Refresh the page to reset the game.</p></div>");
           
            $('forfeit.pop-up').toggle();
    
            // $('.forfeit.pop-up').click(function() {
                // reset();
            // })
        })
    } else {
        $('.button.forfeit').toggle();
    }
}

forfeit();



// GAME WIN FUNCTION
// Function to be called if certain win conditions are met. Currently not working as Push logic still needs to be finalised.


// function gameWin () {

// }



// RESET FUNCTION
// To reset the game after a forfeit or game win. Currently not working.


// function reset () {
//     $('.forfeit.pop-up').hide();
//     $('.token').remove();
//     init();
// }
