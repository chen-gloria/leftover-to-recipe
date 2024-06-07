<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RecipeController extends AbstractController
{
    #[Route('/', name: 'basic_info', methods: ['GET'])]
    public function home(): Response
    {
        return $this->render('_step_1_basic_info.html.twig');
    }

    #[Route('/picture', name: 'take_picture', methods: ['GET'])]
    public function takePicture(): Response
    {
        return $this->render('_step_2_take_picture.html.twig');
    }

    #[Route('/ingredients', name: 'generate_ingeredients', methods: ['POST'])]
    public function generateIngredients(): Response
    {
        // Have some steps...
        // AI Prompt...
        // name and picture
        $ingredients = [
            [
                'name' => 'Apple',
                'picture' => 'apple.jpg'
            ],
            [
                'name' => 'Pear',
                'picture' => 'pear.jpg'
            ],
            [
                'name' => 'Banana',
                'picture' => 'banana.jpg'
            ],
            [
                'name' => 'Tempeh',
                'picture' => 'tempeh.jpg'
            ],
            [
                'name' => 'Donut',
                'picture' => 'donut.jpg'
            ]
        ];

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
            'Apple',
            'Pear',
            'Banana',
            'Tempeh',
            'Donuts'
        ];

        return $this->render('_step_4_generate_recipes.html.twig'. [
            'recipes' => $recipes
         ]);
    }
}
