
function convertJsonToObject(jsonString) {
	
	let filmObject = JSON.parse(jsonString);
	
	return filmObject;
}

function convertObjectToJson(filmObject) {
	
	let jsonString = JSON.stringify(filmObject, null, 4);
	
	return jsonString;
}

function convertXmlToObject(xmlFilm) {
	
	let idElement = xmlFilm.getElementsByTagName("id")[0];
	let titleElement = xmlFilm.getElementsByTagName("title")[0];
	let yearElement = xmlFilm.getElementsByTagName("year")[0];
	let directorElement = xmlFilm.getElementsByTagName("director")[0];
	let starsElement = xmlFilm.getElementsByTagName("stars")[0];
	let reviewElement = xmlFilm.getElementsByTagName("review")[0];
	
	let filmObject = {
		id: getBodyContent(idElement),
		title: getBodyContent(titleElement),
		year: getBodyContent(yearElement),
		director: getBodyContent(directorElement),
		stars: getBodyContent(starsElement),
		review: getBodyContent(reviewElement)
	};
	
	return filmObject;
}

function convertObjectToXML(filmsArray) {
	let xmlString;
	let filmXml;
	for(let i = 0; i < filmsArray.length; i++){
		filmXml = `<film>
			<id>${filmsArray[i].id}</id>
			<title>${filmsArray[i].title}</title>
			<year>${filmsArray[i].year}</year>
			<director>${filmsArray[i].director}</director>
			<stars>${filmsArray[i].stars}</stars>
			<review>${filmsArray[i].review}</review>
		</film>`;
		
		filmXml = escapeSpecialCharsXml(filmXml);
		xmlString = filmXml;
	}
 
	let xml = $.parseXML(xmlString);
	
	return xml;

}


function getBodyContent(element) {
	// normalize get rids of white space
	let bodyContent = "";
	try{
		element.normalize();
		bodyContent = (element.childNodes[0].nodeValue);	
	} catch(err) {
		bodyContent = "";
	}
	
	return bodyContent;
}

function ajaxCall(method, requestUrl, dataContentType, successCallback, errorCallback, expectedDataType = null, requestData = null) {
	
	console.log("ajax call function invoked for: " +  method);
	
	$.ajax({
		type: method,
		url: requestUrl,
		data: requestData,
		contentType: dataContentType,
		success: successCallback,
		error: errorCallback,
		dataType: expectedDataType,
	});
}

function createEventHandlers() {
	$("input[id^=film-delete]").on("click", function() {
		let record = $(this).closest("tr").attr("id");
		let id = $("#" + record + " td:first-child").text();
		let requestUrl = "/filmsAPI/" + id;
		ajaxCall("DELETE", requestUrl, false, onDeleteSuccess, requestErrorHandler, "text", id);
	});
	
	$("input[id^=film-update]").on("click", function() { onUpdateClick(this) });
}

function generateTableHead() {
	$("#table-content").children().remove();
	$("<table>").attr("id", "filmsTable").appendTo("#table-content");
	$("<tr>").attr("id", "thead").appendTo("#filmsTable");
	$("<th>").text("ID").appendTo("#thead");
	$("<th>").text("Title").appendTo("#thead");
	$("<th>").text("Year").appendTo("#thead");
	$("<th>").text("Director").appendTo("#thead");
	$("<th>").text("Stars").appendTo("#thead");
	$("<th>").text("Review").appendTo("#thead");
	$("<th>").text("Delete").appendTo("#thead");
}

function insertRows(result) {
	
	$.each(result, function(i) {
		let id = result[i].id;
		$("<tr>").attr("id", id).appendTo("#filmsTable").attr("id");
		$("<td>").text(result[i].id).appendTo("#" + id);
		$("<td>").text(result[i].title).appendTo("#" + id);
		$("<td>").text(result[i].year).appendTo("#" + id);
		$("<td>").text(result[i].director).appendTo("#" + id);
		$("<td>").text(result[i].stars).appendTo("#" + id);
		$("<td>").text(result[i].review).appendTo("#" + id);
		$("<td>").html("<input id='film-update"+ result[i].id +"' /><br><br><input id='film-delete"+ result[i].id +"' />").appendTo("#" + id);
		$("#film-update"+ result[i].id).attr({
			type: "submit",
			value: "Update",
			filmId: result[i].id
		});
		$("#film-delete"+ result[i].id).attr({
			type: "submit",
			value: "Delete",
			filmId: result[i].id
		});

		//if (i === 50) {
		//	return false;
		//}
	});
}

function tableStyles() {
	$("#filmsTable tr:odd").css("background-color", "rgb(175,175,175)");
	$("#filmsTable td").css("padding", "5px");
	$("#filmsTable td").css("text-align", "center");
	$("#filmsTable").css("border-spacing", "5px");
	$("#filmsTable").css("border", "1px solid black");
	$("#filmsTable tr").css("border", "1px solid black");
	$("#filmsTable th").css("background-color", "green");
	$("#filmsTable th").css("color", "white");
}

function updateDataArray(filmId, filmTitle, year, director, stars, review) {
	for(let i = 0; i < data.length; i++) {
		// not using strict since one is a string and the other is a number.
		if(data[i].id == filmId) {
			data[i].title = filmTitle;
			data[i].year = year;
			data[i].director = director;
			data[i].stars = stars;
			data[i].review = review;
 		}
	}
}

function escapeSpecialCharsXml(escString){
	escString = escString.replace(/&/gi, "&amp;")
					.replace(/"/gi, "&quot;")
					.replace(/'/gi, "&apos;");
	
	return escString;
}
