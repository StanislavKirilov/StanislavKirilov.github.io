const quoteButton = document.getElementById('quoteButton');
const motivationalQuote = document.getElementById('motivationalQuote');
const dropdown = document.getElementById('list-dropdown');
const modalBody = document.querySelector('.modal-body');
const modalTitle = document.querySelector('.modal-title');
const content = document.querySelector('.modal-content');



//...Arrays containing the Quotes elements...//
var motivationQuotesStart = [
'Tough times do not last', 
'Keep going', 
'You have to be at your strongest', 
'Never give up', 
'It does not matter how slowly you go', 
'You have to be at your strongest',]

var motivationQuotesMiddle = [
', everything you need', 
', when you are feeling at your weakest', 
', Great things take time', 
', as long as you do not stop', 
', just look back on how far you are already', 
', do not look in any direction but ahead']

var motivationQuotesEnd = [
', tough people do!', 
', will come to you at the perfect time!', 
', when you are feeling at your weakest!', 
', that is your competition!', 
', is on the other side of fear!', 
', quitting lasts forever!']

var businessQuotes = [
'The secret of change is',
'Don’t take too much advice'  ,
'If your actions inspire others to dream more',
'What do you need to start a business? Three simple things',
'If people like you',
'The value of an idea',
]

var businessQuotesMiddle = [ 
', most people who have a lot of advice to give — with a few exceptions — generalize whatever they did', 
', learn more, do more and become more', 
', they’ll listen to you', 
', to focus all your energy not on fighting the old but on building the new', 
', lies in the using of it', 
', as long as you do not stop', 
]

var businessQuotesEnd = [ 
', don’t over-analyze everything.  I myself have been guilty of over-thinking problems. Just build things and find out if they work!', 
', you are a leader!', 
', but if they trust you, they’ll do business with you!', 
', know your product better than anyone, know your customer, and have a burning desire to succeed!', 
', that is your competition!',
', tough people do!', 
]

//...Function to Generate Random Number...//
function getRandomNumber() {
	return Math.floor(Math.random() * 6);
}

//...Function to Generate Header for the Modal Window...//
function modalHeader() {
	let quoteHeader = "";
	if (motivationalQuote.checked) {
		if (dropdown.value == 1) {
		quoteHeader = "Your motivational Quote is...";
			} else {
		quoteHeader = "Your motivational Quotes are...";
			}
	} else {
		if (dropdown.value == 1) {
		quoteHeader = "Your business Quote is...";
			} else {
		quoteHeader = "Your business Quotes are...";
			}
	}
	return quoteHeader;
}

//...Function to Generate the Quote...//
function getQuote(){
 let quoteGenerator = ""; 
 if(motivationalQuote.checked) {
 	content.style.backgroundColor = "teal";
 	quoteGenerator = motivationQuotesStart[getRandomNumber()] + " " + 
	motivationQuotesMiddle[getRandomNumber()] + " " + motivationQuotesEnd[getRandomNumber()];
 } else {
	quoteGenerator = businessQuotes[getRandomNumber()] + " " +businessQuotesMiddle[getRandomNumber()] + " " + businessQuotesEnd[getRandomNumber()];
 }
 return quoteGenerator;
}

//...Function to log the Generated Quote(s) and Header...//
function mainFunction() {
  quoteButton.addEventListener('click', () => {
	  modalBody.innerHTML = "";
	  content.style.backgroundColor = "white";
	  modalTitle.innerHTML = "";
	   for (var i = 0; i < $('#list-dropdown').val(); i++) {
           modalBody.innerHTML += `<p>${getQuote()}</p>`;
           console.log(document.getElementById("list-dropdown").innerHTML)   
	   	}
	   modalTitle.innerHTML = `${modalHeader()}`;       
  })	 
}


$(mainFunction)

















