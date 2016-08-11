//getter methods for local storage//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getBookmarkHeadingArray(){
	HeadingArray = [];
    var StoredHeadings = localStorage.getItem("BookmarkStoredHeadings");
    if (StoredHeadings) {
		HeadingArray = JSON.parse(StoredHeadings);
    }
	else{
        alert("No saved bookmarks");
	}	
	return HeadingArray;
}

function getBookmarkURLArray(){
	URLArray = [];
	var StoredURLs = localStorage.getItem("BookmarkStoredURLs");
    if (StoredURLs) {
		URLArray = JSON.parse(StoredURLs);
	}
	return URLArray;
}


function getOnScreenHeadingArray(){
	HeadingArray = [];
    var StoredHeadings = localStorage.getItem("OnScreenStoredHeadings");
    if (StoredHeadings) {
		HeadingArray = JSON.parse(StoredHeadings);
    } 
	return HeadingArray;
}

function getOnScreenURLArray(){
	URLArray = [];
	var StoredURLs = localStorage.getItem("OnScreenStoredURLs");
    if (StoredURLs) {
		URLArray = JSON.parse(StoredURLs);
    } 
	return URLArray;
}

//setter methods for local storage/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveBookmark(HeadingArray,URLArray){
	localStorage.setItem("BookmarkStoredHeadings",  JSON.stringify(HeadingArray));
	localStorage.setItem("BookmarkStoredURLs",  JSON.stringify(URLArray));
}

function saveOnScreen(HeadingArray,URLArray){
	localStorage.setItem("OnScreenStoredHeadings",  JSON.stringify(HeadingArray));
	localStorage.setItem("OnScreenStoredURLs",  JSON.stringify(URLArray));
}



//misc functions///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//to check net connection
function checkNetConnection(){ 
	var xhr = new XMLHttpRequest(); 
	var file = "http://localhost/feedreader/check.png"; 
	var r = Math.round(Math.random() * 10000); 
	xhr.open('HEAD', file + "?subins=" + r, false); 
	try {  
		xhr.send();  
		if (xhr.status >= 200 && xhr.status < 304){   
			return true;  
		}
		else { 
			alert("NO INTERNET CONNECTIVITY");
			return false; 
		}
	} 
	catch (e) { 
		alert("NO INTERNET CONNECTIVITY");
		return false; 
	}
}


// on clicking 'get feed' button	
function myfn(){
    var chk = document.getElementById("myCheck").checked;
    myURL = document.getElementById("txtName").value;
    if(myURL.length <= 0){
        alert("What do you want?");
      }
    else{
		if(!checkOnScreen(myURL)){	 
			myHeading = prompt("Give a heading", myURL);
			if(myHeading){
				if(chk == true){
					addToBookmarks(myHeading,myURL);
				}
				getFeed(myHeading,myURL);
				addToOnScreen(myHeading,myURL);
			}	
		}
	}
}



//getting & displaying feeds
google.load("feeds", "1");
function getFeed(myHeading,myURL){ 
	{
		var feed = new google.feeds.Feed(myURL);
		feed.setNumEntries(8);
		feed.load(function(result){
			if (!result.error) {
				var mainDisplay = document.getElementById("feeds");
				var container = document.createElement("div");
				var heading = document.createElement('h5');
				container.id=myURL;
				var headtext = document.createTextNode("FROM: " + myHeading);
				heading.appendChild(headtext);
				var mainList = document.createElement('ul');
				container.className="well";
				for (var i = 0; i < result.feed.entries.length; i++) {
					var entry = result.feed.entries[i];
					var listItem = document.createElement("li");
					var div = document.createElement("div");
					var contentSnippetText = document.createTextNode(entry.contentSnippet);
					var desc = document.createElement('p');
					var link = document.createElement('a');
					link.setAttribute('href', entry.link);
					link.setAttribute('target','_blank');
					var text = document.createTextNode(entry.title);
					link.appendChild(text);
					listItem.appendChild(link);
					desc.appendChild(contentSnippetText);
					listItem.appendChild(desc);
					mainList.appendChild(listItem);
                }
				var buttonnode= document.createElement('i');
				buttonnode.setAttribute('type','button');
				buttonnode.id = myURL;
				buttonnode.setAttribute('class','icon-remove');
				buttonnode.setAttribute('onclick', 'delFeed(this.id)' );
				container.appendChild(buttonnode);
				container.appendChild(heading);
				container.appendChild(mainList);
				mainDisplay.appendChild(container);
			}
        });
    }
	google.setOnLoadCallback(getFeed);
}
 
 


// deleting feed from display	
function delFeed(myURL){
    var element = document.getElementById(myURL);
    element.parentNode.removeChild(element);
	deleteFromOnScreen(myURL);
}


   
// to clear text field 
function clearField() {
    document.getElementById("txtName").value="";
}




//ON LOAD FUNCTION
function load(){
	document.getElementById("myCheck").checked=true;
	loadBookmarks();
	loadOnScreen();
}




//Functions dealing with bookmarks///////////////////////////////////////////////////////////////////////////////////////////////////////////

