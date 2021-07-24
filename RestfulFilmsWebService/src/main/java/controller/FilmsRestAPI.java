package controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import models.Film;
import models.FilmHQL;
import models.FilmStore;

@Controller
@RequestMapping(value = "/filmsAPI")
public class FilmsRestAPI {
	
	@RequestMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE}, method = RequestMethod.GET)
	@ResponseBody
	public FilmStore listFilm() {
		FilmHQL hql = FilmHQL.getHqlInstance();
		FilmStore allFilms = new FilmStore();
		allFilms.setFilmList(hql.listFilm());
		return allFilms;
	}
	
	@RequestMapping(value = "/{film-name}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE}, method = RequestMethod.GET )
	@ResponseBody
	public FilmStore retrieveFilm(@PathVariable("film-name") String filmName) {
		FilmHQL hql = FilmHQL.getHqlInstance();
		FilmStore allFilms = new FilmStore();
		allFilms.setFilmList(hql.retrieveFilm(filmName));
		return allFilms;
	}
	
	@RequestMapping( consumes = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
	@ResponseBody
	public String addFilm(@RequestBody Film f) {
		System.out.println("addFilm: ");
		FilmHQL hql = FilmHQL.getHqlInstance();
		hql.insertFilm(f);
		return "Added Film: " + f.getId();
		
	}
	
	@RequestMapping(value = "/{film-id}", consumes = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE} , method = RequestMethod.PUT)
	@ResponseBody
	public String updateFilm(@PathVariable("film-id") int filmID, @RequestBody Film film) {

		FilmHQL hql = FilmHQL.getHqlInstance();
		film.setId(filmID);
		hql.updateFilm(film);
		return "Film updated: " + filmID;
		
	}
	
	@RequestMapping(value = "/{film-id}", method = RequestMethod.DELETE)
	@ResponseBody
	public int deleteFilm(@PathVariable("film-id") int filmID) {

		FilmHQL hql = FilmHQL.getHqlInstance();
		hql.deleteFilm(filmID);
		return filmID;
	}
	
	@RequestMapping(method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
	@ResponseStatus(value = HttpStatus.UNSUPPORTED_MEDIA_TYPE)
	@ResponseBody
	public String handleNotAcceptableExceptions() {
	    return "Supported Media Types: XML & JSON";
	}
	
}
