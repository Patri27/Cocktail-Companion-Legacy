import axios, { AxiosError } from 'axios';
import { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { getCocktailById } from './cocktailDbApi';
import { MostLikedDrink } from '../interfaces/MostLikedDrinks';

const rootUrl = 'http://localhost:3001';

export async function fetchMostLikedDrinksWithDetails(): Promise<
  (MostLikedDrink | null)[]
> {
  try {
    const response = await axios.get(`${rootUrl}/most-liked-drinks`);
    const mostLikedDrinksData: MostLikedDrink[] = response.data;

    const sortedDrinks = mostLikedDrinksData.sort(
      (a, b) => b.likeCount - a.likeCount
    );

    const mostLikedDrinksWithDetails = await Promise.all(
      sortedDrinks.map(async (drink) => {
        try {
          const detailedDrinkInfo = await getCocktailById(drink._id);
          return { ...drink, ...detailedDrinkInfo };
        } catch (error) {
          console.error(
            `Error fetching details for drink with ID ${drink._id}:`,
            error
          );
          return null;
        }
      })
    );

    return mostLikedDrinksWithDetails;
  } catch (error) {
    console.error('Error fetching most-liked drinks with details:', error);
    throw error;
  }
}

export async function register(username: string, password: string) {
  const token = Cookies.get('token');
  try {
    if (token) {
      throw new Error('User is already authenticated');
    }

    const credentialsObj = {
      username: username,
      password: password
    };

    const res = await axios.post(`${rootUrl}/register`, credentialsObj, {
      headers: {
        'Content-Type': 'application/json'
      }
    } as AxiosRequestConfig);

    const userData = res.data;
    return userData;
  } catch (err) {
    const { message } =
      ((err as AxiosError).response?.data as { message?: string }) || {};
    throw new Error(message);
  }
}

export async function getUser() {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const res = await axios.get(`${rootUrl}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } as AxiosRequestConfig);

    const userData = res.data;
    return userData;
  } catch (err) {
    console.log('Error retrieving user profile:', err);
    throw err;
  }
}

export async function addFavourite(faveId: string) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('User not authenticated');
    }
    const dataObj = {
      faveId
    };

    const res = await axios.put(`${rootUrl}/add-fave`, dataObj, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    } as AxiosRequestConfig);

    const updatedUser = res.data;
    return updatedUser;
  } catch (err) {
    console.log('Error saving favourite');
  }
}

export async function removeFavourite(faveId: string) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const dataObj = {
      faveId
    };

    const res = await axios.put(`${rootUrl}/remove-fave`, dataObj, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    } as AxiosRequestConfig);

    const updatedUser = res.data;
    return updatedUser;
  } catch (err) {
    console.log('Error removing favourite');
    throw err; // Re-throw the error so it can be caught and handled elsewhere in your code
  }
}

export async function getAllCocktails() {
  try {
    const { data } = await axios.get(`${rootUrl}/cocktails`);
    return data ? data : [];
  } catch (err) {
    console.log('Error retrieving user profile:', err);
    throw err;
  }
}
