Small shopping demo application

Tech stack used: Laravel, React, Inertia, Tailwind css

Prerequisities: composer 2.4.2, PHP 8.1.27, mysql 11.3.2, node v14.17.2 (this was what I used)

To install the application locally follow these steps:

1. composer install
2. php artisan migrate
3. php artisan db:seed (I already did some seeding for the buyers, suppliers and some products)
4. php artisan serve
5. npm run dev

You can also use the http://localhost:8000/register to create a new buyer/supplier.

Open http://localhost:8000

I also added a dockerFile and docker-compose.yml so a container can be created in docker. I was not able to deploy this on a server unfortunatley.

