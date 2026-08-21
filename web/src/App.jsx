import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import FlashMessage from './components/FlashMessage.jsx';
import StepIndicator from './components/StepIndicator.jsx';
import Home from './steps/Home.jsx';
import BasicInfo from './steps/BasicInfo.jsx';
import Camera from './steps/Camera.jsx';
import Ingredients from './steps/Ingredients.jsx';
import RecipeList from './steps/RecipeList.jsx';
import RecipeDetail from './steps/RecipeDetail.jsx';
import MyRecipes from './steps/MyRecipes.jsx';
import { fetchIngredients, fetchRecipes, fetchSharedRecipe } from './api.js';

const STEP = {
  HOME: 'home',
  BASIC_INFO: 'basic_info',
  CAMERA: 'camera',
  INGREDIENTS: 'ingredients',
  RECIPES: 'recipes',
  RECIPE_DETAIL: 'recipe_detail',
  MY_RECIPES: 'my_recipes',
  // A recipe opened from someone else's share link (/r/:id) - no step
  // progress dots shown, since this visitor didn't go through the flow.
  SHARED_RECIPE: 'shared_recipe'
};

const SHARE_LINK_PATH = /^\/r\/(\d+)$/;

// Maps app steps to the 4-dot progress indicator shown above each screen.
// HOME has no entry - the landing page doesn't show step progress.
const STEP_INDEX = {
  [STEP.BASIC_INFO]: 0,
  [STEP.CAMERA]: 1,
  [STEP.INGREDIENTS]: 1,
  [STEP.RECIPES]: 2,
  [STEP.RECIPE_DETAIL]: 3
};

