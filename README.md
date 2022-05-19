# Marc Usher - Project 01

![Drag Racing](images/Game%20Screenshot.png)

## Introduction
After looking at a number of past projects and researching some online/tabletop games, I decided to try and recreate 'Push Fight'.

'Push Fight' is a real-life two-player board game in which players take turns to move their game pieces and try to push the opponent's pieces off the board.

There were a number of reasons why I thought it would be a good challenge for this first project:

* The game grid is relatively simple, but there are lots of conditions attached to that grid (only moving on empty spaces, not moving onto other tokens, not pushing off the barriers etc.)
* There are only a small number of pieces for each player, but there are two piece each with different rules.
* The rules themselves are simple but still a challenge to code the different turns, restrictions and victory conditions. (In retrospect, this was a massive understatement...)

## Technologies Used
* HTML
* CSS
* Flexbox
* JavasScript
* jQuery & jQuery UI

## Idea Development
* [Trello Board with Wireframes & User Stories](https://trello.com/b/5KDX4WUr/ga-sei-64-project-1)
* I started by creating some User Stories (linked to above) to identify the most crucial features that a player would want when playing this game. This helped to decide on the priorities for the project, with some ideas being 'nice to have' but not essential to playing the game.
* I then created some mockups that would best serve these user stories and allow the game to be played easily.

## Dev Diary

### Dev Day 01
* I started by setting out the HTML for the main game area, thinking ahead to how I would need to manipulate/identify the various elements and also how I wanted to nest the elements in order to achieve the desired layout.
* I then worked on the CSS, setting properties that gave me the basic layout from my mockups. These properties weren't necessarily the final look for each element, but were added to allow me to easily identify each section of the page/board.
* I then worked on adding some basic pieces for each player, and researched & tested the jQuery functionality that would allow me to click and drag these pieces around the board. There were a few roadblocks during this part of the day, including: 
    * getting the pieces to snap to the squares on the grid
    * how the pieces overlap with each other
    * working out how to only allow the pieces to be moved to certain areas of the board
* Not all of these are solved as of the end of Day 01!

### Dev Day 02
* I started this day by reviewing yesterday's progress and updating my Trello board to track progress on the user stories.
* I also brainstormed the work that still needed to be done, going through the various parts of the code that would need to be added and worked through, and decided on how many of these points would be an achievable goal for today.
* I had hoped to fully complete the game logic for setting up the game board and chaining the various game turns together, but this took a lot longer than anticipated!
    * Ran into problems with tokens being able to drop onto other tokens and various class elements not being added/removed when they should have been.
    * Solving this took me a A LONG TIME.

### Dev Day 03
* Game board set-up functionality and rules working.
* Added game prompts for each turn, and turn order now working correctly with button clicks moving you to the next stage of the game, and looping between move/push/move/push for the two players.
* Tried and failed to get the move turn logic to work, so decided to leave this to player honesty for now and tackle the push functionality.

### Dev Day 04
* Developed the push functionality, but not able to get it fully complete.
* Updated look and feel of the page and game board, and added a few extra pieces of functionality like audio on token drag and drop and final button styling.
* Tidied up js code and tidied up code order and comments for it to be more logical and readable.


## Unfinished Business
* Solving the push functionality, so that tokens are pushed in a certain direction, and tracking if any are pushed off the board as a win condition.
* Adding win condition pop-up, and finalising Forfeit functionality, so that both allow you to reset the game (rather than needing to refresh).
* Adding score trackers to the page and allowing wins to be stored the local storage.

## Winning Condition
* Unfortunately I don't fully have this working yet! The 'Forfeit' functionality works on push turns, allowing a player to forfeit if they have no legal move, but the full win conditions (automatically noticing no legal push move, or having a piece pushed off the game board) is not yet implemented.

## Functionista
* Describe how some of your favorite functions work
