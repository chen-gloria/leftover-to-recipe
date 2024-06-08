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
        /**
         * This is the real AI prompt code
         */
        // $ingredientsImageBase64 = $request->get('ingredients_img_base_64');
        // $removedPrefixImageBase64 = str_replace('data:image/png;base64,', '', $ingredientsImageBase64);

        // $result     = $this->openAIService->getIngredients($removedPrefixImageBase64);
        // $resultBody = json_decode($result);

        // $choicesContent = str_replace(["```json", "\n", "```"] , "", ($resultBody->choices)[0]->message->content);
        
        // $jsonIngredietsList = json_decode($choicesContent);

        // // Add the ingredients list to the getRecipes method
        // // Get the names from AI Prompt
        // $ingredients = $jsonIngredietsList->ingredients;
      
        /**
         * Comment this out for non-AI prompt testing
         */
        $ingredients = [
            'Apple',
            'Pear',
            'Banana',
            'Donut'
        ];

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
        /**
         * This is the real AI prompt code
         */
        // $ingredients = $request->get('ingredients');
        // $recipes     = $this->openAIService->getRecipes(json_encode($ingredients));
        // $recipesBody = json_decode($recipes);

        // $recipesContent = str_replace(["```json", "\n", "```"] , "", ($recipesBody->choices)[0]->message->content);

        // return $this->redirectToRoute('recipes_summmary', [
        //     'recipes' => json_decode($recipesContent)
        // ]);

        /**
         * Comment this out for non-AI prompt testing
         */
        $recipesContent = [
            [
                'Title' => 'Tempeh Stir-Fry',
                'Summary' => 'Loreama dasdasdasdasd asd ',
                'IsHealthy' => true,
                'Ingredients' => [ "Tempeh", "Red chili peppers", "Green chili peppers", "Basil leaves", "Ginger", "Garlic", "Lemongrass", "Kaffir lime leaves", "Soy sauce" ],
                'Instructions' => [ "1. Slice the tempeh into thin strips.", "2. Heat a pan over medium heat and add a bit of oil.", "3. Add minced garlic, ginger, and lemongrass to the pan and sauté until fragrant.", "4. Add the sliced tempeh to the pan and stir-fry until it starts to turn golden brown.", "5. Add sliced red and green chili peppers, kaffir lime leaves, and a splash of soy sauce.", "6. Stir-fry for a few more minutes until everything is well combined and the tempeh is fully cooked.", "7. Garnish with fresh basil leaves before serving." ]
            ],
            [
                'Title' => 'Fried Tempeh with Spicy Peanut Sauce',
                'Summary' => 'Loreama dasdasdasdasd asd ',
                'IsHealthy' => false,
                'Ingredients' => [ "Tempeh", "Red chili peppers", "Green chili peppers", "Garlic", "Coconut (for coconut milk)", "Peanuts", "Palm sugar", "Soy sauce", "Chili paste", "Fried shallots", "Tamarind" ],
                'Instructions' => [ "1. Slice the tempeh into thin strips.", "2. Heat a generous amount of oil in a pan over medium-high heat and fry the tempeh until crispy and golden brown. Drain on paper towels.", "3. In a separate pan, prepare the spicy peanut sauce.", "4. Blend the peanuts, garlic, red and green chili peppers, and some tamarind into a paste.", "5. Add the paste to the pan and cook over medium heat, adding a bit of coconut milk to thin it out.", "6. Add palm sugar, soy sauce, and chili paste to the sauce and simmer until thick and creamy.", "7. Serve the fried tempeh with the spicy peanut sauce drizzled over the top and garnished with fried shallots." ]
            ]
        ];

        return $this->redirectToRoute('recipes_summmary', [
            'recipes' => $recipesContent
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
