<?php

namespace App\Service;

use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class OpenAIService
{
    public function getIngredients($base64_image)
    {
        $api_key = '';
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
                        Extract the ingrediets present in the image. Output the ingredients identified.

                        Then propose recipes (along with the ingredients), return at least 2 recipies, one which is healthy, and one which is unhealthy.
                        
                        Return Dish Title, Ingredients and Instructions in JSON.

                        For example:
                        {
                        "IsHealthy": true,
                        "Title": "Tempeh Stir-Fry",
                        "Ingredients": ["Tempeh", "Red chili peppers", ... ],
                        "Instructions": ["1. Slice the tempeh into thin strips.", "2. Heat a generous amount of oil in a pan over medium-high heat and fry the tempeh until crispy and golden brown. Drain on paper towels."...]
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

    }
}