//to clear all elements from bookmarks' div & display them again
function loadBookmarks(){
	HeadingArray = getBookmarkHeadingArray();
	URLArray = getBookmarkURLArray();
	//deleting all bookmarks
	var mainBookmarksDisplay = document.getElementById("bookmarks");
	while (mainBookmarksDisplay.hasChildNodes()) {
        mainBookmarksDisplay.removeChild(mainBookmarksDisplay.lastChild);
    }
	for(var i = 0; i<HeadingArray.length; i++){
	    displayBookmark(HeadingArray[i],URLArray[i]);
	}
}

//display a single bookmark
function displayBookmark(myHeading,myURL){
    var mainBookmarksDisplay = document.getElementById("bookmarks");
    var bookmark = document.createElement('div');
	
    var bookmarkText = document.createElement('a');
	bookmarkText.innerHTML = myHeading;
	bookmarkText.setAttribute('name', myHeading);
	bookmarkText.setAttribute('id', myURL);
    bookmarkText.setAttribute('onclick', 'onBookmarkClick(this.name,this.id)' );
    
	
	var buttonnode= document.createElement('i');
    buttonnode.setAttribute('type','button');
	myURL += "_B";    //to give bookmark remove button an id different from its feed div, so specified bookmark or feed div can be deleted. 
    buttonnode.id = myURL;
    buttonnode.setAttribute('class','icon-remove');
    buttonnode.setAttribute('onclick', 'delBookmark(this.id)' );
	
	divider = document.createElement('li');
	divider.setAttribute('class','divider');
	
	bookmark.appendChild(buttonnode);
	bookmark.appendChild(bookmarkText);
	bookmark.appendChild(divider);
	
	mainBookmarksDisplay.appendChild(bookmark);
}

// runs on clicking on bookmark
function onBookmarkClick(myHeading,myURL){
    if(!checkOnScreen(myURL)){
	    addToOnScreen(myHeading,myURL);  //add to OnScreen
        getFeed(myHeading,myURL);		
	}
}

//to delete a bookmark
function delBookmark(myURL){
    var element = document.getElementById(myURL);
    parent = element.parentNode;
	parent.parentNode.removeChild(parent);
	myURL = myURL.substring(0, myURL.length - 2);
	
	HeadingArray = getBookmarkHeadingArray();
	URLArray = getBookmarkURLArray();
	
	// get position of myURL in URLArray
	var i = URLArray.indexOf(myURL); 
	alert("Deleting from Bookmarks: "+HeadingArray[i]+" = "+URLArray[i]);
	// delete from arrays
	URLArray.splice(i,1);
	HeadingArray.splice(i,1);
	
	// storing both arrays again 
	saveBookmark(HeadingArray,URLArray);
}

// adding a bookmark
function addToBookmarks(myHeading,myURL){
	HeadingArray = getBookmarkHeadingArray();
	URLArray = getBookmarkURLArray();
	
	var i = URLArray.indexOf(myURL);
    if( i != -1 ){
	    alert("Bookmark already exists by name: "+HeadingArray[i]+" .");
		return true;
	}
    else{
	    // pushing new heading & URL to respective arrays 
	    HeadingArray.push(myHeading);
	    URLArray.push(myURL);
	    alert("Added to Bookmarks: "+HeadingArray[HeadingArray.length-1]+" = "+URLArray[URLArray.length-1]);
		// saving bookmark again 
	    saveBookmark(HeadingArray,URLArray);
		displayBookmark(myHeading,myURL); //again display bookmarks
	}
}



//Functions dealing with OnScreens

//check if feed from myURL is present on screen
function checkOnScreen(myURL){
    HeadingArray = getOnScreenHeadingArray();
    URLArray = getOnScreenURLArray();
	
	var i = URLArray.indexOf(myURL);
    if( i != -1 ){
	    alert("Already exists OnScreen with heading: "+HeadingArray[i]+" .");
		return true;
	}
}

//adding to onScreen 
function addToOnScreen(myHeading,myURL){
    HeadingArray = getOnScreenHeadingArray();
    URLArray = getOnScreenURLArray();
	
	// pushing new heading & URL to respective arrays IF NET CONNECTION IS AVAILABLE
	if(checkNetConnection()){
		HeadingArray.push(myHeading);
		URLArray.push(myURL);
		alert("Added to OnScreen: "+HeadingArray[HeadingArray.length-1]+" = "+URLArray[URLArray.length-1]);
	}
	// storing both arrays again 
	saveOnScreen(HeadingArray,URLArray);
}

//deleting from onScreen
function deleteFromOnScreen(myURL){
    HeadingArray = getOnScreenHeadingArray();
    URLArray = getOnScreenURLArray();
	
	// get position of myURL in OnScreenURLArray
	var i = URLArray.indexOf(myURL); 
	alert("Deleted from OnScreen: "+HeadingArray[i]+" = "+URLArray[i]);
	URLArray.splice(i,1);
	HeadingArray.splice(i,1);
    // storing both arrays again
	saveOnScreen(HeadingArray,URLArray);
}

//load feeds from all the elements saved in onScreen
function loadOnScreen(){
	HeadingArray = getOnScreenHeadingArray();
    URLArray = getOnScreenURLArray();
	
	for(var i = 0; i<HeadingArray.length; i++)
	    getFeed(HeadingArray[i],URLArray[i]);
}
