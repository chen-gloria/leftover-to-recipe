Transform your leftovers into delicious meals, reduce food waste, and help you decide what to eat with Leftover to Recipe, your ultimate kitchen companion!

### Leftover to Recipe
**Build Together Hackathon 2024 - Building for a Better World**

With 783 million people going hungry globally, an equivalent of one billion meals are wasted every day. According to the UN Environment Programme’s Food Waste Index Report 2024, 1.05 billion tonnes of food are wasted annually. This waste occurs across retail, food service, and household. Most of the world’s food waste comes from households, totalling 631 million tonnes.

![Food Waste Pie Chart](public/img/foodwastePiechart.png)

Our project is dedicated to tackling the issue of households food waste while empowering individuals to manage their food consumption efficiently. By leveraging AI technology, we aim to create a sustainable solution that benefits both people and the environment.

### Project Description
Our project is designed with a dual purpose: to reduce food waste and help individuals keep track of the food they consume and have in their inventory. By utilizing AI image recognition and data management, our app offers a comprehensive solution for smarter food management.

![leftover to recipe logo](public/logo.png)

**Key Features:**

- **AI-Powered Food Recognition:**
  - Users can take images of the food items they have.

- **Recipe Generation:**
  - Based on the identified food items, the app generates a variety of recipes.
  - Recipes are tailored to utilize the available ingredients, ensuring minimal waste.

**Upcoming Features:**

- **Meal Planning Assistance:**
  - The app suggests meal plans based on the user's food inventory.
  - Customized plans ensure a balanced diet and efficient use of resources.

- **Food Inventory Management:**
  - The app keeps an up-to-date inventory of the user's food items.
  - Users can easily track what food they have left and what they have consumed.

- **Expiration Date Alerts:**
  - Approaching expiration dates can be shown.
  - Helps prevent food from spoiling and reduces unnecessary waste.

- **Sustainability Insights:**
  - Users can view statistics on how much food waste they have prevented.
  - The app provides tips on sustainable food practices.

- **Community Sharing:**
  - Users can share excess food items with the community.
  - Promotes a sharing economy and reduces overall food waste.
  - Users can share there status and recipe.

- **Nutritional Information:**
  - The app provides detailed nutritional information for each food item and recipe.
  - Users can make informed decisions about their diet.

### Benefits:
- **Environmental Impact:**
  - Reduces the carbon footprint associated with food waste.
  - Promotes sustainable living practices.

- **Economic Savings:**
  - Helps users save money by optimizing food usage.
  - Reduces the need to purchase additional groceries unnecessarily.

- **Health and Well-being:**
  - Provides many meal options for users they may not have expected.
  - Encourages healthy eating habits.
  - Provides balanced and nutritious meal options.

By addressing the critical issue of food waste and promoting efficient food management, our project aims to build a better, more sustainable world. We believe that with the right tools and awareness, we can make a significant impact on both individual lives and the environment.

### How to Run This App?

#### 1. [Install PHP 8.2](https://php.watch/articles/install-php82-ubuntu-debian)
#### 2. [Install Composer](https://getcomposer.org/download/), which is used to install PHP packages.
#### 3. [Install Symfony CLI](https://symfony.com/download)
```bash
// macOS
wget https://get.symfony.com/cli/installer -O - | bash

// Linux
wget https://get.symfony.com/cli/installer -O - | bash

// Windows
scoop install symfony-cli
```

#### 4. Run `composer install`
```bash
composer install
```

Result:
```bash
Installing dependencies from lock file (including require-dev)
Verifying lock file contents can be installed on current platform.
Nothing to install, update or remove
Generating autoload files
114 packages you are using are looking for funding.
Use the `composer fund` command to find out more!

Run composer recipes at any time to see the status of your Symfony recipes.

Executing script cache:clear [OK]
Executing script assets:install public [OK]
Executing script importmap:install [OK]
```

#### 5. Start the Symfony server
```bash
symfony server:start
```

Successful result:
```bash
 [OK] Web server listening                                                                                              
      The Web server is using PHP FPM 8.3.6                                                                             
      http://127.0.0.1:8000   
```

#### 6. Visit `http://127.0.0.1:8000` or `http://localhost:8000/` to see the project

### URLs
| URL | Method  | Role Permission | Description  |
|---|---|---|---|
| / | GET  | Any | Basic info |
| /camera | GET  | Any | Get camera and take a picture of your leftovers | 
| /ingredients | GET | Any | Get all the ingredients from the picture |
| /recipes | POST  | Any | Get the recipes from the ingredients |