export default function App() {
  const [step, setStep] = useState(STEP.HOME);

  const [personAllergies, setPersonAllergies] = useState('No allergies');
  const [personPreferences, setPersonPreferences] = useState('No preferences');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sharedLinkError, setSharedLinkError] = useState('');
  const [loadingSharedRecipe, setLoadingSharedRecipe] = useState(() => SHARE_LINK_PATH.test(window.location.pathname));

  // On first load, if the URL is a share link (/r/:id), fetch that recipe
  // and jump straight to it instead of the landing page.
  useEffect(() => {
    const match = window.location.pathname.match(SHARE_LINK_PATH);
    if (!match) return;
    fetchSharedRecipe(match[1])
      .then((data) => {
        setSelectedRecipe(data.recipe);
        setStep(STEP.SHARED_RECIPE);
      })
      .catch((err) => {
        setSharedLinkError(err.message || 'This shared recipe could not be found.');
        window.history.replaceState({}, '', '/');
      })
      .finally(() => setLoadingSharedRecipe(false));
  }, []);

  function goHome() {
    setStep(STEP.HOME);
    setErrorMessage('');
    setSuccessMessage('');
    setSharedLinkError('');
    if (SHARE_LINK_PATH.test(window.location.pathname)) {
      window.history.replaceState({}, '', '/');
    }
  }

  async function handleCapture(imageBase64) {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { ingredients: detected } = await fetchIngredients({
        imageBase64,
        personPreferences,
        personAllergies
      });
      setIngredients(detected);
      setStep(STEP.INGREDIENTS);
    } catch (err) {
      setErrorMessage(
        err.message ||
          'We can not detect the ingredients from your camera - or there is something wrong in the server :(. Please try again or contact us for support.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGenerateRecipes(finalIngredients) {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { recipes: generated } = await fetchRecipes({
        ingredients: finalIngredients,
        personPreferences,
        personAllergies
      });
      setRecipes(generated);
      setStep(STEP.RECIPES);
    } catch (err) {
      // Mirrors the original app: a failed recipe generation sends the
      // visitor back to the camera step (ingredients are re-detected from scratch).
      setErrorMessage(
        err.message ||
          'We can not generate recipe for now - there is something wrong in the server :(. Please try again or contact us for support.'
      );
      setStep(STEP.CAMERA);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleConfirmRecipe(recipe) {
    setSelectedRecipe({
      title: recipe.Title,
      isHealthy: recipe.IsHealthy,
      ingredients: recipe.Ingredients,
      instructions: recipe.Instructions
    });
    setSuccessMessage('Here’s your recipe! Hit "Save" to keep it in your recipe book.');
    setStep(STEP.RECIPE_DETAIL);
  }

  function handleViewSavedRecipe(recipe) {
    setSelectedRecipe(recipe);
    setSuccessMessage('');
    setStep(STEP.RECIPE_DETAIL);
  }

  return (
    <div className="app-shell">
      <Navbar onNavigateHome={goHome} onNavigateRecipeBook={() => setStep(STEP.MY_RECIPES)} />

      <div className="page-container app-main" style={{ paddingBottom: 'var(--space-8)' }}>
        {step in STEP_INDEX && <StepIndicator current={STEP_INDEX[step]} />}

        {step !== STEP.CAMERA && step !== STEP.INGREDIENTS && (
          <>
            <FlashMessage type="success" message={successMessage} onDismiss={() => setSuccessMessage('')} />
            <FlashMessage
              type="danger"
              message={errorMessage || sharedLinkError}
              onDismiss={() => {
                setErrorMessage('');
                setSharedLinkError('');
              }}
            />
          </>
        )}

        {loadingSharedRecipe && <p className="profile-meta">Loading shared recipe…</p>}

        {step === STEP.HOME && !loadingSharedRecipe && <Home onStart={() => setStep(STEP.BASIC_INFO)} />}

        {step === STEP.BASIC_INFO && (
          <BasicInfo
            personAllergies={personAllergies}
            personPreferences={personPreferences}
            onChangeAllergies={setPersonAllergies}
            onChangePreferences={setPersonPreferences}
            onEnterManually={() => {
              setIngredients([]);
              setStep(STEP.INGREDIENTS);
            }}
            onTakePicture={() => setStep(STEP.CAMERA)}
          />
        )}

        {step === STEP.CAMERA && (
          <Camera
            personAllergies={personAllergies}
            personPreferences={personPreferences}
            onChangeAllergies={setPersonAllergies}
            onChangePreferences={setPersonPreferences}
            onBack={() => setStep(STEP.BASIC_INFO)}
            onSubmit={handleCapture}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onDismissError={() => setErrorMessage('')}
          />
        )}

        {step === STEP.INGREDIENTS && (
          <Ingredients
            ingredients={ingredients}
            personAllergies={personAllergies}
            personPreferences={personPreferences}
            onChangeAllergies={setPersonAllergies}
            onChangePreferences={setPersonPreferences}
            onBack={() => setStep(STEP.CAMERA)}
            onSubmit={handleGenerateRecipes}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onDismissError={() => setErrorMessage('')}
          />
        )}

        {step === STEP.RECIPES && (
          <RecipeList recipes={recipes} onBack={() => setStep(STEP.CAMERA)} onConfirm={handleConfirmRecipe} />
        )}

        {step === STEP.RECIPE_DETAIL && selectedRecipe && (
          <RecipeDetail recipe={selectedRecipe} onGenerateNew={() => setStep(STEP.CAMERA)} onBackHome={goHome} />
        )}

        {step === STEP.SHARED_RECIPE && selectedRecipe && (
          <>
            <p className="hero-banner">
              <span className="hero-emoji" aria-hidden="true">
                🔗
              </span>
              Someone shared this recipe with you from Leftover to Recipe.
            </p>
            <RecipeDetail recipe={selectedRecipe} onGenerateNew={goHome} onBackHome={goHome} backLabel="Back to home" />
          </>
        )}

        {step === STEP.MY_RECIPES && <MyRecipes onBack={goHome} onView={handleViewSavedRecipe} />}
      </div>

      <Footer />
    </div>
  );
}
