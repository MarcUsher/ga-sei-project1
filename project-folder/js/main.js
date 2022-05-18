

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

// Start button asks the game object what status are you in, and what should I do?
// So if game hasn't started then start the game
// If it has started then go on to the white move





// Constant game functions & variables

let currentGridItem = false;


// RULES BUTTON POP-UP

$('.button.rules').click(function() {
    $('.pop-up').toggle();
})

$('.pop-up').click(function() {
    $('.pop-up').toggle();
})



// TOKEN DROPPED SUCCESSFULLY 

function tokenDrop(token, $droppedOn, team) {
    if(!token || !$droppedOn || !team) {
        console.log('tokenDrop isnt being passed all the parameters it needs.');
        return;
    }
    currentGridItem = $droppedOn;
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
}



// ENABLE/DISABLE DROPPABLE

function disableDroppables($elements) {
    if (!$elements) {return;}
    $elements.droppable("disable");
}

function enableDroppables($elements) {
    if (!$elements) {return;}
    $elements.droppable("enable");
}





// START GAME

$('.game-prompt p').html("<b>Welcome to Push Fight! Ready to play? Click the button to start the game.");
$('.button.skip p').html("<b>Start Game</b>");

$('.button.skip').click(function() {
        setup();
        game.status = "setup";
    })

// when the game starts destroy all the logic from init()
// https://api.jqueryui.com/droppable/#method-destroy






// Start game function
function setup() {
    $('.game-prompt p').html("<b>Players, set up your tokens!</b>. White can only be placed on the left of the board, and Green on the right. Click the button when you're ready to play.");
    $('.button.skip p').html("<b>Set-up complete</b>");
    $('.button.skip').off("click"); 
    // $('.button.skip').click(function() {
    //     whiteMove();
    //     game.status = "setup";
    // })

    $('.token').draggable({
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

    $('.grid--unoccupied').droppable({
        accept: '.token',
        tolerance: 'pointer',
        drop: function(ev, ui) {
            var token = ui.draggable;
            var $droppedOn = $(this);
            tokenDrop(token, $droppedOn, 'white');
        },
    });

    // Token picked up and moved
    // function outBehaviour($draggedFrom, team) {
    //     // console.log($draggedFrom, 'draggedFrom');
    //     if(!$draggedFrom || !team) {
    //         console.log('tokenDrop isnt being passed all the parameters it needs.');
    //         return;
    //     }
    //     $draggedFrom.addClass('grid--unoccupied');
    //     $draggedFrom.removeClass('grid--occupied');

    //     // $draggedFrom.removeClass('grid--occupied grid--occupied-' + team);
    //     // enableDroppables($draggedFrom);
    // }
}



// On Token grab, start game logic
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

        // Check for game logic, where can this token move etc?

        if ($token.attr('data-position') === $(value).attr('data-position')) {
            $(value).removeClass('grid--occupied');
            $(value).addClass('grid--unoccupied');
            enableDroppables($(value));
        }

    });
}

// NEXT STEPS
// updateGame function is the big nested boy
// button updates the game status in game object
// updateGame checks game status and if it's whitemove/whietpush etc. will ahve different but similar functionality to allow/disallow moves.

// Fire this outside the main function, in the separate function when the move starts.
// $token.draggable( "option", "cancel", ".token--white" ); // cancel all $token(s) with that class
// $token.draggable( "option", "cancel", "" ); // cancel the cancel!