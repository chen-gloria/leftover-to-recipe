<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class OpenAIService
{
    public function __construct(
        private readonly ParameterBagInterface $params
    ) {
    }

    public function getIngredients($base64Image, $personReferences = "", $personAllergies = "")
    {
        $api_key = $this->params->get('OPEN_AI_KEY');
        $model = 'gpt-4o';

        $url = 'https://api.openai.com/v1/chat/completions';

        $data = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that responds in JSON'],
                [
                    'role' => 'user', 
                    'content' => [
                        ['type' => 'text', 'text' => <<<EOF
                        Extract the ingredients present in the image. The input image could be a photo of ingredients or a reciept of ingredients.
                        
                        User preferences: $personReferences.
                        User allergies: $personAllergies.

                        Return the ingredients in the following format:
                        {
                            "ingredients": ["Red beans", "Spinach", "Olives", ...]
                        }

                        JSON:
                        EOF],
                        ['type' => 'image_url', 'image_url' => ['url' => "data:image/png;base64,$base64Image"]]
                    ]
                ]
            ],
            'temperature' => 0.0
        ];

        $payload = json_encode($data);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        // echo $response;
        return $response;
    }

    public function getRecipes($ingredietsList, $personReferences = "", $personAllergies = "")
    {
        $api_key = $this->params->get('OPEN_AI_KEY');
        $model = 'gpt-4o';

        $url = 'https://api.openai.com/v1/chat/completions';

        $data = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that responds in JSON'],
                [
                    'role' => 'user', 
                    'content' => [
                        ['type' => 'text', 'text' => <<<EOF
                        Given the following ingredients list: $ingredietsList.

                        User preferences: $personReferences.
                        User allergies: $personAllergies.
                        
                        Generate recipes (along with the ingredients), return at least 2 recipies, one which is healthy, and one which is unhealthy.
                        Restrict the recipes with the ingredients provided above.
                        
                        Return Dish Title, Ingredients and Instructions in JSON.

                        For example:
                        {
                            "IsHealthy": true,
                            "Title": "Tempeh Stir-Fry",
                            "Ingredients": ["Tempeh", "Red chili peppers", ... ],
                            "Instructions": ["1. Slice the tempeh into thin strips.", "2. Heat a pan over medium heat and add a bit of oil.", "3. Add minced garlic, ginger, and lemongrass to the pan and sauté until fragrant."...],
                            "Summary": "This dish is a healthy and delicious vegan stir-fry that is packed with flavor and nutrients."
                        }
                        {
                            "IsHealthy": false,
                            "Title": "Fried Tempeh with Spicy Peanut Sauce",
                            "Ingredients": ["Tempeh", "Red chili peppers", ... ],
                            "Instructions": ["1. Slice the tempeh into thin strips.", "2. Heat a generous amount of oil in a pan over medium-high heat and fry the tempeh until crispy and golden brown. Drain on paper towels."...],
                            "Summary": "This dish is a delicious and indulgent vegan treat that is perfect for a special occasion or when you want to impress your guests."
                            }

                        JSON:
                        EOF],
                    ]
                ]
            ],
            'temperature' => 0.0
        ];

        $payload = json_encode($data);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        // echo $response;
        return $response;
    }
}