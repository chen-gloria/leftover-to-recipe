<?php

namespace App\Service;

use Exception;

class OpenAIService
{
    public function getIngredients($base64_image)
    {
        $api_key = 'sk-proj-yWBgHL8vXd8PpFU9t4zeT3BlbkFJETKZx0RhaChMYlZxYvyn';
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
                        
                        Return the ingredients in the following format:
                        {
                            "ingredients": ["Red beans", "Spinach", "Olives", ...]
                        }

                        JSON:
                        EOF],
                        ['type' => 'image_url', 'image_url' => ['url' => "data:image/png;base64,$base64_image"]]
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

        echo $response;
        return $response;
    }

    public function getRecipes($ingrediets_list)
    {
        $api_key = 'sk-proj-yWBgHL8vXd8PpFU9t4zeT3BlbkFJETKZx0RhaChMYlZxYvyn';
        $model = 'gpt-4o';

        $url = 'https://api.openai.com/v1/chat/completions';
        $preferences = "Have nut allergies, and prefer vegan recipes.";

        $data = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that responds in JSON'],
                [
                    'role' => 'user', 
                    'content' => [
                        ['type' => 'text', 'text' => <<<EOF
                        Given the following ingredients list: $ingrediets_list.

                        User preferences/allergies: $preferences.

                        Generate recipes (along with the ingredients), return at least 2 recipies, one which is healthy, and one which is unhealthy.
                        
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

        echo $response;
        return $response;
    }
}