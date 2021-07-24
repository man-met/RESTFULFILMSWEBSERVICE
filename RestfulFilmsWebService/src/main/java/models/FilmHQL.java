package models;

import java.util.ArrayList;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.AnnotationConfiguration;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.core.SpringVersion;


public class FilmHQL implements FilmInfo{
	
	private static FilmHQL hqlInstance;
	
	private FilmHQL() {
		
	}
	
	public static synchronized FilmHQL getHqlInstance() {
		if(hqlInstance == null) {
			hqlInstance = new FilmHQL();
		}
		return hqlInstance;
	}
	
	public SessionFactory getSessionFactory() {
		SessionFactory factory;
			try {
				factory = new AnnotationConfiguration().configure().addAnnotatedClass(Film.class).buildSessionFactory();
			} catch(Throwable ex) {
				System.err.println("Failed to create sessionFactory object." + ex);
				throw new ExceptionInInitializerError(ex);
			}
		return factory;
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<Film> listFilm() {
		
		SessionFactory factory = getSessionFactory();
		Session session = factory.openSession();
		Transaction tx = null;
		ArrayList<Film> allFilms = null;

		System.out.println("FilmHQL: listFilm invoked!");
		
		try {
			
			tx = session.beginTransaction();
			allFilms = (ArrayList<Film>) session.createQuery("FROM Film").list();
			tx.commit();
			
		} catch (HibernateException e) {
			if (tx != null)
				tx.rollback();
			e.printStackTrace();
		} finally {
			session.close();
		}
		
		return allFilms;
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<Film> retrieveFilm(String filmTitle) {
		
		SessionFactory factory = getSessionFactory();
		Session session = factory.openSession();
		Transaction tx = null;
		ArrayList<Film> allFilms = null;
		System.out.println(org.hibernate.Version.getVersionString());
		System.out.println(SpringVersion.getVersion());
		
		System.out.println("FilmHQL: retrieveFilm invoked!");
		
		try {
			tx = session.beginTransaction();
			
			Criteria cr = session.createCriteria(Film.class);
			
			cr.add(Restrictions.ilike("title", filmTitle, MatchMode.ANYWHERE));
			
			allFilms = (ArrayList<Film>) cr.list();
			
			tx.commit();
		} catch (HibernateException e) {
			if (tx != null)
				tx.rollback();
			e.printStackTrace();
		} finally {
			session.close();
		}
		
		return allFilms;
	}
	
	public void insertFilm(Film film) {
		
		SessionFactory factory = getSessionFactory();
		Session session = factory.openSession();
		Transaction tx = null;
		
		System.out.println("FilmHQL: insertFilm invoked!");
		
		try {
			tx = session.beginTransaction();
			
			session.save(film);
			
			tx.commit();
			
		} catch (HibernateException e) {
			if (tx != null)
				tx.rollback();
			e.printStackTrace();
		} finally {
			session.close();
		}
		
	}
	
	public void updateFilm(Film film) {
		
		SessionFactory factory = getSessionFactory();
		Session session = factory.openSession();
		Transaction tx = null;
		
		System.out.println("FilmHQL: updateFilm invoked!");
		
		try {
			
			tx = session.beginTransaction();
			
			session.update(film);
			
			tx.commit();
			
		} catch (HibernateException e) {
			if (tx != null)
				tx.rollback();
			e.printStackTrace();
		} finally {
			session.close();
		}
		
	}
	
	public void deleteFilm(int filmID) {
		
		SessionFactory factory = getSessionFactory();
		Session session = factory.openSession();
		Transaction tx = null;
		
		Film film = new Film();
		
		film.setId(filmID);
		
		System.out.println("FilmHQL: deleteFilm invoked!");
		
		try {
			
			tx = session.beginTransaction();
			
			session.delete(film);
			
			tx.commit();
			
		} catch (HibernateException e) {
			if (tx != null)
				tx.rollback();
			e.printStackTrace();
		} finally {
			session.close();
		}
	}
}
