import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CocktailList from './CocktailList';
import Navbar from './Navbar';
import logo from '../assets/LOGO.png';
import MyIngredients from './MyIngredients';
import { updateFilteredCocktails } from '../helpers';
import {
  getAllIngredients,
  getCocktailById,
  getCocktailByIngredient,
} from '../apiComs/cocktailDbApi';
import { PageProps } from '../interfaces/Props';
import { Cocktail } from '../interfaces/Cocktail';
import Cookies from 'js-cookie';
import { useAuth } from '../context/authContext';
import MostLikedDrinks from './MostLikedDrinks';
import { getAllCocktails } from '../apiComs/myApi';

export default function SearchPage({ page, setPage }: PageProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedIngs, setSelectedIngs] = useState<string[]>([]);
  const [cocktails, setCocktails] = useState<Cocktail[] | Cocktail>([]);
  const [allCocktails, setAllCocktails] = useState<Cocktail[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedIngs = await getAllIngredients();
        if (fetchedIngs) {
          setIngredients(fetchedIngs.map(el => el.toLowerCase()));
        }

        const data = await getAllCocktails();
        setAllCocktails(
          data.map((el: Cocktail) => ({
            idDrink: el.idDrink,
            drink: el.drink?.toLowerCase(),
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const { user, logout } = useAuth();

  async function handleAddToSelected(ingredient: string): Promise<void> {
    try {
      const updatedIngredients = ingredients.filter(el => el !== ingredient);
      const newCocktails: Cocktail | Cocktail[] = await getCocktailByIngredient(
        ingredient
      );
      if (Array.isArray(newCocktails)) {
        if (!selectedIngs.includes(ingredient)) {
          Array.isArray(cocktails)
            ? setCocktails(
                updateFilteredCocktails(cocktails, newCocktails, 'add')
              )
            : setCocktails(
                updateFilteredCocktails([cocktails], newCocktails, 'add')
              );
          setIngredients(updatedIngredients);
          setSelectedIngs([...selectedIngs, ingredient.toLowerCase()]);
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async function handleRemoveFromSelected(ingredient: string): Promise<void> {
    try {
      setIngredients([...ingredients, ingredient]);

      const cocktailsToReduce: Cocktail | Cocktail[] =
        await getCocktailByIngredient(ingredient);

      if (Array.isArray(cocktailsToReduce)) {
        Array.isArray(cocktails)
          ? setCocktails(
              updateFilteredCocktails(cocktails, cocktailsToReduce, 'add')
            )
          : setCocktails(
              updateFilteredCocktails([cocktails], cocktailsToReduce, 'remove')
            );
        const resultingIngredients = selectedIngs.filter(
          el => el !== ingredient
        );
        setSelectedIngs([...resultingIngredients]);
      }
    } catch (err) {
      throw err;
    }
  }

  async function handleCocktailSelected(cocktailName: string) {
    const selectedCocktail = allCocktails.find(
      cocktail => cocktail.drink === cocktailName
    );

    if (selectedCocktail) {
      const cocktailId = selectedCocktail.idDrink;
      const cocktail = await getCocktailById(cocktailId);
      const singleCocktail = Array.isArray(cocktail) ? cocktail[0] : cocktail;

      setCocktails([singleCocktail]);
    }
  }

  const handleLogoClick = () => {
    window.location.reload();
  }
  return (
    <div className='list-page'>
      <header className='page-header'>
        <div className='header-wrapper'>
          <img className='logo' src={logo} onClick={handleLogoClick} alt='Logo'/>
          <div className='button-container'>
            {Cookies.get('token') ? (
              <>
                <button
                  onClick={() => {
                    setPage('favourites');
                    navigate('/favourites');
                  }}>
                  Favourites
                </button>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to='/login' className='login-button'>
                  Login
                </Link>
                <Link to='/register' className='register-button'>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {!selectedIngs.length && user && (
        <h2 className='welcome'>
          <span>Welcome back {user.username}!</span>
          <span>What are we drinking today?</span>{' '}
        </h2>
      )}

      <Navbar
        className='NavBar'
        allCocktails={allCocktails}
        ingredients={ingredients}
        handleAddToSelected={handleAddToSelected}
        selectedIngs={selectedIngs}
        handleCocktailSelected={handleCocktailSelected}
      />
      <MyIngredients
        selectedIngs={selectedIngs}
        handleRemoveFromSelected={handleRemoveFromSelected}
      />
      {Array.isArray(cocktails) && cocktails.length ? (
        <CocktailList
          page={page}
          selectedIngs={selectedIngs}
          cocktails={cocktails}
          setPage={setPage}
        />
      ) : (
        <div>
          <p>No ingredients selected.</p>
          <MostLikedDrinks />
        </div>
      )}
    </div>
  );
}
