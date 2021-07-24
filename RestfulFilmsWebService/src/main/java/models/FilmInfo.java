package models;

import java.util.Collection;

public interface FilmInfo {
	
	public void insertFilm(Film filmInfo);
	
	public void updateFilm(Film filmInfo);
	
	public void deleteFilm(int filmId);
	
	public Collection<Film> listFilm();
	
	public Collection<Film> retrieveFilm(String searchKeyword);
}
