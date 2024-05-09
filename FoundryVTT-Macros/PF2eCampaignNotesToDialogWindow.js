        /*╔═══════════════════════════════╗*\       
        ╔═╝┌─────────────────────────────┐╚═╗       
        ║ ┌┤ [PF2e]Campaign Notes Dialog ├┐ ║       
        ╟─┘└────────┐ SoraHjort ┌────────┘└─╢       
        ╚═╗         └─────╥─────┘         ╔═╝       
        \*╚═══════════════╩═══════════════╝*/          
        
//Creates dialog based on selected tokens' Campaign Notes on their sheets

//I do a lot of alias setup on the token data, ye be warned. Also sadly 
//there are less emtpy newlines to make this readable due to trying to 
//fit it in discord's limit to see the whole file. I was close to 80 
//lines over the line limit, soooo.... yeah.

//Get all selected tokens
selectedActors = canvas.tokens.controlled;

//setup a array to throw in compares later
dupeCheck = [];

//minimum dimensions for dialog
minWidth = 200; 
minHeight = 200; //<=== is for spacing calculations only

//alias for the viewport's dimensions
winWidth = window.innerWidth;
winHeight = window.innerHeight;

//max dimensions
maxWidth = winWidth/2;
maxHeight = winHeight*0.9;

//dirty max distance psuedo margin calculation
maxX = winWidth - 200;
maxY = winHeight;

//get the number of min dimensiosn can fit in viewport
widthCount = Math.floor(maxX / minWidth);
heightCount = Math.floor(maxY / minHeight) + 1;

//loop through every selected token
for (let key in selectedActors) {
    
    //alias to the current loop's token
    selectedActor = canvas.tokens.controlled[key].actor;
    
    //double check whether or not Campaign Notes exists on the token as 
    //they don't exist on NPC or Familiar sheets
    try {
        
        //alias campaign notes
        campaignNotes = selectedActor.system.details.biography.campaignNotes
        
        } catch(e) {
        //if not exist, set the value to a empty string
        campaignNotes = "";
        }

    //Alias the sheet name and image
    charName = selectedActor.name;
    charImg = selectedActor.img;
    
    //If campaign notes aren't empty, and also don't already exist within 
    //the dupeCheck Array, then proceed.
    if (campaignNotes != "" && dupeCheck.includes(campaignNotes) != true) {
        
        //push campaign notes to dupeCheck for later use
        dupeCheck.push(campaignNotes);
        
        //Setup positional data for the dialog box(es)
        //check the number of entries in dupeCheck
        i = dupeCheck.length - 1;
        
        //Modulo calculations on how many can fit left to right, top to 
        //bottom.
        x = (i % widthCount) + 1;
        y = (Math.floor(i/widthCount) % heightCount) + 1;
        
        //Save positional data calculation
        dialogBoxOptions = {
            top: y * 150 - 100,
            left: x * 200 - 50 }
            
            
        //Setup template for the html within the dialog window. Due to 
        //using backticks I'll have to explain here instead of each line 
        //on what's going on.
        
        //First few style sets are attempting to find one of the 
        //grandparents so we can set various properties including a dark 
        //transparent background, minimum width, and auto width.
        //#charImgFor is to format an image of the selected token as well 
        //as specifying it is unique to that image if there are multiple 
        //dialog windows open. (probably could have been done as a class 
        //and I over thought that part)
        
        //Div section is putting it all together. We also take the image 
        //path we found earlier and use it to show it as a small corner 
        //image on the dialog.
        
        //It is also setup so if you were to click on the character image 
        //it will open up the character's sheet, because why not?
        
        //Then we insert the campaign notes before closing up the div.
        
        //And because campaign notes are stored as HTML, it'll render in the dialog window much like it does on the sheet.
        dialogBox = `
        <style>
        .dialog:has(.window-content .dialog-content .campaignNotesDialog ) {
            background-color: rgba(0,0,0,0.5);
            background-blend-mode: lighten;
            min-width: `+minWidth+`px !important;
            max-width: `+maxWidth+`px !important;
            max-height:`+maxHeight+`px !important;
            overflow-x: auto;
            overflow-y: scroll;
            width: auto !important;
            backdrop-filter: blur(2px);
            }
        .dialog:has(.window-content .dialog-content .campaignNotesDialog ) > .window-header {
            background: rgba(0,0,0,0.25);
            font-size: 16pt;
            height: auto;
            }
        .window-content:has(.dialog-content .campaignNotesDialog ) {
            background: unset !important;
            }
        .campaignNotesDialog {
            color:white;
            }
        #charImgFor`+charName+` {
            max-width: 50px;
            max-height: 100px;
            float: left;
            margin: 0 0 0 0;
            padding: 0 0 0 0;
            }
        </style>
        <div class="campaignNotesDialog ">
            <a onClick="game.actors.getName('`+charName+`').sheet.render(true)">
                <img id="charImgFor`+charName+`"src="`+charImg+`">
            </a>
            <br>`+ campaignNotes +`
        </div>`;
        
        //time to spawn the dialog window
        new Dialog({
            
            //unique name for each dialog window using the character's 
            //name
            title: "Notes for " + charName, content: dialogBox, buttons: {}
            
            //time to use that positional data from earlier and make it render
            },dialogBoxOptions).render(true);
            
        //Some debugging stuff to double check if an issue arises.
        //console.log(key + ": Opening Campaign Notes " + charName)
//        console.log(`i: `+i+`
//        wC: `+widthCount+`
//        hC: `+heightCount+`
//        mX: `+maxX+`
//        mY: `+maxY+`
//        X: `+x+`(`+i+`/`+widthCount+`)
//        Y: `+y+`(`+Math.floor(widthCount / i)+`/`+heightCount+`)`)

        //And at the very end of that large if statement from earlier we 
        //just print out a message in console if a sheet's campaign notes 
        //already exist in dupeCheck, or is just an empty string.
        } else {
            console.log("Duplicate or empty notes detected");
        }
    }
    
//Clear out dupeCheck on the event someone decides to have a lot of stuff 
//in their notes.
dupeCheck = [];
