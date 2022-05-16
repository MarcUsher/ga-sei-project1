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


$('.game-board').append("<div class='white circle'></div>")

$('.grid').droppable()

$('.white').draggable({ containment: ".game-board", scroll: false, snap: ".grid", grid: [50, 50], snapMode: "inner"});
