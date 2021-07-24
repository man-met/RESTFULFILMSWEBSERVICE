package models;

import java.util.ArrayList;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

// This statement means that class "FilmStore.java" is the root-element of our exanple
@XmlRootElement(namespace = "model")
public class FilmStore {

	// XmlElementWrapper generates a wrapper element around XML representation
	@XmlElementWrapper(name = "filmList")

	@XmlElement(name = "film")
	private ArrayList<Film> filmList;

	public void setFilmList(ArrayList<Film> filmList) {
		this.filmList = filmList;
	}

	public ArrayList<Film> getFilmsList() {
		return filmList;
	}
}
