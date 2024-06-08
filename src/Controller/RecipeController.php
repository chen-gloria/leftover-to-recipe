<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Entity\Recipe;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RecipeController extends AbstractController
{
    public function __construct
    (
        protected ManagerRegistry $doctrine,
        private readonly EntityManagerInterface $em
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

        // Have some steps...
        // AI Prompt...
        // Get the names from AI Prompt

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
    public function generateRecipes(): Response
    {
        // Have some steps...
        // AI Prompt...
        // Generate recipes
        // Json data please...

        $recipes = [
            [
                'title' => 'Tempeh Stir-Fry',
                'isHealthy' => true,
                'ingredients' => [ "Tempeh", "Red chili peppers", "Green chili peppers", "Basil leaves", "Ginger", "Garlic", "Lemongrass", "Kaffir lime leaves", "Soy sauce" ],
                'instructions' => [ "1. Slice the tempeh into thin strips.", "2. Heat a pan over medium heat and add a bit of oil.", "3. Add minced garlic, ginger, and lemongrass to the pan and sauté until fragrant.", "4. Add the sliced tempeh to the pan and stir-fry until it starts to turn golden brown.", "5. Add sliced red and green chili peppers, kaffir lime leaves, and a splash of soy sauce.", "6. Stir-fry for a few more minutes until everything is well combined and the tempeh is fully cooked.", "7. Garnish with fresh basil leaves before serving." ]
            ],
            [
                'title' => 'Fried Tempeh with Spicy Peanut Sauce',
                'isHealthy' => false,
                'ingredients' => [ "Tempeh", "Red chili peppers", "Green chili peppers", "Garlic", "Coconut (for coconut milk)", "Peanuts", "Palm sugar", "Soy sauce", "Chili paste", "Fried shallots", "Tamarind" ],
                'instructions' => [ "1. Slice the tempeh into thin strips.", "2. Heat a generous amount of oil in a pan over medium-high heat and fry the tempeh until crispy and golden brown. Drain on paper towels.", "3. In a separate pan, prepare the spicy peanut sauce.", "4. Blend the peanuts, garlic, red and green chili peppers, and some tamarind into a paste.", "5. Add the paste to the pan and cook over medium heat, adding a bit of coconut milk to thin it out.", "6. Add palm sugar, soy sauce, and chili paste to the sauce and simmer until thick and creamy.", "7. Serve the fried tempeh with the spicy peanut sauce drizzled over the top and garnished with fried shallots." ]
            ]
        ];

        return $this->redirectToRoute('get_recipes', [
            'recipes' => $recipes
        ]);
    }

    #[Route('/recipes', name: 'get_recipes', methods: ['GET'])]
    public function getRecipes(Request $request): Response
    {
        $recipes = $request->get('recipes');

        return $this->render('_step_4_get_recipes.html.twig', [
            'recipes' => $recipes
        ]);
    }
}
