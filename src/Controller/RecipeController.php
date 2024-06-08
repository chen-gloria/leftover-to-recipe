<?php

namespace App\Controller;

use App\Service\OpenAIService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RecipeController extends AbstractController
{
    public function __construct
    (
        private readonly OpenAIService $openAIService
    )
    {}

    #[Route('/', name: 'basic_info', methods: ['GET'])]
    public function home(): Response
    {
        return $this->render('_step_1_basic_info.html.twig');
    }

    #[Route('/camera', name: 'get_camera', methods: ['GET'])]
    public function getCamera(): Response
    {
        return $this->render('_step_2_get_camera.html.twig');
    }

    #[Route('/ingredients', name: 'generate_ingeredients', methods: ['POST'])]
    public function generateIngredients(Request $request): Response
    {
        $ingredientsImageBase64 = $request->get('ingredients_img_base_64');
        $removedPrefixImageBase64 = str_replace('data:image/png;base64,', '', $ingredientsImageBase64);

        $result     = $this->openAIService->getIngredients($removedPrefixImageBase64);
        $resultBody = json_decode($result);

        $choicesContent = str_replace(["```json", "\n", "```"] , "", ($resultBody->choices)[0]->message->content);
        
        $json_ingrediets_list = json_decode($choicesContent);

        // Add the ingredients list to the getRecipes method
        // Get the names from AI Prompt
        $ingredients = $json_ingrediets_list->ingredients;
      
        return $this->redirectToRoute('get_ingredients', [
            'ingredients' => $ingredients
        ]);
    }

    #[Route('/ingredients', name: 'get_ingredients', methods: ['GET'])]
    public function getIngredients(Request $request): Response
    {
        $ingredients = $request->get('ingredients');

        return $this->render('_step_3_generate_ingeredients.html.twig', [
            'ingredients' => $ingredients
        ]);
    }

    #[Route('/recipes', name: 'generate_recipes', methods: ['POST'])]
    public function generateRecipes(Request $request): Response
    {
        $ingredients = $request->get('ingredients');
        $recipes     = $this->openAIService->getRecipes(json_encode($ingredients));
        $recipesBody = json_decode($recipes);

        $recipesContent = str_replace(["```json", "\n", "```"] , "", ($recipesBody->choices)[0]->message->content);

        return $this->redirectToRoute('recipes_summmary', [
            'recipes' => json_decode($recipesContent)
        ]);
    }

    #[Route('/recipes', name: 'recipes_summmary', methods: ['GET'])]
    public function getRecipes(Request $request): Response
    {
        $recipes = $request->get('recipes');

        return $this->render('_step_4_get_recipes_summmary.html.twig', [
            'recipes' => $recipes
        ]);
    }

    #[Route('/recipe', name: 'recipe_details', methods: ['GET'])]
    public function showFinalRecipeDetails(Request $request): Response
    {
        $selectedRecipe = $request->get('selectedRecipe');

        // Transfer to a json array and push to the FE
        $recipe = [
            'title' => $selectedRecipe['title'],
            'isHealthy' => $selectedRecipe['isHealthy'],
            'ingredients' => $selectedRecipe['ingredients'],
            'instructions' => $selectedRecipe['instructions']
        ];

        $this->addFlash("success", "Congratulations! This recipe has been added to your recipe book.");
        
        return $this->render('_step_5_recipe_details.html.twig', [
            'recipe' => $recipe
        ]);
    }
}
