

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




// RULES BUTTON POP-UP

$('.button.rules').click(function() {
    $('.pop-up').toggle();
})

$('.pop-up').click(function() {
    $('.pop-up').toggle();
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





// START GAME
// Button click to start the game and move us into the first game phase of 'setup'.


$('.game-prompt p').html("<b>Welcome to Push Fight! Ready to play? Click the button to start the game.");
$('.button.skip p').html("<b>Start Game</b>");

$('.button.skip').click(function() {
        game.status = "setup"; 
        setup();   
    })

// when the game starts destroy all the logic from init()
// https://api.jqueryui.com/droppable/#method-destroy


// DRAGGABLE & DROPPABLE SETUP
// Allows both players to position their pieces on the game board, with rules governing which can be picked up/placed governed by the individual turn functions and the updateGame() function.
// The function calls the updateGame() function, which is where the main game logic functionality is stored.

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
        tokenDrop(token, $droppedOn, tokenTeam);
    },
});





// ON TOKEN PICKUP, this function runs to check the game board for which grid items have tokens already, and stops players from placing their tokens there. The main game logic happens here on the PICKUP of a token.

function updateGame($token) {
    
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

        if (($token.attr('data-row') === $(value).attr('data-row')) && ($token.attr('data-column') === $(value).attr('data-column'))) {
            $(value).removeClass('grid--occupied');
            $(value).addClass('grid--unoccupied');
            enableDroppables($(value));
        }
        // This is doing the same as the tokenLeft tokenTop thing?

        if (game.status === "setup") {
            if ($token.hasClass('token--white')) {
                if ($(value).hasClass('right')) {
                    $(value).addClass('grid--occupied');
                    $(value).removeClass('grid--unoccupied');
                    disableDroppables($(value))
                }
            }
    
            if ($token.hasClass('token--green')) {
                if ($(value).hasClass('left')) {
                    $(value).addClass('grid--occupied');
                    $(value).removeClass('grid--unoccupied');
                    disableDroppables($(value))
                }
            }
        }

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

        if (game.status === "whitepush") {
            // wrap game status in not(greenpush, whitepush)
            // if $token 
            // PICK UP token from check the ones NEWS by +-1 to the row/column positions and check if token is in one of them, if yes then ENABLE the space (else disable it), 
            // then need to add to the drop function if dropping onto occupied space then fire a new function (pass in to that function what direction we care about ie. row/column, + or -) and then for the rest of the ones in that row it shimmies them along
        }
    });
}




// GAME TURN FUNCTIONS

// GAME SETUP
// Button click clears the element taking the draggable property and updates it before calling the function for the next turn, whiteMove().

function setup() {
    $('.game-prompt p').html("<b>Players, set up your tokens!</b>. White can only be placed on the left of the board, and Green on the right. Click the button when you're ready to play.");

    $('.button.skip p').html("<b>Finish set up</b>");
    $('.button.skip').off("click"); 
    $('.button.skip').click(function() {
        game.status = "whitemove";
        setupDraggables.draggable( "option", "cancel", ".token--green" ) 
        whiteMove();
    })
    }


// FIRST PHASE - WHITE TURN
// Updates the game prompt, while the rest of the functionality stays the same as in the setup() function.
// Button click clears the element taking the draggable property before calling the function for the next turn, whitePush().

function whiteMove () {
    $('.game-prompt p').html("<b>White, move your tokens!</b>. You can move up to two of your tokens to an empty space on the board, as long as you can get there by moving unimpeded in horizontal and vertical moves. Click the button when you're ready.");

    $('.button.skip p').html("<b>Finish white move</b>");
    $('.button.skip').off("click");
    $('.button.skip').click(function() {
        game.status = "whitepush";
        setupDraggables.draggable( "option", "cancel", "" )
        setupDraggables.draggable( "option", "cancel", ".token--circle, .token--green")
        whitePush();
        
    })
}




function whitePush () {
    $('.game-prompt p').html("<b>White, push with one of your square tokens!</b>");

    $('.button.skip p').html("<b>Finish white push</b>");
    $('.button.skip').off("click");
    // $('.button.skip').click(function() {
        // game.status = "whitepush";  
        //  whitePush();
}