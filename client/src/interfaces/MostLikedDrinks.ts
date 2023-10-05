import { Cocktail } from "./Cocktail";

export interface MostLikedDrink extends Cocktail{
  _id: string;
  likeCount: number;
  
}
