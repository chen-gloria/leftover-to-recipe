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

        dd($ingredientsImageBase64);
        // Have some steps...
        // AI Prompt...
        // name and picture
        $ingredientNames = [
            [
                'name' => 'Apple',
            ],
            [
                'name' => 'Pear',
            ],
            [
                'name' => 'Banana',
            ],
            [
                'name' => 'Tempeh',
            ],
            [
                'name' => 'Donut',
            ],
            [
                'name' => 'Bread'
            ]
        ];

        $initialRecipe = (new Recipe())
                        ->setTitle("My initial recipe")
                        ->setDescription("dummy dummy")
                        ->setPreparationTime(0)
                        ->setCookingTime(0)
                        ->setDifficultyLevel(1)
                        ->setCategory('dummy category')
                        ->setCreatedOnDatetime(new DateTime());

        foreach ($ingredientNames as $ingredientName) {
            $ingredient = (new Ingredient())
                            ->setName($ingredientName['name'])
                            ->setPicture("dummy");
            
            $initialRecipe->addIngredients($ingredient);
                            
            $this->em->persist($ingredient);
            $this->em->persist($initialRecipe);
        }

        $this->em->flush();
        
        return $this->redirectToRoute('get_ingredients', [
            'initial_recipe_id' => $initialRecipe->getId()
        ]);
    }

    #[Route('/ingredients/{initial_recipe_id}', name: 'get_ingredients', methods: ['GET'])]
    public function getIngredients($initial_recipe_id): Response
    {
        $recipe = $this->doctrine->getRepository(Recipe::class)->findOneBy([ 'id' => $initial_recipe_id ]);
        $ingredients = $recipe->getIngredients();

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

        return $this->render('_step_4_generate_recipes.html.twig', [
            'recipes' => $recipes
         ]);
    }
}
