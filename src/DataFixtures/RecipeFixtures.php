<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Recipe;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class RecipeFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $recipe = (new Recipe())
                    ->setTitle($faker->text())
                    ->setDescription($faker->text())
                    ->setInstructions($faker->text())
                    ->setIngredients($faker->text())
                    ->setCookingTime($faker->numberBetween(10, 100))
                    ->setPreparationTime($faker->numberBetween(10, 100))
                    ->setDifficultyLevel($faker->numberBetween(1, 5))
                    ->setCategory($faker->word())
                    ->setCreatedOnDatetime(new DateTime());

        $manager->persist($recipe);
        $manager->flush();
    }
}
