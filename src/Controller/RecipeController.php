<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Entity\Recipe;
use App\Service\OpenAIService;
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
        private readonly EntityManagerInterface $em,
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
        // $ingredientsImageBase64 = $request->get('ingredients_img_base_64');

        $imagePath = $this->getParameter('kernel.project_dir') . '/public/img/test.jpeg';

        // Create a response object with the image file

        // $type = pathinfo($imagePath, PATHINFO_EXTENSION);
        $data = file_get_contents($imagePath);
        // dd($imagePath,$data);
        $base64 = base64_encode($data);

        // $result = $this->openAIService->getIngredients($base64);
        
        $result ='{"id": "chatcmpl-9XgKVhL68AVR0Fl1qLHLtBsuQ9E4t", "object": "chat.completion", "created": 1717814567, "model": "gpt-4o-2024-05-13", "choices": [ { "index": 0, "message": { "role": "assistant", "content": "```json\n{\n \"Ingredients\": [\n \"Green onions\",\n \"Green chili peppers\",\n \"Garlic\",\n \"Limes\",\n \"Ginger\",\n \"Basil\",\n \"Cooked chicken\",\n \"Coconut milk\",\n \"Black peppercorns\",\n \"Brown sugar\"\n ],\n \"Recipes\": [\n {\n \"IsHealthy\": true,\n \"Title\": \"Thai Basil Chicken Stir-Fry\",\n \"Ingredients\": [\n \"Green onions\",\n \"Green chili peppers\",\n \"Garlic\",\n \"Limes\",\n \"Ginger\",\n \"Basil\",\n \"Cooked chicken\",\n \"Coconut milk\",\n \"Black peppercorns\"\n ],\n \"Instructions\": [\n \"1. Slice the green onions, green chili peppers, and garlic.\",\n \"2. Grate the ginger.\",\n \"3. Heat a pan over medium heat and add a small amount of oil.\",\n \"4. Add the green onions, green chili peppers, garlic, and ginger to the pan and sauté until fragrant.\",\n \"5. Add the cooked chicken to the pan and stir-fry for a few minutes.\",\n \"6. Pour in the coconut milk and bring to a simmer.\",\n \"7. Add the basil leaves and black peppercorns, and cook for another 2-3 minutes.\",\n \"8. Squeeze lime juice over the dish before serving.\"\n ]\n },\n {\n \"IsHealthy\": false,\n \"Title\": \"Sweet and Spicy Chicken\",\n \"Ingredients\": [\n \"Green onions\",\n \"Green chili peppers\",\n \"Garlic\",\n \"Limes\",\n \"Ginger\",\n \"Cooked chicken\",\n \"Brown sugar\",\n \"Black peppercorns\"\n ],\n \"Instructions\": [\n \"1. Slice the green onions, green chili peppers, and garlic.\",\n \"2. Grate the ginger.\",\n \"3. Heat a pan over medium heat and add a small amount of oil.\",\n \"4. Add the green onions, green chili peppers, garlic, and ginger to the pan and sauté until fragrant.\",\n \"5. Add the cooked chicken to the pan and stir-fry for a few minutes.\",\n \"6. Sprinkle brown sugar over the chicken and stir well to coat.\",\n \"7. Add black peppercorns and cook for another 2-3 minutes until the sugar has caramelized.\",\n \"8. Squeeze lime juice over the dish before serving.\"\n ]\n }\n ]\n}\n```" }, "logprobs": null, "finish_reason": "stop" } ], "usage": { "prompt_tokens": 416, "completion_tokens": 526, "total_tokens": 942 }, "system_fingerprint": "fp_aa87380ac5" }';
        $resultBody = json_decode($result);

        // trim the following: ```json

        
        $choicesContent = str_replace("```json", "", ($resultBody->choices)[0]->message->content);
        $choicesContent = str_replace("\n", "", $choicesContent);
        $choicesContent = str_replace("```", "", $choicesContent);

        dd(json_decode($result), $choicesContent, json_decode($choicesContent));
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
