### How to run this app?


#### 1. [Install PHP8.2](https://php.watch/articles/install-php82-ubuntu-debian)
#### 2. [Install Composer](https://getcomposer.org/download/), which is used to install PHP packages.
#### 3. [Install Symfony CLI](https://symfony.com/download)
```bash
// MacOS
wget https://get.symfony.com/cli/installer -O - | bash

// Linux
wget https://get.symfony.com/cli/installer -O - | bash

// Windows
scoop install symfony-cli
```

### 4. Do `composer install`

```bash
gloriachen$ composer install
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

#### 5. Run Symfony project up

```bash
gloriachen$ symfony server:start

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
|  / | GET  |  Any |  Basic info |
|  /picture | GET  | Any |  Take a picture of your leftover | 
|  /ingredients |  GET | Any |  Get all the ingredients from the picture  |
|  /recipes | POST  | Any | GET  | Get the recipes from the ingredients  |


### Description
<!-- TODO -->
