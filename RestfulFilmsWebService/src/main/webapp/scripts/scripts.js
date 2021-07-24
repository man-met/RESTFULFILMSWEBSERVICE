
// global variable to store all the films data
let data = new Array();

// event listeners
$("document").ready(function() {
	$("#tabsCtrl").tabs({
		active: 0,
		heightStyle: "content"
	});

	$("#get-all-films").click(getFilms);

	$("#insert-row").click(insertData);
	
	$("#update-row").click(function() {
		onUpdateSubmit();
	});
	
	$("#tab1-dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 600
	});
	
	$("#tab2-dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 300
	});
	
});

function onUpdateSubmit() {
	let filmId = $("#id-update").val();
	let filmTitle = $("#title-update").val();
	let year = $("#year-update").val();
	let director = $("#director-update").val();
	let stars = $("#stars-update").val();
	let review = $("#review-update").val();
	
	let contentType = $("#update-format-type").val();
	
	let film = {
		id: filmId,
		title: filmTitle,
		year: year,
		director: director,
		stars: stars,
		review: review
	}
	
	let updateData;
	
	if (contentType === "xml") {
		
		contentType = "application/" + contentType;
		let filmArray = new Array();
		filmArray.push(film)
		updateData = new XMLSerializer().serializeToString(convertObjectToXML(filmArray));
		
	} else {
		
		contentType = "application/" + contentType;
		updateData = convertObjectToJson(film);
		
	}
	
	const url = "/filmsAPI/" + film.id;
	
	console.log(url);
	console.log("contentType: " + contentType);
	console.log(updateData);
	
	ajaxCall("PUT", url, contentType, onUpdateSuccess, requestErrorHandler, "text", updateData);
	
}

function insertData() {
	let filmTitle = $("#title-field").val();
	let year = $("#year-field").val();
	let director = $("#director-field").val();
	let stars = $("#stars-field").val();
	let review = $("#review-field").val();
	
	let contentType = $("#insert-format-type").val();

	let film = {
		id: 0,
		title: filmTitle,
		year: year,
		director: director,
		stars: stars,
		review: review
	}
	
	let insertData;
	
	if (contentType === "xml") {
		
		contentType = "application/" + contentType;
		let filmArray = new Array();
		filmArray.push(film)
		insertData = new XMLSerializer().serializeToString(convertObjectToXML(filmArray));
		
	} else {
		
		contentType = "application/" + contentType;
		insertData = convertObjectToJson(film);
		
	}
	
	const url = "/filmsAPI";
	
	ajaxCall("POST", url, contentType, onInsertSuccess, requestErrorHandler, "text", insertData);

}

function getFilms() {

	let format = $("#tab1-format-type").val();
	let keyword = $("#search-keyword").val();
	let address = "";

	if (keyword !== "") {
		address = "/filmsAPI/" + keyword;
	} else {
		address = "/filmsAPI";
	}

	if (format === "xml") {
		ajaxCall("GET", address, false, xmlDataHandler, requestErrorHandler, "xml");
	} else {
		ajaxCall("GET", address, false, jsonDataHandler, requestErrorHandler, "json");
	}

}

function jsonDataHandler(result){
	
	console.log("Result returned: ");
	
	console.log(result);
	
	data.splice(0, data.length);
	data = result.filmsList;
			
	let rawData = convertObjectToJson(data);
	$("#raw-data").text(rawData);
	
	createTable(data);
}

function xmlDataHandler(result) {
		
	let rawData = new XMLSerializer().serializeToString(result);
		
	$("#raw-data").text(rawData);

	var films = result.getElementsByTagName("film");
		
	data.splice(0, data.length);
	for(let i = 0; i < films.length; i++) {
		data[i] = convertXmlToObject(films[i]);
	}
		
	createTable(data);
}

function createTable(result) {
	
	generateTableHead();

	insertRows(result);
	
	tableStyles();
	
	createEventHandlers();
}

function onUpdateClick(element) {
	$("#tab1-dialog").dialog("open");
	//console.log(element);
	let filmId = $(element).attr("filmId");
	let record = "";
	for(let i = 0; i < data.length; i++) {
		// not using strict since one is a string and the other is a number.
		if(data[i].id == filmId) {
			record = data[i];
		}
	}

	$("#id-update").val(record.id);
	$("#title-update").val(record.title);
	$("#year-update").val(record.year);
	$("#director-update").val(record.director);
	$("#stars-update").val(record.stars);
	$("#review-update").val(record.review);
	
}

function onDeleteSuccess(result){
	console.log(result);
	$("#raw-data").text("No data to display! Please request some data.");
	$("#" + result).remove();
	$("#filmsTable tr:odd").css("background-color", "rgb(175,175,175)");
	$("#filmsTable tr:even").css("background-color", "rgb(245, 243, 229)");
}

function onUpdateSuccess(result) {
	
	let filmId = $("#id-update").val();
	let filmTitle = $("#title-update").val();
	let year = $("#year-update").val();
	let director = $("#director-update").val();
	let stars = $("#stars-update").val();
	let review = $("#review-update").val();
	
	updateDataArray(filmId, filmTitle, year, director, stars, review);
	
	let children = $("#" + filmId).children();
	
	$(children[1]).text(filmTitle);
	$(children[2]).text(year);
	$(children[3]).text(director);
	$(children[4]).text(stars);
	$(children[5]).text(review);
	
	let json = JSON.stringify(data, null, 4);
	
	$("#raw-data").text(json);
	
	$("#tab1-dialog").dialog("close");
	$("#tab2-dialog p").text(result).css("color", "green");
	$("#tab2-dialog").dialog("open");
}

function onInsertSuccess(result) {	
	$("#tab2-dialog p").text(result).css("color", "green");
	$("#tab2-dialog").dialog("open");
	$("#title-field").val("");
	$("#year-field").val("");
	$("#director-field").val("");
	$("#stars-field").val("");
	$("#review-field").val("");
}

function requestErrorHandler() {
	$("#tab2-dialog p").text("There was an error! Please contact the service admin.").css("color", "red");
	$("#tab2-dialog").dialog("open");
}