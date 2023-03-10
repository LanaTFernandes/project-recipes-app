import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './DetailsCard.css';
import { useHistory } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';

import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function DetailsCard({
  image,
  name,
  category,
  ingredient,
  instruction,
  video,
  alcoholicOrNot,
  recomendations,
  pathname,
  id,
  nationality,
  type,
}) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  const [copyMessage, setCopyMessage] = useState(false);
  const [isFavorite, setIsfavorite] = useState(false);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'))
    || [];
    const isFavoriteRecipe = favoriteRecipes.some((recipe) => recipe.id === id);
    setIsfavorite(isFavoriteRecipe);
  }, []);

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Text copied to clipboard successfully!');
      },
      (error) => {
        console.error('Could not copy text: ', error);
      },
    );
  };

  const history = useHistory();

  const shareLink = (idd) => {
    copy(`http://localhost:3000/${idd}`);
    setCopyMessage(!copyMessage);
  };

  const inProgressRecipes = {
    drinks: {
      178319: [],
    },
    meals: {
      52771: [],
    },
  };

  const startOrInProgress = () => {
    if (pathname.includes('drinks') && inProgressRecipes.drinks[id]) {
      return 'Continue Recipe';
    } if (pathname.includes('meals') && inProgressRecipes.meals[id]) {
      return 'Continue Recipe';
    }
    return 'Start Recipe';
  };

  const clickChange = () => {
    history.push(`${pathname}/in-progress`);
  };
  console.log(video);
  const urlVideo = video ? video.replace('watch?v=', 'embed/') : '';

  const saveFavorite = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isFavoriteRecipe = favoriteRecipes.some((recipe) => recipe.id === id);
    if (!isFavoriteRecipe) {
      const newRecipe = {
        id,
        type,
        nationality: nationality || '',
        category,
        alcoholicOrNot,
        name,
        image,
      };
      localStorage
        .setItem('favoriteRecipes', JSON.stringify([...favoriteRecipes, newRecipe]));
    } else {
      const newFavorite = favoriteRecipes.filter((recipe) => recipe.id !== id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorite));
    }
  };

  return (
    <>
      <div
        className="background-image"
        style={ { backgroundImage: `url(${image})` } }
      >
        <div className="header-details">
          <nav>
            {pathname.includes('drinks') ? (
              <h2 data-testid="recipe-category">{`${category} - ${alcoholicOrNot}`}</h2>
            ) : (
              <h2 data-testid="recipe-category">{`${category}`}</h2>
            )}
            <div>
              <button
                data-testid="share-btn"
                onClick={ () => shareLink(pathname.includes('meals')
                  ? `meals/${id}` : `drinks/${id}`) }
                type="button"
              >
                <i className="fa-solid fa-share-nodes" />

              </button>
              <button
                type="button"
                onClick={ () => {
                  saveFavorite();
                  setIsfavorite(!isFavorite);
                } }
              >
                { isFavorite ? <i className="fa-solid fa-heart" />
                  : <i className="fa-regular fa-heart" /> }
              </button>
              {
                (copyMessage && <p>Link copied!</p>)
              }
            </div>

          </nav>
          <h1 data-testid="recipe-title">{name}</h1>
        </div>

      </div>

      <div className="ingredients-content">
        <h3>Ingredients</h3>
        <ul>
          {ingredient.map((ingrediente, index) => (
            <li
              data-testid={ `${index}-ingredient-name-and-measure` }
              key={ index }
            >
              {ingrediente}
            </li>
          ))}
        </ul>
      </div>
      <div className="instructions-content">
        <h3>Instructions</h3>
        <p>{ instruction}</p>
      </div>
      {video && (
        <div className="video-content">
          <h3>Video</h3>
          <iframe
            title="Veja no youtube"
            data-testid="video"
            height="205.09px"
            width="336px"
            src={ urlVideo }
          />
        </div>
      )}
      <div className="slider-content">
        <h3>Recommended</h3>
        <Slider { ...settings }>
          {pathname.includes('drinks')
            ? recomendations.map((d, index) => (
              <div
                key={ d.strMeal }
                data-testid={ `${index}-recommendation-card` }
              >
                <img
                  key={ d.strMeal }
                  className="recomImg"
                  src={ d.strMealThumb }
                  alt={ d.strMeal }
                />
                <p data-testid={ `${index}-recommendation-title` }>
                  {d.strMeal}
                </p>
              </div>
            ))
            : recomendations.map((d, index) => (
              <div
                key={ d.strDrink }
                data-testid={ `${index}-recommendation-card` }
              >
                <img
                  className="recomImg"
                  src={ d.strDrinkThumb }
                  alt={ d.strDrink }
                />
                <p data-testid={ `${index}-recommendation-title` }>
                  {d.strDrink}
                </p>
              </div>
            ))}
        </Slider>
      </div>
      <button
        className="startRecipeBtn"
        type="button"
        id="startRecipeBtn"
        data-testid="start-recipe-btn"
        onClick={ clickChange }
      >
        {
          startOrInProgress()
        }
      </button>

    </>
  );
}

DetailsCard.propTypes = {}.isRequired;

export default DetailsCard;
